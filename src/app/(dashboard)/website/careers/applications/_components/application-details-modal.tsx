"use client";

import { useState } from "react";
import { JobApplication } from "../_data/applications";
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
import { Textarea } from "@/components/ui/textarea";
import {
  FileUser,
  Download,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
  onShortlist: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function ApplicationDetailsModal({
  isOpen,
  onClose,
  application,
  onShortlist,
  onReject,
}: ApplicationDetailsModalProps) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!application) return null;

  const handleDownloadResume = () => {
    swiftAlert.success({
      title: "Resume Downloaded",
      description: `Downloaded ${application.candidateName}'s CV document (PDF).`,
    });
  };

  const handleShortlistClick = () => {
    onShortlist(application.id);
    swiftAlert.success({
      title: "Applicant Shortlisted",
      description: `${application.candidateName} has been moved to Shortlisted status.`,
    });
    onClose();
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      swiftAlert.error({
        title: "Reason Required",
        description: "Please enter a reason when rejecting an applicant request.",
      });
      return;
    }

    onReject(application.id, rejectionReason);
    swiftAlert.info({
      title: "Application Rejected",
      description: `Application for ${application.candidateName} rejected. Reason: "${rejectionReason}".`,
    });
    setShowRejectInput(false);
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileUser className="h-5 w-5 text-teal-600" />
                Job Candidate Application Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Application ID: <strong className="font-mono text-foreground">{application.id}</strong> · Applied:{" "}
                <strong className="text-foreground">{application.appliedDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                application.status === "Shortlisted"
                  ? "default"
                  : application.status === "Rejected"
                  ? "destructive"
                  : "outline"
              }
              className="text-xs font-bold"
            >
              {application.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Candidate Card */}
          <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
            <h3 className="font-extrabold text-base text-foreground">{application.candidateName}</h3>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> Applied Position: {application.appliedJobTitle}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-500" /> {application.phone}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-500" /> {application.email}
              </span>
            </div>
          </div>

          {/* Qualification Details */}
          <div className="rounded-xl border p-4 bg-card space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-teal-600" /> Candidate Qualification & Experience
            </span>
            <p className="text-foreground font-medium leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
              {application.qualification}
            </p>
          </div>

          {/* Uploaded Resume Section */}
          <div className="rounded-xl border p-4 bg-card flex items-center justify-between">
            <div>
              <span className="font-bold text-foreground block">Uploaded Candidate Resume (CV)</span>
              <span className="text-[10px] text-muted-foreground font-mono">resume_{application.candidateName.toLowerCase().replace(/\s+/g, "_")}.pdf</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadResume}
              className="h-9 text-xs gap-1.5 border-teal-200 text-teal-700 dark:text-teal-400"
            >
              <Download className="h-3.5 w-3.5" />
              Download Resume
            </Button>
          </div>

          {/* Rejection Reason Display / Prompt */}
          {application.status === "Rejected" && application.rejectionReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 p-3 text-xs space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400 block">Rejection Reason:</span>
              <p className="text-rose-600 dark:text-rose-300">{application.rejectionReason}</p>
            </div>
          )}

          {showRejectInput && (
            <div className="rounded-xl border border-rose-300 bg-rose-50/70 dark:bg-rose-950/40 p-4 space-y-3">
              <Label className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                Reason to Reject Application *
              </Label>
              <Textarea
                placeholder="State specific reason for candidate rejection (e.g., Insufficient clinical home care experience)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-20 text-xs w-full resize-none border-rose-300"
                required
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectInput(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleRejectConfirm}
                  className="h-8 text-xs bg-rose-600 text-white hover:bg-rose-700 font-bold"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>

          {!showRejectInput && (
            <div className="flex items-center gap-2">
              {application.status !== "Shortlisted" && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleShortlistClick}
                  className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Shortlist
                </Button>
              )}

              {application.status !== "Rejected" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectInput(true)}
                  className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Application
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
