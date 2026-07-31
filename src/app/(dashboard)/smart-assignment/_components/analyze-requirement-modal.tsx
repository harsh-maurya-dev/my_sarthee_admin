"use client";

import { PatientRequirement } from "../_data/assignments";
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
  Stethoscope,
  MapPin,
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  FileText,
} from "lucide-react";

interface AnalyzeRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: PatientRequirement | null;
  onProceedToAssign: (req: PatientRequirement) => void;
}

export function AnalyzeRequirementModal({
  isOpen,
  onClose,
  requirement,
  onProceedToAssign,
}: AnalyzeRequirementModalProps) {
  if (!requirement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Analyze Care Requirement & Health Condition
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Booking ID: <strong className="font-mono text-foreground">{requirement.id}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                requirement.urgency === "Urgent"
                  ? "destructive"
                  : requirement.urgency === "High"
                  ? "default"
                  : "outline"
              }
              className="text-xs font-bold"
            >
              {requirement.urgency} Urgency
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Patient Overview Card */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                  {requirement.patientName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{requirement.patientName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {requirement.patientAge} years · {requirement.patientGender}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200 border-teal-200 text-xs">
                {requirement.requestedRole} Requested
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate text-foreground font-medium">
                  {requirement.location.address}, {requirement.location.neighborhood}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate text-foreground font-medium">{requirement.scheduleSlot}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Start Date: <strong className="text-foreground">{requirement.startDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Status: <strong className="text-amber-600">{requirement.status}</strong></span>
              </div>
            </div>
          </div>

          {/* Diagnosis & Care Need */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-teal-600" />
              Diagnosis & Care Requirement
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground font-medium">Primary Condition:</span>
                <p className="font-semibold text-foreground mt-0.5">{requirement.condition}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-medium">Care Summary:</span>
                <p className="text-foreground leading-relaxed mt-0.5">{requirement.careRequirement}</p>
              </div>
            </div>

            {/* Medical History */}
            <div className="pt-2 border-t space-y-1.5">
              <span className="text-xs font-bold text-muted-foreground">Medical History & Risk Factors:</span>
              <div className="flex flex-wrap gap-1.5">
                {requirement.medicalHistory.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Required Care Tasks */}
          <div className="rounded-xl border p-4 bg-card space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              Required Clinical Tasks Checklist
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {requirement.tasksNeeded.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-foreground">{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences & Matching Criteria */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Caregiver Match Criteria & Preferences
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Gender Preference:</span>
                <p className="font-semibold text-foreground mt-0.5">{requirement.preferences.genderPreference}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Min Experience Required:</span>
                <p className="font-semibold text-foreground mt-0.5">{requirement.preferences.experienceYearsMin} Years</p>
              </div>
            </div>
            <div className="pt-2 border-t space-y-1">
              <span className="text-xs text-muted-foreground">Mandatory Specialty Skills:</span>
              <div className="flex flex-wrap gap-1">
                {requirement.preferences.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] bg-teal-50 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close Analysis
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onClose();
              onProceedToAssign(requirement);
            }}
            className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Run AI Smart Match</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
