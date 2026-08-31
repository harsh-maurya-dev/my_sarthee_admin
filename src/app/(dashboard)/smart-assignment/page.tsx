"use client";

import { useState, useMemo } from "react";
import {
  initialBookings,
  initialCareProfessionals,
  initialPatients360,
  BookingItem,
  CareProfessional,
} from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  Search,
  Filter,
  Check,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  FileText,
  Calendar,
  User,
  HeartPulse,
  Activity,
  AlertCircle,
  Phone,
  Building,
  ClipboardList,
  Languages,
  BadgeCheck,
  ChevronRight,
  Radio,
  RefreshCw,
  BellRing,
  RotateCcw,
  Eye,
  CheckCheck,
  Timer,
  Smartphone,
  XCircle,
  Users,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";
import {
  LiveDispatchDetailsModal,
  LiveDispatchModalData,
} from "./_components/live-dispatch-details-modal";

export interface LiveDispatchRequest {
  id: string;
  bookingCode: string;
  patientName: string;
  patientAgeGender?: string;
  patientPhone?: string;
  patientAddress?: string;
  careType: string;
  locationArea: string;
  shiftTiming?: string;
  startDate?: string;
  duration?: string;
  primaryDiagnosis?: string;
  billingAmount?: string;
  paymentStatus?: string;
  professionalId: string;
  professionalName: string;
  professionalRole: "Nurse" | "Caregiver" | "Physiotherapist";
  professionalPhone: string;
  professionalRating?: number;
  professionalExperience?: string;
  sentTime: string;
  expiresInMinutes: number;
  status: "Request Sent" | "Awaiting Acceptance" | "Accepted" | "En Route" | "Declined";
  matchScore: number;
  rejectReason?: string;
  rejectedAt?: string;
  alternativeSuggestion?: string;
}

export interface SuccessfullyAssignedItem {
  id: string;
  bookingCode: string;
  patientName: string;
  patientPhone: string;
  careType: string;
  locationArea: string;
  professionalName: string;
  professionalRole: "Nurse" | "Caregiver" | "Physiotherapist";
  professionalPhone: string;
  shiftTiming: string;
  startDate: string;
  assignedTime: string;
  assignedBy: string;
  status: "Confirmed" | "Care Started" | "Upcoming";
  matchScore: number;
}

