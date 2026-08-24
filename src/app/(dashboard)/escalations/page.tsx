"use client";

import { useState, useMemo } from "react";
import {
  initialEscalations,
  EscalationRecord,
  EscalationPriority,
} from "@/lib/admin-data";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  AlertOctagon,
  HeartPulse,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Stethoscope,
  MapPin,
  RefreshCw,
  Phone,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Eye,
  LockOpen,
  User,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";
import {
  OTPBypassDetailsModal,
  OTPBypassRecord,
} from "./_components/otp-bypass-details-modal";

interface EnrichedEscalationRecord extends EscalationRecord {
  sourceType: "caregiver" | "patient";
}

const enrichedInitialEscalations: EnrichedEscalationRecord[] = [
  // Patient Escalations
  {
    id: "esc-1",
    escalationId: "ESC-801",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    patientLocation: "Juhu",
    professionalName: "Anita Jadhav",
    professionalRole: "Nurse",
    issue: "SpO2 drop to 91% and BP spike to 152/94 during morning mobility drill.",
    category: "Medical concern / emergency",
    timeRaised: "Today, 09:12 AM",
    priority: "Critical",
    assignedTo: "Dr. Vikram Joshi",
    assignedRole: "Clinical Care Coordinator",
    actionTaken: "Patient placed in semi-Fowler position; oxygen concentrator standby. Video call scheduled with treating neurologist.",
    status: "Action In Progress",
    requiresDoctorConsult: true,
    sourceType: "patient",
  },
  {
    id: "esc-4",
    patientId: "MS-1104",
    escalationId: "ESC-804",
    patientName: "Meera Krishnan",
    patientLocation: "Andheri West",
    professionalName: "Priya Sharma",
    professionalRole: "Nurse",
    issue: "Family raised concern regarding sternal surgical incision dressing hygiene and requested senior doctor review.",
    category: "Patient complaint",
    timeRaised: "Today, 11:45 AM",
    priority: "High",
    assignedTo: "Dr. Neha Kothari",
    assignedRole: "Quality Assurance Lead",
    actionTaken: "Wound photograph submitted for sterile compliance review. Dispatched senior clinical nursing supervisor for on-site dressing check.",
    status: "Investigating",
    requiresDoctorConsult: true,
    sourceType: "patient",
  },
  {
    id: "esc-5",
    patientId: "MS-1088",
    escalationId: "ESC-805",
    patientName: "Shalini Singhania",
    patientLocation: "Powai",
    professionalName: "Rahul Verma",
    professionalRole: "Physiotherapist",
    issue: "Patient expressed dissatisfaction with evening visit time due to post-exercise fatigue; requested morning schedule transition.",
    category: "Schedule change",
    timeRaised: "Yesterday, 04:20 PM",
    priority: "Medium",
    assignedTo: "Pooja Hegde",
    assignedRole: "Operations Manager",
    actionTaken: "Approved shift time transition to 10:00 AM slot. Caregiver schedule updated and confirmed on mobile app.",
    resolutionNotes: "Rescheduled to 10:00 AM morning slot with patient agreement.",
    closureTime: "Yesterday, 05:30 PM",
    status: "Resolved",
    sourceType: "patient",
  },

  // Caregiver Professional Escalations
  {
    id: "esc-2",
    escalationId: "ESC-802",
    patientId: "MS-1042",
    patientName: "Kamala Mehta",
    patientLocation: "Bandra",
    professionalName: "Sunita Deshmukh",
    professionalRole: "Caregiver",
    issue: "Caregiver personal emergency leave requested for Saturday/Sunday. Immediate replacement required with dementia experience.",
    category: "Replacement required",
    timeRaised: "Today, 08:30 AM",
    priority: "Medium",
    assignedTo: "Pooja Hegde",
    assignedRole: "Operations Manager",
    actionTaken: "Filtered available certified caregivers in Bandra area. Mapped replacement caregiver Meena Patel for weekend shift.",
    status: "Investigating",
    sourceType: "caregiver",
  },
  {
    id: "esc-3",
    escalationId: "ESC-799",
    patientId: "MS-1070",
    patientName: "Ratan Tata",
    patientLocation: "Colaba",
    professionalName: "Sanjay Shinde",
    professionalRole: "Nurse",
    issue: "Delayed care start by 45 mins due to heavy waterlogging and traffic on Western Express Highway.",
    category: "Delayed care",
    timeRaised: "Yesterday, 10:15 AM",
    priority: "High",
    assignedTo: "Dr. Vikram Joshi",
    assignedRole: "Operations Manager",
    actionTaken: "Called family immediately to inform ETA. Shift extended by 1 hour at no extra charge. Client satisfied.",
    resolutionNotes: "Resolved with client verbal sign-off and 1 hour shift makeup extension.",
    closureTime: "Yesterday, 06:30 PM",
    status: "Resolved",
    sourceType: "caregiver",
  },
  {
    id: "esc-6",
    escalationId: "ESC-806",
    patientId: "MS-1108",
    patientName: "Homi Bhabha Jr.",
    patientLocation: "Bandra West",
    professionalName: "Sunita Deshmukh",
    professionalRole: "Caregiver",
    issue: "Caregiver reported pet dog in residence causing safety concern during night live-in duty.",
    category: "Caregiver issue / no-show",
    timeRaised: "Today, 07:15 AM",
    priority: "High",
    assignedTo: "Pooja Hegde",
    assignedRole: "Operations Manager",
    actionTaken: "Contacted son Nirav Shah. Family agreed to secure pet in separate room during night nursing hours.",
    status: "Action In Progress",
    sourceType: "caregiver",
  },
];

