"use client";

import { useState, useMemo } from "react";
import { JobPosting, initialJobPostings } from "./_data/jobs";
import { AddEditJobModal } from "./_components/add-edit-job-modal";
import { JobViewModal } from "./_components/job-view-modal";
import { WebsiteNavHeader } from "../../_components/website-nav-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function JobManagementPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobPostings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<JobPosting | null>(null);

  const [selectedJobView, setSelectedJobView] = useState<JobPosting | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        j.jobTitle.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || j.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setJobToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (job: JobPosting) => {
    setJobToEdit(job);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (job: JobPosting) => {
    setSelectedJobView(job);
    setIsViewOpen(true);
  };

  const handleSaveJob = (savedJob: JobPosting) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === savedJob.id);
      if (exists) {
        return prev.map((j) => (j.id === savedJob.id ? savedJob : j));
      }
      return [savedJob, ...prev];
    });
  };

  const handleToggleStatus = (job: JobPosting) => {
    const newStatus = job.status === "Active" ? "Inactive" : "Active";
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    );

    if (newStatus === "Active") {
      swiftAlert.success({
        title: "Job Profile Enabled",
        description: `"${job.jobTitle}" is now active for applicants.`,
      });
    } else {
      swiftAlert.info({
        title: "Job Profile Disabled",
        description: `"${job.jobTitle}" has been deactivated.`,
      });
    }
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    if (confirm(`Are you sure you want to delete job posting "${jobTitle}"?`)) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      swiftAlert.error({
        title: "Job Deleted",
        description: `Job profile "${jobTitle}" was removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Careers (Job) Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Post, edit, and manage clinical career openings displayed on the website portal.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Post New Job</span>
        </Button>
      </div>

      {/* Nav Header */}
      {/* <WebsiteNavHeader /> */}

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Job Title, Location, or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Job Title / ID</TableHead>
              <TableHead className="font-bold text-xs">Location</TableHead>
              <TableHead className="font-bold text-xs">Department</TableHead>
              <TableHead className="font-bold text-xs">Description</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No job postings found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((j) => (
                <TableRow key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Job Title */}
                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{j.jobTitle}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{j.id}</span>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-xs">
                    <span className="flex items-center gap-1 text-[#01265D] dark:text-blue-400 font-medium">
                      <MapPin className="h-3.5 w-3.5" /> {j.location}
                    </span>
                  </TableCell>

                  {/* Department */}
                  <TableCell className="text-xs">
                    <Badge variant="outline">{j.department}</Badge>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {j.description}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge variant={j.status === "Active" ? "default" : "secondary"} className="text-[10px] font-bold">
                      {j.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenView(j)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(j)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(j)}
                        className="h-8 text-xs gap-1"
                      >
                        {j.status === "Active" ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteJob(j.id, j.jobTitle)}
                        className="h-8 w-8 p-0 text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredJobs.length}</strong> active career job profiles
          </span>
          <span className="font-medium text-[#01265D] dark:text-blue-400">
            Recruitment Stream Active
          </span>
        </div>
      </div>

      {/* Modals */}
      <AddEditJobModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        jobToEdit={jobToEdit}
        onSaveJob={handleSaveJob}
      />

      <JobViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        job={selectedJobView}
      />
    </div>
  );
}
