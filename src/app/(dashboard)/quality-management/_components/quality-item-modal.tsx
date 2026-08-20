"use client";

import { useState } from "react";
import { PatientFeedback, CaregiverRatingItem } from "../_data/quality";
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
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  HeartPulse,
  Award,
  UserCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface QualityItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "feedback" | "caregiver";
  data: PatientFeedback | CaregiverRatingItem | null;
  onResolve?: (id: string, notes: string) => void;
}

export function QualityItemModal({
  isOpen,
  onClose,
  type,
  data,
  onResolve,
}: QualityItemModalProps) {
  const [qaNotes, setQaNotes] = useState("Audited by QA supervisor. Quality benchmark standard met.");

  if (!data) return null;

  const handleSaveAction = () => {
    if (onResolve) {
      const id = "id" in data ? data.id : data.caregiverId;
      onResolve(id, qaNotes);
    }
    swiftAlert.success({
      title: "Quality Review Recorded",
      description: `QA record updated for ${"patientName" in data ? data.patientName : data.caregiverName}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {type === "feedback" ? "Patient Feedback Review & Audit" : "Caregiver Quality & Performance Audit"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {"id" in data ? `Feedback Ref: ${data.id} • ${data.date}` : `Caregiver ID: ${data.caregiverId}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* FEEDBACK DETAILS */}
          {type === "feedback" && "feedbackText" in data && (
            <>
              <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3.5 space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Patient:</span>
                  <strong className="text-foreground font-semibold text-xs">{data.patientName}</strong>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Caregiver:</span>
                  <strong className="text-foreground font-semibold text-xs">{data.caregiverName}</strong>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Service Type:</span>
                  <span className="font-medium text-foreground">{data.serviceType}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline" className="text-[10px]">{data.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{data.rating} / 5.0 Stars</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-foreground">Patient Review Narrative:</span>
                <p className="bg-card p-3 rounded-xl border text-foreground italic leading-relaxed text-xs">
                  &quot;{data.feedbackText}&quot;
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <Label className="text-xs font-semibold">QA Supervisor Remarks</Label>
                <Input
                  value={qaNotes}
                  onChange={(e) => setQaNotes(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Enter audit remarks or follow-up notes..."
                />
              </div>
            </>
          )}

          {/* CAREGIVER QUALITY DETAILS */}
          {type === "caregiver" && "caregiverId" in data && (
            <>
              <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3.5 space-y-2.5">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <strong className="text-foreground font-bold text-sm block">{data.caregiverName}</strong>
                    <span className="text-[10px] text-muted-foreground">{data.caregiverId} • {data.role}</span>
                  </div>
                  <Badge
                    variant={data.qualityStatus === "Excellent" ? "default" : "outline"}
                    className={`text-[10px] font-bold ${
                      data.qualityStatus === "Needs Improvement" ? "border-amber-500 text-amber-600 bg-amber-50" : ""
                    }`}
                  >
                    {data.qualityStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-lg bg-card p-2.5 border">
                    <p className="text-[10px] text-muted-foreground">Average Rating</p>
                    <p className="text-base font-extrabold text-amber-500 flex items-center gap-1 mt-0.5">
                      <Star className="h-4 w-4 fill-amber-500" /> {data.averageRating.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Based on {data.totalReviewsCount} reviews</p>
                  </div>

                  <div className="rounded-lg bg-card p-2.5 border">
                    <p className="text-[10px] text-muted-foreground">5-Star Ratio</p>
                    <p className="text-base font-extrabold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Award className="h-4 w-4" /> {data.fiveStarPercentage}%
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Satisfaction: {data.satisfactionScore}%</p>
                  </div>

                  <div className="rounded-lg bg-card p-2.5 border">
                    <p className="text-[10px] text-muted-foreground">Punctuality Score</p>
                    <p className="text-base font-extrabold text-teal-600 flex items-center gap-1 mt-0.5">
                      <Clock className="h-4 w-4" /> {data.punctualityRate}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">On-time check-in</p>
                  </div>

                  <div className="rounded-lg bg-card p-2.5 border">
                    <p className="text-[10px] text-muted-foreground">Shifts Completed</p>
                    <p className="text-base font-extrabold text-foreground flex items-center gap-1 mt-0.5">
                      <UserCheck className="h-4 w-4 text-teal-600" /> {data.totalShiftsCompleted}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Total assignments</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="font-bold text-muted-foreground mb-1.5">Key Strengths & Clinical Attributes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.strengths.map((str, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        <Sparkles className="h-2.5 w-2.5 mr-1" />
                        {str}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold">Audit Feedback & Recognition Notes</Label>
                <Input
                  value={qaNotes}
                  onChange={(e) => setQaNotes(e.target.value)}
                  className="h-9 text-xs"
                  placeholder="Add quality commendation or coaching note..."
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAction}
            className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Save Audit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
