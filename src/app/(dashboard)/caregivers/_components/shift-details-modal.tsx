"use client";

import { CareProfessional } from "@/lib/admin-data";
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
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Navigation,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: CareProfessional | null;
}

export function ShiftDetailsModal({
  isOpen,
  onClose,
  professional,
}: ShiftDetailsModalProps) {
  if (!professional) return null;

  const assignment = professional.currentAssignment;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">🟢 Available</Badge>;
      case "Assigned":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">🟡 Assigned</Badge>;
      case "Accepted":
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px]">🔵 Accepted</Badge>;
      case "En route":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px]">🚗 En Route</Badge>;
      case "Care Started":
        return <Badge className="bg-teal-600 text-white font-bold animate-pulse text-[10px]">❤️ Care Started</Badge>;
      case "Care Completed":
        return <Badge className="bg-slate-200 text-slate-800 font-bold text-[10px]">✓ Completed</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Active Shift Details & Live Roster
            </DialogTitle>
            {getStatusBadge(professional.status)}
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Real-time shift schedule, patient assignment, and visit telemetry for {professional.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Professional Overview Card */}
          <div className="rounded-2xl border bg-slate-50/70 dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  {professional.name}
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {professional.type}
                  </Badge>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>{professional.qualification}</span>
                  <span>&bull;</span>
                  <span>{professional.experienceYears} yrs experience</span>
                  <span>&bull;</span>
                  <span>★ {professional.rating} ({professional.totalVisitsCompleted} visits)</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <a
                  href={`tel:${professional.phone}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {professional.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-teal-600" /> Base Area: {professional.area}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                {professional.policeVerified ? "Police & Background Verified" : "Verification Pending"}
              </span>
              <span>&bull;</span>
              <span>Languages: {professional.languages.join(", ")}</span>
            </div>
          </div>

          {/* Current Assignment / Active Shift Card */}
          {assignment ? (
            <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
                  Current Active Patient Assignment
                </span>
                <Badge className="bg-teal-600 text-white text-[10px] font-bold">
                  Live Dispatch
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Patient Information</span>
                  <div className="text-xs font-bold text-foreground">
                    {assignment.patientName}
                  </div>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Patient ID: #{assignment.patientId}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Shift Timing & Window</span>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    {assignment.shiftTime}
                  </div>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold block">
                    Today &bull; Verified GPS Tracking
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-teal-200 dark:border-teal-900/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <Navigation className="h-3 w-3 text-teal-600" />
                  Location: <strong className="text-foreground">{assignment.location || professional.area}</strong>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  ✓ Geo-fence Verified
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
              <h4 className="text-xs font-bold text-foreground">No Active Shift Assigned Currently</h4>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                {professional.name} is currently {professional.status.toLowerCase()} and available for upcoming patient bookings in {professional.area}.
              </p>
            </div>
          )}

          {/* Clinical Specializations & Skills */}
          <div className="rounded-2xl border p-3.5 space-y-2 bg-card">
            <span className="text-xs font-bold text-foreground block">Clinical Specializations & Care Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {professional.specializations.map((spec, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] font-medium bg-slate-50 dark:bg-slate-900">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.info({
                title: "Shift Log Synced",
                description: `Updated telemetry and attendance log for ${professional.name}.`,
              })
            }
            className="h-8 text-xs gap-1"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Sync Attendance
          </Button>

          <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
            Close Shift Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
