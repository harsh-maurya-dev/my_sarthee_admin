"use client";

import { useState, useEffect, useRef } from "react";
import { KYCDocumentItem } from "../_data/onboarding-documents";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Save,
  UploadCloud,
  FileText,
  X,
  Plus,
  Files,
  Info,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: KYCDocumentItem | null;
  onSave: (doc: KYCDocumentItem) => void;
}

export function AddEditKYCModal({
  isOpen,
  onClose,
  documentToEdit,
  onSave,
}: AddEditKYCModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<KYCDocumentItem["category"]>("Identity Proof");
  const [iconType, setIconType] = useState<KYCDocumentItem["iconType"]>("id-card");
  const [isMandatory, setIsMandatory] = useState(true);
  const [allowedFormats, setAllowedFormats] = useState<string>("PDF, JPG, PNG");
  const [status, setStatus] = useState<KYCDocumentItem["status"]>("Active");
  
  // Multiple File Upload states
  const [allowMultipleFiles, setAllowMultipleFiles] = useState(false);
  const [maxFilesCount, setMaxFilesCount] = useState<number>(2);
  const [sampleFiles, setSampleFiles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (documentToEdit) {
      setName(documentToEdit.name);
      setCategory(documentToEdit.category);
      setIconType(documentToEdit.iconType);
      setIsMandatory(documentToEdit.isMandatory);
      setAllowedFormats(documentToEdit.allowedFormats.join(", "));
      setStatus(documentToEdit.status);
      setAllowMultipleFiles(documentToEdit.allowMultipleFiles || false);
      setMaxFilesCount(documentToEdit.maxFilesCount || 2);
      setSampleFiles(documentToEdit.sampleFiles || []);
    } else {
      setName("");
      setCategory("Identity Proof");
      setIconType("id-card");
      setIsMandatory(true);
      setAllowedFormats("PDF, JPG, PNG");
      setStatus("Active");
      setAllowMultipleFiles(false);
      setMaxFilesCount(2);
      setSampleFiles([]);
    }
  }, [documentToEdit, isOpen]);

  const handleFileUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileNames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].name);
    }

    if (sampleFiles.length + fileNames.length > maxFilesCount) {
      swiftAlert.error({
        title: "File Limit Reached",
        description: `Maximum ${maxFilesCount} files allowed for this document requirement.`,
      });
      return;
    }

    setSampleFiles((prev) => [...prev, ...fileNames]);
    swiftAlert.info({
      title: "Files Attached",
      description: `Attached ${fileNames.length} sample template file(s).`,
    });
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveSampleFile = (index: number) => {
    setSampleFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      swiftAlert.error({
        title: "Document Name Required",
        description: "Please enter a title for the KYC document requirement.",
      });
      return;
    }

    const newDoc: KYCDocumentItem = {
      id: documentToEdit ? documentToEdit.id : `KYC-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      code: documentToEdit ? documentToEdit.code : name.toUpperCase().replace(/\s+/g, "_"),
      category,
      iconType,
      isMandatory,
      allowedFormats: allowedFormats.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      maxSizeMB: documentToEdit ? documentToEdit.maxSizeMB : 5,
      verificationMethod: documentToEdit ? documentToEdit.verificationMethod : "Manual Admin Review",
      description: documentToEdit ? documentToEdit.description : "",
      status,
      allowMultipleFiles,
      maxFilesCount: allowMultipleFiles ? maxFilesCount : 1,
      sampleFiles,
      createdDate: documentToEdit ? documentToEdit.createdDate : new Date().toISOString().split("T")[0],
      totalSubmissions: documentToEdit ? documentToEdit.totalSubmissions : 0,
      verifiedCount: documentToEdit ? documentToEdit.verifiedCount : 0,
    };

    onSave(newDoc);
    swiftAlert.success({
      title: documentToEdit ? "KYC Requirement Updated" : "KYC Requirement Created",
      description: `"${newDoc.name}" configured ${allowMultipleFiles ? `with multiple upload (max ${maxFilesCount} files)` : "with single file upload"}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              {documentToEdit ? "Edit KYC Document Requirement" : "Configure New KYC Document"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Define identity, background, and verification documents caregivers must upload during onboarding.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs">
            {/* Document Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document Name *</Label>
              <Input
                placeholder="e.g. Aadhar Card, Driving License, Degree Certificate..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            {/* Category & Icon Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Category</Label>
                <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Identity Proof">Identity Proof</SelectItem>
                    <SelectItem value="Financial & Tax">Financial & Tax</SelectItem>
                    <SelectItem value="Medical & Health">Medical & Health</SelectItem>
                    <SelectItem value="Background & Legal">Background & Legal</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Icon Symbol</Label>
                <Select value={iconType} onValueChange={(val: any) => setIconType(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id-card">🪪 ID / Passport Card</SelectItem>
                    <SelectItem value="pan-card">💳 PAN / Tax Card</SelectItem>
                    <SelectItem value="vaccine">💉 Vaccination / Medical</SelectItem>
                    <SelectItem value="police">👮 Police Verification</SelectItem>
                    <SelectItem value="bank">🏛️ Bank Passbook / Cheque</SelectItem>
                    <SelectItem value="insurance">🛡️ Insurance Policy</SelectItem>
                    <SelectItem value="generic">📄 Standard Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Allowed Formats */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Allowed File Formats (Comma Separated)</Label>
              <Input
                placeholder="PDF, JPG, PNG"
                value={allowedFormats}
                onChange={(e) => setAllowedFormats(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Mandatory Toggle */}
            <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Mandatory Onboarding Requirement</span>
                  <span className="text-[11px] text-muted-foreground">Caregiver cannot activate shifts without submitting this document.</span>
                </div>
                <Switch checked={isMandatory} onCheckedChange={setIsMandatory} />
              </div>
            </div>

            {/* ========================================================= */}
            {/* MULTIPLE FILE UPLOAD CONFIGURATION */}
            {/* ========================================================= */}
            <div className="rounded-xl border p-3.5 bg-slate-50 dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#01265D] dark:text-blue-300">
                    <Files className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">Allow Multiple File Uploads</span>
                    <span className="text-[11px] text-muted-foreground">Enable caregivers to upload multiple files (e.g. Front & Back scan, multi-page certificates).</span>
                  </div>
                </div>
                <Switch checked={allowMultipleFiles} onCheckedChange={setAllowMultipleFiles} />
              </div>

              {allowMultipleFiles && (
                <div className="pt-2 border-t space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Label className="text-xs font-semibold text-foreground block">Maximum Allowed Files</Label>
                      <span className="text-[10px] text-muted-foreground">Caregiver can upload up to this many attachments.</span>
                    </div>
                    <Select
                      value={maxFilesCount.toString()}
                      onValueChange={(val) => val && setMaxFilesCount(parseInt(val))}
                    >
                      <SelectTrigger className="h-8 text-xs w-28 font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Files (Front & Back)</SelectItem>
                        <SelectItem value="3">3 Files</SelectItem>
                        <SelectItem value="4">4 Files</SelectItem>
                        <SelectItem value="5">5 Files (Max Multi-Page)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sample Templates & Reference Upload */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">
                        Admin Reference & Sample Files ({sampleFiles.length}/{maxFilesCount})
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-6 text-[10px] font-semibold gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Files
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUploadSimulation}
                        multiple
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                      />
                    </div>

                    {sampleFiles.length === 0 ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <UploadCloud className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <span className="text-[11px] text-muted-foreground block">
                          Click to attach sample reference files or templates (Max {maxFilesCount} files)
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {sampleFiles.map((fileName, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
                              <span className="font-medium text-foreground truncate">{fileName}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSampleFile(idx)}
                              className="text-rose-500 hover:text-rose-700 p-0.5 rounded"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
              <span>{documentToEdit ? "Update Document" : "Save KYC Document"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
