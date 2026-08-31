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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  FileText,
  Clock,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  BellRing,
  Check,
  Send,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReviewApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: CaregiverRegistrationRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const COMMON_REJECTION_REASONS = [
  "KYC Documents Unclear or Incomplete",
  "Nursing License Verification Failed",
  "Background Check Non-Compliant",
  "Insufficient Clinical Experience",
  "Ineligible Certifications for Care Role",
  "Duplicate or Invalid Application",
];

export function ReviewApplicantModal({
  isOpen,
  onClose,
  applicant,
  onApprove,
  onReject,
}: ReviewApplicantModalProps) {
  const [kycVerifiedMap, setKycVerifiedMap] = useState<Record<string, boolean>>({});
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  if (!applicant) return null;

  const idVerified = kycVerifiedMap[`${applicant.id}-id`] ?? applicant.kycDetails.idProof;
  const licenseVerified = kycVerifiedMap[`${applicant.id}-license`] ?? applicant.kycDetails.nursingLicense;
  const bgVerified = kycVerifiedMap[`${applicant.id}-bg`] ?? (applicant.backgroundCheckStatus === "Passed");

  const toggleKyc = (key: string, currentVal: boolean) => {
    setKycVerifiedMap((prev) => ({
      ...prev,
      [`${applicant.id}-${key}`]: !currentVal,
    }));
    swiftAlert.info({
      title: "KYC Status Updated",
      description: `Document verification status has been updated.`,
    });
  };

  const allKycPassed = idVerified && licenseVerified && bgVerified;

  const handleApprove = () => {
    onApprove(applicant.id);
    swiftAlert.success({
      title: "Application Approved & Caregiver Notified",
      description: `${applicant.fullName} has been approved. A push notification & welcome SMS have been sent to their mobile application.`,
    });
    onClose();
  };

  const finalRejectReason = customReason.trim() || selectedPreset;

  const handleConfirmReject = () => {
    if (!finalRejectReason) {
      swiftAlert.error({
        title: "Rejection Reason Required",
        description: "Please select a standard reason or enter detailed feedback.",
      });
      return;
    }

    onReject(applicant.id, finalRejectReason);
    swiftAlert.error({
      title: "Application Rejected & Caregiver Notified",
      description: `${applicant.fullName}'s application was rejected with reason: "${finalRejectReason}". Caregiver notified via mobile application.`,
    });
    setIsRejecting(false);
    setSelectedPreset("");
    setCustomReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Review Caregiver Registration Request
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Submitted via Mobile Application · Ref: <strong className="font-mono text-foreground">{applicant.id}</strong> · Applied:{" "}
                <strong className="text-foreground">{applicant.appliedDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                applicant.status === "Approved"
                  ? "default"
                  : applicant.status === "Rejected"
                  ? "destructive"
                  : "outline"
              }
              className={`text-xs px-2.5 py-0.5 ${
                applicant.status === "Approved"
                  ? "bg-emerald-600 text-white"
                  : applicant.status === "Pending Review"
                  ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold"
                  : ""
              }`}
            >
              {applicant.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Rejection Reason Notice if already rejected */}
          {applicant.status === "Rejected" && applicant.rejectionReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 p-3.5 text-xs text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-700 dark:text-rose-300">
                <XCircle className="h-4 w-4 shrink-0" />
                Application Rejection Reason:
              </div>
              <p className="font-medium bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
                {applicant.rejectionReason}
              </p>
            </div>
          )}

          {/* Mobile App Notification Notification Banner */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 dark:bg-blue-950/30 dark:border-blue-800 p-3 text-xs flex items-center gap-2.5 text-[#01265D] dark:text-blue-100 dark:text-blue-300">
            <BellRing className="h-4 w-4 text-[#01265D] dark:text-blue-400 shrink-0" />
            <p>
              <strong>Live Notification Sync:</strong> Actions taken on this request automatically notify the caregiver through the mobile application.
            </p>
          </div>

          {/* Applicant Profile Card - Profile Management */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 font-bold flex items-center justify-center text-base dark:bg-blue-950 dark:text-blue-300 shadow-xs">
                  {applicant.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    {applicant.fullName}
                    <Badge variant="outline" className="text-[10px] font-mono">
                      @{applicant.username}
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {applicant.gender} · {applicant.age} Years Old · DOB: <span className="font-semibold text-foreground">{applicant.dateOfBirth}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span className="font-mono text-foreground font-medium">{applicant.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span className="truncate text-foreground font-medium">{applicant.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Date of Birth: <strong className="text-foreground">{applicant.dateOfBirth}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                <span>Experience: <strong className="text-foreground">{applicant.experience}</strong></span>
              </div>
            </div>
          </div>

          {/* Skills & Certifications Section */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              Clinical Skills & Professional Certifications
            </h4>

            <div>
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Registered Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {applicant.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-100 border-blue-200 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Certifications & Licenses:</span>
              <ul className="space-y-1 pl-1">
                {applicant.certifications.map((cert, idx) => (
                  <li key={idx} className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KYC Verification Section */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                KYC Document Verification Checklist
              </h4>
              {allKycPassed ? (
                <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> All Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px] font-semibold">
                  Action Required
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* Document 1: ID Proof */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground font-medium">Government ID Proof</span>
                  <p className="text-[11px] text-foreground font-semibold mt-0.5">{applicant.idProofDocumentUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] gap-1"
                    onClick={() =>
                      swiftAlert.info({
                        title: "Document Inspector",
                        description: `Inspecting ${applicant.idProofDocumentUrl} for ${applicant.fullName}.`,
                      })
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View Document</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={idVerified ? "default" : "outline"}
                    onClick={() => toggleKyc("id", idVerified)}
                    className={`h-7 text-[11px] font-semibold ${
                      idVerified ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-slate-600 border-dashed"
                    }`}
                  >
                    {idVerified ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : null}
                    {idVerified ? "Verified" : "Mark Verified"}
                  </Button>
                </div>
              </div>

              {/* Document 2: Nursing / Care License */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground font-medium">Nursing / Care License Document</span>
                  <p className="text-[11px] text-foreground font-semibold mt-0.5">{applicant.licenseDocumentUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] gap-1"
                    onClick={() =>
                      swiftAlert.info({
                        title: "License Inspector",
                        description: `Inspecting license document: ${applicant.licenseDocumentUrl}.`,
                      })
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View License</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={licenseVerified ? "default" : "outline"}
                    onClick={() => toggleKyc("license", licenseVerified)}
                    className={`h-7 text-[11px] font-semibold ${
                      licenseVerified ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-slate-600 border-dashed"
                    }`}
                  >
                    {licenseVerified ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : null}
                    {licenseVerified ? "Verified" : "Mark Verified"}
                  </Button>
                </div>
              </div>

              {/* Document 3: Background Check */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground font-medium">Criminal & Police Background Verification</span>
                  <p className="text-[11px] text-foreground font-semibold mt-0.5">
                    State Registry Status: {bgVerified ? "Clear / Passed" : "Pending Check"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={bgVerified ? "default" : "outline"}
                    onClick={() => toggleKyc("bg", bgVerified)}
                    className={`h-7 text-[11px] font-semibold ${
                      bgVerified ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-slate-600 border-dashed"
                    }`}
                  >
                    {bgVerified ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : null}
                    {bgVerified ? "Passed" : "Mark Passed"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* In-Modal Rejection Form Section when admin initiates rejection */}
          {isRejecting && (
            <div className="rounded-xl border border-rose-300 bg-rose-50/70 dark:bg-rose-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  Specify Rejection Reason (Sent to Caregiver App)
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsRejecting(false)}
                  className="h-6 text-[11px] text-slate-500 hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground">Standard Reasons:</Label>
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
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-rose-600 text-white border-rose-600 font-semibold"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {reason}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-foreground">
                  Detailed Feedback / Reason <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  placeholder="Type the specific reason why this caregiver application is being rejected..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="text-xs h-20 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmReject}
                  disabled={!finalRejectReason}
                  className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold gap-1 shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  Confirm & Send Rejection
                </Button>
              </div>
            </div>
          )}

          {/* Notes */}
          {applicant.notes && (
            <div className="rounded-xl border p-3 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-xs">
              <span className="flex items-center gap-1 text-amber-800 dark:text-amber-300 font-semibold mb-1">
                <FileText className="h-3.5 w-3.5" /> Application Notes:
              </span>
              <p className="text-muted-foreground">{applicant.notes}</p>
            </div>
          )}

          {!allKycPassed && (
            <div className="rounded-xl border p-3 bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-700 dark:text-rose-300">Incomplete KYC:</span>
                <p className="text-muted-foreground mt-0.5">
                  Some documents or background checks have not yet been marked verified. Approving will bypass remaining checks.
                </p>
              </div>
            </div>
          )}
        </div>

        {!isRejecting && (
          <DialogFooter className="border-t pt-4 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRejecting(true)}
              disabled={applicant.status === "Rejected"}
              className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Reject Application
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApprove}
              disabled={applicant.status === "Approved"}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Approve & Register Caregiver
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
