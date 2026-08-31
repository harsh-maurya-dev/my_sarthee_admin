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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, MapPin, UserCheck } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule: (newSchedule: VisitSchedule) => void;
}

export function CreateScheduleModal({
  isOpen,
  onClose,
  onAddSchedule,
}: CreateScheduleModalProps) {
  const [patientName, setPatientName] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [service, setService] = useState("Essential Care");
  const [caregiverName, setCaregiverName] = useState("Dr. Sarah Jenkins");
  const [caregiverRole, setCaregiverRole] = useState<"Nurse" | "Caregiver" | "Physiotherapist">("Nurse");
  const [date, setDate] = useState("2026-08-31");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [repeatFrequency, setRepeatFrequency] = useState<"Single Visit" | "Daily" | "Mon-Wed-Fri" | "Weekly">("Daily");
  const [tasksInput, setTasksInput] = useState("Vitals Check, Medication Administration, Hygiene Care");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !patientAddress) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter Patient Name and Address.",
      });
      return;
    }

    const newSchedule: VisitSchedule = {
      id: `VS-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: `BK-${Math.floor(9000 + Math.random() * 999)}`,
      patientName,
      patientAddress,
      patientPhone: patientPhone || "+91 98200 11223",
      caregiverId: `CG-${Math.floor(100 + Math.random() * 90)}`,
      caregiverName,
      caregiverRole,
      service,
      date,
      startTime,
      endTime,
      timeSlotFormatted: `${startTime.replace(":00", "")}–${endTime.replace(":00", "")}`,
      repeatFrequency,
      tasks: tasksInput.split(",").map((t) => t.trim()).filter(Boolean),
      status: "Confirmed",
    };

    onAddSchedule(newSchedule);
    swiftAlert.success({
      title: "Visit Scheduled",
      description: `New visit schedule created for ${patientName} on ${date}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#01265D]" />
            Schedule Caregiver Visit
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create duty shift schedule & care tasks for assigned caregiver.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Patient Details */}
          <div className="space-y-3 border-b pb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Patient Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Patient Name *</Label>
                <Input
                  placeholder="e.g. Robert Vance"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Phone</Label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Home Address *</Label>
              <Input
                placeholder="Full address (e.g. 742 Evergreen Terrace)"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Caregiver Selection */}
          <div className="space-y-3 border-b pb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned Caregiver</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Caregiver Name</Label>
                <Input
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role</Label>
                <Select value={caregiverRole} onValueChange={(val: any) => setCaregiverRole(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Caregiver">Caregiver</SelectItem>
                    <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule Timing & Frequency */}
          <div className="space-y-3 border-b pb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shift Timing</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Visit Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  placeholder="09:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  placeholder="01:00 PM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Repeat Frequency</Label>
              <Select value={repeatFrequency} onValueChange={(val: any) => setRepeatFrequency(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Visit">Single Visit</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Mon-Wed-Fri">Mon - Wed - Fri</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Care Tasks */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Planned Care Tasks (Comma-separated)</Label>
            <Input
              placeholder="Vitals Check, Medication Administration, Dressing Change"
              value={tasksInput}
              onChange={(e) => setTasksInput(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold">
              Create Visit Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