const initialLiveDispatches: LiveDispatchRequest[] = [
  {
    id: "DISP-101",
    bookingCode: "BK-2120",
    patientName: "Meera Krishnan",
    patientAgeGender: "71y / Female",
    patientPhone: "+91 98200 11223",
    patientAddress: "Flat 402, Sea Breeze Apts, 10th Road, Juhu Scheme, Mumbai",
    careType: "Nursing (Post-Op Care)",
    locationArea: "Andheri West",
    shiftTiming: "Daily 10 hrs (8 AM – 6 PM)",
    startDate: "2026-08-31",
    duration: "14 days",
    primaryDiagnosis: "Post Total Hip Replacement Rehab with IV Antibiotic Infusion & Sterile Dressing.",
    billingAmount: "₹22,000",
    paymentStatus: "Paid",
    professionalId: "CP-01",
    professionalName: "Priya Sharma",
    professionalRole: "Nurse",
    professionalPhone: "+91 98201 23456",
    professionalRating: 4.9,
    professionalExperience: "6y exp",
    sentTime: "3 mins ago (04:12 PM)",
    expiresInMinutes: 7,
    status: "Awaiting Acceptance",
    matchScore: 98,
  },
  {
    id: "DISP-101-B",
    bookingCode: "BK-2120",
    patientName: "Meera Krishnan",
    patientAgeGender: "71y / Female",
    patientPhone: "+91 98200 11223",
    patientAddress: "Flat 402, Sea Breeze Apts, 10th Road, Juhu Scheme, Mumbai",
    careType: "Nursing (Post-Op Care)",
    locationArea: "Andheri West",
    shiftTiming: "Daily 10 hrs (8 AM – 6 PM)",
    startDate: "2026-08-31",
    duration: "14 days",
    primaryDiagnosis: "Post Total Hip Replacement Rehab with IV Antibiotic Infusion & Sterile Dressing.",
    billingAmount: "₹22,000",
    paymentStatus: "Paid",
    professionalId: "CP-02",
    professionalName: "Sunita Deshmukh",
    professionalRole: "Nurse",
    professionalPhone: "+91 98334 56789",
    professionalRating: 4.8,
    professionalExperience: "5y exp",
    sentTime: "5 mins ago (04:10 PM)",
    expiresInMinutes: 5,
    status: "Request Sent",
    matchScore: 94,
  },
  {
    id: "DISP-104",
    bookingCode: "BK-2121",
    patientName: "Homi Bhabha Jr.",
    patientAgeGender: "84y / Male",
    patientPhone: "+91 98211 44556",
    patientAddress: "701 Horizon Towers, Waterfield Road, Bandra West, Mumbai",
    careType: "Personal Care (Live-in)",
    locationArea: "Bandra",
    shiftTiming: "24/7 Live-in Support",
    startDate: "2026-09-01",
    duration: "30 days",
    primaryDiagnosis: "Mild Alzheimer's Dementia & Fall Risk Prevention.",
    billingAmount: "₹65,000",
    paymentStatus: "Pending",
    professionalId: "CP-06",
    professionalName: "Rameshwar Yadav",
    professionalRole: "Caregiver",
    professionalPhone: "+91 97652 11890",
    professionalRating: 4.7,
    professionalExperience: "4y exp",
    sentTime: "42 mins ago (03:30 PM)",
    expiresInMinutes: 0,
    status: "Declined",
    matchScore: 91,
    rejectReason: "Schedule Overlap - Currently engaged with emergency patient handover at Breach Candy Hospital until 9 PM.",
    rejectedAt: "Today, 03:45 PM",
    alternativeSuggestion: "Auto-routed to Suresh Gawade (Caregiver - 95% Match Score).",
  },
  {
    id: "DISP-104-B",
    bookingCode: "BK-2121",
    patientName: "Homi Bhabha Jr.",
    patientAgeGender: "84y / Male",
    patientPhone: "+91 98211 44556",
    patientAddress: "701 Horizon Towers, Waterfield Road, Bandra West, Mumbai",
    careType: "Personal Care (Live-in)",
    locationArea: "Bandra",
    shiftTiming: "24/7 Live-in Support",
    startDate: "2026-09-01",
    duration: "30 days",
    primaryDiagnosis: "Mild Alzheimer's Dementia & Fall Risk Prevention.",
    billingAmount: "₹65,000",
    paymentStatus: "Pending",
    professionalId: "CP-07",
    professionalName: "Suresh Gawade",
    professionalRole: "Caregiver",
    professionalPhone: "+91 98200 44321",
    professionalRating: 4.85,
    professionalExperience: "7y exp",
    sentTime: "15 mins ago (03:55 PM)",
    expiresInMinutes: 8,
    status: "Awaiting Acceptance",
    matchScore: 95,
  },
  {
    id: "DISP-102",
    bookingCode: "BK-2124",
    patientName: "Dr. Arvind Kulkarni",
    patientAgeGender: "72y / Male",
    patientPhone: "+91 98200 11223",
    patientAddress: "Flat 501, Palm Court, Juhu Tara Road, Mumbai",
    careType: "Nursing (IV & Vitals)",
    locationArea: "Juhu",
    shiftTiming: "Twice daily visits (Morning & Evening)",
    startDate: "2026-08-31",
    duration: "30 days",
    primaryDiagnosis: "Post-Ischemic Stroke Recovery with Left Hemiparesis & Type 2 Diabetes.",
    billingAmount: "₹38,000",
    paymentStatus: "Paid",
    professionalId: "CP-02",
    professionalName: "Sunita Deshmukh",
    professionalRole: "Nurse",
    professionalPhone: "+91 98334 56789",
    professionalRating: 4.8,
    professionalExperience: "5y exp",
    sentTime: "12 mins ago (04:03 PM)",
    expiresInMinutes: 0,
    status: "Accepted",
    matchScore: 96,
  },
  {
    id: "DISP-103",
    bookingCode: "BK-2128",
    patientName: "Shalini Singhania",
    patientAgeGender: "64y / Female",
    patientPhone: "+91 98210 11990",
    patientAddress: "B-1204, Hiranandani Gardens, Powai, Mumbai",
    careType: "Physiotherapy (TKR Rehab)",
    locationArea: "Powai",
    shiftTiming: "60 mins Single Session",
    startDate: "2026-08-31",
    duration: "14 days",
    primaryDiagnosis: "Post Total Knee Arthroplasty (TKR Right Knee) Day 8 Rehab.",
    billingAmount: "₹18,000",
    paymentStatus: "Paid",
    professionalId: "CP-03",
    professionalName: "Dr. Alisha Merchant (PT)",
    professionalRole: "Physiotherapist",
    professionalPhone: "+91 98190 33211",
    professionalRating: 4.95,
    professionalExperience: "7y exp",
    sentTime: "18 mins ago (03:57 PM)",
    expiresInMinutes: 0,
    status: "En Route",
    matchScore: 95,
  },
];

