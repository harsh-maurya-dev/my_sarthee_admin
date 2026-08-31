"use client";

import { useState, useEffect } from "react";
import { CaregiverLeaveRequest } from "../_data/leave-requests";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, Calendar, User } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface RejectLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: CaregiverLeaveRequest | null;
  onConfirmReject: (id: string, rejectionReason: string) => void;
}

const quickReasons = [
  "Critical assigned patient shift on selected dates with no cover",
  "Insufficient advance notice provided as per roster policy (<48h)",
  "Multiple professionals on leave in the same zone on these dates",
  "High emergency care demand / peak weekend coverage required",
];

export function RejectLeaveModal({
  isOpen,
  onClose,
  leaveRequest,
  onConfirmReject,
}: RejectLeaveModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRejectionReason("");
    }
  }, [isOpen]);

  if (!leaveRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      swiftAlert.error({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this leave request.",
      });
      return;
    }

    onConfirmReject(leaveRequest.id, rejectionReason.trim());
    swiftAlert.error({
      title: "Leave Request Rejected",
      description: `Leave request for ${leaveRequest.caregiverName} has been rejected.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-rose-600" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Reject Leave Request
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide a mandatory rejection reason to inform the care professional.
          </DialogDescription>
        </DialogHeader>

        {/* Leave Request Summary Card */}
        <div className="rounded-xl border bg-slate-50/70 dark:bg-slate-900/50 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span className="font-bold text-foreground">{leaveRequest.caregiverName}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                {leaveRequest.role}
              </Badge>
            </div>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px]">
              {leaveRequest.leaveType}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {leaveRequest.startDate} to {leaveRequest.endDate} ({leaveRequest.daysCount} days)
            </span>
          </div>

          <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-foreground">Applied Reason: </span>
            <span className="text-muted-foreground italic">&ldquo;{leaveRequest.reason}&rdquo;</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="rejectionReason" className="text-xs font-semibold">
              Admin Rejection Reason <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Explain why this leave cannot be approved at this time..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="text-xs min-h-[90px]"
              required
            />
          </div>

          {/* Quick Reason Suggestions */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickReasons.map((r, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRejectionReason(r)}
                  className="text-[10px] text-left bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md transition-colors"
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 font-semibold"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
