"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  GraduationCap,
  Save,
  UploadCloud,
  FileText,
  X,
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
  const [category, setCategory] = useState<TrainingDocumentItem["category"]>("Hygiene & Sanitization");
  const [iconType, setIconType] = useState<TrainingDocumentItem["iconType"]>("sanitization");
  const [targetRoles, setTargetRoles] = useState<("Nurse" | "Caregiver" | "Physiotherapist")[]>([
    "Nurse",
    "Caregiver",
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<TrainingDocumentItem["fileFormat"]>("PDF");
  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState<TrainingDocumentItem["status"]>("Active");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (documentToEdit) {
      setTitle(documentToEdit.title);
      setCategory(documentToEdit.category);
      setIconType(documentToEdit.iconType);
      setTargetRoles(documentToEdit.targetRoles);
      setFileName(documentToEdit.documentFileUrl ? documentToEdit.documentFileUrl.split("/").pop() || "Attached Document.pdf" : "");
      setFileSizeStr("");
      setSelectedFile(null);
      setFileFormat(documentToEdit.fileFormat);
      setVersion(documentToEdit.version);
      setStatus(documentToEdit.status);
    } else {
      setTitle("");
      setCategory("Hygiene & Sanitization");
      setIconType("sanitization");
      setTargetRoles(["Nurse", "Caregiver", "Physiotherapist"]);
      setSelectedFile(null);
      setFileName("");
      setFileSizeStr("");
      setFileFormat("PDF");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeStr(`${sizeInMB} MB`);

      const extension = file.name.split(".").pop()?.toUpperCase();
      if (extension === "PDF" || extension === "DOC" || extension === "DOCX" || extension === "MP4") {
        setFileFormat(extension as any);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    if (!fileName && !selectedFile) {
      swiftAlert.warning({
        title: "Document File Required",
        description: "Please upload a document file from your system.",
      });
      return;
    }

    const newDoc: TrainingDocumentItem = {
      id: documentToEdit ? documentToEdit.id : `TRN-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      code: documentToEdit ? documentToEdit.code : title.toUpperCase().replace(/\s+/g, "_"),
      category,
      iconType,
      targetRoles,
      estimatedReadingTime: documentToEdit ? documentToEdit.estimatedReadingTime : "15 mins",
      pagesCount: documentToEdit ? documentToEdit.pagesCount : 5,
      isAssessmentMandatory: documentToEdit ? documentToEdit.isAssessmentMandatory : true,
      passingScorePercent: documentToEdit ? documentToEdit.passingScorePercent : 80,
      documentFileUrl: selectedFile
        ? URL.createObjectURL(selectedFile)
        : documentToEdit?.documentFileUrl || `https://my-sarthee.com/docs/${fileName || "protocol.pdf"}`,
      fileFormat,
      description: documentToEdit ? documentToEdit.description : "",
      version,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
      completedCaregiversCount: documentToEdit ? documentToEdit.completedCaregiversCount : 0,
    };

    onSave(newDoc);
    swiftAlert.success({
      title: documentToEdit ? "Training Document Updated" : "Training SOP Created",
      description: `"${newDoc.title}" uploaded and published to caregiver training academy.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              {documentToEdit ? "Edit Training Protocol Document" : "Create New Training SOP & Protocol"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Upload clinical protocols, sanitization guides, and patient care SOPs from your computer for mobile caregiver training.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Protocol Title *</Label>
              <Input
                placeholder="e.g. Infection Control & Sanitization Protocol"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9"
                required
              />
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
                          ? "bg-[#01265D] text-white border-[#01265D] shadow-xs"
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

            {/* File Upload from System */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Document File (Upload from System) *
              </Label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4"
                className="hidden"
              />

              {fileName ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 dark:bg-blue-950/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-[#01265D] text-white shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{fileName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-[#01265D] dark:text-blue-300 font-mono">
                          {fileFormat}
                        </span>
                        {fileSizeStr && (
                          <>
                            <span className="text-[10px] text-muted-foreground">&bull;</span>
                            <span className="text-[10px] text-muted-foreground">{fileSizeStr}</span>
                          </>
                        )}
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-[11px] px-2.5"
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/40/30 dark:hover:bg-blue-950/20 hover:border-blue-200 transition-all cursor-pointer text-center group"
                >
                  <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground group-hover:text-[#01265D] dark:text-blue-400 group-hover:bg-blue-100 dark:hover:bg-blue-900/40 dark:group-hover:bg-blue-950 transition-colors mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-foreground group-hover:text-[#01265D] dark:text-blue-400 transition-colors">
                    Click to browse or drag and drop file
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Supports PDF, DOC, DOCX, PNG, JPG (up to 25 MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1.5 shadow-xs">
              <Save className="h-3.5 w-3.5" />
              <span>{documentToEdit ? "Update Protocol" : "Publish Training SOP"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
