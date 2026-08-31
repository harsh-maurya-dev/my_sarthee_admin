"use client";

import { useState } from "react";
import { VisitSchedule } from "../_data/schedules";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReplacementManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: VisitSchedule | null;
  onAssignReplacement: (scheduleId: string, newCaregiverName: string, reason: string) => void;
}

const availableReplacements = [
  { id: "CG-104", name: "Marcus Brody, PT", role: "Physiotherapist", distance: "1.2 miles away", rating: 4.9 },
  { id: "CG-102", name: "David Chen, RN", role: "Nurse", distance: "2.1 miles away", rating: 4.8 },
  { id: "CG-105", name: "Sarah Jenkins, RN", role: "Nurse", distance: "0.9 miles away", rating: 4.9 },
];

export function ReplacementManagementModal({
  isOpen,
  onClose,
  schedule,
  onAssignReplacement,
}: ReplacementManagementModalProps) {
  const [selectedCaregiverName, setSelectedCaregiverName] = useState("");
  const [replacementReason, setReplacementReason] = useState("Caregiver sick leave / emergency replacement.");

  if (!schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCaregiverName) {
      swiftAlert.error({
        title: "Selection Required",
        description: "Please select a replacement caregiver.",
      });
      return;
    }

    onAssignReplacement(schedule.id, selectedCaregiverName, replacementReason);
    swiftAlert.success({
      title: "Replacement Assigned",
      description: `${selectedCaregiverName} has been assigned to replace ${schedule.caregiverName} for visit ${schedule.id}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Caregiver Replacement Management</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Re-assign an available caregiver for Visit <strong className="font-mono text-foreground">{schedule.id}</strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Current Visit Context */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 text-xs space-y-2">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Patient:</span>
              <span className="font-bold text-foreground">{schedule.patientName}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Date & Shift:</span>
              <span className="font-medium text-foreground">{schedule.date} ({schedule.startTime} - {schedule.endTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unavailable Caregiver:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{schedule.caregiverName}</span>
            </div>
          </div>

          {/* Replacement Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Reason for Replacement</Label>
            <Input
              value={replacementReason}
              onChange={(e) => setReplacementReason(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Replacement Roster */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Select Available Replacement Caregiver</Label>

            <div className="space-y-2">
              {availableReplacements.map((rep) => {
                const isSelected = selectedCaregiverName === rep.name;

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedCaregiverName(rep.name)}
                    className={`rounded-xl border p-3 cursor-pointer text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[#01265D] bg-blue-50/50 dark:bg-blue-950/30 dark:bg-blue-950/40 ring-1 ring-[#01265D]/30"
                        : "bg-card hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{rep.name}</span>
                        <Badge variant="outline" className="text-[9px] py-0">{rep.role}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" /> {rep.distance} · ★ {rep.rating}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-[#01265D] dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedCaregiverName}
              className="h-9 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Assign Replacement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