const initialOTPBypassRecords: OTPBypassRecord[] = [
  {
    id: "BYP-901",
    userId: "CG-1048",
    userName: "Sunita Deshmukh",
    userRole: "Caregiver",
    userPhone: "+91 98201 44512",
    userLocation: "Bandra West, Mumbai",
    bookingId: "BK-4892",
    shiftTime: "08:00 AM - 08:00 PM (12h Shift)",
    reason: "SMS Gateway network failure in remote sector; caregiver physically arrived at patient residence but OTP SMS timed out after 3 retries.",
    overrideCategory: "Network / SMS Gateway Failure",
    authorizedBy: "Pooja Hegde",
    authorizedRole: "Lead Operations Manager",
    timestamp: "Today, 08:15 AM",
    verificationMethod: "Telephonic Confirmation with Patient Family",
    ipAddress: "103.24.188.42",
    geoLocation: "19.0596° N, 72.8295° E (Bandra)",
    securityStatus: "Authorized & Logged",
    additionalNotes: "Patient son Nirav Shah verbally confirmed caregiver arrival at doorstep. Shift clock-in approved manually via supervisor override console.",
  },
  {
    id: "BYP-902",
    userId: "PT-3091",
    userName: "Dr. Arvind Kulkarni",
    userRole: "Patient",
    userPhone: "+91 98192 33401",
    userLocation: "Juhu, Mumbai",
    bookingId: "BK-5104",
    shiftTime: "Emergency Post-Op Nursing Visit",
    reason: "Elderly patient phone in DND / spam block mode; unable to receive 6-digit confirmation OTP for urgent specialized tracheostomy nurse booking.",
    overrideCategory: "Elderly / Accessibility Assistance",
    authorizedBy: "Dr. Vikram Joshi",
    authorizedRole: "Clinical Care Coordinator",
    timestamp: "Today, 09:30 AM",
    verificationMethod: "In-Person Attendant Aadhaar Verification",
    ipAddress: "114.143.220.18",
    geoLocation: "19.1075° N, 72.8263° E (Juhu)",
    securityStatus: "Audit Cleared",
    additionalNotes: "Emergency clinical triage protocol enacted. Attending clinical lead authorized bypass after reviewing patient post-operative discharge summary.",
  },
  {
    id: "BYP-903",
    userId: "NR-2044",
    userName: "Anita Jadhav",
    userRole: "Nurse",
    userPhone: "+91 97690 12894",
    userLocation: "Andheri East, Mumbai",
    bookingId: "BK-4980",
    shiftTime: "10:00 AM - 02:00 PM (Clinical Shift)",
    reason: "Caregiver smartphone battery died during heavy transit rain; required urgent check-in override at critical ICU patient setup.",
    overrideCategory: "Device Malfunction / Battery",
    authorizedBy: "Dr. Neha Kothari",
    authorizedRole: "Quality Assurance Lead",
    timestamp: "Yesterday, 10:05 AM",
    verificationMethod: "Supervisor GPS Check & Biometric Scan",
    ipAddress: "122.161.45.92",
    geoLocation: "19.1136° N, 72.8697° E (Andheri)",
    securityStatus: "Audit Cleared",
    additionalNotes: "Caregiver reported to hospital setup on time. Clinical supervisor confirmed physical presence and vitals monitoring initiation.",
  },
  {
    id: "BYP-904",
    userId: "CG-1120",
    userName: "Rameshwar Patil",
    userRole: "Caregiver",
    userPhone: "+91 99204 88710",
    userLocation: "Thane West, Mumbai",
    bookingId: "BK-5211",
    shiftTime: "Night Live-in Duty (08:00 PM)",
    reason: "Telecom SIM card porting in progress; temporary secondary number could not receive automated registered carrier OTP.",
    overrideCategory: "Supervisor Direct Authorization",
    authorizedBy: "Pooja Hegde",
    authorizedRole: "Operations Manager",
    timestamp: "Yesterday, 07:55 PM",
    verificationMethod: "Video Verification with Duty Supervisor",
    ipAddress: "103.88.234.11",
    geoLocation: "19.2183° N, 72.9781° E (Thane)",
    securityStatus: "Flagged for Review",
    additionalNotes: "Temporary bypass granted for night shift. Secondary phone KYC update ticket logged for compliance resolution within 24h.",
  },
  {
    id: "BYP-905",
    userId: "PT-2880",
    userName: "Meera Krishnan",
    userRole: "Patient",
    userPhone: "+91 98450 77123",
    userLocation: "Andheri West, Mumbai",
    bookingId: "BK-5309",
    shiftTime: "Morning Physiotherapy Assessment",
    reason: "Family representative booking on behalf of bedridden mother while travelling abroad (international roaming latency prevented timely OTP submission).",
    overrideCategory: "Emergency Shift Start",
    authorizedBy: "Dr. Vikram Joshi",
    authorizedRole: "Clinical Care Coordinator",
    timestamp: "2026-08-23 11:10 AM",
    verificationMethod: "Email Authorization & Registered WhatsApp",
    ipAddress: "86.98.140.55",
    geoLocation: "19.1363° N, 72.8277° E (Andheri West)",
    securityStatus: "Authorized & Logged",
    additionalNotes: "Daughter authorized booking confirmation via official registered email. Physio session completed with digital clinical handover sign-off.",
  },
];

