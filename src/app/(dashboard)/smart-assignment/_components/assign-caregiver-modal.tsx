"use client";

import { useState } from "react";
import { PatientRequirement, CaregiverCandidate, caregiverCandidatesPool } from "../_data/assignments";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  UserCheck,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AssignCaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: PatientRequirement | null;
  onConfirmAssignment: (req: PatientRequirement, caregiver: CaregiverCandidate) => void;
}

export function AssignCaregiverModal({
  isOpen,
  onClose,
  requirement,
  onConfirmAssignment,
}: AssignCaregiverModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CaregiverCandidate | null>(null);

  if (!requirement) return null;

  const candidates: CaregiverCandidate[] = caregiverCandidatesPool[requirement.id] || [
    {
      id: "CG-101",
      name: "Dr. Sarah Jenkins",
      role: "Nurse",
      gender: "Female",
      age: 32,
      rating: 4.9,
      experience: "6 Years Clinical Care",
      experienceYears: 6,
      skills: requirement.preferences.requiredSkills,
      location: "Downtown (1.5 miles away)",
      distanceMiles: 1.5,
      availability: "Available",
      matchScore: 94,
      matchedReasons: ["Primary Skills Matched", "Available in Slot", "Proximity 1.5 miles"],
      languages: ["English"],
      phoneNumber: "+1 (555) 892-1123",
    },
  ];

  const handleSelectCaregiver = (candidate: CaregiverCandidate) => {
    setSelectedCandidate(candidate);
  };

  const handleSubmitAssignment = () => {
    if (!selectedCandidate) {
      swiftAlert.error({
        title: "No Caregiver Selected",
        description: "Please select a candidate to assign to this care request.",
      });
      return;
    }

    onConfirmAssignment(requirement, selectedCandidate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                AI Smart Caregiver Match & Assignment
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Matching best suited <strong className="text-foreground">{requirement.requestedRole}</strong> for{" "}
                <strong className="text-foreground">{requirement.patientName}</strong> ({requirement.id})
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-100 border-blue-300 dark:border-blue-800 font-bold text-xs">
              {candidates.length} Recommended Matches
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Patient Quick Context */}
          <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/40 p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-muted-foreground font-medium">Condition:</span>{" "}
              <strong className="text-foreground">{requirement.condition}</strong>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Shift:</span>{" "}
              <strong className="text-foreground">{requirement.scheduleSlot}</strong>
            </div>
          </div>

          {/* Candidate List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Candidate Roster (Sorted by Match Score)
            </h4>

            {candidates.map((candidate) => {
              const isSelected = selectedCandidate?.id === candidate.id;

              return (
                <div
                  key={candidate.id}
                  onClick={() => handleSelectCaregiver(candidate)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "border-[#01265D] bg-blue-50 dark:bg-blue-950/40/40 dark:bg-blue-950/30 ring-2 ring-[#01265D]/30 shadow-md"
                      : "bg-card hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 border shadow-xs">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback className="bg-[#01265D] text-white font-bold text-xs">
                          {candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{candidate.name}</h4>
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            {candidate.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {candidate.gender} · {candidate.age} yrs · {candidate.experience}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[#01265D] dark:text-blue-400 font-extrabold text-lg">
                        <TrendingUp className="h-4 w-4" />
                        <span>{candidate.matchScore}%</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Match Score
                      </span>
                    </div>
                  </div>

                  {/* Skills & Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="text-foreground">{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="font-bold text-foreground">{candidate.rating.toFixed(1)} Rating</span>
                    </div>
                  </div>

                  {/* Matched Highlights */}
                  <div className="rounded-xl bg-slate-100/70 dark:bg-slate-900/60 p-2.5 space-y-1">
                    <span className="text-[11px] font-bold text-[#01265D] dark:text-blue-100 dark:text-blue-300 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                      Why Smart Match Recommended:
                    </span>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground pl-4 list-disc">
                      {candidate.matchedReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmitAssignment}
            disabled={!selectedCandidate}
            className="h-9 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1.5 shadow-xs"
          >
            <UserCheck className="h-4 w-4" />
            <span>Confirm & Dispatch Assignment</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
