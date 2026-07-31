"use client";

import { useState, useMemo } from "react";
import { WebsiteEnquiry, initialWebsiteEnquiries } from "./_data/enquiries";
import { EnquiryDetailsModal } from "./_components/enquiry-details-modal";
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
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function EnquiryManagementPage() {
  const [enquiries, setEnquiries] = useState<WebsiteEnquiry[]>(initialWebsiteEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState<WebsiteEnquiry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      const matchesDate = !dateFilter || e.submittedDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [enquiries, searchQuery, statusFilter, dateFilter]);

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

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "New").length;
  const resolvedCount = enquiries.filter((e) => e.status === "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-teal-600" />
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

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Submitted Enquiries</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalCount}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Website Form Submissions</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">New Unread Enquiries</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{newCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Awaiting Staff Response</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Resolved Enquiries</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{resolvedCount}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Follow-up Completed</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Subject, Message, Name, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="New">New Only</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Date:</span>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-9 text-xs pl-8 w-36"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Sender Name & Phone</TableHead>
              <TableHead className="font-bold text-xs">Email Address</TableHead>
              <TableHead className="font-bold text-xs">Subject</TableHead>
              <TableHead className="font-bold text-xs">Submitted Date</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No enquiry submissions found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((e) => (
                <TableRow key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Sender Name & Phone */}
                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{e.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> {e.phone}
                    </span>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-xs font-mono text-foreground">
                    {e.email}
                  </TableCell>

                  {/* Subject */}
                  <TableCell className="text-xs font-semibold text-foreground max-w-xs truncate">
                    {e.subject}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {e.submittedDate}
                  </TableCell>

                  {/* Status */}
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

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetails(e)}
                        className="h-8 text-xs gap-1 border-slate-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

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

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredEnquiries.length}</strong> website enquiry submissions
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Contact Form Sync Active
          </span>
        </div>
      </div>

      {/* Enquiry Details Modal */}
      <EnquiryDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        enquiry={selectedEnquiry}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