export default function EscalationCentrePage() {
  const [escalations, setEscalations] = useState<EnrichedEscalationRecord[]>(enrichedInitialEscalations);
  const [otpBypassRecords, setOtpBypassRecords] = useState<OTPBypassRecord[]>(initialOTPBypassRecords);
  const [mainTab, setMainTab] = useState<"caregivers" | "patients" | "otp_bypass">("caregivers");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Escalations
  const [selectedEscalation, setSelectedEscalation] = useState<EnrichedEscalationRecord | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Modal State for OTP Bypass
  const [selectedOTPBypass, setSelectedOTPBypass] = useState<OTPBypassRecord | null>(null);
  const [isOTPBypassModalOpen, setIsOTPBypassModalOpen] = useState(false);

  // Filtered Escalations
  const filteredEscalations = useMemo(() => {
    return escalations.filter((esc) => {
      const matchesMainTab =
        mainTab === "caregivers" ? esc.sourceType === "caregiver" : esc.sourceType === "patient";

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        esc.patientName.toLowerCase().includes(q) ||
        esc.professionalName.toLowerCase().includes(q) ||
        esc.issue.toLowerCase().includes(q) ||
        esc.escalationId.toLowerCase().includes(q) ||
        esc.patientLocation.toLowerCase().includes(q);

      const matchesPriority =
        priorityFilter === "All" ||
        (priorityFilter === "Critical" && esc.priority === "Critical") ||
        (priorityFilter === "High" && esc.priority === "High") ||
        (priorityFilter === "Medium" && esc.priority === "Medium") ||
        (priorityFilter === "Resolved" && esc.priority === "Resolved");

      return matchesMainTab && matchesSearch && matchesPriority;
    });
  }, [escalations, mainTab, searchQuery, priorityFilter]);

  // Filtered OTP Bypass
  const filteredOTPBypass = useMemo(() => {
    return otpBypassRecords.filter((byp) => {
      const q = searchQuery.toLowerCase();
      return (
        byp.userId.toLowerCase().includes(q) ||
        byp.userName.toLowerCase().includes(q) ||
        byp.reason.toLowerCase().includes(q) ||
        byp.authorizedBy.toLowerCase().includes(q) ||
        byp.userLocation.toLowerCase().includes(q) ||
        byp.overrideCategory.toLowerCase().includes(q)
      );
    });
  }, [otpBypassRecords, searchQuery]);

  const handleResolve = () => {
    if (!selectedEscalation) return;

    setEscalations((prev) =>
      prev.map((e) =>
        e.id === selectedEscalation.id
          ? {
              ...e,
              priority: "Resolved",
              status: "Resolved",
              resolutionNotes: resolutionNote || "Resolved with patient sign-off and clinical review.",
              closureTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : e
      )
    );

    swiftAlert.success({
      title: "Escalation Closed & Resolved",
      description: `${selectedEscalation.escalationId} closed. Quality audit logged.`,
    });

    setIsResolveModalOpen(false);
    setResolutionNote("");
    setSelectedEscalation(null);
  };

  const getPriorityBadge = (p: EscalationPriority) => {
    switch (p) {
      case "Critical":
        return <Badge className="bg-rose-600 text-white font-extrabold animate-pulse">🔴 Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-500 text-white font-bold">🟠 High</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500 text-white font-bold">🟡 Medium</Badge>;
      case "Resolved":
        return <Badge className="bg-emerald-600 text-white font-bold">🟢 Resolved</Badge>;
      default:
        return <Badge variant="outline">{p}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <AlertOctagon className="h-7 w-7 text-rose-600" />
              Escalation Centre
            </h1>
            <Badge variant="destructive" className="font-semibold text-xs flex items-center gap-1">
              Clinical Quality & Triage
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Standardized incident triage, medical alerts, caregiver delays/no-shows, and OTP bypass authorizations.
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs: Care Professionals vs Patients vs OTP Bypass */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto scrollbar-none">
        {/* Tab 1: Caregiver Professionals */}
        <button
          onClick={() => {
            setMainTab("caregivers");
            setPriorityFilter("All");
          }}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            mainTab === "caregivers"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartPulse className="h-4 w-4" />
          <span>Care Professionals</span>
        </button>

        {/* Tab 2: Patients & Families */}
        <button
          onClick={() => {
            setMainTab("patients");
            setPriorityFilter("All");
          }}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            mainTab === "patients"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Patients & Families</span>
        </button>

        {/* Tab 3: OTP Bypass */}
        <button
          onClick={() => {
            setMainTab("otp_bypass");
            setPriorityFilter("All");
          }}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative shrink-0 ${
            mainTab === "otp_bypass"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>OTP Bypass</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        {mainTab !== "otp_bypass" ? (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["All", "Critical", "High", "Medium", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setPriorityFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  priorityFilter === tab
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <LockOpen className="h-4 w-4 text-amber-600" />
            <span>Authorized Security Overrides & Verification Audit Trail</span>
          </div>
        )}

        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={
              mainTab === "caregivers"
                ? "Search professional, patient, issue..."
                : mainTab === "patients"
                ? "Search patient, family concern, area..."
                : "Search User ID, Name, Reason..."
            }
            className="pl-9 text-xs rounded-xl bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conditional Rendering: Main Escalations vs OTP Bypass */}
      {mainTab === "otp_bypass" ? (
        /* OTP Bypass Table */
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table className="min-w-[900px] w-full">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80 border-b">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[130px] min-w-[130px]">
                  User ID
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[220px] min-w-[220px]">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground min-w-[360px]">
                  Reason for Override
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[150px] min-w-[150px]">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[120px] min-w-[120px] text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOTPBypass.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground font-medium">
                    No OTP bypass records found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOTPBypass.map((byp) => (
                  <TableRow key={byp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b">
                    {/* User ID */}
                    <TableCell className="text-xs font-mono font-bold py-3.5 align-middle whitespace-nowrap">
                      <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-900">
                        {byp.userId}
                      </span>
                    </TableCell>

                    {/* Name & Role */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">{byp.userName}</div>
                          <Badge variant="outline" className="text-[10px] mt-0.5 font-semibold">
                            {byp.userRole}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Reason for Override */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="space-y-1">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                          {byp.overrideCategory}
                        </Badge>
                        <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">
                          {byp.reason}
                        </p>
                      </div>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell className="py-3.5 align-middle whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{byp.timestamp}</span>
                        <span className="text-[10px] text-muted-foreground">by {byp.authorizedBy.split(" ")[0]}</span>
                      </div>
                    </TableCell>

                    {/* View Button */}
                    <TableCell className="text-right py-3.5 align-middle whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOTPBypass(byp);
                          setIsOTPBypassModalOpen(true);
                        }}
                        className="h-8 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 hover:border-teal-300 shadow-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-teal-600" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Escalations Table */
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table className="min-w-[1200px] w-full">
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80 border-b">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[110px] min-w-[110px]">
                  Escalation ID
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[120px] min-w-[120px]">
                  Priority
                </TableHead>
                {mainTab === "caregivers" ? (
                  <>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px] min-w-[180px]">
                      Care Professional
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                      Assigned Patient & Area
                    </TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[180px] min-w-[180px]">
                      Patient & Location
                    </TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                      Assigned Staff
                    </TableHead>
                  </>
                )}
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                  Assigned To
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[280px] min-w-[280px]">
                  Action Taken & Resolution
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[130px] min-w-[130px] text-right">
                  Triage Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscalations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground font-medium">
                    No {mainTab === "caregivers" ? "care professional" : "patient"} escalations found matching the filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEscalations.map((esc) => (
                  <TableRow key={esc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b">
                    {/* Escalation ID & Time */}
                    <TableCell className="text-xs font-mono font-bold py-3.5 align-top whitespace-nowrap">
                      <span className="text-teal-700 dark:text-teal-400 block">{esc.escalationId}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">{esc.timeRaised}</span>
                    </TableCell>

                    {/* Priority Badge */}
                    <TableCell className="py-3.5 align-top whitespace-nowrap">
                      {getPriorityBadge(esc.priority)}
                    </TableCell>

                    {/* Conditional Columns based on Tab */}
                    {mainTab === "caregivers" ? (
                      <>
                        {/* Care Professional */}
                        <TableCell className="py-3.5 align-top">
                          <div className="text-xs font-bold text-foreground">{esc.professionalName}</div>
                          <Badge variant="outline" className="text-[10px] mt-0.5 font-semibold">
                            {esc.professionalRole}
                          </Badge>
                        </TableCell>

                        {/* Associated Patient */}
                        <TableCell className="py-3.5 align-top">
                          <div className="text-xs font-semibold text-foreground">{esc.patientName}</div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 text-teal-600" /> {esc.patientLocation} · {esc.patientId}
                          </span>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        {/* Patient Details */}
                        <TableCell className="py-3.5 align-top">
                          <div className="text-xs font-bold text-foreground">{esc.patientName}</div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 text-teal-600" /> {esc.patientLocation} · {esc.patientId}
                          </span>
                        </TableCell>

                        {/* Assigned Professional */}
                        <TableCell className="py-3.5 align-top">
                          <div className="text-xs font-semibold text-foreground">{esc.professionalName}</div>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">{esc.professionalRole}</span>
                        </TableCell>
                      </>
                    )}

                    {/* Assigned To */}
                    <TableCell className="py-3.5 align-top">
                      <div className="text-xs font-semibold text-foreground">{esc.assignedTo}</div>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{esc.assignedRole}</span>
                    </TableCell>

                    {/* Action Taken & Resolution */}
                    <TableCell className="text-xs py-3.5 align-top whitespace-normal break-words max-w-[280px]">
                      <p className="text-xs text-foreground font-medium leading-relaxed">{esc.actionTaken}</p>
                      {esc.resolutionNotes && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded border border-emerald-200 dark:border-emerald-900">
                          ✓ Closed: {esc.resolutionNotes}
                        </span>
                      )}
                    </TableCell>

                    {/* Triage Action */}
                    <TableCell className="text-right py-3.5 align-top whitespace-nowrap">
                      {esc.status !== "Resolved" ? (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 shadow-xs"
                          onClick={() => {
                            setSelectedEscalation(esc);
                            setIsResolveModalOpen(true);
                          }}
                        >
                          Resolve Case
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px] font-bold">
                          Closed ({esc.closureTime})
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Resolution Dialog for Escalations */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Resolve Escalation: {selectedEscalation?.escalationId}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record the clinical / operational resolution details and root-cause fix for {selectedEscalation?.patientName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border space-y-1">
              <span className="font-bold text-foreground">Issue:</span> {selectedEscalation?.issue}
            </div>

            <div className="space-y-2 pt-1">
              <label className="font-bold text-foreground block">Resolution Notes & Quality Audit Remarks:</label>
              <Textarea
                placeholder="Enter actions taken, doctor consultations, or caregiver replacement notes..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="text-xs min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={handleResolve}>
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Bypass Details Modal */}
      <OTPBypassDetailsModal
        isOpen={isOTPBypassModalOpen}
        onClose={() => {
          setIsOTPBypassModalOpen(false);
          setSelectedOTPBypass(null);
        }}
        record={selectedOTPBypass}
      />
    </div>
  );
}
