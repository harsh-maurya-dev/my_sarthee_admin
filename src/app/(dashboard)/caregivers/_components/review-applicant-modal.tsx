"use client";

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
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReviewApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: CaregiverRegistrationRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewApplicantModal({
  isOpen,
  onClose,
  applicant,
  onApprove,
  onReject,
}: ReviewApplicantModalProps) {
  if (!applicant) return null;

  const handleApprove = () => {
    onApprove(applicant.id);
    swiftAlert.success({
      title: "Application Approved",
      description: `${applicant.fullName} has been approved and added to the active caregiver roster.`,
    });
    onClose();
  };

  const handleReject = () => {
    onReject(applicant.id);
    swiftAlert.error({
      title: "Application Rejected",
      description: `${applicant.fullName}'s registration request has been rejected.`,
    });
    onClose();
  };

  const allKycPassed =
    applicant.kycDetails.idProof &&
    applicant.kycDetails.nursingLicense &&
    applicant.kycDetails.backgroundCheck;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-teal-600" />
                Review Caregiver Application
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Application <strong className="font-mono text-foreground">{applicant.id}</strong> · Submitted on{" "}
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
              className="text-xs px-2.5 py-0.5"
            >
              {applicant.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Applicant Profile Card */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-base dark:bg-teal-950 dark:text-teal-300">
                {applicant.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{applicant.fullName}</h3>
                <p className="text-xs text-muted-foreground">
                  @{applicant.username} · {applicant.age}y · {applicant.gender}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-foreground">{applicant.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate text-foreground">{applicant.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>DOB: <strong className="text-foreground">{applicant.dateOfBirth}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                <span>Experience: <strong className="text-foreground">{applicant.experience}</strong></span>
              </div>
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-teal-600" />
              Skills & Professional Certifications
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {applicant.skills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
                  {skill}
                </Badge>
              ))}
            </div>

            <ul className="list-disc list-inside text-xs text-foreground space-y-0.5 pl-1 pt-1 border-t">
              {applicant.certifications.map((cert, idx) => (
                <li key={idx} className="font-medium">{cert}</li>
              ))}
            </ul>
          </div>

          {/* KYC Verification Section */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                KYC Document Verification
              </h4>
              {allKycPassed ? (
                <Badge className="bg-emerald-600 text-white text-[10px]">All Verified</Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px]">Incomplete</Badge>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground">Government ID Proof</span>
                  <p className="text-[11px] text-foreground font-medium mt-0.5">{applicant.idProofDocumentUrl}</p>
                </div>
                {applicant.kycDetails.idProof ? (
                  <span className="font-semibold flex items-center gap-1 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </span>
                ) : (
                  <span className="font-semibold flex items-center gap-1 text-rose-600 shrink-0">
                    <XCircle className="h-4 w-4" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground">Nursing / Care License</span>
                  <p className="text-[11px] text-foreground font-medium mt-0.5">{applicant.licenseDocumentUrl}</p>
                </div>
                {applicant.kycDetails.nursingLicense ? (
                  <span className="font-semibold flex items-center gap-1 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </span>
                ) : (
                  <span className="font-semibold flex items-center gap-1 text-rose-600 shrink-0">
                    <XCircle className="h-4 w-4" /> Missing
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                <div>
                  <span className="text-muted-foreground">Background Check Status</span>
                </div>
                {applicant.backgroundCheckStatus === "Passed" ? (
                  <span className="font-semibold flex items-center gap-1 text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> Passed
                  </span>
                ) : applicant.backgroundCheckStatus === "Pending" ? (
                  <span className="font-semibold flex items-center gap-1 text-amber-600 shrink-0">
                    <Clock className="h-4 w-4" /> Pending
                  </span>
                ) : (
                  <span className="font-semibold flex items-center gap-1 text-rose-600 shrink-0">
                    <XCircle className="h-4 w-4" /> Failed
                  </span>
                )}
              </div>
            </div>
          </div>

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
                <span className="font-semibold text-rose-700 dark:text-rose-300">KYC Incomplete:</span>
                <p className="text-muted-foreground mt-0.5">Some verification documents are missing or pending. Approving this application will bypass incomplete checks.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={applicant.status === "Rejected"}
            className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
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
            Approve & Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
