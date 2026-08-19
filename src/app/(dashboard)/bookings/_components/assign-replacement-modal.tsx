"use client";

import { useState } from "react";
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
import {
  RefreshCw,
  UserCheck,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export interface BookingReplacementRequest {
  id: string;
  bookingId: string;
  bookingCode: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  careType: string;
  locationArea: string;
  shiftSchedule: string;
  currentProfessional: {
    name: string;
    type: string;
    phone: string;
  };
  reason: string;
  urgency: "Critical" | "High" | "Medium";
  requestDate: string;
  status: "Pending Reassignment" | "Replacement Assigned" | "Resolved";
  replacementProfessional?: {
    name: string;
    type: string;
    phone: string;
    assignedAt: string;
  };
  patientNotes?: string;
}

interface AvailableReplacementCandidate {
  id: string;
  name: string;
  type: string;
  phone: string;
  rating: number;
  experience: string;
  area: string;
  matchScore: number;
  skills: string[];
}

const AVAILABLE_REPLACEMENTS: AvailableReplacementCandidate[] = [
  {
    id: "rep-1",
    name: "Dr. Hannah Vance",
    type: "Nurse",
    phone: "+91 98201 23456",
    rating: 4.9,
    experience: "10 Years",
    area: "Andheri / Lokhandwala",
    matchScore: 98,
    skills: ["Post-Stroke Care", "Gait Training", "ICU Telemetry"],
  },
  {
    id: "rep-2",
    name: "Marcus Thorne",
    type: "Caregiver",
    phone: "+91 98765 43210",
    rating: 4.8,
    experience: "6 Years",
    area: "Bandra / Khar",
    matchScore: 95,
    skills: ["Physical Therapy Assistance", "Wound Dressing", "Orthopedic Rehab"],
  },
  {
    id: "rep-3",
    name: "Priya Sharma",
    type: "Nurse",
    phone: "+91 98212 34567",
    rating: 4.9,
    experience: "8 Years",
    area: "Andheri East",
    matchScore: 94,
    skills: ["B.Sc Nursing", "Critical Care", "Vital Monitoring"],
  },
  {
    id: "rep-4",
    name: "Sunita Deshmukh",
    type: "Caregiver",
    phone: "+91 98199 87654",
    rating: 4.8,
    experience: "7 Years",
    area: "Juhu / Vile Parle",
    matchScore: 91,
    skills: ["Dementia Care", "Elderly Assistance", "Gujarati/Hindi Fluent"],
  },
];

interface AssignReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BookingReplacementRequest | null;
  onAssignReplacement: (
    requestId: string,
    replacement: { name: string; type: string; phone: string }
  ) => void;
}

export function AssignReplacementModal({
  isOpen,
  onClose,
  request,
  onAssignReplacement,
}: AssignReplacementModalProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    AVAILABLE_REPLACEMENTS[0].id
  );

  if (!request) return null;

  const handleConfirm = () => {
    const candidate = AVAILABLE_REPLACEMENTS.find((c) => c.id === selectedCandidateId);
    if (!candidate) return;

    onAssignReplacement(request.id, {
      name: candidate.name,
      type: candidate.type,
      phone: candidate.phone,
    });

    swiftAlert.success({
      title: "Replacement Professional Dispatched",
      description: `${candidate.name} (${candidate.type}) has been assigned to ${request.patientName} for booking ${request.bookingCode}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-teal-600 animate-spin-slow" />
              Assign Replacement Professional
            </DialogTitle>
            <Badge
              variant={
                request.urgency === "Critical"
                  ? "destructive"
                  : request.urgency === "High"
                  ? "default"
                  : "outline"
              }
              className="text-[10px] uppercase font-bold"
            >
              {request.urgency} Urgency
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Booking Ref: <strong className="font-mono text-foreground">{request.bookingCode}</strong> · Patient:{" "}
            <strong className="text-foreground">{request.patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Reason Alert Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:bg-rose-950/40 p-3 text-xs space-y-1 text-rose-950 dark:text-rose-200">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>Reason for Replacement Request:</span>
            </div>
            <p className="font-medium pl-5">{request.reason}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-rose-200/60 dark:border-rose-900/60 mt-1 pl-5">
              <span>Prior Staff: <strong className="text-foreground">{request.currentProfessional.name}</strong> ({request.currentProfessional.type})</span>
              <span>Requested on: <strong className="text-foreground">{request.requestDate}</strong></span>
            </div>
          </div>

          {/* Patient Booking Summary Card */}
          <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-3 space-y-1.5 text-xs">
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                <span>Location: <strong className="text-foreground">{request.locationArea}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                <span>Schedule: <strong className="text-foreground">{request.shiftSchedule}</strong></span>
              </div>
            </div>
            {request.patientNotes && (
              <p className="text-[11px] text-muted-foreground pt-1 border-t">
                Special Care Needs: <span className="font-medium text-foreground">{request.patientNotes}</span>
              </p>
            )}
          </div>

          {/* Candidate Selection List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-teal-600" />
              Smart Matched Replacement Candidates
            </h4>

            <div className="space-y-2">
              {AVAILABLE_REPLACEMENTS.map((candidate) => {
                const isSelected = selectedCandidateId === candidate.id;
                return (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-800 bg-card hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-teal-100 text-teal-800 font-bold text-xs">
                        <AvatarFallback>{candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">{candidate.name}</span>
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                            {candidate.type}
                          </Badge>
                          <span className="text-[10px] text-emerald-600 font-bold">
                            {candidate.matchScore}% Match
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{candidate.experience} exp</span>
                          <span>&bull;</span>
                          <span className="flex items-center text-amber-500 font-semibold">
                            <Star className="h-2.5 w-2.5 fill-amber-500 mr-0.5" />
                            {candidate.rating}
                          </span>
                          <span>&bull;</span>
                          <span>{candidate.area}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Confirm & Dispatch Replacement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
