"use client";

import { useState, useMemo } from "react";
import { WebsiteEnquiry, initialWebsiteEnquiries } from "./_data/enquiries";
import { EnquiryDetailsModal } from "./_components/enquiry-details-modal";
import { WebsiteNavHeader } from "../_components/website-nav-header";
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
  MessageSquare,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Edit,
  X,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function EnquiryManagementPage() {
  const [enquiries, setEnquiries] = useState<WebsiteEnquiry[]>(initialWebsiteEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [startDateFrom, setStartDateFrom] = useState<string>("");
  const [startDateTo, setStartDateTo] = useState<string>("");

  const [selectedEnquiry, setSelectedEnquiry] = useState<WebsiteEnquiry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered by Search (Subject, Message, Name, Email) and Filters (Date Range, Status)
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        e.subject.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || e.status === statusFilter;

      const enquiryDate = e.submittedDate; // format YYYY-MM-DD
      const matchesDateFrom = !startDateFrom || enquiryDate >= startDateFrom;
      const matchesDateTo = !startDateTo || enquiryDate <= startDateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [enquiries, searchQuery, statusFilter, startDateFrom, startDateTo]);

  const handleOpenDetails = (enquiry: WebsiteEnquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: WebsiteEnquiry["status"],
    notes: string
  ) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: newStatus, responseNotes: notes } : e
      )
    );
  };

  const handleDeleteEnquiry = (id: string, senderName: string) => {
    if (confirm(`Are you sure you want to delete enquiry from "${senderName}"?`)) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      swiftAlert.error({
        title: "Enquiry Deleted",
        description: `Enquiry from ${senderName} removed.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setStartDateFrom("");
    setStartDateTo("");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    startDateFrom !== "" ||
    startDateTo !== "";

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "New").length;
  const resolvedCount = enquiries.filter((e) => e.status === "Resolved").length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-teal-600 dark:text-teal-400" />
            Enquiry Form Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review general website contact form submissions, patient inquiries, email & phone details.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Export Ready",
              description: "Exported website contact enquiries to CSV.",
            })
          }
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Enquiries CSV</span>
        </Button>
      </div>

      {/* Nav Header */}
      {/* <WebsiteNavHeader /> */} 


      {/* Search & Filter Toolbar (Search by Subject, Message; Filter by Date Range, Status) */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search by Subject / Message / Name */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Subject, Message, or Sender Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="h-9 w-36 text-xs rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>Date Range:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">From</span>
              <Input
                type="date"
                value={startDateFrom}
                onChange={(e) => setStartDateFrom(e.target.value)}
                className="h-8 w-34 text-xs rounded-lg bg-background px-2"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">To</span>
              <Input
                type="date"
                value={startDateTo}
                onChange={(e) => setStartDateTo(e.target.value)}
                className="h-8 w-34 text-xs rounded-lg bg-background px-2"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <X className="h-3 w-3" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">ID / Date</TableHead>
              <TableHead className="font-bold text-xs">Name</TableHead>
              <TableHead className="font-bold text-xs">Email & Phone</TableHead>
              <TableHead className="font-bold text-xs">Subject</TableHead>
              <TableHead className="font-bold text-xs">Message</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                  No enquiry submissions found matching your search and filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((e) => (
                <TableRow
                  key={e.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 cursor-pointer"
                  onClick={() => handleOpenDetails(e)}
                >
                  <TableCell className="text-xs font-mono">
                    <span className="font-bold text-foreground">{e.id}</span>
                    <span className="text-[10px] text-muted-foreground block">{e.submittedDate}</span>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-foreground">
                    {e.name}
                  </TableCell>

                  <TableCell className="text-xs font-mono">
                    <span className="text-foreground block">{e.email}</span>
                    <span className="text-[10px] text-muted-foreground">{e.phone}</span>
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground max-w-[180px]">
                    <span className="truncate block">{e.subject}</span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground max-w-[260px]">
                    <span className="truncate block">{e.message}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        e.status === "Resolved"
                          ? "default"
                          : e.status === "Contacted"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {e.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetails(e)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-teal-600" />
                        <span>View</span>
                      </Button>

                      {/* Update */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetails(e)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5 text-sky-600" />
                        <span>Update</span>
                      </Button>

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEnquiry(e.id, e.name)}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
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
      </div>

      {/* Details & Status Update Modal */}
      <EnquiryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        enquiry={selectedEnquiry}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
