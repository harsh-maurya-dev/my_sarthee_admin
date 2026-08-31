"use client";

import { useState, useMemo } from "react";
import {
  CaregiverRegistrationRequest,
  initialRegistrationRequests,
} from "./_data/caregivers";
import {
  initialCareProfessionals,
  CareProfessional,
  ProfessionalStatus,
} from "@/lib/admin-data";
import { ReviewApplicantModal } from "./_components/review-applicant-modal";
import { RejectApplicantModal } from "./_components/reject-applicant-modal";
import { OnboardProfessionalModal } from "./_components/onboard-professional-modal";
import { ShiftDetailsModal } from "./_components/shift-details-modal";
import { ProfessionalScheduleModal } from "./_components/professional-schedule-modal";
import { LeaveRequestsTab } from "./_components/leave-requests-tab";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  XCircle,
  Download,
  Calendar,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  Phone,
  Activity,
  MapPin,
  Smartphone,
  Check,
  RefreshCw,
  CalendarOff,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CaregiverManagementPage() {
  const [activeTab, setActiveTab] = useState<"availability" | "requests" | "leaves">("availability");

  // Registration Requests State
  const [registrationRequests, setRegistrationRequests] = useState<CaregiverRegistrationRequest[]>(
    initialRegistrationRequests
  );
  const [requestSearchQuery, setRequestSearchQuery] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<"All" | "Pending Review" | "Approved" | "Rejected">("All");
  const [requestDateFilter, setRequestDateFilter] = useState("");
  const [requestKycFilter, setRequestKycFilter] = useState<"All" | "Complete" | "Incomplete">("All");

  // Availability / Roster State
  const [professionals, setProfessionals] = useState<CareProfessional[]>(initialCareProfessionals);
  const [proTypeFilter, setProTypeFilter] = useState<string>("All");
  const [proStatusFilter, setProStatusFilter] = useState<string>("All");
  const [proSearchQuery, setProSearchQuery] = useState("");

  // Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<CaregiverRegistrationRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rejectingApplicant, setRejectingApplicant] = useState<CaregiverRegistrationRequest | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [selectedProForShift, setSelectedProForShift] = useState<CareProfessional | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedProForSchedule, setSelectedProForSchedule] = useState<CareProfessional | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filtered Registration Requests
  const filteredRequests = useMemo(() => {
    return registrationRequests.filter((req) => {
      const q = requestSearchQuery.toLowerCase();
      const matchesSearch =
        req.fullName.toLowerCase().includes(q) ||
        req.username.toLowerCase().includes(q) ||
        req.skills.some((s) => s.toLowerCase().includes(q)) ||
        req.id.toLowerCase().includes(q) ||
        req.phoneNumber.includes(q);

      const matchesStatus = requestStatusFilter === "All" || req.status === requestStatusFilter;
      const matchesDate = !requestDateFilter || req.appliedDate === requestDateFilter;
      const isCompleteKyc = req.kycDetails.idProof && req.kycDetails.nursingLicense && req.kycDetails.backgroundCheck;
      const matchesKyc =
        requestKycFilter === "All" ||
        (requestKycFilter === "Complete" && isCompleteKyc) ||
        (requestKycFilter === "Incomplete" && !isCompleteKyc);

      return matchesSearch && matchesStatus && matchesDate && matchesKyc;
    });
  }, [registrationRequests, requestSearchQuery, requestStatusFilter, requestDateFilter, requestKycFilter]);

  // Filtered Live Availability
  const filteredPros = useMemo(() => {
    return professionals.filter((p) => {
      const q = proSearchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.area.toLowerCase().includes(q) ||
        (p.currentAssignment && p.currentAssignment.patientName.toLowerCase().includes(q));

      const matchesType = proTypeFilter === "All" || p.type === proTypeFilter;
      const matchesStatus = proStatusFilter === "All" || p.status === proStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [professionals, proSearchQuery, proTypeFilter, proStatusFilter]);

  // Counts
  const pendingCount = registrationRequests.filter((r) => r.status === "Pending Review").length;

  // Handlers for Registration Requests
  const handleApproveApplicant = (applicantId: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === applicantId ? { ...r, status: "Approved" as const } : r))
    );

    const applicant = registrationRequests.find((r) => r.id === applicantId);
    if (applicant) {
      const newPro: CareProfessional = {
        id: `PRO-${Date.now().toString().slice(-4)}`,
        name: applicant.fullName,
        email: `${applicant.username.toLowerCase()}@care.mysarthee.in`,
        phone: applicant.phoneNumber,
        area: "Downtown / Central",
        status: "Available",
        type: "Caregiver",
        specializations: applicant.skills,
        experienceYears: parseInt(applicant.experience) || 5,
        rating: 5.0,
        totalVisitsCompleted: 0,
        onDutyToday: true,
        languages: ["English", "Hindi"],
        policeVerified: applicant.kycDetails.backgroundCheck,
        qualification: applicant.certifications[0] || "Registered Caregiver",
      };
      setProfessionals((prev) => [newPro, ...prev]);
    }
  };

  const handleRejectApplicant = (applicantId: string, reason: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) =>
        r.id === applicantId ? { ...r, status: "Rejected" as const, rejectionReason: reason } : r
      )
    );
  };

  const handleOpenQuickReject = (applicant: CaregiverRegistrationRequest) => {
    setRejectingApplicant(applicant);
    setIsRejectModalOpen(true);
  };

  const handleResetRequestFilters = () => {
    setRequestSearchQuery("");
    setRequestStatusFilter("All");
    setRequestDateFilter("");
    setRequestKycFilter("All");
    swiftAlert.info({ title: "Filters Reset", description: "Displaying all caregiver registration requests." });
  };

  const getProStatusBadge = (status: ProfessionalStatus) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">🟢 Available</Badge>;
      case "Assigned":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">🟡 Assigned</Badge>;
      case "Accepted":
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px]">🔵 Accepted</Badge>;
      case "En route":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px]">🚗 En Route</Badge>;
      case "Care Started":
        return <Badge className="bg-[#01265D] text-white font-bold animate-pulse text-[10px]">❤️ Care Started</Badge>;
      case "Care Completed":
        return <Badge className="bg-slate-200 text-slate-800 font-bold text-[10px]">✓ Completed</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-600 font-bold text-[10px]">Off Duty</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
              Care Professionals & Registration
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs">
              Unified Roster
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time availability lifecycle management and mobile registration request processing with KYC verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Exported roster report to CSV format.",
              })
            }
            className="h-9 gap-2 text-xs border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsOnboardModalOpen(true)}
            className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard Professional</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        {/* Tab 1: Live Availability */}
        <button
          onClick={() => setActiveTab("availability")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "availability"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Care Giver Listing</span>
          {/* <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {professionals.length}
          </Badge> */}
        </button>

        {/* Tab 2: Caregiver Registration Requests */}
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "requests"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Registration Requests</span>
        </button>

        {/* Tab 3: Caregiver Leave Requests */}
        <button
          onClick={() => setActiveTab("leaves")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "leaves"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarOff className="h-4 w-4" />
          <span>Leave Requests</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LIVE AVAILABILITY & LIFECYCLE */}
      {/* ========================================================= */}
      {activeTab === "availability" && (
        <div className="space-y-4">
          {/* Filter Tabs & Search Bar */}
          <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { key: "All", label: "All Professionals", count: professionals.length },
                { key: "Nurse", label: "Nurses", count: professionals.filter((p) => p.type === "Nurse").length },
                { key: "Caregiver", label: "Caregivers", count: professionals.filter((p) => p.type === "Caregiver").length },
                { key: "Physiotherapist", label: "Physiotherapists", count: professionals.filter((p) => p.type === "Physiotherapist").length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setProTypeFilter(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    proTypeFilter === tab.key
                      ? "bg-[#01265D] text-white shadow-sm"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      proTypeFilter === tab.key ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search professional or area..."
                  className="pl-9 text-xs rounded-xl bg-card"
                  value={proSearchQuery}
                  onChange={(e) => setProSearchQuery(e.target.value)}
                />
              </div>

              <Select value={proStatusFilter} onValueChange={(val) => val && setProStatusFilter(val)}>
                <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-card">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="En route">En route</SelectItem>
                  <SelectItem value="Care Started">Care Started</SelectItem>
                  <SelectItem value="Care Completed">Care Completed</SelectItem>
                  <SelectItem value="Off Duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-64">
                    Professional
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Area
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Current Assignment
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Experience & Rating
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                    Quick Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                      No professionals match the selected criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPros.map((pro) => (
                    <TableRow key={pro.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      {/* Professional */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 text-xs font-bold">
                            <AvatarFallback>{pro.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              {pro.name}
                              {pro.policeVerified && (
                                <ShieldCheck className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" /> {pro.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell className="py-3">
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {pro.type}
                        </Badge>
                      </TableCell>

                      {/* Area */}
                      <TableCell className="text-xs font-medium text-foreground py-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                          {pro.area}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        {getProStatusBadge(pro.status)}
                      </TableCell>

                      {/* Current Assignment */}
                      <TableCell className="py-3">
                        {pro.currentAssignment ? (
                          <div>
                            <span className="text-xs font-bold text-[#01265D] dark:text-blue-300 dark:text-blue-400 block">
                              Patient #{pro.currentAssignment.patientId} ({pro.currentAssignment.patientName})
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {pro.currentAssignment.shiftTime}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      {/* Experience & Rating */}
                      <TableCell className="py-3">
                        <div className="text-xs font-semibold text-foreground">
                          ★ {pro.rating} <span className="text-muted-foreground text-[10px]">({pro.totalVisitsCompleted} visits)</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {pro.experienceYears} yrs exp · {pro.qualification}
                        </div>
                      </TableCell>

                      {/* Quick Action */}
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs font-semibold gap-1 border-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#01265D] dark:text-blue-300 dark:hover:bg-blue-950"
                            onClick={() => {
                              setSelectedProForSchedule(pro);
                              setIsScheduleModalOpen(true);
                            }}
                            title="View Full Date Schedule"
                          >
                            <Calendar className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                            <span>View Schedule</span>
                          </Button>

                          {pro.status === "Available" ? (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold"
                              onClick={() =>
                                swiftAlert.info({
                                  title: `Assign ${pro.name}`,
                                  description: "Connecting to open booking queue in Smart Matcher.",
                                })
                              }
                            >
                              Assign Patient
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-semibold"
                              onClick={() => {
                                setSelectedProForShift(pro);
                                setIsShiftModalOpen(true);
                              }}
                            >
                              View Shift
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CAREGIVER REGISTRATION REQUESTS */}
      {/* ========================================================= */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {/* Search & Filter Bar for Registration Requests */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search by Username, Skills, Name */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Username, Skills, Phone, or Full Name..."
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {/* Filter by Date, Status, KYC */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={requestStatusFilter} onValueChange={(val: any) => setRequestStatusFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Requests</SelectItem>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">KYC Docs:</span>
                  <Select value={requestKycFilter} onValueChange={(val: any) => setRequestKycFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-32">
                      <SelectValue placeholder="KYC Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All KYC</SelectItem>
                      <SelectItem value="Complete">Complete</SelectItem>
                      <SelectItem value="Incomplete">Incomplete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Applied:</span>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="date"
                      value={requestDateFilter}
                      onChange={(e) => setRequestDateFilter(e.target.value)}
                      className="h-9 text-xs pl-8 w-36"
                    />
                  </div>
                </div>

                {(requestSearchQuery || requestStatusFilter !== "All" || requestDateFilter || requestKycFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetRequestFilters}
                    className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Registration Requests Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Application ID</TableHead>
                  <TableHead className="font-bold text-xs">Applicant Name & Username</TableHead>
                  <TableHead className="font-bold text-xs">Age / Gender</TableHead>
                  <TableHead className="font-bold text-xs">Date of Birth</TableHead>
                  {/* <TableHead className="font-bold text-xs">Skills</TableHead> */}
                  <TableHead className="font-bold text-xs">Experience</TableHead>
                  {/* <TableHead className="font-bold text-xs">Certification</TableHead> */}
                  <TableHead className="font-bold text-xs text-center">KYC Verification</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No caregiver registration requests found matching your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req) => {
                    const isKycComplete =
                      req.kycDetails.idProof &&
                      req.kycDetails.nursingLicense &&
                      req.kycDetails.backgroundCheck;

                    return (
                      <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                        {/* Application ID & Applied Date */}
                        <TableCell className="font-mono text-xs text-foreground font-semibold">
                          <div className="flex flex-col">
                            <span className="text-[#01265D] dark:text-blue-300 dark:text-blue-400 font-bold">{req.id}</span>
                            <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1">
                              <Smartphone className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" />
                              {req.appliedDate}
                            </span>
                          </div>
                        </TableCell>

                        {/* Applicant Name & Username */}
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 font-bold flex items-center justify-center text-xs dark:bg-blue-950 dark:text-blue-300">
                              {req.fullName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">{req.fullName}</span>
                              <span className="text-[10px] text-muted-foreground">
                                @{req.username} · {req.phoneNumber}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Age / Gender */}
                        <TableCell className="text-xs">
                          {req.age} yrs · <span className="text-muted-foreground">{req.gender}</span>
                        </TableCell>

                        {/* Date of Birth */}
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {req.dateOfBirth}
                        </TableCell>

                        {/* Skills */}
                        {/* <TableCell className="text-xs max-w-[180px]">
                          <div className="flex flex-wrap gap-1">
                            {req.skills.slice(0, 2).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 bg-blue-50/50 dark:bg-blue-950/30 text-[#01265D] dark:text-blue-100 dark:text-blue-300">
                                {skill}
                              </Badge>
                            ))}
                            {req.skills.length > 2 && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                +{req.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell> */}

                        {/* Experience */}
                        <TableCell className="text-xs font-medium text-foreground">
                          {req.experience}
                        </TableCell>

                        {/* Certification */}
                        {/* <TableCell className="text-xs max-w-[170px]">
                          <div className="flex flex-wrap gap-1">
                            {req.certifications.slice(0, 1).map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 truncate max-w-[140px]">
                                {cert}
                              </Badge>
                            ))}
                            {req.certifications.length > 1 && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                +{req.certifications.length - 1}
                              </Badge>
                            )}
                          </div>
                        </TableCell> */}

                        {/* KYC Verification */}
                        <TableCell className="text-center">
                          {isKycComplete ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                              <ShieldCheck className="h-3 w-3 mr-0.5" /> Complete
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px] font-semibold">
                              Incomplete
                            </Badge>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          {req.status === "Approved" ? (
                            <Badge className="bg-emerald-600 text-white font-semibold text-[11px]">Approved</Badge>
                          ) : req.status === "Rejected" ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-[11px]">Rejected</Badge>
                              {req.rejectionReason && (
                                <span
                                  className="text-[9px] text-rose-600 dark:text-rose-400 font-medium max-w-[130px] truncate"
                                  title={req.rejectionReason}
                                >
                                  {req.rejectionReason}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-[11px] font-semibold">
                              Pending Review
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplicant(req);
                                setIsReviewOpen(true);
                              }}
                              className="h-8 text-xs gap-1 font-semibold border-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#01265D] dark:text-blue-300 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-950"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Review</span>
                            </Button>

                            {req.status === "Pending Review" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveApplicant(req.id)}
                                  className="h-8 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                                  title="Quick Approve"
                                >
                                  <Check className="h-3.5 w-3.5 mr-0.5" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenQuickReject(req)}
                                  className="h-8 text-xs px-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950"
                                  title="Reject with Reason"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Footer Summary */}
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredRequests.length}</strong> of{" "}
                <strong className="text-foreground">{registrationRequests.length}</strong> total requests ·{" "}
                <strong className="text-amber-600">{pendingCount} pending review</strong>
              </span>
              <span className="font-medium text-[#01265D] dark:text-blue-400 flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile App Sync Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: USER GENERATED LEAVE REQUESTS & APPROVALS          */}
      {/* ========================================================= */}
      {activeTab === "leaves" && <LeaveRequestsTab />}

      {/* Review Applicant Registration Request Modal */}
      <ReviewApplicantModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        applicant={selectedApplicant}
        onApprove={handleApproveApplicant}
        onReject={handleRejectApplicant}
      />

      {/* Quick Reject Modal */}
      <RejectApplicantModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        applicant={rejectingApplicant}
        onConfirmReject={handleRejectApplicant}
      />

      {/* Onboard Care Professional Modal */}
      <OnboardProfessionalModal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onAddProfessional={(newPro) => setProfessionals((prev) => [newPro, ...prev])}
      />

      {/* Shift Details Modal */}
      <ShiftDetailsModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        professional={selectedProForShift}
      />

      {/* Professional Full Date Schedule Modal */}
      <ProfessionalScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        professional={selectedProForSchedule}
      />
    </div>
  );
}
