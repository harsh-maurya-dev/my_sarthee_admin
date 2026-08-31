"use client";

import { useState, useMemo } from "react";
import {
  RescheduleRequestItem,
  initialRescheduleRequests,
} from "./_data/reschedule-requests";
import { ReviewRescheduleModal } from "./_components/review-reschedule-modal";
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
  CalendarClock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  MapPin,
  User,
  ArrowRight,
  Send,
  Smartphone,
  Check,
  Eye,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function RescheduleRequestsPage() {
  const [requests, setRequests] = useState<RescheduleRequestItem[]>(
    initialRescheduleRequests
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [requesterFilter, setRequesterFilter] = useState<string>("All");

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState<RescheduleRequestItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(q) ||
        r.bookingCode.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.assignedProfessional.name.toLowerCase().includes(q) ||
        r.locationArea.toLowerCase().includes(q) ||
        r.reasonForRescheduling.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesRequester = requesterFilter === "All" || r.requestedBy === requesterFilter;

      return matchesSearch && matchesStatus && matchesRequester;
    });
  }, [requests, searchQuery, statusFilter, requesterFilter]);

  // Counts
  const pendingCount = requests.filter((r) => r.status === "Pending Approval").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const declinedCount = requests.filter((r) => r.status === "Declined").length;

  const handleApprove = (id: string, remarks?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Approved" as const,
              adminRemarks: remarks || "Approved and synced to master visit schedule.",
              actionTakenAt: new Date().toLocaleString(),
            }
          : r
      )
    );
  };

  const handleDecline = (id: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Declined" as const,
              adminRemarks: `Declined: ${reason}`,
              actionTakenAt: new Date().toLocaleString(),
            }
          : r
      )
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setRequesterFilter("All");
    swiftAlert.info({
      title: "Filters Reset",
      description: "Displaying all reschedule requests.",
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <CalendarClock className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
              Visit Reschedule Requests
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs">
              {pendingCount} Pending Action
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Review shift adjustment requests from patients and care professionals with updated timings, reasons, and caregiver availability verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Exported reschedule log to CSV format.",
              })
            }
            className="h-9 gap-2 text-xs border-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Mobile Feed</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Pending Card */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Pending Approval</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">Awaiting Admin Decision</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Approved Card */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Approved Reschedules</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</h3>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">Synced to Schedules</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Declined Card */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Declined Requests</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{declinedCount}</h3>
            <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium mt-0.5">Retained Original Slot</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Turnaround Time */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Avg. Response Time</p>
            <h3 className="text-2xl font-black text-foreground mt-1">12m</h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-medium mt-0.5">Target: &lt; 30 mins</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center font-bold">
            <CalendarClock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Request ID, Patient, Booking, or Caregiver..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses ({requests.length})</SelectItem>
                  <SelectItem value="Pending Approval">Pending Approval ({pendingCount})</SelectItem>
                  <SelectItem value="Approved">Approved ({approvedCount})</SelectItem>
                  <SelectItem value="Declined">Declined ({declinedCount})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Requested By:</span>
              <Select value={requesterFilter} onValueChange={(val) => val && setRequesterFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-40">
                  <SelectValue placeholder="Requester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Requesters</SelectItem>
                  <SelectItem value="Patient / Family">Patient / Family</SelectItem>
                  <SelectItem value="Care Professional">Care Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || statusFilter !== "All" || requesterFilter !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Requests Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-28">
                Request ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Patient & Booking
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Staff
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Original Schedule
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Requested New Time
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground max-w-xs">
                Reason for Reschedule
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                Requester
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-xs text-muted-foreground font-medium">
                  No reschedule requests match your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                  {/* Request ID & Submitted Time */}
                  <TableCell className="py-3 font-mono">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#01265D] dark:text-blue-300 dark:text-blue-400">{req.id}</span>
                      <span className="text-[10px] text-muted-foreground">{req.requestedAt}</span>
                    </div>
                  </TableCell>

                  {/* Patient & Booking */}
                  <TableCell className="py-3">
                    <div className="text-xs font-bold text-foreground">{req.patientName}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono font-semibold text-foreground">{req.bookingCode}</span>
                      <span>&bull;</span>
                      <span>{req.careType}</span>
                    </div>
                  </TableCell>

                  {/* Assigned Staff */}
                  <TableCell className="py-3">
                    <div className="text-xs font-medium text-foreground">{req.assignedProfessional.name}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>{req.assignedProfessional.type}</span>
                      <span>&bull;</span>
                      {req.assignedProfessional.isAvailableForNewTime ? (
                        <span className="text-emerald-600 font-semibold">Available</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Overlap</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Original Schedule */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium text-muted-foreground line-through">{req.originalSchedule.date}</span>
                      <span className="text-[10px] text-muted-foreground">{req.originalSchedule.timeSlot}</span>
                    </div>
                  </TableCell>

                  {/* Requested New Schedule */}
                  <TableCell className="py-3 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#01265D] dark:text-blue-300 dark:text-blue-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {req.requestedNewSchedule.date}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                        {req.requestedNewSchedule.timeSlot}
                      </span>
                    </div>
                  </TableCell>

                  {/* Reason for Reschedule */}
                  <TableCell className="py-3 max-w-xs text-xs">
                    <p className="font-medium text-foreground line-clamp-2" title={req.reasonForRescheduling}>
                      {req.reasonForRescheduling}
                    </p>
                  </TableCell>

                  {/* Requested By */}
                  <TableCell className="py-3 text-center">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {req.requestedBy}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 text-center">
                    {req.status === "Approved" ? (
                      <Badge className="bg-emerald-600 text-white font-semibold text-[10px]">
                        ✓ Approved
                      </Badge>
                    ) : req.status === "Declined" ? (
                      <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-[10px]">
                        ✕ Declined
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold text-[10px]">
                        Pending Review
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsReviewOpen(true);
                        }}
                        className="h-8 text-xs gap-1 font-semibold border-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#01265D] dark:text-blue-300 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-950"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review</span>
                      </Button>

                      {req.status === "Pending Approval" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              handleApprove(req.id);
                              swiftAlert.success({
                                title: "Reschedule Approved",
                                description: `${req.patientName}'s shift updated to ${req.requestedNewSchedule.date} (${req.requestedNewSchedule.timeSlot}).`,
                              });
                            }}
                            className="h-8 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                            title="Quick Approve"
                          >
                            <Check className="h-3.5 w-3.5 mr-0.5" />
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Table Footer */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredRequests.length}</strong> of{" "}
            <strong className="text-foreground">{requests.length}</strong> total requests ·{" "}
            <strong className="text-amber-600">{pendingCount} pending decision</strong>
          </span>
          <span className="font-medium text-[#01265D] dark:text-blue-400 flex items-center gap-1">
            <Smartphone className="h-3.5 w-3.5" />
            Mobile Sync Active
          </span>
        </div>
      </div>

      {/* Review & Reschedule Modal */}
      <ReviewRescheduleModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        request={selectedRequest}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    </div>
  );
}
