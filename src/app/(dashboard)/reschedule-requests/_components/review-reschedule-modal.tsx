"use client";

import { useState } from "react";
import { RescheduleRequestItem } from "../_data/reschedule-requests";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Calendar,
  AlertTriangle,
  Send,
  UserCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Check,
  BellRing,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReviewRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RescheduleRequestItem | null;
  onApprove: (id: string, remarks?: string) => void;
  onDecline: (id: string, reason: string) => void;
}

export function ReviewRescheduleModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onDecline,
}: ReviewRescheduleModalProps) {
  const [remarks, setRemarks] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  if (!request) return null;

  const handleApprove = () => {
    onApprove(request.id, remarks);
    swiftAlert.success({
      title: "Reschedule Approved & Synchronized",
      description: `Visit updated to ${request.requestedNewSchedule.date} (${request.requestedNewSchedule.timeSlot}). Notifications dispatched to ${request.patientName} & ${request.assignedProfessional.name}.`,
    });
    setRemarks("");
    onClose();
  };

  const handleConfirmDecline = () => {
    if (!declineReason.trim()) {
      swiftAlert.error({
        title: "Decline Reason Required",
        description: "Please specify why the reschedule request cannot be fulfilled.",
      });
      return;
    }

    onDecline(request.id, declineReason);
    swiftAlert.error({
      title: "Reschedule Request Declined",
      description: `Request ${request.id} declined. Notification dispatched with reason: "${declineReason}".`,
    });
    setIsDeclining(false);
    setDeclineReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              Review Shift Reschedule Request
            </DialogTitle>
            <Badge
              variant={
                request.status === "Approved"
                  ? "default"
                  : request.status === "Declined"
                  ? "destructive"
                  : "outline"
              }
              className={`text-xs px-2.5 py-0.5 ${
                request.status === "Approved"
                  ? "bg-emerald-600 text-white"
                  : request.status === "Pending Approval"
                  ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold"
                  : ""
              }`}
            >
              {request.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Request Ref: <strong className="font-mono text-foreground">{request.id}</strong> · Booking:{" "}
            <strong className="font-mono text-foreground">{request.bookingCode}</strong> · Submitted:{" "}
            <strong className="text-foreground">{request.requestedAt}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Notification Sync Banner */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 dark:bg-blue-950/30 dark:border-blue-800 p-3 flex items-center gap-2.5 text-[#01265D] dark:text-blue-100 dark:text-blue-300">
            <BellRing className="h-4 w-4 text-[#01265D] dark:text-blue-400 shrink-0" />
            <p>
              <strong>Mobile Sync:</strong> Approving or declining automatically updates both the Patient Mobile App and Caregiver Handheld Roster.
            </p>
          </div>

          {/* Time Comparison Card */}
          <div className="rounded-2xl border p-4 bg-card shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Schedule Comparison (Original &rarr; Requested)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Original Schedule */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">Original Slot</span>
                  <Badge variant="outline" className="text-[9px] bg-white dark:bg-slate-800">
                    Current
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{request.originalSchedule.date}</span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{request.originalSchedule.timeSlot} ({request.originalSchedule.duration})</span>
                  </div>
                </div>
              </div>

              {/* Requested New Schedule */}
              <div className="p-3.5 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40/70 dark:bg-blue-950/40 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#01265D] dark:text-blue-200 dark:text-blue-300">Requested New Slot</span>
                  <Badge className="text-[9px] bg-[#01265D] text-white font-bold">
                    Target Time
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#01265D] dark:text-blue-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                    <span>{request.requestedNewSchedule.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#01265D] dark:text-blue-200 dark:text-blue-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                    <span>{request.requestedNewSchedule.timeSlot} ({request.requestedNewSchedule.duration})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reason for Rescheduling */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/40 dark:border-amber-900 p-3.5 space-y-1.5 text-amber-950 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                Reason for Rescheduling:
              </span>
              <Badge variant="outline" className="text-[10px] border-amber-300 bg-white/80 dark:bg-slate-900">
                Requested by: {request.requestedBy}
              </Badge>
            </div>
            <p className="font-medium pl-5 text-foreground">{request.reasonForRescheduling}</p>
          </div>

          {/* Patient & Assigned Professional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Patient Card */}
            <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground block">Patient Details</span>
              <div className="text-xs font-bold text-foreground">{request.patientName}</div>
              <div className="text-[11px] text-muted-foreground">
                {request.ageGender} · <span className="font-medium text-foreground">{request.careType}</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1 border-t">
                <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> {request.locationArea} · {request.patientPhone}
              </div>
            </div>

            {/* Assigned Professional Card */}
            <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground block">Assigned Staff</span>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  {request.assignedProfessional.name}
                  <Badge variant="outline" className="text-[9px] py-0">
                    {request.assignedProfessional.type}
                  </Badge>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {request.assignedProfessional.phone}
              </div>
              <div className="pt-1 border-t">
                {request.assignedProfessional.isAvailableForNewTime ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Available for requested slot
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Schedule overlap / Alternative required
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Decline Reason Input Section when declining */}
          {isDeclining ? (
            <div className="rounded-xl border border-rose-300 bg-rose-50/80 dark:bg-rose-950/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Reason for Declining Reschedule <span className="text-rose-500">*</span>
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDeclining(false)}
                  className="h-6 text-[11px] text-slate-500"
                >
                  Cancel
                </Button>
              </div>
              <Textarea
                placeholder="Explain why this reschedule request cannot be approved (e.g. Caregiver schedule conflict, minimum notice period)..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="text-xs h-20 bg-white dark:bg-slate-900"
              />
              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmDecline}
                  className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1 shadow-xs"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Confirm Decline & Notify
                </Button>
              </div>
            </div>
          ) : (
            /* Admin Remarks for Approval */
            request.status === "Pending Approval" && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Admin Approval Notes / Instructions (Optional):
                </Label>
                <Textarea
                  placeholder="Add any specific instructions for the patient or caregiver regarding this adjusted shift..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="text-xs h-16 resize-none"
                />
              </div>
            )
          )}

          {/* Past Remarks if already handled */}
          {request.adminRemarks && (
            <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900 text-xs">
              <span className="font-semibold text-foreground block mb-0.5">Admin Remarks Log:</span>
              <p className="text-muted-foreground">{request.adminRemarks}</p>
              {request.actionTakenAt && (
                <span className="text-[10px] text-muted-foreground block mt-1">
                  Action taken on: {request.actionTakenAt}
                </span>
              )}
            </div>
          )}
        </div>

        {!isDeclining && request.status === "Pending Approval" && (
          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeclining(true)}
              className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950 font-semibold"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Decline Request
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApprove}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve Reschedule & Sync Schedule
            </Button>
          </DialogFooter>
        )}

        {request.status !== "Pending Approval" && (
          <DialogFooter className="border-t pt-3 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
