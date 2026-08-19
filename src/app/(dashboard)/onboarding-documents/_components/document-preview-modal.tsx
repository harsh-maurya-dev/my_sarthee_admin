"use client";

import {
  KYCDocumentItem,
  TrainingDocumentItem,
} from "../_data/onboarding-documents";
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
  FileText,
  ShieldCheck,
  Smartphone,
  Upload,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycDoc?: KYCDocumentItem | null;
  trainingDoc?: TrainingDocumentItem | null;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  kycDoc,
  trainingDoc,
}: DocumentPreviewModalProps) {
  if (!kycDoc && !trainingDoc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-teal-600" />
              Mobile App Caregiver View Preview
            </DialogTitle>
            <Badge className="bg-teal-600 text-white text-[10px]">
              {kycDoc ? "KYC Document" : "Training SOP"}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            How this document appears to caregivers inside the mobile application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Mobile Preview Frame */}
          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-foreground">MySarthee Caregiver App</span>
              <span className="text-[10px]">Onboarding Flow</span>
            </div>

            {/* If KYC Document */}
            {kycDoc && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xl font-bold border border-sky-200 dark:border-sky-800">
                      {kycDoc.iconType === "id-card" && "🪪"}
                      {kycDoc.iconType === "pan-card" && "💳"}
                      {kycDoc.iconType === "vaccine" && "💉"}
                      {kycDoc.iconType === "police" && "👮"}
                      {kycDoc.iconType === "bank" && "🏛️"}
                      {kycDoc.iconType === "insurance" && "🛡️"}
                      {kycDoc.iconType === "generic" && "📄"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{kycDoc.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {kycDoc.isMandatory ? "Mandatory Document" : "Optional"} · Max {kycDoc.maxSizeMB}MB
                      </p>
                    </div>
                  </div>

                  <div className="h-9 w-9 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-300 flex items-center justify-center shadow-xs">
                    <Upload className="h-4 w-4" />
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {kycDoc.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                  <span>Formats: {kycDoc.allowedFormats.join(", ")}</span>
                  <span className="font-semibold text-teal-600">{kycDoc.verificationMethod}</span>
                </div>
              </div>
            )}

            {/* If Training Document */}
            {trainingDoc && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl font-bold border border-amber-200 dark:border-amber-800">
                      {trainingDoc.iconType === "sanitization" && "🦠"}
                      {trainingDoc.iconType === "vitals" && "🧍"}
                      {trainingDoc.iconType === "emergency" && "🚨"}
                      {trainingDoc.iconType === "medication" && "💊"}
                      {trainingDoc.iconType === "protocol" && "📋"}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{trainingDoc.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-teal-600" />
                        {trainingDoc.estimatedReadingTime} · {trainingDoc.pagesCount} Pages · {trainingDoc.version}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="text-[11px] text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {trainingDoc.description}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-muted-foreground">
                    Roles: {trainingDoc.targetRoles.join(", ")}
                  </span>
                  {trainingDoc.isAssessmentMandatory && (
                    <Badge variant="outline" className="text-[9px] border-teal-400 text-teal-700 bg-teal-50 dark:bg-teal-950">
                      Pass Score: {trainingDoc.passingScorePercent}%
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.info({
                title: "Mobile Push Dispatched",
                description: "Caregivers notified about updated onboarding document guidelines.",
              })
            }
            className="h-8 text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Notify Caregiver App
          </Button>
          <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
