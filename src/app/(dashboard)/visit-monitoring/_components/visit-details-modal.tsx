"use client";

import { MonitoredVisit } from "../_data/visits";
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
  Eye,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  User,
  Phone,
  FileText,
  AlertTriangle,
  Compass,
} from "lucide-react";

interface VisitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: MonitoredVisit | null;
}

export function VisitDetailsModal({
  isOpen,
  onClose,
  visit,
}: VisitDetailsModalProps) {
  if (!visit) return null;

  const completedTaskCount = visit.tasks.filter((t) => t.completed).length;
  const taskProgressPercent = Math.round((completedTaskCount / (visit.tasks.length || 1)) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Live Visit Telemetry & Care Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Telemetry ID: <strong className="font-mono text-foreground">{visit.id}</strong> · Visit Schedule:{" "}
                <strong className="font-mono text-foreground">{visit.scheduleId}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                visit.liveStatus.includes("Check-In")
                  ? "secondary"
                  : visit.liveStatus.includes("Check-Out")
                  ? "default"
                  : visit.liveStatus === "Delayed" || visit.liveStatus === "Missed"
                  ? "destructive"
                  : "outline"
              }
              className="text-xs font-bold px-2.5 py-0.5"
            >
              {visit.liveStatus}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Patient & Caregiver Overview Card */}
          <div className="grid grid-cols-2 gap-3">
            {/* Patient Card */}
            <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Patient</span>
              <h4 className="font-bold text-foreground">{visit.patientName}</h4>
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                <span className="truncate">{visit.patientAddress}</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                <span className="font-mono text-foreground">{visit.patientPhone}</span>
              </p>
            </div>

            {/* Caregiver Card */}
            <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Caregiver</span>
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                {visit.caregiverName}
                <Badge variant="outline" className="text-[9px] py-0 px-1">{visit.caregiverRole}</Badge>
              </h4>
              <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                <span className="font-mono text-foreground">{visit.caregiverPhone}</span>
              </p>
              <p className="text-muted-foreground text-[11px]">
                Shift: <strong className="text-foreground">{visit.scheduledStartTime} - {visit.scheduledEndTime}</strong>
              </p>
            </div>
          </div>

          {/* GPS Check-In & Check-Out Telemetry Grid */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              GPS Geofence & Check-In / Check-Out Telemetry
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Check-In Status */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">Check-In Verification</span>
                  {visit.checkIn.status === "Verified Geofence" ? (
                    <Badge className="bg-emerald-600 text-white text-[9px]">Verified</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[9px]">Missed</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 text-foreground">
                  <span>Timestamp:</span>
                  <strong className="font-mono">{visit.checkIn.timestamp || "N/A"}</strong>
                </div>
                {visit.checkIn.locationName && (
                  <p className="text-[10px] text-muted-foreground truncate pt-0.5">
                    Location: {visit.checkIn.locationName}
                  </p>
                )}
              </div>

              {/* Check-Out Status */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">Check-Out Status</span>
                  {visit.checkOut.status === "Verified Check-Out" ? (
                    <Badge className="bg-emerald-600 text-white text-[9px]">Completed</Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 text-[9px]">Pending</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 text-foreground">
                  <span>Timestamp:</span>
                  <strong className="font-mono">{visit.checkOut.timestamp || "In Progress"}</strong>
                </div>
                <div className="flex items-center justify-between pt-0.5 text-foreground text-[10px]">
                  <span>Elapsed Time:</span>
                  <strong className="text-[#01265D] dark:text-blue-400 font-bold">{visit.actualDurationMinutes} mins</strong>
                </div>
              </div>
            </div>

            {visit.checkOut.summaryNotes && (
              <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 dark:bg-blue-950/30 p-2.5 text-xs text-foreground border border-blue-200 dark:border-blue-900">
                <span className="font-bold text-[#01265D] dark:text-blue-100 dark:text-blue-300 block mb-0.5">Caregiver Check-Out Notes:</span>
                <p className="text-muted-foreground">{visit.checkOut.summaryNotes}</p>
              </div>
            )}
          </div>

          {/* Vitals Telemetry (If recorded) */}
          {visit.vitalSignsRecorded && (
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                Recorded Patient Vital Signs
              </h4>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <span className="text-[10px] text-muted-foreground font-semibold block">Blood Pressure</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">{visit.vitalSignsRecorded.bloodPressure}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <span className="text-[10px] text-muted-foreground font-semibold block flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> Heart Rate
                  </span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">{visit.vitalSignsRecorded.heartRateBpm} <span className="text-[10px] font-normal text-muted-foreground">bpm</span></span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <span className="text-[10px] text-muted-foreground font-semibold block">SpO2 Oxygen</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">{visit.vitalSignsRecorded.spO2Percent}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <span className="text-[10px] text-muted-foreground font-semibold block flex items-center justify-center gap-1">
                    <Thermometer className="h-3 w-3 text-amber-500" /> Temp
                  </span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">{visit.vitalSignsRecorded.temperatureF}°F</span>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Task Progress Checklist */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                Assigned Task Progress Checklist ({completedTaskCount}/{visit.tasks.length})
              </h4>
              <Badge variant="outline" className="text-[10px] font-bold">
                {taskProgressPercent}% Complete
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              {visit.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border"
                >
                  <div className="flex items-center gap-2">
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className={`font-medium ${task.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {task.title}
                    </span>
                  </div>

                  {task.completed && task.completedAt ? (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Completed at {task.completedAt}
                    </span>
                  ) : (
                    <Badge variant="outline" className="text-[9px] text-slate-500">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full bg-[#01265D] hover:bg-[#0a3375] text-white font-bold h-9 text-xs">
            Close Telemetry View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
