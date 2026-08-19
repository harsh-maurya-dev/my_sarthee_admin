"use client";

import { useState, useEffect } from "react";
import { TrainingDocumentItem } from "../_data/onboarding-documents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Save,
  BookOpen,
  FileText,
  Clock,
  Award,
  CheckCircle2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: TrainingDocumentItem | null;
  onSave: (doc: TrainingDocumentItem) => void;
}

export function AddEditTrainingModal({
  isOpen,
  onClose,
  documentToEdit,
  onSave,
}: AddEditTrainingModalProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState<TrainingDocumentItem["category"]>("Hygiene & Sanitization");
  const [iconType, setIconType] = useState<TrainingDocumentItem["iconType"]>("sanitization");
  const [targetRoles, setTargetRoles] = useState<("Nurse" | "Caregiver" | "Physiotherapist")[]>([
    "Nurse",
    "Caregiver",
  ]);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState("15 mins");
  const [pagesCount, setPagesCount] = useState(8);
  const [isAssessmentMandatory, setIsAssessmentMandatory] = useState(true);
  const [passingScorePercent, setPassingScorePercent] = useState(80);
  const [documentFileUrl, setDocumentFileUrl] = useState("");
  const [fileFormat, setFileFormat] = useState<TrainingDocumentItem["fileFormat"]>("PDF");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState<TrainingDocumentItem["status"]>("Active");

  useEffect(() => {
    if (documentToEdit) {
      setTitle(documentToEdit.title);
      setCode(documentToEdit.code);
      setCategory(documentToEdit.category);
      setIconType(documentToEdit.iconType);
      setTargetRoles(documentToEdit.targetRoles);
      setEstimatedReadingTime(documentToEdit.estimatedReadingTime);
      setPagesCount(documentToEdit.pagesCount);
      setIsAssessmentMandatory(documentToEdit.isAssessmentMandatory);
      setPassingScorePercent(documentToEdit.passingScorePercent || 80);
      setDocumentFileUrl(documentToEdit.documentFileUrl);
      setFileFormat(documentToEdit.fileFormat);
      setDescription(documentToEdit.description);
      setVersion(documentToEdit.version);
      setStatus(documentToEdit.status);
    } else {
      setTitle("");
      setCode("");
      setCategory("Hygiene & Sanitization");
      setIconType("sanitization");
      setTargetRoles(["Nurse", "Caregiver", "Physiotherapist"]);
      setEstimatedReadingTime("15 mins");
      setPagesCount(8);
      setIsAssessmentMandatory(true);
      setPassingScorePercent(80);
      setDocumentFileUrl("");
      setFileFormat("PDF");
      setDescription("");
      setVersion("v1.0");
      setStatus("Active");
    }
  }, [documentToEdit, isOpen]);

  const toggleRole = (role: "Nurse" | "Caregiver" | "Physiotherapist") => {
    if (targetRoles.includes(role)) {
      if (targetRoles.length > 1) {
        setTargetRoles(targetRoles.filter((r) => r !== role));
      }
    } else {
      setTargetRoles([...targetRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      swiftAlert.error({
        title: "Protocol Title Required",
        description: "Please enter a title for the training document.",
      });
      return;
    }

    const newDoc: TrainingDocumentItem = {
      id: documentToEdit ? documentToEdit.id : `TRN-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      code: code.trim() || title.toUpperCase().replace(/\s+/g, "_"),
      category,
      iconType,
      targetRoles,
      estimatedReadingTime,
      pagesCount: Number(pagesCount) || 5,
      isAssessmentMandatory,
      passingScorePercent: Number(passingScorePercent) || 80,
      documentFileUrl: documentFileUrl.trim() || `https://my-sarthee.com/docs/${title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      fileFormat,
      description: description.trim(),
      version,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
      completedCaregiversCount: documentToEdit ? documentToEdit.completedCaregiversCount : 0,
    };

    onSave(newDoc);
    swiftAlert.success({
      title: documentToEdit ? "Training Document Updated" : "Training SOP Created",
      description: `"${newDoc.title}" published to caregiver training academy.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-teal-600" />
              {documentToEdit ? "Edit Training Protocol Document" : "Create New Training SOP & Protocol"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Publish clinical protocols, sanitization guides, and patient care SOPs for mobile caregiver training.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs">
            {/* Title & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Protocol Title *</Label>
                <Input
                  placeholder="e.g. Infection Control & Sanitization Protocol"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!documentToEdit) {
                      setCode(e.target.value.toUpperCase().replace(/\s+/g, "_"));
                    }
                  }}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Code Identifier</Label>
                <Input
                  placeholder="e.g. INF_CONTROL_SOP"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-xs h-9 font-mono uppercase"
                />
              </div>
            </div>

            {/* Target Roles */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Target Care Roles (Who must read this?)</Label>
              <div className="flex gap-2">
                {(["Nurse", "Caregiver", "Physiotherapist"] as const).map((role) => {
                  const isSelected = targetRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {role}s
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Time & Pages */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Reading Time</Label>
                <Input
                  placeholder="e.g. 15 mins"
                  value={estimatedReadingTime}
                  onChange={(e) => setEstimatedReadingTime(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Page Count</Label>
                <Input
                  type="number"
                  min={1}
                  value={pagesCount}
                  onChange={(e) => setPagesCount(Number(e.target.value))}
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Document PDF URL / File link */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document File Attachment / URL</Label>
              <Input
                placeholder="https://my-sarthee.com/docs/sop-file.pdf"
                value={documentFileUrl}
                onChange={(e) => setDocumentFileUrl(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Description / Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document Description & Learning Objectives</Label>
              <Textarea
                placeholder="Describe what key clinical skills and procedures this SOP covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-20 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 shadow-xs">
              <Save className="h-3.5 w-3.5" />
              <span>{documentToEdit ? "Update Protocol" : "Publish Training SOP"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
