"use client";

import { useState, useMemo } from "react";
import { JobApplication, initialJobApplications } from "./_data/applications";
import { ApplicationDetailsModal } from "./_components/application-details-modal";
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
  FileUser,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function ApplicationManagementPage() {
  const [applications, setApplications] = useState<JobApplication[]>(initialJobApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.candidateName.toLowerCase().includes(q) ||
        a.qualification.toLowerCase().includes(q) ||
        a.appliedJobTitle.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || a.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleOpenDetails = (app: JobApplication) => {
    setSelectedApp(app);
    setIsDetailsOpen(true);
  };

  const handleShortlist = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Shortlisted" } : a))
    );
  };

  const handleReject = (id: string, reason: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Rejected", rejectionReason: reason } : a))
    );
  };

  const handleDownloadResume = (candidateName: string) => {
    swiftAlert.success({
      title: "Resume Exported",
      description: `Downloaded ${candidateName}'s CV document (PDF).`,
    });
  };

  const totalCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <FileUser className="h-7 w-7 text-teal-600" />
            Job Application Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review incoming job applications, candidate qualifications, download resumes, and accept/reject submissions.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Export Ready",
              description: "Exported all candidate resumes & application records to ZIP.",
            })
          }
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Candidate Resumes</span>
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
              placeholder="Search by Candidate Name, Qualification, or Job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Applications</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Application Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Candidate Name</TableHead>
              <TableHead className="font-bold text-xs">Applied Position</TableHead>
              <TableHead className="font-bold text-xs">Qualification & Experience</TableHead>
              <TableHead className="font-bold text-xs">Resume (CV)</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No candidate applications found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((a) => (
                <TableRow key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Candidate Name */}
                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{a.candidateName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{a.email}</span>
                  </TableCell>

                  {/* Applied Position */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    {a.appliedJobTitle}
                  </TableCell>

                  {/* Qualification */}
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {a.qualification}
                  </TableCell>

                  {/* Resume Download */}
                  <TableCell className="text-xs">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadResume(a.candidateName)}
                      className="h-7 text-[11px] gap-1 text-teal-600 hover:bg-teal-50 px-2"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </Button>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        a.status === "Shortlisted"
                          ? "default"
                          : a.status === "Rejected"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {a.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDetails(a)}
                      className="h-8 text-xs gap-1 border-slate-200 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredApps.length}</strong> candidate applications
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Resume Screening Matrix Active
          </span>
        </div>
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        application={selectedApp}
        onShortlist={handleShortlist}
        onReject={handleReject}
      />
    </div>
  );
}
