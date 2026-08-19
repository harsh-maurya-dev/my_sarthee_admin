"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  initialBookings,
  BookingItem,
} from "@/lib/admin-data";
import {
  AssignReplacementModal,
  BookingReplacementRequest,
} from "./_components/assign-replacement-modal";
import {
  RescheduleRequestItem,
  initialRescheduleRequests,
} from "../reschedule-requests/_data/reschedule-requests";
import { ReviewRescheduleModal } from "../reschedule-requests/_components/review-reschedule-modal";
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
  Search,
  MapPin,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CalendarCheck2,
  CalendarClock,
  Clock,
  Calendar,
  Eye,
  Check,
  Smartphone,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

const initialReplacementRequests: BookingReplacementRequest[] = [
  {
    id: "rep-req-1",
    bookingId: "bk-1",
    bookingCode: "BK-2120",
    patientId: "MS-1104",
    patientName: "Meera Krishnan",
    ageGender: "71y / Female",
    careType: "Nursing",
    locationArea: "Andheri",
    shiftSchedule: "Once daily (09:00 AM - 01:00 PM)",
    currentProfessional: {
      name: "Priya Sharma",
      type: "Nurse",
      phone: "+91 98201 23456",
    },
    reason: "Caregiver emergency sick leave for 3 days due to personal health issue.",
    urgency: "Critical",
    requestDate: "2026-08-19",
    status: "Pending Reassignment",
    patientNotes: "Post-op cardiac recovery, sterile dressing change required daily.",
  },
  {
    id: "rep-req-2",
    bookingId: "bk-3",
    bookingCode: "BK-2045",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    ageGender: "72y / Male",
    careType: "Combination",
    locationArea: "Juhu",
    shiftSchedule: "Twice daily (08:00 AM & 06:00 PM)",
    currentProfessional: {
      name: "Anita Jadhav",
      type: "Nurse",
      phone: "+91 98765 43210",
    },
    reason: "Family requested male caregiver with Neuro-rehab and gait training specialization.",
    urgency: "High",
    requestDate: "2026-08-18",
    status: "Pending Reassignment",
    patientNotes: "Parkinson's mobility support, wheelchair assistance.",
  },
  {
    id: "rep-req-3",
    bookingId: "bk-4",
    bookingCode: "BK-2110",
    patientId: "MS-1088",
    patientName: "Shalini Singhania",
    ageGender: "64y / Female",
    careType: "Physiotherapy",
    locationArea: "Powai",
    shiftSchedule: "Once daily (10:00 AM)",
    currentProfessional: {
      name: "Rahul Verma",
      type: "Physiotherapist",
      phone: "+91 98212 34567",
    },
    reason: "Patient preferred morning slot instead of evening; caregiver schedule conflict.",
    urgency: "Medium",
    requestDate: "2026-08-17",
    status: "Replacement Assigned",
    replacementProfessional: {
      name: "Dr. Neha Kothari",
      type: "Physiotherapist",
      phone: "+91 98199 87654",
      assignedAt: "2026-08-18 11:30 AM",
    },
    patientNotes: "Knee replacement post-op physiotherapy.",
  },
];

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [replacementRequests, setReplacementRequests] = useState<BookingReplacementRequest[]>(
    initialReplacementRequests
  );
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequestItem[]>(
    initialRescheduleRequests
  );
  const [activeTab, setActiveTab] = useState<"bookings" | "replacements" | "reschedules">("bookings");

  // Booking Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [careTypeFilter, setCareTypeFilter] = useState<string>("All");

  // Replacement Request Filters
  const [replacementSearchQuery, setReplacementSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [replacementStatusFilter, setReplacementStatusFilter] = useState<string>("All");

  // Reschedule Request Filters
  const [rescheduleSearchQuery, setRescheduleSearchQuery] = useState("");
  const [rescheduleStatusFilter, setRescheduleStatusFilter] = useState<string>("All");
  const [rescheduleRequesterFilter, setRescheduleRequesterFilter] = useState<string>("All");

  // Modals State
  const [selectedReplacementReq, setSelectedReplacementReq] = useState<BookingReplacementRequest | null>(null);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);

  const [selectedRescheduleReq, setSelectedRescheduleReq] = useState<RescheduleRequestItem | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.bookingCode.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.locationArea.toLowerCase().includes(q) ||
        b.careType.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const matchesCareType = careTypeFilter === "All" || b.careType === careTypeFilter;

      return matchesSearch && matchesStatus && matchesCareType;
    });
  }, [bookings, searchQuery, statusFilter, careTypeFilter]);

  // Filtered Replacement Requests
  const filteredReplacementRequests = useMemo(() => {
    return replacementRequests.filter((r) => {
      const q = replacementSearchQuery.toLowerCase();
      const matchesSearch =
        r.bookingCode.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.locationArea.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.currentProfessional.name.toLowerCase().includes(q);

      const matchesUrgency = urgencyFilter === "All" || r.urgency === urgencyFilter;
      const matchesStatus = replacementStatusFilter === "All" || r.status === replacementStatusFilter;

      return matchesSearch && matchesUrgency && matchesStatus;
    });
  }, [replacementRequests, replacementSearchQuery, urgencyFilter, replacementStatusFilter]);

  // Filtered Reschedule Requests
  const filteredRescheduleRequests = useMemo(() => {
    return rescheduleRequests.filter((r) => {
      const q = rescheduleSearchQuery.toLowerCase();
      const matchesSearch =
        r.id.toLowerCase().includes(q) ||
        r.bookingCode.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.assignedProfessional.name.toLowerCase().includes(q) ||
        r.locationArea.toLowerCase().includes(q) ||
        r.reasonForRescheduling.toLowerCase().includes(q);

      const matchesStatus = rescheduleStatusFilter === "All" || r.status === rescheduleStatusFilter;
      const matchesRequester = rescheduleRequesterFilter === "All" || r.requestedBy === rescheduleRequesterFilter;

      return matchesSearch && matchesStatus && matchesRequester;
    });
  }, [rescheduleRequests, rescheduleSearchQuery, rescheduleStatusFilter, rescheduleRequesterFilter]);

  const pendingReplacementsCount = replacementRequests.filter(
    (r) => r.status === "Pending Reassignment"
  ).length;

  const pendingReschedulesCount = rescheduleRequests.filter(
    (r) => r.status === "Pending Approval"
  ).length;

  const handleResetBookingFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCareTypeFilter("All");
    swiftAlert.info({ title: "Filters Reset", description: "Displaying all bookings." });
  };

  const handleResetReplacementFilters = () => {
    setReplacementSearchQuery("");
    setUrgencyFilter("All");
    setReplacementStatusFilter("All");
    swiftAlert.info({ title: "Filters Reset", description: "Displaying all replacement requests." });
  };

  const handleResetRescheduleFilters = () => {
    setRescheduleSearchQuery("");
    setRescheduleStatusFilter("All");
    setRescheduleRequesterFilter("All");
    swiftAlert.info({ title: "Filters Reset", description: "Displaying all reschedule requests." });
  };

  const handleAssignReplacement = (
    requestId: string,
    replacement: { name: string; type: string; phone: string }
  ) => {
    setReplacementRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "Replacement Assigned" as const,
              replacementProfessional: {
                name: replacement.name,
                type: replacement.type,
                phone: replacement.phone,
                assignedAt: new Date().toLocaleString(),
              },
            }
          : r
      )
    );

    // Update assigned professional in bookings list
    const targetReq = replacementRequests.find((r) => r.id === requestId);
    if (targetReq) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === targetReq.bookingId
            ? {
                ...b,
                assignedProfessional: {
                  name: replacement.name,
                  type: replacement.type as any,
                  phone: replacement.phone,
                },
              }
            : b
        )
      );
    }
  };

  const handleApproveReschedule = (id: string, remarks?: string) => {
    setRescheduleRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Approved" as const,
              adminRemarks: remarks || "Approved and synced to master schedule.",
              actionTakenAt: new Date().toLocaleString(),
            }
          : r
      )
    );
  };

  const handleDeclineReschedule = (id: string, reason: string) => {
    setRescheduleRequests((prev) =>
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

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <CalendarCheck2 className="h-7 w-7 text-teal-600" />
              Bookings & Service Intake
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              {activeTab === "bookings"
                ? `${bookings.length} Total Bookings`
                : activeTab === "replacements"
                ? `${replacementRequests.length} Replacement Requests`
                : `${rescheduleRequests.length} Reschedule Requests`}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage customer care bookings, monitor real-time fulfillment, replacements, and visit reschedule requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/smart-assignment">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Matching Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tabs Navigation: All Bookings, Replacement Requests, Reschedule Requests */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        {/* Tab 1: All Bookings */}
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "bookings"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarCheck2 className="h-4 w-4" />
          <span>All Bookings</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {bookings.length}
          </Badge>
        </button>

        {/* Tab 2: Replacement Requests */}
        <button
          onClick={() => setActiveTab("replacements")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "replacements"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Replacement Requests</span>
          {/* {pendingReplacementsCount > 0 ? (
            <Badge className="bg-rose-600 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
              {pendingReplacementsCount} Pending
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {replacementRequests.length}
            </Badge>
          )} */}
        </button>

        {/* Tab 3: Reschedule Requests */}
        <button
          onClick={() => setActiveTab("reschedules")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "reschedules"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarClock className="h-4 w-4" />
          <span>Reschedule Requests</span>
          {/* {pendingReschedulesCount > 0 ? (
            <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold">
              {pendingReschedulesCount} Pending
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {rescheduleRequests.length}
            </Badge>
          )} */}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ALL BOOKINGS (WITH STATUS & SEARCH FILTERS) */}
      {/* ========================================================= */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {/* Filters Bar: Search, Status Filter, Care Type Filter */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Booking Code, Patient Name, Area..."
                  className="pl-9 h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status & Care Type Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-44">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses ({bookings.length})</SelectItem>
                      <SelectItem value="New">New ({bookings.filter((b) => b.status === "New").length})</SelectItem>
                      <SelectItem value="Pending Assignment">Pending Assignment ({bookings.filter((b) => b.status === "Pending Assignment").length})</SelectItem>
                      <SelectItem value="Upcoming">Upcoming ({bookings.filter((b) => b.status === "Upcoming").length})</SelectItem>
                      <SelectItem value="Ongoing">Ongoing ({bookings.filter((b) => b.status === "Ongoing").length})</SelectItem>
                      <SelectItem value="Completed">Completed ({bookings.filter((b) => b.status === "Completed").length})</SelectItem>
                      <SelectItem value="Cancelled">Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Care Type Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Care Type:</span>
                  <Select value={careTypeFilter} onValueChange={(val) => val && setCareTypeFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-36">
                      <SelectValue placeholder="Care Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Nursing">Nursing</SelectItem>
                      <SelectItem value="Personal Care">Personal Care</SelectItem>
                      <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                      <SelectItem value="Combination">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                {(searchQuery || statusFilter !== "All" || careTypeFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetBookingFilters}
                    className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bookings Data Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-28">
                    Booking ID
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Patient
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Care Type
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Location
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Duration & Schedule
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Assigned Professional
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Billing Breakdown
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-xs text-muted-foreground font-medium">
                      No bookings found matching your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b) => (
                    <TableRow key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      <TableCell className="text-xs font-mono font-bold py-3">
                        {b.bookingCode}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-xs font-bold text-foreground">{b.patientName}</div>
                        <span className="text-[10px] text-muted-foreground">{b.ageGender} · {b.patientId}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {b.careType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground py-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-teal-600" /> {b.locationArea}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        <span className="font-semibold text-foreground block">{b.duration} ({b.frequency})</span>
                        <span className="text-[10px] text-muted-foreground">Starts: {b.startDate}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        {b.assignedProfessional ? (
                          <div>
                            <span className="text-xs font-bold text-foreground block">{b.assignedProfessional.name}</span>
                            <span className="text-[10px] text-muted-foreground">{b.assignedProfessional.type}</span>
                          </div>
                        ) : (
                          <Link href="/smart-assignment">
                            <Button size="sm" variant="outline" className="h-6 text-[10px] border-amber-300 text-amber-800 bg-amber-50 font-bold">
                              Assign Now &rarr;
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        <div className="text-[11px] font-mono">
                          <span>Val: ₹{b.billing.bookingValue.toLocaleString()}</span>
                          <span className="text-muted-foreground"> &bull; Paid: </span>
                          <span className="text-emerald-600 font-bold">₹{b.billing.amountPaid.toLocaleString()}</span>
                        </div>
                        {b.billing.balance > 0 ? (
                          <span className="text-[10px] font-bold text-rose-600 block">
                            Balance: ₹{b.billing.balance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 block">
                            Fully Settled
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge
                          className={`text-[10px] font-bold ${
                            b.status === "Ongoing"
                              ? "bg-teal-600 text-white"
                              : b.status === "Pending Assignment"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : b.status === "New"
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                              : b.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Link href="/smart-assignment">
                          <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950">
                            Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Table Footer */}
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredBookings.length}</strong> of{" "}
                <strong className="text-foreground">{bookings.length}</strong> total bookings
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Live Intake Stream Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: REPLACEMENT REQUESTS */}
      {/* ========================================================= */}
      {activeTab === "replacements" && (
        <div className="space-y-4">
          {/* Replacement Filters Bar */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Code, Patient, Area, Reason..."
                  className="pl-9 h-9 text-xs"
                  value={replacementSearchQuery}
                  onChange={(e) => setReplacementSearchQuery(e.target.value)}
                />
              </div>

              {/* Urgency & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Urgency:</span>
                  <Select value={urgencyFilter} onValueChange={(val) => val && setUrgencyFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-32">
                      <SelectValue placeholder="Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Urgencies</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={replacementStatusFilter} onValueChange={(val) => val && setReplacementStatusFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-44">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Pending Reassignment">Pending Reassignment</SelectItem>
                      <SelectItem value="Replacement Assigned">Replacement Assigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(replacementSearchQuery || urgencyFilter !== "All" || replacementStatusFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetReplacementFilters}
                    className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Replacement Requests Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-28">
                    Booking Code
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Patient Details
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Previous Staff
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground max-w-xs">
                    Reason for Replacement
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                    Urgency
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Replacement Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReplacementRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground font-medium">
                      No replacement requests found matching search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReplacementRequests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      {/* Booking Code & Requested Date */}
                      <TableCell className="py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-foreground">{req.bookingCode}</span>
                          <span className="text-[10px] text-muted-foreground">Req: {req.requestDate}</span>
                        </div>
                      </TableCell>

                      {/* Patient Details */}
                      <TableCell className="py-3">
                        <div className="text-xs font-bold text-foreground">{req.patientName}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>{req.careType}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5 text-teal-600" />
                            {req.locationArea}
                          </span>
                        </div>
                      </TableCell>

                      {/* Previous Staff */}
                      <TableCell className="py-3">
                        <div className="text-xs font-medium text-foreground">{req.currentProfessional.name}</div>
                        <span className="text-[10px] text-muted-foreground">{req.currentProfessional.type} · {req.currentProfessional.phone}</span>
                      </TableCell>

                      {/* Reason */}
                      <TableCell className="py-3 max-w-xs">
                        <p className="text-xs text-foreground font-medium line-clamp-2">{req.reason}</p>
                        {req.patientNotes && (
                          <span className="text-[10px] text-muted-foreground block mt-0.5">Needs: {req.patientNotes}</span>
                        )}
                      </TableCell>

                      {/* Urgency */}
                      <TableCell className="py-3 text-center">
                        <Badge
                          variant={
                            req.urgency === "Critical"
                              ? "destructive"
                              : req.urgency === "High"
                              ? "default"
                              : "outline"
                          }
                          className="text-[10px] uppercase font-bold"
                        >
                          {req.urgency}
                        </Badge>
                      </TableCell>

                      {/* Replacement Status */}
                      <TableCell className="py-3">
                        {req.status === "Pending Reassignment" ? (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">
                            Pending Reassignment
                          </Badge>
                        ) : (
                          <div>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              ✓ {req.replacementProfessional?.name || "Assigned"}
                            </Badge>
                            {req.replacementProfessional?.assignedAt && (
                              <span className="text-[9px] text-muted-foreground block mt-0.5">
                                {req.replacementProfessional.assignedAt}
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-3">
                        {req.status === "Pending Reassignment" ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedReplacementReq(req);
                              setIsReplacementModalOpen(true);
                            }}
                            className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1 shadow-xs"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Assign Replacement</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReplacementReq(req);
                              setIsReplacementModalOpen(true);
                            }}
                            className="h-7 text-xs font-semibold"
                          >
                            Reassign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Footer summary */}
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredReplacementRequests.length}</strong> replacement requests
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Dispatch Live Sync Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: RESCHEDULE REQUESTS */}
      {/* ========================================================= */}
      {activeTab === "reschedules" && (
        <div className="space-y-4">
          {/* Reschedule Filters Bar */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by Request ID, Patient, Booking, or Caregiver..."
                  className="pl-9 h-9 text-xs"
                  value={rescheduleSearchQuery}
                  onChange={(e) => setRescheduleSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={rescheduleStatusFilter} onValueChange={(val) => val && setRescheduleStatusFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-44">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses ({rescheduleRequests.length})</SelectItem>
                      <SelectItem value="Pending Approval">Pending Approval ({pendingReschedulesCount})</SelectItem>
                      <SelectItem value="Approved">Approved ({rescheduleRequests.filter((r) => r.status === "Approved").length})</SelectItem>
                      <SelectItem value="Declined">Declined ({rescheduleRequests.filter((r) => r.status === "Declined").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Requested By:</span>
                  <Select value={rescheduleRequesterFilter} onValueChange={(val) => val && setRescheduleRequesterFilter(val)}>
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

                {(rescheduleSearchQuery || rescheduleStatusFilter !== "All" || rescheduleRequesterFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetRescheduleFilters}
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
                {filteredRescheduleRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-xs text-muted-foreground font-medium">
                      No reschedule requests match your filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRescheduleRequests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      {/* Request ID & Submitted Time */}
                      <TableCell className="py-3 font-mono">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">{req.id}</span>
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
                          <span className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {req.requestedNewSchedule.date}
                          </span>
                          <span className="text-[11px] font-semibold text-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-teal-600" />
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
                              setSelectedRescheduleReq(req);
                              setIsRescheduleModalOpen(true);
                            }}
                            className="h-8 text-xs gap-1 font-semibold border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Review</span>
                          </Button>

                          {req.status === "Pending Approval" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleApproveReschedule(req.id);
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
                Showing <strong className="text-foreground">{filteredRescheduleRequests.length}</strong> of{" "}
                <strong className="text-foreground">{rescheduleRequests.length}</strong> total requests
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Sync Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assign Replacement Modal */}
      <AssignReplacementModal
        isOpen={isReplacementModalOpen}
        onClose={() => setIsReplacementModalOpen(false)}
        request={selectedReplacementReq}
        onAssignReplacement={handleAssignReplacement}
      />

      {/* Review Reschedule Modal */}
      <ReviewRescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        request={selectedRescheduleReq}
        onApprove={handleApproveReschedule}
        onDecline={handleDeclineReschedule}
      />
    </div>
  );
}
