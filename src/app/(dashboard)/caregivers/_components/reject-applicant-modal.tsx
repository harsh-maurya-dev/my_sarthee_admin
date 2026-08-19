"use client";

import { useState } from "react";
import { CaregiverRegistrationRequest } from "../_data/caregivers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { XCircle, AlertTriangle, Send, BellRing } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface RejectApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: CaregiverRegistrationRequest | null;
  onConfirmReject: (id: string, reason: string) => void;
}

const COMMON_REJECTION_REASONS = [
  "KYC Documents Unclear or Incomplete",
  "Nursing License Verification Failed",
  "Background Check Non-Compliant",
  "Insufficient Clinical Experience",
  "Ineligible Certifications for Care Role",
  "Duplicate or Invalid Application",
];

export function RejectApplicantModal({
  isOpen,
  onClose,
  applicant,
  onConfirmReject,
}: RejectApplicantModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  if (!applicant) return null;

  const finalReason = customReason.trim() || selectedPreset;

  const handleReject = () => {
    if (!finalReason) {
      swiftAlert.error({
        title: "Rejection Reason Required",
        description: "Please select a standard reason or provide specific feedback for the caregiver.",
      });
      return;
    }

    onConfirmReject(applicant.id, finalReason);
    swiftAlert.error({
      title: "Application Rejected",
      description: `${applicant.fullName}'s registration request has been rejected. Notification sent with reason: "${finalReason}"`,
    });
    setSelectedPreset("");
    setCustomReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
            <XCircle className="h-5 w-5 text-rose-600" />
            Reject Registration Request
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Specify the reason for rejecting <strong className="text-foreground">{applicant.fullName}</strong> ({applicant.id}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Notification Alert Info */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 flex items-start gap-2 text-amber-900 dark:text-amber-300">
            <BellRing className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This reason will be automatically transmitted to the caregiver's mobile application via push notification.
            </p>
          </div>

          {/* Preset Reasons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Select Standard Reason
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REJECTION_REASONS.map((reason) => {
                const isSelected = selectedPreset === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPreset("");
                      } else {
                        setSelectedPreset(reason);
                        if (!customReason) setCustomReason(reason);
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                      isSelected
                        ? "bg-rose-50 border-rose-400 text-rose-700 font-semibold dark:bg-rose-950/60 dark:text-rose-200"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason / Feedback Textarea */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Detailed Rejection Feedback <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              placeholder="Explain what the applicant needs to correct or why the request was rejected..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="text-xs h-24 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleReject}
            disabled={!finalReason}
            className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1 shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Confirm Rejection & Notify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
