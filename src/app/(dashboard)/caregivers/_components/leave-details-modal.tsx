"use client";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  FileText,
  Check,
  X,
} from "lucide-react";

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: CaregiverLeaveRequest | null;
  onApprove?: (id: string, name: string) => void;
  onOpenReject?: (req: CaregiverLeaveRequest) => void;
  onOpenReassign?: (req: CaregiverLeaveRequest) => void;
}

export function LeaveDetailsModal({
  isOpen,
  onClose,
  leaveRequest,
  onApprove,
  onOpenReject,
  onOpenReassign,
}: LeaveDetailsModalProps) {
  if (!leaveRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 flex items-center justify-center">
                <FileText className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              </div>
              <DialogTitle className="text-base font-bold">
                Leave Request Details
              </DialogTitle>
            </div>
            <Badge
              className={
                leaveRequest.status === "Approved"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
                  : leaveRequest.status === "Rejected"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold"
              }
            >
              {leaveRequest.status === "Approved" && "✓ Approved"}
              {leaveRequest.status === "Rejected" && "✕ Rejected"}
              {leaveRequest.status === "Pending" && "⏳ Pending Review"}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Request #{leaveRequest.id} &bull; Applied on {leaveRequest.appliedOn}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Care Professional Profile */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={leaveRequest.avatar} alt={leaveRequest.caregiverName} />
                <AvatarFallback className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200">
                  {leaveRequest.caregiverName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold text-foreground">{leaveRequest.caregiverName}</p>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mt-0.5">
                  <span className="font-mono">{leaveRequest.caregiverId}</span>
                  <span>&bull;</span>
                  <span className="font-medium text-[#01265D] dark:text-blue-300 dark:text-blue-400">{leaveRequest.role}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1 justify-end">
                <Phone className="h-3 w-3" />
                {leaveRequest.phoneNumber}
              </span>
              <Badge variant="outline" className="text-[10px] mt-1 font-semibold">
                {leaveRequest.leaveType}
              </Badge>
            </div>
          </div>

          {/* Leave Dates & Duration Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl border bg-card">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Start Date</span>
              <p className="text-xs font-bold text-foreground mt-0.5">{leaveRequest.startDate}</p>
            </div>
            <div className="p-2.5 rounded-xl border bg-card">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">End Date</span>
              <p className="text-xs font-bold text-foreground mt-0.5">{leaveRequest.endDate}</p>
            </div>
            <div className="p-2.5 rounded-xl border bg-card">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</span>
              <p className="text-xs font-bold text-[#01265D] dark:text-blue-400 mt-0.5">{leaveRequest.daysCount} Days Total</p>
            </div>
          </div>

          {/* Reason for Leave */}
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Caregiver Reason for Leave
            </span>
            <p className="text-xs text-foreground font-medium italic leading-relaxed">
              &ldquo;{leaveRequest.reason}&rdquo;
            </p>
          </div>

          {/* If Reassigned Replacement Staff */}
          {leaveRequest.reassignedTo && (
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#01265D] dark:text-blue-300 flex items-center gap-1">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Assigned Substitute Staff
                </span>
                <Badge className="bg-[#01265D] text-white text-[9px] font-semibold">Active Replacement</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={leaveRequest.reassignedTo.avatar} alt={leaveRequest.reassignedTo.name} />
                    <AvatarFallback className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200">
                      {leaveRequest.reassignedTo.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold text-foreground">{leaveRequest.reassignedTo.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {leaveRequest.reassignedTo.role} &bull; {leaveRequest.reassignedTo.zone || "Available"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-mono">{leaveRequest.reassignedTo.phone}</span>
                </div>
              </div>

              {leaveRequest.patientCoverageNotes && (
                <div className="pt-1.5 border-t border-blue-200 dark:border-blue-900/50 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Handover Notes: </span>
                  {leaveRequest.patientCoverageNotes}
                </div>
              )}
            </div>
          )}

          {/* If Rejected */}
          {leaveRequest.status === "Rejected" && leaveRequest.rejectionReason && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Admin Rejection Reason
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-medium">
                {leaveRequest.rejectionReason}
              </p>
              {leaveRequest.reviewedBy && (
                <p className="text-[10px] text-muted-foreground pt-1 border-t border-rose-200 dark:border-rose-900/50">
                  Reviewed by {leaveRequest.reviewedBy} at {leaveRequest.reviewedAt}
                </p>
              )}
            </div>
          )}

          {/* If Approved Reviewer info */}
          {leaveRequest.status === "Approved" && leaveRequest.reviewedBy && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span>Approved by: <strong className="text-foreground">{leaveRequest.reviewedBy}</strong></span>
              <span className="font-mono text-[10px]">{leaveRequest.reviewedAt}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
          {leaveRequest.status === "Pending" ? (
            <div className="flex items-center gap-2 w-full justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenReject?.(leaveRequest);
                }}
                className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onApprove?.(leaveRequest.id, leaveRequest.caregiverName);
                  onClose();
                }}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Approve Leave
              </Button>
            </div>
          ) : leaveRequest.status === "Approved" ? (
            <div className="flex items-center justify-between w-full">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onClose();
                  onOpenReassign?.(leaveRequest);
                }}
                className="h-8 text-xs gap-1.5 border-blue-300 dark:border-blue-800 text-[#01265D] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>{leaveRequest.reassignedTo ? "Change Replacement" : "Reassign Another Staff"}</span>
              </Button>
              <Button size="sm" onClick={onClose} className="h-8 text-xs">
                Close
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={onClose} className="h-8 text-xs ml-auto">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
