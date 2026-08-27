"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  Calendar,
  AlertTriangle,
  Receipt,
  CreditCard,
  Building2,
  User,
  ArrowRight,
  TrendingDown,
  Info,
  DollarSign,
  Send,
  Eye,
  Check,
  Percent,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { swiftAlert } from "@/lib/swift-alert";

export interface CancellationRefundRecord {
  id: string;
  bookingCode: string;
  patientName: string;
  patientPhone: string;
  careType: string;
  caregiverAssigned: string;
  requestDate: string;
  requestedBy: "Patient" | "Family Member" | "Attending Doctor" | "Coordinator";
  reasonCategory:
    | "Patient Hospitalized"
    | "Condition Improved"
    | "Family Relocated"
    | "Doctor Advised Pause"
    | "Caregiver Schedule Conflict"
    | "Financial Constraints"
    | "Dissatisfied with Service"
    | "Other";
  reasonDetails: string;
  totalBookingAmount: number;
  cancellationCharge: number;
  cancellationChargeReason: string;
  refundAmount: number;
  refundStatus: "Pending Refund" | "Refund Processed" | "No Refund Due" | "Refund Rejected";
  paymentMethod: "Razorpay (UPI)" | "Net Banking" | "Credit Card" | "Direct Bank Transfer";
  processedDate?: string;
  utrNumber?: string;
  processedBy?: string;
}

export interface RescheduleRequestRecord {
  id: string;
  bookingCode: string;
  patientName: string;
  careType: string;
  caregiverName: string;
  originalStartDate: string;
  requestedStartDate: string;
  requestedBy: string;
  rescheduleReason: string;
  status: "Pending Review" | "Approved" | "Rejected";
  requestDate: string;
}

