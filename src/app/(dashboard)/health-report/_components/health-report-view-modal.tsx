"use client";

import { CaregiverHealthReport } from "../_data/health-reports";
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
  FileText,
  Activity,
  Heart,
  Thermometer,
  Stethoscope,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface HealthReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CaregiverHealthReport | null;
}

export function HealthReportViewModal({
  isOpen,
  onClose,
  report,
}: HealthReportViewModalProps) {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Caregiver Clinical Health Report
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Report ID: <strong className="font-mono text-foreground">{report.id}</strong> · Visit:{" "}
                <strong className="font-mono text-foreground">{report.visitId}</strong> · Submitted:{" "}
                <strong className="text-foreground">{report.reportDate} at {report.reportTime}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                report.patientProgress === "Improving"
                  ? "default"
                  : report.patientProgress === "Stable"
                  ? "secondary"
                  : report.patientProgress === "Needs Monitoring"
                  ? "outline"
                  : "destructive"
              }
              className="text-xs font-bold"
            >
              {report.patientProgress}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Patient & Caregiver Header Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Patient Information</span>
              <h4 className="font-bold text-foreground">{report.patientName}</h4>
              <p className="text-muted-foreground">
                {report.patientAge} years · {report.patientGender} · ID: {report.patientId}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reporting Caregiver</span>
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                {report.caregiverName}
                <Badge variant="outline" className="text-[9px] py-0">{report.caregiverRole}</Badge>
              </h4>
              <p className="text-muted-foreground">ID: {report.caregiverId}</p>
            </div>
          </div>

          {/* Vitals Telemetry Section */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-teal-600" />
              Logged Vital Signs Telemetry
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <span className="text-[10px] text-muted-foreground font-semibold block">Blood Pressure</span>
                <span className="font-extrabold text-foreground text-sm mt-0.5 block">{report.vitals.bloodPressure}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <span className="text-[10px] text-muted-foreground font-semibold block flex items-center justify-center gap-1">
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> Heart Rate
                </span>
                <span className="font-extrabold text-foreground text-sm mt-0.5 block">{report.vitals.heartRateBpm} <span className="text-[10px] font-normal text-muted-foreground">bpm</span></span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <span className="text-[10px] text-muted-foreground font-semibold block">SpO2 Oxygen</span>
                <span className="font-extrabold text-foreground text-sm mt-0.5 block">{report.vitals.spO2Percent}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <span className="text-[10px] text-muted-foreground font-semibold block flex items-center justify-center gap-1">
                  <Thermometer className="h-3 w-3 text-amber-500" /> Temp
                </span>
                <span className="font-extrabold text-foreground text-sm mt-0.5 block">{report.vitals.temperatureF}°F</span>
              </div>
            </div>
          </div>

          {/* Visit Notes Narrative */}
          <div className="rounded-xl border p-4 bg-card space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-teal-600" />
              Caregiver Visit Clinical Notes
            </h4>
            <p className="text-xs leading-relaxed text-foreground bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border font-medium">
              {report.visitNotes}
            </p>
          </div>

          {/* Uploaded Images Gallery */}
          {report.uploadedImages && report.uploadedImages.length > 0 && (
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-teal-600" />
                Uploaded Clinical Observations ({report.uploadedImages.length} Photos)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {report.uploadedImages.map((img) => (
                  <div key={img.id} className="rounded-xl border overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-2.5 text-xs">
                      <p className="font-bold text-foreground truncate">{img.caption}</p>
                      <span className="text-[10px] text-muted-foreground font-mono block mt-0.5">
                        Uploaded at {img.uploadedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Progress Score & Alert */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                Patient Recovery Progress Trajectory
              </h4>
              <span className="text-xs font-extrabold text-teal-600">{report.progressScorePercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${report.progressScorePercent}%` }}
              />
            </div>

            {report.physicianFollowUpRequired && (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2.5 border border-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  Physician follow-up consultation recommended for this report.
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.info({
                title: "Report Exported",
                description: `PDF export generated for Health Report ${report.id}.`,
              })
            }
            className="h-9 text-xs gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Export Medical PDF
          </Button>

          <Button type="button" onClick={onClose} className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold">
            Close Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