const initialSuccessfullyAssigned: SuccessfullyAssignedItem[] = [
  {
    id: "ASSG-801",
    bookingCode: "BK-2115",
    patientName: "Kamala Mehta",
    patientPhone: "+91 98211 44556",
    careType: "Personal Care (Geriatric)",
    locationArea: "Bandra West",
    professionalName: "Rameshwar Yadav",
    professionalRole: "Caregiver",
    professionalPhone: "+91 97652 11890",
    shiftTiming: "Daily 10 hrs (8 AM – 6 PM)",
    startDate: "2026-08-31",
    assignedTime: "Today, 02:30 PM",
    assignedBy: "Smart Allocation AI",
    status: "Confirmed",
    matchScore: 97,
  },
  {
    id: "ASSG-802",
    bookingCode: "BK-2110",
    patientName: "Dr. Ashok Mehta",
    patientPhone: "+91 98330 99881",
    careType: "Physiotherapy (Home)",
    locationArea: "Borivali East",
    professionalName: "Dr. Alisha Merchant (PT)",
    professionalRole: "Physiotherapist",
    professionalPhone: "+91 98190 33211",
    shiftTiming: "60 mins Single Session",
    startDate: "2026-08-31",
    assignedTime: "Today, 11:15 AM",
    assignedBy: "Smart Allocation AI",
    status: "Care Started",
    matchScore: 99,
  },
  {
    id: "ASSG-803",
    bookingCode: "BK-2108",
    patientName: "Sarla Devi Patel",
    patientPhone: "+91 99201 88412",
    careType: "Personal Care (Attendant)",
    locationArea: "Dadar West",
    professionalName: "Mahesh Patil",
    professionalRole: "Caregiver",
    professionalPhone: "+91 98331 22904",
    shiftTiming: "Daily 10 hrs (8 AM – 6 PM)",
    startDate: "2026-09-01",
    assignedTime: "Today, 09:45 AM",
    assignedBy: "Operations Admin",
    status: "Upcoming",
    matchScore: 94,
  },
  {
    id: "ASSG-804",
    bookingCode: "BK-2104",
    patientName: "Vikram Sethi",
    patientPhone: "+91 98670 11928",
    careType: "Nursing (Tracheostomy)",
    locationArea: "Thane West",
    professionalName: "Kavita Shinde",
    professionalRole: "Nurse",
    professionalPhone: "+91 99200 88765",
    shiftTiming: "Night Shift (8 PM – 8 AM)",
    startDate: "2026-08-31",
    assignedTime: "Today, 08:30 AM",
    assignedBy: "Smart Allocation AI",
    status: "Confirmed",
    matchScore: 96,
  },
];

