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
import {
  User,
  MapPin,
  AlertTriangle,
  LockOpen,
} from "lucide-react";

export interface OTPBypassRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: "Caregiver" | "Nurse" | "Patient" | "Physiotherapist" | "Family Member";
  userPhone: string;
  userLocation: string;
  userEmail?: string;
  bookingId?: string;
  shiftTime?: string;
  reason: string;
  overrideCategory:
    | "Network / SMS Gateway Failure"
    | "Emergency Shift Start"
    | "Elderly / Accessibility Assistance"
    | "Device Malfunction / Battery"
    | "Supervisor Direct Authorization";
  authorizedBy: string;
  authorizedRole: string;
  timestamp: string;
  verificationMethod: string;
  ipAddress?: string;
  geoLocation?: string;
  securityStatus: "Authorized & Logged" | "Flagged for Review" | "Audit Cleared";
  additionalNotes?: string;
}

interface OTPBypassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: OTPBypassRecord | null;
}

export function OTPBypassDetailsModal({
  isOpen,
  onClose,
  record,
}: OTPBypassDetailsModalProps) {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <DialogHeader className="border-b pb-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                <LockOpen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  OTP Bypass Details
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  System ID: <span className="font-mono font-bold text-foreground">{record.id}</span> &bull; {record.timestamp}
                </DialogDescription>
              </div>
            </div>
            <Badge
              className={
                record.securityStatus === "Audit Cleared"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300"
                  : record.securityStatus === "Flagged for Review"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300"
                  : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300"
              }
            >
              {record.securityStatus}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Section 1: User Details */}
          <div className="p-4 rounded-xl border bg-slate-50/60 dark:bg-slate-900/50 space-y-2.5">
            <h3 className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5 text-teal-600" />
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-muted-foreground block">User ID</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{record.userId}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Full Name</span>
                <span className="font-bold text-foreground">{record.userName}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Role Profile</span>
                <Badge variant="outline" className="text-[10px] font-semibold mt-0.5">
                  {record.userRole}
                </Badge>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Contact Phone</span>
                <span className="font-mono font-medium text-foreground">{record.userPhone}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Location / Area</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-teal-600" /> {record.userLocation}
                </span>
              </div>
              {record.bookingId && (
                <div>
                  <span className="text-[11px] text-muted-foreground block">Booking Reference</span>
                  <span className="font-mono font-bold text-foreground">{record.bookingId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Reason for Override */}
          <div className="p-4 rounded-xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                Reason for Override
              </h3>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[10px] font-bold">
                {record.overrideCategory}
              </Badge>
            </div>
            <p className="text-xs text-foreground font-semibold leading-relaxed bg-card p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/40">
              &ldquo;{record.reason}&rdquo;
            </p>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold px-4"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
