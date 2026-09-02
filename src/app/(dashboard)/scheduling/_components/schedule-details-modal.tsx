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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VisitSchedule } from "../_data/schedules";
import {
  CalendarClock,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  Sparkles,
  Printer,
  BellRing,
  CheckSquare,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ScheduleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: VisitSchedule | null;
  onReassign?: (schedule: VisitSchedule) => void;
}

export function ScheduleDetailsModal({
  isOpen,
  onClose,
  schedule,
  onReassign,
}: ScheduleDetailsModalProps) {
  if (!schedule) return null;

  const handleSendReminder = () => {
    swiftAlert.success({
      title: "Mobile Reminder Dispatched",
      description: `Sent shift notification & GPS route to ${schedule.caregiverName} (${schedule.caregiverRole}).`,
    });
  };

  const handlePrintCard = () => {
    swiftAlert.info({
      title: "Clinical Shift Slip Printed",
      description: `Generated printable duty card for ${schedule.id} - ${schedule.patientName}.`,
    });
  };

  const getStatusBadge = (status: VisitSchedule["status"]) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">✓ Confirmed</Badge>;
      case "In-Progress":
        return <Badge className="bg-blue-100 text-[#01265D] border-blue-200 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold animate-pulse">⏳ In-Progress</Badge>;
      case "Replacement Required":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold">⚠️ Replacement Required</Badge>;
      case "Completed":
        return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold">Completed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs font-bold">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 rounded-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg font-bold text-foreground">
                    Visit Schedule {schedule.id}
                  </DialogTitle>
                  {getStatusBadge(schedule.status)}
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Linked Booking: <span className="font-mono font-semibold text-foreground">{schedule.bookingId}</span>
                </DialogDescription>
              </div>
            </div>
            <Badge
              className={`text-xs font-bold w-fit ${
                schedule.service === "Essential Care"
                  ? "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                  : schedule.service === "Skilled Care"
                  ? "bg-blue-100 text-[#01265D] border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {schedule.service}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Shift Schedule Timing Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#01265D] text-white flex items-center justify-center shadow-xs">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Scheduled Date & Time</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  {schedule.date} · {schedule.timeSlotFormatted || `${schedule.startTime} - ${schedule.endTime}`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block">Recurrence Pattern</span>
              <Badge variant="outline" className="text-xs font-semibold border-blue-200 text-[#01265D] dark:text-blue-300">
                {schedule.repeatFrequency}
              </Badge>
            </div>
          </div>

          {/* Patient Details & Address */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span>Patient & Care Location</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Patient Name:</span>
                <span className="font-bold text-foreground text-sm">{schedule.patientName}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  {schedule.patientPhone}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Home Address:</span>
                <span className="font-medium text-foreground flex items-start gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{schedule.patientAddress}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Caregiver Profile */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Assigned Care Professional</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">ID: {schedule.caregiverId}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-blue-100 text-[#01265D] font-bold text-xs">
                    {schedule.caregiverRole === "Nurse" ? "RN" : schedule.caregiverRole === "Physiotherapist" ? "PT" : "CG"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{schedule.caregiverName}</span>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {schedule.caregiverRole}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    Assigned Care Specialist · Verified Active
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleSendReminder}
                className="h-7 text-xs gap-1 shrink-0"
              >
                <BellRing className="h-3 w-3 text-amber-600" />
                <span>Notify</span>
              </Button>
            </div>
          </div>

          {/* Clinical Tasks Checklist */}
          {schedule.tasks && schedule.tasks.length > 0 && (
            <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <CheckSquare className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Assigned Clinical & Care Tasks ({schedule.tasks.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {schedule.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border text-xs text-foreground font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shift Notes or Replacement History */}
          {schedule.notes && (
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#01265D] dark:text-blue-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Care Plan Instructions & Supervisor Notes
              </span>
              <p className="text-muted-foreground pl-5">{schedule.notes}</p>
            </div>
          )}

          {schedule.replacementHistory && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> Replacement Record
              </span>
              <p className="text-amber-800 dark:text-amber-400 pl-5">
                Originally scheduled with {schedule.replacementHistory.originalCaregiverName} on {schedule.replacementHistory.replacedAt}. Reason: {schedule.replacementHistory.reason}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {schedule.status === "Replacement Required" && onReassign && (
              <Button
                size="sm"
                className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={() => {
                  onClose();
                  onReassign(schedule);
                }}
              >
                Reassign Caregiver
              </Button>
            )}
            <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
