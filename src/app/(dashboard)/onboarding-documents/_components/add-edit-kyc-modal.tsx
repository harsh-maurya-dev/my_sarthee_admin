"use client";

import { useState, useEffect } from "react";
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
import {
  ShieldCheck,
  Save,
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

  useEffect(() => {
    if (documentToEdit) {
      setName(documentToEdit.name);
      setCategory(documentToEdit.category);
      setIconType(documentToEdit.iconType);
      setIsMandatory(documentToEdit.isMandatory);
      setAllowedFormats(documentToEdit.allowedFormats.join(", "));
      setStatus(documentToEdit.status);
    } else {
      setName("");
      setCategory("Identity Proof");
      setIconType("id-card");
      setIsMandatory(true);
      setAllowedFormats("PDF, JPG, PNG");
      setStatus("Active");
    }
  }, [documentToEdit, isOpen]);

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
      createdDate: documentToEdit ? documentToEdit.createdDate : new Date().toISOString().split("T")[0],
      totalSubmissions: documentToEdit ? documentToEdit.totalSubmissions : 0,
      verifiedCount: documentToEdit ? documentToEdit.verifiedCount : 0,
    };

    onSave(newDoc);
    swiftAlert.success({
      title: documentToEdit ? "KYC Requirement Updated" : "KYC Requirement Created",
      description: `"${newDoc.name}" has been configured for mobile caregiver onboarding.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              {documentToEdit ? "Edit KYC Document Requirement" : "Configure New KYC Document"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Define identity, background, and verification documents caregivers must upload in the mobile application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs">
            {/* Document Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document Name *</Label>
              <Input
                placeholder="e.g. Aadhar Card, Driving License..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9"
                required
              />
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
                  <span className="text-xs font-bold text-foreground block">Mandatory Onboarding Document</span>
                  <span className="text-[11px] text-muted-foreground">Caregiver cannot activate shifts without uploading this document.</span>
                </div>
                <Switch checked={isMandatory} onCheckedChange={setIsMandatory} />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 shadow-xs">
              <Save className="h-3.5 w-3.5" />
              <span>{documentToEdit ? "Update Document" : "Save KYC Document"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