export default function SmartAssignmentEnginePage() {
  const [activeTab, setActiveTab] = useState<"unassigned" | "live_dispatch" | "assigned_today">("unassigned");

  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem>(bookings[0]);
  const [professionals, setProfessionals] = useState<CareProfessional[]>(initialCareProfessionals);
  const [searchBookingQuery, setSearchBookingQuery] = useState("");
  const [searchLiveDispatchQuery, setSearchLiveDispatchQuery] = useState("");

  // Live dispatch and successfully assigned lists
  const [liveDispatches, setLiveDispatches] = useState<LiveDispatchRequest[]>(initialLiveDispatches);
  const [assignedToday, setAssignedToday] = useState<SuccessfullyAssignedItem[]>(initialSuccessfullyAssigned);

  // Selected patient for Live Dispatch 3-column view
  const [selectedDispatchBookingCode, setSelectedDispatchBookingCode] = useState<string>("BK-2120");

  // Selected modal item for Live Dispatch Details
  const [selectedDispatchForModal, setSelectedDispatchForModal] = useState<LiveDispatchModalData | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Look up full Patient 360 record if available for rich specifications in Unassigned tab
  const patient360 = useMemo(() => {
    return initialPatients360.find(
      (p) =>
        p.patientId === selectedBooking.patientId ||
        p.fullName.toLowerCase() === selectedBooking.patientName.toLowerCase()
    );
  }, [selectedBooking]);

  // Filter open unassigned bookings
  const unassignedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "Pending Assignment" || b.status === "New");
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return unassignedBookings.filter((b) => {
      const q = searchBookingQuery.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.careType.toLowerCase().includes(q) ||
        b.locationArea.toLowerCase().includes(q)
      );
    });
  }, [unassignedBookings, searchBookingQuery]);

  // Dispatches already sent for current unassigned booking (up to 5)
  const currentBookingDispatchedList = useMemo(() => {
    return liveDispatches.filter((d) => d.bookingCode === selectedBooking.bookingCode);
  }, [liveDispatches, selectedBooking.bookingCode]);

  const currentBookingDispatchedCount = currentBookingDispatchedList.length;

  // Available professionals ranked for smart matching against selected booking
  const matchingCandidates = useMemo(() => {
    return professionals
      .filter((p) => p.status === "Available" || p.status === "Care Completed")
      .map((p) => {
        let score = 80;
        const reasons: string[] = [];

        if (p.area.toLowerCase() === selectedBooking.locationArea.toLowerCase()) {
          score += 15;
          reasons.push(`Same Area (${p.area})`);
        } else {
          reasons.push(`Nearby (${p.area} - ~3.8 km)`);
        }

        if (
          (selectedBooking.careType === "Nursing" && p.type === "Nurse") ||
          (selectedBooking.careType === "Personal Care" && p.type === "Caregiver") ||
          (selectedBooking.careType === "Physiotherapy" && p.type === "Physiotherapist") ||
          selectedBooking.careType === "Combination"
        ) {
          score += 10;
          reasons.push(`Skill & Role Exact Match (${p.type})`);
        }

        if (p.rating >= 4.8) {
          score += 5;
          reasons.push(`Top Patient Rating (★ ${p.rating})`);
        }

        const finalScore = Math.min(score, 99);
        const alreadyDispatched = currentBookingDispatchedList.some((d) => d.professionalId === p.id);

        return {
          ...p,
          matchScore: finalScore,
          matchReasons: reasons,
          alreadyDispatched,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [professionals, selectedBooking, currentBookingDispatchedList]);

  // ==========================================
  // LIVE DISPATCH UNIQUE PATIENT GROUPS
  // ==========================================
  const liveDispatchPatientGroups = useMemo(() => {
    const map = new Map<string, { bookingCode: string; patientName: string; careType: string; locationArea: string; items: LiveDispatchRequest[] }>();
    liveDispatches.forEach((item) => {
      if (!map.has(item.bookingCode)) {
        map.set(item.bookingCode, {
          bookingCode: item.bookingCode,
          patientName: item.patientName,
          careType: item.careType,
          locationArea: item.locationArea,
          items: [],
        });
      }
      map.get(item.bookingCode)!.items.push(item);
    });
    return Array.from(map.values());
  }, [liveDispatches]);

  const filteredDispatchPatientGroups = useMemo(() => {
    return liveDispatchPatientGroups.filter((g) => {
      const q = searchLiveDispatchQuery.toLowerCase();
      return (
        g.bookingCode.toLowerCase().includes(q) ||
        g.patientName.toLowerCase().includes(q) ||
        g.careType.toLowerCase().includes(q) ||
        g.locationArea.toLowerCase().includes(q)
      );
    });
  }, [liveDispatchPatientGroups, searchLiveDispatchQuery]);

  // Currently selected dispatch patient group & items
  const activeDispatchGroup = useMemo(() => {
    return (
      liveDispatchPatientGroups.find((g) => g.bookingCode === selectedDispatchBookingCode) ||
      liveDispatchPatientGroups[0] ||
      null
    );
  }, [liveDispatchPatientGroups, selectedDispatchBookingCode]);

  const activeDispatchPatient360 = useMemo(() => {
    if (!activeDispatchGroup) return null;
    return initialPatients360.find(
      (p) =>
        p.fullName.toLowerCase() === activeDispatchGroup.patientName.toLowerCase() ||
        p.locationArea.toLowerCase() === activeDispatchGroup.locationArea.toLowerCase()
    );
  }, [activeDispatchGroup]);

  // Handle Sent Request / Allocation action (Max 5 Care Professionals per booking)
  const handleSendRequest = (pro: (typeof matchingCandidates)[0]) => {
    if (currentBookingDispatchedCount >= 5) {
      swiftAlert.error({
        title: "Maximum Dispatches Reached",
        description: "You have reached the maximum limit of 5 care professionals for this booking.",
      });
      return;
    }

    if (pro.alreadyDispatched) {
      swiftAlert.info({
        title: "Request Already Dispatched",
        description: `A live dispatch request is already active for ${pro.name}.`,
      });
      return;
    }

    // 1. Create a live dispatch entry
    const newDispatch: LiveDispatchRequest = {
      id: `DISP-${Date.now().toString().slice(-4)}`,
      bookingCode: selectedBooking.bookingCode,
      patientName: selectedBooking.patientName,
      patientAgeGender: selectedBooking.ageGender,
      patientPhone: "+91 98200 11223",
      patientAddress: patient360?.address || `${selectedBooking.locationArea} West, Mumbai`,
      careType: selectedBooking.careType,
      locationArea: selectedBooking.locationArea,
      shiftTiming: selectedBooking.frequency || "Daily 10 hrs",
      startDate: selectedBooking.startDate,
      duration: selectedBooking.duration || "14 days",
      primaryDiagnosis: patient360?.primaryDiagnosis || `${selectedBooking.careType} requirement with vitals monitoring.`,
      billingAmount: `₹${selectedBooking.billing?.bookingValue?.toLocaleString("en-IN") || "22,000"}`,
      paymentStatus: selectedBooking.billing?.paymentStatus || "Paid",
      professionalId: pro.id,
      professionalName: pro.name,
      professionalRole: pro.type as any,
      professionalPhone: pro.phone,
      professionalRating: pro.rating,
      professionalExperience: `${pro.experienceYears}y exp`,
      sentTime: "Just now",
      expiresInMinutes: 10,
      status: "Request Sent",
      matchScore: pro.matchScore,
    };

    setLiveDispatches([newDispatch, ...liveDispatches]);

    swiftAlert.success({
      title: `Dispatch Request (${currentBookingDispatchedCount + 1}/5) Sent!`,
      description: `Sent to ${pro.name} (${pro.type}) for ${selectedBooking.patientName} (${selectedBooking.bookingCode}). Max 5 care professionals allowed.`,
    });
  };

  const handleOpenDispatchDetails = (dispatch: LiveDispatchRequest) => {
    setSelectedDispatchForModal(dispatch);
    setIsDispatchModalOpen(true);
  };

  const handleResendWhatsApp = (proName: string, phone: string) => {
    swiftAlert.success({
      title: "WhatsApp Dispatch Re-sent",
      description: `Immediate notification re-dispatched to ${proName} (${phone}).`,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Smart Allocation Engine
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> AI Proximity & Skill Allocator
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Review unassigned bookings, dispatch up to 5 care professionals per patient, track real-time staff acceptance & rejection telemetry.
          </p>
        </div>
      </div>

      {/* THREE MAIN TABS */}
      <div className="flex border-b">
        {/* Tab 1: Unassigned Bookings */}
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "unassigned"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Unassigned Bookings</span>
        </button>

        {/* Tab 2: Live Dispatch */}
        <button
          onClick={() => setActiveTab("live_dispatch")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "live_dispatch"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Radio className="h-4 w-4 text-rose-600 animate-pulse" />
          <span>Live Dispatch</span>
        </button>

        {/* Tab 3: Successfully Assigned Today */}
        <button
          onClick={() => setActiveTab("assigned_today")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "assigned_today"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Successfully Assigned Today</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: UNASSIGNED BOOKINGS (3-COLUMN ENGINE)
      ======================================================== */}
      {activeTab === "unassigned" && (
        <div className="grid gap-5 lg:grid-cols-12">
          {/* COLUMN 1: Open Bookings Queue */}
          <div className="lg:col-span-4 xl:col-span-3 rounded-2xl border bg-card p-4 shadow-xs space-y-3.5 flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Open Bookings Queue
                </h2>
                <p className="text-[11px] text-muted-foreground">Select a booking to allocate</p>
              </div>
            </div>

            {/* Search Bookings */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search code, patient, area..."
                value={searchBookingQuery}
                onChange={(e) => setSearchBookingQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Bookings Scroll List */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No open bookings matching query.
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const isSelected = selectedBooking.id === booking.id;
                  const dispatchesForThis = liveDispatches.filter((d) => d.bookingCode === booking.bookingCode);

                  return (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${
                        isSelected
                          ? "border-[#01265D] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#01265D]/30 shadow-xs"
                          : "border-slate-200/80 bg-slate-50/40 hover:bg-slate-100/70 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground font-mono">
                          {booking.bookingCode}
                        </span>
                        <div className="flex items-center gap-1">
                          {dispatchesForThis.length > 0 && (
                            <Badge className="text-[9px] font-bold bg-[#01265D] text-white py-0">
                              {dispatchesForThis.length}/5 Dispatched
                            </Badge>
                          )}
                          <Badge
                            className={`text-[9px] font-bold py-0 ${
                              booking.status === "Pending Assignment"
                                ? "bg-amber-100 text-amber-800"
                                : booking.status === "New"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-1.5">
                        <h3 className="text-xs font-bold text-foreground">{booking.patientName}</h3>
                        <p className="text-[11px] text-muted-foreground">
                          {booking.ageGender} · Care: <strong className="text-foreground">{booking.careType}</strong>
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" /> {booking.locationArea}
                        </span>
                        <span>Starts: {booking.startDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 2: BOOKING SPECIFICATION (according to patient) */}
          <div className="lg:col-span-4 xl:col-span-5 rounded-2xl border bg-card p-5 shadow-xs space-y-4 border-[#01265D]/20">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-3.5 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-[#01265D] dark:text-blue-300">
                      Booking Specification
                    </h2>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold py-0">
                      Active Patient Spec
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Clinical needs & schedule parameters for {selectedBooking.patientName}
                  </p>
                </div>
              </div>
              <Badge className="bg-[#01265D] text-white font-mono text-xs">
                {selectedBooking.bookingCode}
              </Badge>
            </div>

            {/* Section 1: Patient Identity Card */}
            <div className="rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-foreground">{selectedBooking.patientName}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">({selectedBooking.patientId})</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold bg-white dark:bg-slate-800">
                  {selectedBooking.ageGender}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-muted-foreground border-t">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
                  <span className="truncate">
                    {patient360?.address || `${selectedBooking.locationArea} West, Mumbai`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
                  <span>{patient360?.primaryContactPhone || "+91 98200 11223"}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Focus & Diagnosis */}
            <div className="rounded-xl border p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-rose-600" />
                  Clinical Focus & Diagnosis
                </span>
                <Badge className="bg-blue-100 text-[#01265D] font-bold text-[10px]">
                  {selectedBooking.careType}
                </Badge>
              </div>

              <p className="text-xs text-foreground font-medium bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border leading-relaxed">
                {patient360?.primaryDiagnosis ||
                  `${selectedBooking.careType} requirement with regular vitals monitoring, assisted mobility, and routine medication adherence.`}
              </p>

              {patient360?.doctorNotes && (
                <div className="text-[11px] text-muted-foreground border-l-2 border-[#01265D] pl-2.5 py-0.5">
                  <strong className="text-foreground">Attending Physician:</strong> {patient360.doctorName} ({patient360.doctorHospital})
                  <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300 italic">
                    &ldquo;{patient360.doctorNotes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Shift, Duration & Mobility */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Shift & Frequency
                </span>
                <p className="font-bold text-foreground text-xs flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#01265D]" />
                  {selectedBooking.frequency}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Duration: <strong>{selectedBooking.duration}</strong> (Starts {selectedBooking.startDate})
                </span>
              </div>

              <div className="rounded-xl border p-3 bg-slate-50/50 dark:bg-slate-900/30 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mobility & Support
                </span>
                <p className="font-bold text-foreground text-xs flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  {patient360?.mobilityLevel || "Assisted Walker"}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Blood Group: <strong>{patient360?.bloodGroup || "B+"}</strong>
                </span>
              </div>
            </div>

            {/* Section 4: Caregiver Match Preferences */}
            <div className="rounded-xl border p-3 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#01265D] dark:text-blue-300 flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5" />
                Caregiver Preference Criteria
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border text-[#01265D] dark:text-blue-300">
                  📍 Location: {selectedBooking.locationArea} Area
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border text-[#01265D] dark:text-blue-300">
                  🗣️ Languages: Marathi, Hindi, English
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border text-[#01265D] dark:text-blue-300">
                  🛡️ Police Verified Required
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border text-[#01265D] dark:text-blue-300">
                  ⭐ 4.8+ Rating
                </span>
              </div>
            </div>

            {/* Section 5: Billing Snapshot */}
            <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground">Booking Value:</span>
                <p className="font-mono font-black text-sm text-foreground">
                  ₹{selectedBooking.billing?.bookingValue?.toLocaleString("en-IN") || "22,000"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">Payment Status:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ {selectedBooking.billing?.paymentStatus || "Paid"}
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Smart Allocation Recommendations (Max 5 Care Professionals) */}
          <div className="lg:col-span-4 xl:col-span-4 rounded-2xl border bg-card p-4.5 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Ranked Candidates ({matchingCandidates.length})
                </h2>
                <p className="text-[11px] text-muted-foreground">Auto-matched to booking spec</p>
              </div>
              <Badge
                className={`text-[10px] font-bold ${
                  currentBookingDispatchedCount >= 5
                    ? "bg-rose-600 text-white"
                    : "bg-[#01265D] text-white"
                }`}
              >
                Dispatched: {currentBookingDispatchedCount}/5 (Max 5)
              </Badge>
            </div>

            {/* Dispatched Count Indicator */}
            {currentBookingDispatchedCount >= 5 && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300 text-[11px] font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                <span>Maximum 5 care professionals dispatched for this booking.</span>
              </div>
            )}

            {/* Candidates List */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
              {matchingCandidates.map((pro) => {
                const isMaxReached = currentBookingDispatchedCount >= 5 && !pro.alreadyDispatched;

                return (
                  <div
                    key={pro.id}
                    className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                      pro.alreadyDispatched
                        ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20 shadow-xs"
                        : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 hover:border-[#01265D]/50 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-9 w-9 bg-blue-100 text-[#01265D] font-bold border-2 border-[#01265D]">
                          <AvatarFallback className="text-xs">{pro.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-foreground">{pro.name}</h4>
                            <Badge variant="outline" className="text-[9px] font-bold py-0">
                              {pro.type}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span>📍 {pro.area}</span>
                            <span>•</span>
                            <span>⭐ {pro.rating}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-semibold">{pro.experienceYears}y exp</span>
                          </p>
                        </div>
                      </div>

                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                        {pro.matchScore}%
                      </Badge>
                    </div>

                    {/* Match Reasons Badges */}
                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {pro.matchReasons.map((reason, rid) => (
                        <span
                          key={rid}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-[#01265D] border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>

                    <div className="pt-1.5 border-t flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {pro.languages.slice(0, 2).join(", ")}
                      </span>
                      {pro.alreadyDispatched ? (
                        <Badge className="bg-emerald-100 text-emerald-800 text-[11px] font-bold gap-1 px-2.5 py-1">
                          <CheckCheck className="h-3 w-3" />
                          Request Sent
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isMaxReached}
                          className="h-7 text-[11px] bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1 px-3 shadow-xs disabled:opacity-50"
                          onClick={() => handleSendRequest(pro)}
                        >
                          <Send className="h-3 w-3" />
                          Sent Request ({currentBookingDispatchedCount + 1}/5)
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: LIVE DISPATCH (PATIENTS & DISPATCHED CARE PROFESSIONALS)
      ======================================================== */}
      {activeTab === "live_dispatch" && (
        <div className="space-y-4">

          {/* 3-COLUMN PATIENT & DISPATCHED CARE PROFESSIONALS MODULE */}
          <div className="grid gap-5 lg:grid-cols-12">
            {/* COLUMN 1: Live Dispatch Patients Queue */}
            <div className="lg:col-span-4 xl:col-span-3 rounded-2xl border bg-card p-4 shadow-xs space-y-3.5 flex flex-col">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Live Dispatch Patients
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Select patient to view dispatched staff</p>
                </div>
                <Badge className="bg-[#01265D] text-white text-[10px] font-bold">
                  {liveDispatchPatientGroups.length} Active
                </Badge>
              </div>

              {/* Search Patients in Dispatch */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search code, patient, area..."
                  value={searchLiveDispatchQuery}
                  onChange={(e) => setSearchLiveDispatchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
                {filteredDispatchPatientGroups.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    No active patient dispatches matching query.
                  </div>
                ) : (
                  filteredDispatchPatientGroups.map((group) => {
                    const isSelected = activeDispatchGroup?.bookingCode === group.bookingCode;
                    const acceptedCount = group.items.filter((i) => i.status === "Accepted" || i.status === "En Route").length;
                    const declinedCount = group.items.filter((i) => i.status === "Declined").length;
                    const pendingCount = group.items.filter((i) => i.status === "Awaiting Acceptance" || i.status === "Request Sent").length;

                    return (
                      <div
                        key={group.bookingCode}
                        onClick={() => setSelectedDispatchBookingCode(group.bookingCode)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? "border-[#01265D] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#01265D]/30 shadow-xs"
                            : "border-slate-200/80 bg-slate-50/40 hover:bg-slate-100/70 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground font-mono">
                            {group.bookingCode}
                          </span>
                          <Badge className="text-[9px] font-bold bg-[#01265D] text-white py-0">
                            {group.items.length}/5 Dispatched
                          </Badge>
                        </div>

                        <div className="mt-1.5">
                          <h3 className="text-xs font-bold text-foreground">{group.patientName}</h3>
                          <p className="text-[11px] text-muted-foreground">
                            Care: <strong className="text-foreground">{group.careType}</strong>
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground flex-wrap gap-1">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" /> {group.locationArea}
                          </span>
                          <div className="flex items-center gap-1">
                            {acceptedCount > 0 && (
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                ✓ {acceptedCount}
                              </span>
                            )}
                            {declinedCount > 0 && (
                              <span className="text-rose-700 dark:text-rose-400 font-bold">
                                ✕ {declinedCount}
                              </span>
                            )}
                            {pendingCount > 0 && (
                              <span className="text-amber-700 dark:text-amber-400 font-bold">
                                ⏳ {pendingCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 2: SELECTED PATIENT BOOKING SPECIFICATION */}
            {activeDispatchGroup && (
              <div className="lg:col-span-4 xl:col-span-4 rounded-2xl border bg-card p-5 shadow-xs space-y-4 border-[#01265D]/20">
                {/* Header */}
                <div className="flex items-start justify-between border-b pb-3.5 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-black uppercase tracking-wider text-[#01265D] dark:text-blue-300">
                        Patient Specification
                      </h2>
                      <p className="text-[11px] text-muted-foreground">
                        {activeDispatchGroup.patientName} ({activeDispatchGroup.bookingCode})
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-[#01265D] text-white font-mono text-xs">
                    {activeDispatchGroup.bookingCode}
                  </Badge>
                </div>

                {/* Patient Identity */}
                <div className="rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-foreground">{activeDispatchGroup.patientName}</span>
                    </div>
                    <Badge className="bg-blue-100 text-[#01265D] text-[10px] font-bold">
                      {activeDispatchGroup.careType}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-[11px] pt-1 text-muted-foreground border-t">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
                      <span className="truncate">
                        {activeDispatchPatient360?.address || `${activeDispatchGroup.locationArea} West, Mumbai`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
                      <span>{activeDispatchPatient360?.primaryContactPhone || "+91 98200 11223"}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Focus */}
                <div className="rounded-xl border p-3.5 space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    Clinical Focus & Diagnosis
                  </span>
                  <p className="text-xs text-foreground font-medium bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border leading-relaxed">
                    {activeDispatchPatient360?.primaryDiagnosis ||
                      `${activeDispatchGroup.careType} requirement with regular vitals monitoring and medication adherence.`}
                  </p>
                </div>

                {/* Shift Timing */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30">
                    <span className="text-[10px] text-muted-foreground block">Shift Timing</span>
                    <span className="font-bold text-foreground text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-[#01265D]" />
                      Daily 10 hrs
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30">
                    <span className="text-[10px] text-muted-foreground block">Mobility</span>
                    <span className="font-bold text-foreground text-xs flex items-center gap-1 mt-0.5">
                      <Activity className="h-3.5 w-3.5 text-emerald-600" />
                      {activeDispatchPatient360?.mobilityLevel || "Assisted Walker"}
                    </span>
                  </div>
                </div>

                {/* Staff Dispatch Pool Summary */}
                <div className="rounded-xl border p-3.5 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-[#01265D] dark:text-blue-300 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Dispatched Pool ({activeDispatchGroup.items.length}/5)
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      Max 5 Staff
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Requests dispatched across top proximity and skill-matched professionals. Telemetry updates in real-time.
                  </p>
                </div>
              </div>
            )}

            {/* COLUMN 3: DISPATCHED CARE PROFESSIONALS LIST (UP TO 5) */}
            {activeDispatchGroup && (
              <div className="lg:col-span-4 xl:col-span-5 rounded-2xl border bg-card p-4.5 shadow-xs space-y-4 flex flex-col">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                      Dispatched Care Professionals ({activeDispatchGroup.items.length})
                    </h2>
                    <p className="text-[11px] text-muted-foreground">Staff responses, timer & rejection reasons</p>
                  </div>
                  <Badge className="bg-[#01265D] text-white text-[10px] font-bold">
                    {activeDispatchGroup.items.length}/5 Dispatched
                  </Badge>
                </div>

                {/* Dispatched Professionals Cards */}
                <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
                  {activeDispatchGroup.items.map((dispatch) => {
                    const isDeclined = dispatch.status === "Declined";

                    return (
                      <div
                        key={dispatch.id}
                        className={`rounded-xl border p-4 space-y-3 transition-all ${
                          isDeclined
                            ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20"
                            : dispatch.status === "Accepted" || dispatch.status === "En Route"
                            ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                            : "border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30"
                        }`}
                      >
                        {/* Top: Professional Info & Match Score */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-10 w-10 bg-blue-100 text-[#01265D] font-bold border-2 border-[#01265D]">
                              <AvatarFallback className="text-xs">
                                {dispatch.professionalName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-bold text-foreground">{dispatch.professionalName}</h4>
                                <Badge variant="outline" className="text-[9px] font-bold py-0">
                                  {dispatch.professionalRole}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span><Phone className="inline h-2.5 w-2.5 text-[#01265D]" /> {dispatch.professionalPhone}</span>
                                <span>•</span>
                                <span>⭐ {dispatch.professionalRating || 4.9}</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-semibold">{dispatch.professionalExperience || "6y exp"}</span>
                              </p>
                            </div>
                          </div>

                          <Badge className="bg-emerald-600 text-white text-[10px] font-bold shrink-0">
                            {dispatch.matchScore}% Match
                          </Badge>
                        </div>

                        {/* Middle: Live Status & Response Timer */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                            <span className="text-[10px] text-muted-foreground block">Assigned / Dispatch Status</span>
                            <Badge
                              className={`text-[10px] font-bold mt-0.5 ${
                                isDeclined
                                  ? "bg-rose-100 text-rose-800 border-rose-300"
                                  : dispatch.status === "Awaiting Acceptance" || dispatch.status === "Request Sent"
                                  ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                  : dispatch.status === "Accepted"
                                  ? "bg-blue-100 text-[#01265D] border-blue-300"
                                  : "bg-emerald-100 text-emerald-900 border-emerald-300"
                              }`}
                            >
                              {isDeclined && "✕ "}
                              {dispatch.status === "Awaiting Acceptance" && "⏳ "}
                              {dispatch.status === "Accepted" && "✓ "}
                              {dispatch.status === "En Route" && "🚗 "}
                              {dispatch.status}
                            </Badge>
                          </div>

                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                            <span className="text-[10px] text-muted-foreground block">Response Timer</span>
                            {dispatch.expiresInMinutes > 0 ? (
                              <span className="font-bold text-amber-700 text-xs flex items-center gap-1 mt-0.5">
                                <Timer className="h-3.5 w-3.5" />
                                {dispatch.expiresInMinutes}m remaining
                              </span>
                            ) : (
                              <span className="font-semibold text-muted-foreground text-xs block mt-0.5">
                                {isDeclined ? "Response recorded" : "Accepted"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* REJECT REASON (IF REJECTED) */}
                        {isDeclined && (
                          <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/80 dark:bg-rose-950/40 text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-bold text-[11px]">
                              <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                              <span>Reason for Rejection:</span>
                              {dispatch.rejectedAt && (
                                <span className="text-[10px] font-normal text-rose-700/80 dark:text-rose-400">
                                  ({dispatch.rejectedAt})
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-rose-950 dark:text-rose-100 text-[11px] leading-relaxed pl-5">
                              {dispatch.rejectReason || "Staff unavailable due to active hospital emergency duty."}
                            </p>
                          </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="pt-2 border-t flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            Dispatched: {dispatch.sentTime}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-semibold gap-1 text-foreground"
                              onClick={() => handleOpenDispatchDetails(dispatch)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SUCCESSFULLY ASSIGNED TODAY
      ======================================================== */}
      {activeTab === "assigned_today" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3.5 rounded-xl border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-foreground">
                Today&apos;s Confirmed Allocations ({assignedToday.length} bookings successfully assigned)
              </span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 text-xs font-bold">
              100% SLA Fulfilment
            </Badge>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/60">
                  <TableHead className="font-extrabold text-xs text-foreground py-3">Booking & Patient</TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground py-3">Allocated Care Professional</TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground py-3">Shift Timing & Start</TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground py-3">Assignment Source</TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground py-3 text-center">Status</TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedToday.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center text-muted-foreground text-xs font-medium">
                      No bookings assigned yet today.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignedToday.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                      {/* Booking & Patient */}
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-foreground">{item.bookingCode}</span>
                            <Badge variant="outline" className="text-[10px] py-0">{item.careType}</Badge>
                          </div>
                          <p className="font-bold text-xs text-foreground mt-0.5">{item.patientName}</p>
                          <span className="text-[10px] text-muted-foreground">📍 {item.locationArea}</span>
                        </div>
                      </TableCell>

                      {/* Allocated Care Professional */}
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-foreground">{item.professionalName}</span>
                            <Badge className="bg-blue-100 text-[#01265D] text-[9px] font-bold py-0">{item.professionalRole}</Badge>
                            <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold py-0">★ {item.matchScore}%</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" /> {item.professionalPhone}
                          </p>
                        </div>
                      </TableCell>

                      {/* Shift Timing */}
                      <TableCell>
                        <div className="text-xs">
                          <span className="font-semibold text-foreground">{item.shiftTiming}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Starts: {item.startDate}</p>
                        </div>
                      </TableCell>

                      {/* Assignment Source */}
                      <TableCell>
                        <div className="text-xs">
                          <span className="font-medium text-foreground">{item.assignedBy}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.assignedTime}</p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          className={`text-[10px] font-bold ${
                            item.status === "Care Started"
                              ? "bg-blue-100 text-[#01265D] border-blue-300"
                              : item.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          ✓ {item.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-semibold"
                          onClick={() => {
                            swiftAlert.info({
                              title: `Allocation Summary: ${item.bookingCode}`,
                              description: `Patient: ${item.patientName} | Care Professional: ${item.professionalName} (${item.professionalRole}) | Shift: ${item.shiftTiming} | Status: ${item.status}`,
                            });
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Summary
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* LIVE DISPATCH DETAILS MODAL */}
      <LiveDispatchDetailsModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        data={selectedDispatchForModal}
      />
    </div>
  );
}
