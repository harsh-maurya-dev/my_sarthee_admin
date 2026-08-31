"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Radio,
  User,
  Phone,
  MapPin,
  Clock,
  Calendar,
  HeartPulse,
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Sparkles,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
} from "lucide-react";

export interface LiveDispatchModalData {
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

interface LiveDispatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LiveDispatchModalData | null;
  onReassign?: (dispatchId: string) => void;
}

export function LiveDispatchDetailsModal({
  isOpen,
  onClose,
  data,
}: LiveDispatchDetailsModalProps) {
  if (!data) return null;

  const isRejected = data.status === "Declined" || Boolean(data.rejectReason);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader className="border-b pb-3.5 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                <Radio className="h-5 w-5 text-rose-600 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-foreground">
                  Live Dispatch & Allocation Telemetry
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Booking Reference: <span className="font-mono font-bold text-foreground">{data.bookingCode}</span>
                </p>
              </div>
            </div>

            <Badge
              className={`text-xs font-bold px-2.5 py-1 ${
                data.status === "Declined"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : data.status === "Awaiting Acceptance" || data.status === "Request Sent"
                  ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                  : data.status === "Accepted"
                  ? "bg-blue-100 text-[#01265D] border-blue-300"
                  : "bg-emerald-100 text-emerald-900 border-emerald-300"
              }`}
            >
              {data.status === "Declined" && "✕ "}
              {data.status === "Awaiting Acceptance" && "⏳ "}
              {data.status === "Accepted" && "✓ "}
              {data.status === "En Route" && "🚗 "}
              {data.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* REJECTION REASON ALERT BANNER (If Declined) */}
          {isRejected && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Care Professional Declined Request</span>
                {data.rejectedAt && (
                  <span className="text-[11px] font-normal text-rose-700/80 dark:text-rose-400">
                    · {data.rejectedAt}
                  </span>
                )}
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-rose-200/60 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                  Reason for Decline
                </span>
                <p className="font-semibold text-rose-900 dark:text-rose-200">
                  {data.rejectReason || "Professional unavailable due to ongoing hospital shift overlap."}
                </p>
              </div>
              {data.alternativeSuggestion && (
                <p className="text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-1 font-medium">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Auto-Fallback: {data.alternativeSuggestion}
                </p>
              )}
            </div>
          )}

          {/* SECTION 1: CARE PROFESSIONAL STATUS & TELEMETRY */}
          <div className="rounded-xl border bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#01265D]" />
                Dispatched Professional Telemetry
              </span>
              <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                {data.matchScore}% Match Score
              </Badge>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 bg-blue-100 text-[#01265D] font-bold border-2 border-[#01265D]">
                  <AvatarFallback>{data.professionalName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{data.professionalName}</h4>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {data.professionalRole}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#01265D]" /> {data.professionalPhone}
                    </span>
                    <span>•</span>
                    <span>⭐ {data.professionalRating || 4.9}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">{data.professionalExperience || "6y exp"}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs border-t">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="text-[10px] text-muted-foreground block">Dispatch Sent</span>
                <span className="font-bold text-foreground text-[11px]">{data.sentTime}</span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                <span className="text-[10px] text-muted-foreground block">Response Window</span>
                <span className="font-bold text-amber-700 text-[11px] flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {data.expiresInMinutes > 0 ? `${data.expiresInMinutes} mins left` : "Recorded"}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border col-span-2 sm:col-span-1">
                <span className="text-[10px] text-muted-foreground block">Live Status</span>
                <span className="font-bold text-[#01265D] dark:text-blue-300 text-[11px]">
                  {data.status}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: BOOKING SPECIFICATION & PATIENT DETAILS */}
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#01265D]" />
                Patient & Booking Specification
              </span>
              <Badge className="bg-blue-100 text-[#01265D] text-[10px] font-bold">
                {data.careType}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground">Patient Name:</span>
                <p className="font-bold text-foreground">{data.patientName}</p>
                <p className="text-[11px] text-muted-foreground">{data.patientAgeGender || "71y / Female"}</p>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground">Patient Contact:</span>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#01265D]" /> {data.patientPhone || "+91 98200 11223"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  📍 {data.patientAddress || `${data.locationArea} West, Mumbai`}
                </p>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-rose-600" /> Clinical Focus / Diagnosis
              </span>
              <p className="font-medium text-foreground">
                {data.primaryDiagnosis || "Post-operative recovery with wound dressing, assisted mobility, and routine vitals monitoring."}
              </p>
            </div>

            {/* Shift & Duration */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30">
                <span className="text-[10px] text-muted-foreground block">Shift Timing</span>
                <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#01265D]" />
                  {data.shiftTiming || "Daily 10 hrs"}
                </span>
              </div>
              <div className="p-2 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30">
                <span className="text-[10px] text-muted-foreground block">Start Date</span>
                <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#01265D]" />
                  {data.startDate || "2026-08-31"}
                </span>
              </div>
              <div className="p-2 rounded-lg border bg-slate-50/50 dark:bg-slate-900/30 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-muted-foreground block">Billing Value</span>
                <span className="font-mono font-bold text-foreground text-[11px]">
                  {data.billingAmount || "₹22,000"} (✓ {data.paymentStatus || "Paid"})
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