const initialCancellationData: CancellationRefundRecord[] = [
  {
    id: "CAN-001",
    bookingCode: "BK-2120",
    patientName: "Meera Nair",
    patientPhone: "+91 98201 12345",
    careType: "Post-Surgical Nursing (14 Days)",
    caregiverAssigned: "Nurse Priya Sharma",
    requestDate: "2026-08-26 10:30 AM",
    requestedBy: "Family Member",
    reasonCategory: "Patient Hospitalized",
    reasonDetails: "Patient developed fever and was re-admitted to Hinduja Hospital for observation.",
    totalBookingAmount: 28000,
    cancellationCharge: 0,
    cancellationChargeReason: "Medical Emergency (>24h notice, full medical exemption)",
    refundAmount: 28000,
    refundStatus: "Pending Refund",
    paymentMethod: "Razorpay (UPI)",
  },
  {
    id: "CAN-002",
    bookingCode: "BK-2115",
    patientName: "Dr. Ashok Mehta",
    patientPhone: "+91 98330 99881",
    careType: "Physiotherapy (10 Sessions)",
    caregiverAssigned: "Dr. Alisha Merchant (PT)",
    requestDate: "2026-08-25 04:15 PM",
    requestedBy: "Patient",
    reasonCategory: "Condition Improved",
    reasonDetails: "Mobility recovered ahead of schedule, orthopedist advised home exercises instead of assisted physio.",
    totalBookingAmount: 15000,
    cancellationCharge: 1500,
    cancellationChargeReason: "Standard 10% administrative & scheduling fee",
    refundAmount: 13500,
    refundStatus: "Pending Refund",
    paymentMethod: "Credit Card",
  },
  {
    id: "CAN-003",
    bookingCode: "BK-2108",
    patientName: "Sarla Devi Patel",
    patientPhone: "+91 99201 88412",
    careType: "Geriatric Caregiver (30 Days)",
    caregiverAssigned: "Rameshwar Yadav",
    requestDate: "2026-08-24 11:00 AM",
    requestedBy: "Family Member",
    reasonCategory: "Family Relocated",
    reasonDetails: "Patient moving to son's residence in Pune.",
    totalBookingAmount: 36000,
    cancellationCharge: 3600,
    cancellationChargeReason: "Early termination policy charge (10%)",
    refundAmount: 32400,
    refundStatus: "Refund Processed",
    paymentMethod: "Net Banking",
    processedDate: "2026-08-25",
    utrNumber: "HDFC982310842019",
    processedBy: "Anil Kapoor (Finance)",
  },
  {
    id: "CAN-004",
    bookingCode: "BK-2099",
    patientName: "Harish Chandra",
    patientPhone: "+91 98110 55432",
    careType: "Catheter & Vitals Nursing (7 Days)",
    caregiverAssigned: "Nurse Sanjay Rao",
    requestDate: "2026-08-23 08:45 AM",
    requestedBy: "Patient",
    reasonCategory: "Doctor Advised Pause",
    reasonDetails: "Doctor changed antibiotic protocol, home visits paused temporarily.",
    totalBookingAmount: 14000,
    cancellationCharge: 700,
    cancellationChargeReason: "Standard cancellation processing fee (5%)",
    refundAmount: 13300,
    refundStatus: "Refund Processed",
    paymentMethod: "Razorpay (UPI)",
    processedDate: "2026-08-24",
    utrNumber: "RZP_REF_881923019",
    processedBy: "Anil Kapoor (Finance)",
  },
  {
    id: "CAN-005",
    bookingCode: "BK-2085",
    patientName: "Vikram Sethi",
    patientPhone: "+91 98670 11928",
    careType: "Tracheostomy Support (12hr Shift)",
    caregiverAssigned: "Nurse Kavita Shinde",
    requestDate: "2026-08-22 09:20 PM",
    requestedBy: "Coordinator",
    reasonCategory: "Caregiver Schedule Conflict",
    reasonDetails: "Late cancellation initiated due to shift unavailability without backup.",
    totalBookingAmount: 8500,
    cancellationCharge: 0,
    cancellationChargeReason: "MySarthee Operational Waiver (100% Refund + Voucher)",
    refundAmount: 8500,
    refundStatus: "Refund Processed",
    paymentMethod: "Razorpay (UPI)",
    processedDate: "2026-08-23",
    utrNumber: "RZP_REF_771923011",
    processedBy: "Anil Kapoor (Finance)",
  },
  {
    id: "CAN-006",
    bookingCode: "BK-2070",
    patientName: "Ananya Deshpande",
    patientPhone: "+91 97551 22891",
    careType: "ICU Nursing Care (24h Live-in)",
    caregiverAssigned: "Nurse Priya Sharma",
    requestDate: "2026-08-21 02:00 PM",
    requestedBy: "Family Member",
    reasonCategory: "Dissatisfied with Service",
    reasonDetails: "Family requested cancellation due to language preference barrier on Day 1.",
    totalBookingAmount: 22000,
    cancellationCharge: 2200,
    cancellationChargeReason: "1 Day Pro-rated care utilization deduction",
    refundAmount: 19800,
    refundStatus: "Pending Refund",
    paymentMethod: "Direct Bank Transfer",
  },
];

const initialRescheduleData: RescheduleRequestRecord[] = [
  {
    id: "RSC-001",
    bookingCode: "BK-2122",
    patientName: "Kishore Kumar Agarwal",
    careType: "Physiotherapy (Home)",
    caregiverName: "Dr. Alisha Merchant (PT)",
    originalStartDate: "2026-08-28 10:00 AM",
    requestedStartDate: "2026-08-30 11:30 AM",
    requestedBy: "Patient",
    rescheduleReason: "Family visiting on original date; requested 2-day deferral.",
    status: "Pending Review",
    requestDate: "2026-08-26 03:20 PM",
  },
  {
    id: "RSC-002",
    bookingCode: "BK-2118",
    patientName: "Nalini Krishnan",
    careType: "Post-Chemo Nursing Support",
    caregiverName: "Nurse Sunita Deshmukh",
    originalStartDate: "2026-08-27 08:00 AM",
    requestedStartDate: "2026-08-29 08:00 AM",
    requestedBy: "Doctor (Dr. R. Joshi)",
    rescheduleReason: "Hospital chemo cycle delayed by 48 hours.",
    status: "Approved",
    requestDate: "2026-08-25 01:10 PM",
  },
  {
    id: "RSC-003",
    bookingCode: "BK-2104",
    patientName: "Rajendra Prasad Gupta",
    careType: "Elderly Care Assistant",
    caregiverName: "Mahesh Patil",
    originalStartDate: "2026-08-25 09:00 AM",
    requestedStartDate: "2026-08-27 09:00 AM",
    requestedBy: "Family Member",
    rescheduleReason: "Patient traveling for routine OPD checkup.",
    status: "Approved",
    requestDate: "2026-08-24 10:00 AM",
  },
];

function CancellationsRefundsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"cancellations" | "rescheduling" | "refunds">(
    (tabParam as any) || "cancellations"
  );

  const [cancellations, setCancellations] = useState<CancellationRefundRecord[]>(
    initialCancellationData
  );
  const [reschedules, setReschedules] = useState<RescheduleRequestRecord[]>(
    initialRescheduleData
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState("All");

  // Modal State
  const [selectedItem, setSelectedItem] = useState<CancellationRefundRecord | null>(null);
  const [isProcessRefundModalOpen, setIsProcessRefundModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [utrInput, setUtrInput] = useState("");
  const [financeNotes, setFinanceNotes] = useState("");

  const handleTabSwitch = (tab: "cancellations" | "rescheduling" | "refunds") => {
    setActiveTab(tab);
    router.push(`/cancellations-refunds?tab=${tab}`);
  };

  // KPIs
  const totalCancellationCount = cancellations.length;
  const pendingRefunds = cancellations.filter((c) => c.refundStatus === "Pending Refund");
  const pendingRefundAmount = pendingRefunds.reduce((acc, c) => acc + c.refundAmount, 0);
  const processedRefunds = cancellations.filter((c) => c.refundStatus === "Refund Processed");
  const processedRefundAmount = processedRefunds.reduce((acc, c) => acc + c.refundAmount, 0);
  const totalCancellationCharges = cancellations.reduce((acc, c) => acc + c.cancellationCharge, 0);

  // Filtered cancellation requests
  const filteredCancellations = useMemo(() => {
    return cancellations.filter((c) => {
      const matchesReason = reasonFilter === "All" || c.reasonCategory === reasonFilter;
      const matchesStatus =
        refundStatusFilter === "All" ||
        (activeTab === "refunds"
          ? c.refundStatus === "Refund Processed"
          : c.refundStatus === refundStatusFilter);

      const matchesSearch =
        c.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caregiverAssigned.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.reasonDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.utrNumber && c.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesReason && matchesStatus && matchesSearch;
    });
  }, [cancellations, reasonFilter, refundStatusFilter, searchQuery, activeTab]);

  // Execute Refund Process
  const handleProcessRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const utr = utrInput || `RZP_REF_${Math.floor(100000000 + Math.random() * 900000000)}`;

    setCancellations((prev) =>
      prev.map((c) =>
        c.id === selectedItem.id
          ? {
              ...c,
              refundStatus: "Refund Processed",
              processedDate: new Date().toISOString().split("T")[0],
              utrNumber: utr,
              processedBy: "Admin Portal (Finance)",
            }
          : c
      )
    );

    setIsProcessRefundModalOpen(false);
    setUtrInput("");
    setFinanceNotes("");

    swiftAlert.success({
      title: "Refund Processed Successfully",
      description: `₹${selectedItem.refundAmount.toLocaleString("en-IN")} refunded for ${selectedItem.patientName} (${selectedItem.bookingCode}). UTR: ${utr}`,
    });
  };

  // Handle Reschedule Quick Approval
  const handleApproveReschedule = (rescheduleId: string) => {
    setReschedules((prev) =>
      prev.map((r) => (r.id === rescheduleId ? { ...r, status: "Approved" } : r))
    );
    swiftAlert.success({
      title: "Rescheduling Approved",
      description: "Caregiver shift schedule updated and notification sent via WhatsApp.",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Cancellation & Refund Management
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <RotateCcw className="h-3 w-3 text-amber-400" />
              SLA Compliance & Charge Governance
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track patient cancellation requests, reason analytics, charge calculations, rescheduling, and instant refund processing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold"
            onClick={() => {
              swiftAlert.info({
                title: "Cancellation Policy Summary",
                description: "Notice >24h: 100% Refund | 12-24h: 5-10% fee | Medical Emergency: 100% Full Waiver.",
              });
            }}
          >
            <Info className="h-4 w-4 text-[#01265D]" />
            <span>Policy Rules</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards (Showing all requested metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* a. Cancellation Requests */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">a. Cancellation Requests</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-foreground tracking-tight">
            {totalCancellationCount}
          </p>
          <span className="text-[11px] text-muted-foreground">Total booking cancellations</span>
        </div>

        {/* b. Rescheduling Requests */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">b. Rescheduling Requests</span>
            <CalendarClock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
            {reschedules.length}
          </p>
          <span className="text-[11px] text-muted-foreground">{reschedules.filter(r => r.status === "Pending Review").length} Pending approval</span>
        </div>

        {/* c. Cancellation Charge */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">c. Cancellation Charges</span>
            <Percent className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">
            ₹{totalCancellationCharges.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-muted-foreground">Collected retention fees</span>
        </div>

        {/* e. Pending Refund */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-1 border-amber-200 dark:border-amber-900/40 bg-amber-50/30">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
            <span className="text-xs font-semibold">e. Pending Refunds</span>
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">
            ₹{pendingRefundAmount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] font-bold text-amber-700">{pendingRefunds.length} Action Required</span>
        </div>

        {/* d. Refund Processed */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">d. Refunds Processed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
            ₹{processedRefundAmount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-muted-foreground">{processedRefunds.length} Settled via PG</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => handleTabSwitch("cancellations")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "cancellations"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <XCircle className="h-4 w-4 text-rose-600" />
          <span>Cancellation Requests & Charges</span>
          <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
            {totalCancellationCount}
          </Badge>
        </button>

        <button
          onClick={() => handleTabSwitch("rescheduling")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "rescheduling"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarClock className="h-4 w-4 text-blue-600" />
          <span>Rescheduling Requests</span>
          <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-blue-100 text-[#01265D] dark:bg-blue-950 dark:text-blue-300 font-bold">
            {reschedules.length}
          </Badge>
        </button>

        <button
          onClick={() => handleTabSwitch("refunds")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "refunds"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="h-4 w-4 text-emerald-600" />
          <span>Processed Refunds & UTR Logs</span>
          <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            {processedRefunds.length}
          </Badge>
        </button>
      </div>

      {/* Filters (Showing f. Reason for cancellation filter) */}
      {activeTab !== "rescheduling" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Booking ID, Patient, Caregiver, UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Reason for Cancellation Filter */}
            <Select value={reasonFilter} onValueChange={(val) => setReasonFilter(val || "All")}>
              <SelectTrigger className="h-9 text-xs w-52">
                <SelectValue placeholder="f. Reason for Cancellation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reasons (Reason f)</SelectItem>
                <SelectItem value="Patient Hospitalized">Patient Hospitalized</SelectItem>
                <SelectItem value="Condition Improved">Condition Improved</SelectItem>
                <SelectItem value="Family Relocated">Family Relocated</SelectItem>
                <SelectItem value="Doctor Advised Pause">Doctor Advised Pause</SelectItem>
                <SelectItem value="Caregiver Schedule Conflict">Caregiver Schedule Conflict</SelectItem>
                <SelectItem value="Financial Constraints">Financial Constraints</SelectItem>
                <SelectItem value="Dissatisfied with Service">Dissatisfied with Service</SelectItem>
              </SelectContent>
            </Select>

            {/* Refund Status Filter */}
            {activeTab === "cancellations" && (
              <Select value={refundStatusFilter} onValueChange={(val) => setRefundStatusFilter(val || "All")}>
                <SelectTrigger className="h-9 text-xs w-44">
                  <SelectValue placeholder="Refund Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Refund Statuses</SelectItem>
                  <SelectItem value="Pending Refund">Pending Refund (e)</SelectItem>
                  <SelectItem value="Refund Processed">Refund Processed (d)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* VIEW 1 & 3: CANCELLATION REQUESTS / PROCESSED REFUNDS TABLE */}
      {activeTab !== "rescheduling" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableHead className="text-xs font-bold">Booking & Patient</TableHead>
                <TableHead className="text-xs font-bold">f. Reason for Cancellation</TableHead>
                <TableHead className="text-xs font-bold">Assigned Caregiver</TableHead>
                <TableHead className="text-xs font-bold text-right">Booking Total</TableHead>
                <TableHead className="text-xs font-bold text-right">c. Cancellation Charge</TableHead>
                <TableHead className="text-xs font-bold text-right">Net Refund</TableHead>
                <TableHead className="text-xs font-bold text-center">Refund Status</TableHead>
                <TableHead className="text-xs font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCancellations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-36 text-center text-muted-foreground text-xs">
                    No cancellation or refund records matching the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCancellations.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    {/* Booking & Patient */}
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-foreground">
                            {item.bookingCode}
                          </span>
                          <Badge variant="outline" className="text-[10px] py-0">
                            {item.requestedBy}
                          </Badge>
                        </div>
                        <p className="font-semibold text-xs text-foreground mt-0.5">{item.patientName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.careType}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Req: {item.requestDate}</p>
                      </div>
                    </TableCell>

                    {/* f. Reason for Cancellation */}
                    <TableCell>
                      <div className="space-y-1 max-w-xs">
                        <Badge
                          className={`text-[10px] font-bold ${
                            item.reasonCategory === "Patient Hospitalized"
                              ? "bg-rose-100 text-rose-800 border-rose-200"
                              : item.reasonCategory === "Condition Improved"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : item.reasonCategory === "Doctor Advised Pause"
                              ? "bg-blue-100 text-[#01265D] border-blue-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {item.reasonCategory}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                          {item.reasonDetails}
                        </p>
                      </div>
                    </TableCell>

                    {/* Assigned Caregiver */}
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-semibold text-foreground">{item.caregiverAssigned}</p>
                        <span className="text-[10px] text-muted-foreground">Payment: {item.paymentMethod}</span>
                      </div>
                    </TableCell>

                    {/* Total Amount */}
                    <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
                      ₹{item.totalBookingAmount.toLocaleString("en-IN")}
                    </TableCell>

                    {/* c. Cancellation Charge */}
                    <TableCell className="text-right">
                      <div>
                        <span
                          className={`font-mono text-xs font-bold ${
                            item.cancellationCharge > 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {item.cancellationCharge > 0
                            ? `-₹${item.cancellationCharge.toLocaleString("en-IN")}`
                            : "₹0 (Waived)"}
                        </span>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[140px] ml-auto">
                          {item.cancellationChargeReason}
                        </p>
                      </div>
                    </TableCell>

                    {/* Net Refund Amount */}
                    <TableCell className="text-right font-mono text-xs font-extrabold text-foreground">
                      ₹{item.refundAmount.toLocaleString("en-IN")}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <Badge
                        className={`text-[10px] font-bold ${
                          item.refundStatus === "Pending Refund"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : item.refundStatus === "Refund Processed"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.refundStatus === "Pending Refund" && "⏳ "}
                        {item.refundStatus === "Refund Processed" && "✓ "}
                        {item.refundStatus}
                      </Badge>
                      {item.utrNumber && (
                        <p className="text-[9px] font-mono text-muted-foreground mt-0.5">
                          UTR: {item.utrNumber}
                        </p>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs font-semibold"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Audit
                        </Button>

                        {item.refundStatus === "Pending Refund" && (
                          <Button
                            size="sm"
                            className="h-8 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-bold shadow-xs"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsProcessRefundModalOpen(true);
                            }}
                          >
                            <CreditCard className="h-3.5 w-3.5 mr-1" />
                            Process Refund
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
      )}

      {/* VIEW 2: b. RESCHEDULING REQUESTS TABLE */}
      {activeTab === "rescheduling" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableHead className="text-xs font-bold">Booking Code</TableHead>
                <TableHead className="text-xs font-bold">Patient & Care Type</TableHead>
                <TableHead className="text-xs font-bold">Assigned Professional</TableHead>
                <TableHead className="text-xs font-bold">Original Schedule</TableHead>
                <TableHead className="text-xs font-bold">Requested New Schedule</TableHead>
                <TableHead className="text-xs font-bold">Rescheduling Reason</TableHead>
                <TableHead className="text-xs font-bold">Status</TableHead>
                <TableHead className="text-xs font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reschedules.map((rsc) => (
                <TableRow key={rsc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <TableCell className="font-mono font-bold text-xs text-foreground">
                    {rsc.bookingCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-xs text-foreground">{rsc.patientName}</p>
                    <p className="text-[11px] text-muted-foreground">{rsc.careType}</p>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {rsc.caregiverName}
                  </TableCell>
                  <TableCell className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                    {rsc.originalStartDate}
                  </TableCell>
                  <TableCell className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    {rsc.requestedStartDate}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    {rsc.rescheduleReason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] font-bold ${
                        rsc.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rsc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {rsc.status === "Pending Review" ? (
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                        onClick={() => handleApproveReschedule(rsc.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Approve Reschedule
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">✓ Rescheduled</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* MODAL: Process Refund (d & e) */}
      <Dialog open={isProcessRefundModalOpen} onOpenChange={setIsProcessRefundModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#01265D]" />
              Execute Patient Refund
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <form onSubmit={handleProcessRefundSubmit} className="space-y-4 text-xs py-2">
              <div className="rounded-xl border p-3.5 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{selectedItem.patientName}</span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">{selectedItem.bookingCode}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t">
                  <div>
                    <span className="text-muted-foreground">Booking Total:</span>
                    <p className="font-semibold text-foreground">₹{selectedItem.totalBookingAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cancellation Charge (c):</span>
                    <p className="font-semibold text-rose-600">-₹{selectedItem.cancellationCharge.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="font-bold text-foreground">Refund Payable (e):</span>
                  <span className="font-mono font-black text-sm text-emerald-700">
                    ₹{selectedItem.refundAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Payment Gateway / Payout Mode</Label>
                <Select defaultValue={selectedItem.paymentMethod}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Razorpay (UPI)">Razorpay Instant UPI Payout</SelectItem>
                    <SelectItem value="Credit Card">Original Credit Card Reverse</SelectItem>
                    <SelectItem value="Net Banking">Net Banking NEFT/IMPS</SelectItem>
                    <SelectItem value="Direct Bank Transfer">Direct RTGS / Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Bank UTR / Transaction Reference ID</Label>
                <Input
                  placeholder="e.g. RZP_REF_99182301 or HDFC991203"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
                <span className="text-[10px] text-muted-foreground">
                  Leave blank to auto-generate digital transaction reference.
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Finance Remarks & Audit Notes</Label>
                <Textarea
                  placeholder="Reason for cancellation verified. Processed under medical waiver policy."
                  value={financeNotes}
                  onChange={(e) => setFinanceNotes(e.target.value)}
                  className="text-xs h-16"
                />
              </div>

              <DialogFooter className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsProcessRefundModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-bold"
                >
                  Confirm & Process ₹{selectedItem.refundAmount.toLocaleString("en-IN")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL: Full Audit & Cancellation Details */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Cancellation Audit Log: {selectedItem?.bookingCode}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-3.5 text-xs py-2">
              <div className="rounded-xl border p-3 bg-slate-50/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-foreground">{selectedItem.patientName}</span>
                  <Badge className="bg-blue-100 text-[#01265D] font-bold">{selectedItem.careType}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Caregiver: {selectedItem.caregiverAssigned} &bull; Requested on: {selectedItem.requestDate}
                </p>
              </div>

              <div className="space-y-1 rounded-xl border p-3">
                <span className="font-bold text-foreground">Reason for Cancellation (f):</span>
                <Badge className="bg-rose-100 text-rose-800 font-bold block w-fit mt-1">
                  {selectedItem.reasonCategory}
                </Badge>
                <p className="text-muted-foreground pt-1 leading-relaxed">
                  {selectedItem.reasonDetails}
                </p>
              </div>

              <div className="space-y-2 rounded-xl border p-3 bg-slate-50/50">
                <span className="font-bold text-foreground">Financial Breakdown:</span>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Gross Booking Value:</span>
                  <span className="font-mono font-bold">₹{selectedItem.totalBookingAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Cancellation Charge Applied (c):</span>
                  <span className="font-mono font-bold text-rose-600">-₹{selectedItem.cancellationCharge.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-sm text-emerald-700">
                  <span>Net Refund Amount:</span>
                  <span className="font-mono">₹{selectedItem.refundAmount.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-muted-foreground pt-1">
                  Charge Justification: {selectedItem.cancellationChargeReason}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CancellationsRefundsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Cancellations & Refunds...</div>}>
      <CancellationsRefundsContent />
    </Suspense>
  );
}
