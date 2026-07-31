"use client";

import { PatientRequirement, CaregiverCandidate } from "../_data/assignments";
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
import { CheckCircle2, Send, Smartphone, Calendar, Clock, MapPin, UserCheck } from "lucide-react";

interface AssignmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: PatientRequirement | null;
  assignedCaregiver: CaregiverCandidate | null;
}

export function AssignmentConfirmationModal({
  isOpen,
  onClose,
  requirement,
  assignedCaregiver,
}: AssignmentConfirmationModalProps) {
  if (!requirement || !assignedCaregiver) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 text-center">
        <DialogHeader className="items-center">
          <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Assignment Confirmed & Dispatched!
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Booking <strong className="font-mono text-foreground">{requirement.id}</strong> has been successfully assigned.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 text-left space-y-3 text-xs my-2">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground font-medium">Assigned Caregiver:</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-teal-600" />
              {assignedCaregiver.name} ({assignedCaregiver.role})
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground font-medium">Patient:</span>
            <span className="font-bold text-foreground">{requirement.patientName}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground font-medium">Shift Slot:</span>
            <span className="font-medium text-foreground">{requirement.scheduleSlot}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Location:</span>
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {requirement.location.address}
            </span>
          </div>
        </div>

        {/* Mobile Dispatch Status Card */}
        <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/30 p-3 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-teal-600" />
              Push Notifications Dispatched
            </span>
            <Badge className="bg-emerald-600 text-white text-[9px]">Delivered</Badge>
          </div>

          <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-4">
            <li>Dispatch alert sent to <strong>{assignedCaregiver.name}&apos;s Caregiver Mobile App</strong>.</li>
            <li>Confirmation notification & caregiver profile shared with <strong>{requirement.patientName}</strong>.</li>
          </ul>
        </div>

        <DialogFooter className="pt-2">
          <Button
            onClick={onClose}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-9 text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
