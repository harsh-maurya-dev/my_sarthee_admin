"use client";

import { useState } from "react";
import { PatientComplaint, QualityAlert, PatientFeedback } from "../_data/quality";
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
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
  UserCheck,
  MessageSquare,
  FileText,
  Radio,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface QualityItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "complaint" | "alert" | "feedback";
  data: PatientComplaint | QualityAlert | PatientFeedback | null;
  onResolve: (id: string, notes: string) => void;
}

export function QualityItemModal({
  isOpen,
  onClose,
  type,
  data,
  onResolve,
}: QualityItemModalProps) {
  const [resolutionNotes, setResolutionNotes] = useState("Investigated with caregiver. Corrective guidance issued.");

  if (!data) return null;

  const handleResolveAction = () => {
    onResolve(data.id, resolutionNotes);
    swiftAlert.success({
      title: "Quality Action Recorded",
      description: `Item ${data.id} has been marked as resolved.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {type === "complaint" ? "Investigate Patient Complaint" : type === "alert" ? "Review Quality Alert" : "Patient Feedback Review"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Item ID: <strong className="font-mono text-foreground">{data.id}</strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* COMPLAINT DETAILS */}
          {type === "complaint" && (
            <>
              {/* @ts-ignore */}
              <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-3 space-y-2">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Patient:</span>
                  {/* @ts-ignore */}
                  <strong className="text-foreground">{data.patientName}</strong>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Caregiver:</span>
                  {/* @ts-ignore */}
                  <strong className="text-foreground">{data.caregiverName}</strong>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Category:</span>
                  {/* @ts-ignore */}
                  <Badge variant="outline">{data.issueCategory}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity:</span>
                  {/* @ts-ignore */}
                  <Badge variant={data.severity === "High" ? "destructive" : "default"}>{data.severity}</Badge>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-muted-foreground">Complaint Description:</span>
                {/* @ts-ignore */}
                <p className="bg-card p-3 rounded-xl border text-foreground leading-relaxed">{data.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <Label className="text-xs font-semibold">Resolution / Audit Action Notes</Label>
                <Input
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </>
          )}

          {/* ALERT DETAILS */}
          {type === "alert" && (
            <>
              <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 p-3 space-y-2">
                <div className="flex justify-between border-b pb-1.5 border-amber-200/50">
                  <span className="text-muted-foreground">Alert Type:</span>
                  {/* @ts-ignore */}
                  <strong className="text-amber-800 dark:text-amber-300 font-bold">{data.alertType}</strong>
                </div>
                <div className="flex justify-between border-b pb-1.5 border-amber-200/50">
                  <span className="text-muted-foreground">Caregiver:</span>
                  {/* @ts-ignore */}
                  <strong className="text-foreground">{data.caregiverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  {/* @ts-ignore */}
                  <span className="font-mono text-foreground">{data.timestamp}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-muted-foreground">System Audit Log:</span>
                {/* @ts-ignore */}
                <p className="bg-card p-3 rounded-xl border text-foreground">{data.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <Label className="text-xs font-semibold">Resolution Action</Label>
                <Input
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </>
          )}

          {/* FEEDBACK DETAILS */}
          {type === "feedback" && (
            <>
              <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Patient:</span>
                  {/* @ts-ignore */}
                  <strong className="text-foreground">{data.patientName}</strong>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Caregiver:</span>
                  {/* @ts-ignore */}
                  <strong className="text-foreground">{data.caregiverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Star Rating:</span>
                  <div className="flex items-center text-amber-500 font-bold">
                    {/* @ts-ignore */}
                    <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {data.rating} / 5 Stars
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-muted-foreground">Patient Review Narrative:</span>
                {/* @ts-ignore */}
                <p className="bg-card p-3 rounded-xl border text-foreground italic">&quot;{data.feedbackText}&quot;</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>
          {type !== "feedback" && (
            <Button
              type="button"
              size="sm"
              onClick={handleResolveAction}
              className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark Resolved
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
