"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingItem } from "@/lib/admin-data";
import {
  CalendarCheck2,
  MapPin,
  Clock,
  User,
  HeartPulse,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Receipt,
  FileText,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { swiftAlert } from "@/lib/swift-alert";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingItem | null;
}

export function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  if (!booking) return null;

  const handleDownloadInvoice = () => {
    swiftAlert.success({
      title: "Invoice Downloaded",
      description: `Tax invoice for booking ${booking.bookingCode} downloaded successfully (PDF).`,
    });
  };

  const getStatusBadge = (status: BookingItem["status"]) => {
    switch (status) {
      case "Ongoing":
        return <Badge className="bg-[#01265D] text-white text-xs font-bold px-2.5 py-0.5">Ongoing Care</Badge>;
      case "Pending Assignment":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5">Pending Assignment</Badge>;
      case "New":
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-bold px-2.5 py-0.5">New Booking</Badge>;
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5">Completed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-bold px-2.5 py-0.5">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 rounded-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-bold text-foreground">
                    Booking {booking.bookingCode}
                  </DialogTitle>
                  {getStatusBadge(booking.status)}
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Internal ID: {booking.id} · Registered on MySarthee Intake
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold border-blue-200 dark:border-blue-800 text-[#01265D] dark:text-blue-300 w-fit">
              {booking.careType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Patient Details & Location */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span>Patient Profile & Service Location</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Patient Name & ID:</span>
                <span className="font-bold text-foreground text-sm">{booking.patientName}</span>
                <span className="text-[10px] text-muted-foreground block">ID: {booking.patientId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Demographics:</span>
                <span className="font-semibold text-foreground">{booking.ageGender}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Service Area:</span>
                <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                  {booking.locationArea}, Mumbai
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Care Schedule:</span>
                <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                  {booking.duration} ({booking.frequency})
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Start Date: {booking.startDate}</span>
              </div>
            </div>
          </div>

          {/* Assigned Staff or Direct Allocation Card */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <HeartPulse className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Assigned Care Professional</span>
              </div>
              {booking.assignedProfessional ? (
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                  ✓ Staff Deployed
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                  ⚠️ Action Required
                </Badge>
              )}
            </div>

            {booking.assignedProfessional ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-foreground block">
                    {booking.assignedProfessional.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-[9px] font-semibold">
                      {booking.assignedProfessional.type}
                    </Badge>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3 text-emerald-600" />
                      {booking.assignedProfessional.phone}
                    </span>
                  </div>
                </div>
                <Link href="/smart-assignment">
                  <Button size="sm" variant="outline" className="h-7 text-xs font-semibold gap-1">
                    <Sparkles className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                    Reassign via AI
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    No caregiver assigned yet
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Match candidate based on location proximity & specialized clinical skills.
                  </p>
                </div>
                <Link href="/smart-assignment">
                  <Button size="sm" className="h-8 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1 shadow-xs shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                    Launch Smart Allocation
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Billing & Financial Breakdown */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Financial & Payment Details</span>
              </div>
              <Badge
                className={`text-[10px] font-bold ${
                  booking.billing.paymentStatus === "Paid"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : booking.billing.paymentStatus === "Partially Paid"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                }`}
              >
                Payment: {booking.billing.paymentStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                <span className="text-[10px] text-muted-foreground block">Package Value</span>
                <span className="font-bold text-foreground text-sm font-mono">
                  ₹{booking.billing.bookingValue.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                <span className="text-[10px] text-muted-foreground block">Discount / Offer</span>
                <span className="font-semibold text-rose-600 text-sm font-mono">
                  -₹{booking.billing.discount.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                <span className="text-[10px] text-muted-foreground block">Amount Paid</span>
                <span className="font-bold text-emerald-600 text-sm font-mono">
                  ₹{booking.billing.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border text-xs">
                <span className="text-[10px] text-muted-foreground block">Outstanding Balance</span>
                <span className={`text-sm font-mono font-bold ${booking.billing.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  ₹{booking.billing.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            className="h-8 text-xs gap-1.5 w-full sm:w-auto"
          >
            <Receipt className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
            Download Invoice PDF
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link href="/patients">
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                Patient 360°
              </Button>
            </Link>
            <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
