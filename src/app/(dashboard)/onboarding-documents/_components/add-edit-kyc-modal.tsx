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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  ShieldCheck,
  Plus,
  Save,
  CreditCard,
  Syringe,
  Shield,
  Landmark,
  FileCheck,
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
  const [code, setCode] = useState("");
  const [category, setCategory] = useState<KYCDocumentItem["category"]>("Identity Proof");
  const [iconType, setIconType] = useState<KYCDocumentItem["iconType"]>("id-card");
  const [isMandatory, setIsMandatory] = useState(true);
  const [allowedFormats, setAllowedFormats] = useState<string>("PDF, JPG, PNG");
  const [maxSizeMB, setMaxSizeMB] = useState(5);
  const [verificationMethod, setVerificationMethod] = useState<KYCDocumentItem["verificationMethod"]>("Manual Admin Review");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<KYCDocumentItem["status"]>("Active");

  useEffect(() => {
    if (documentToEdit) {
      setName(documentToEdit.name);
      setCode(documentToEdit.code);
      setCategory(documentToEdit.category);
      setIconType(documentToEdit.iconType);
      setIsMandatory(documentToEdit.isMandatory);
      setAllowedFormats(documentToEdit.allowedFormats.join(", "));
      setMaxSizeMB(documentToEdit.maxSizeMB);
      setVerificationMethod(documentToEdit.verificationMethod);
      setDescription(documentToEdit.description);
      setStatus(documentToEdit.status);
    } else {
      setName("");
      setCode("");
      setCategory("Identity Proof");
      setIconType("id-card");
      setIsMandatory(true);
      setAllowedFormats("PDF, JPG, PNG");
      setMaxSizeMB(5);
      setVerificationMethod("Manual Admin Review");
      setDescription("");
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
      code: code.trim() || name.toUpperCase().replace(/\s+/g, "_"),
      category,
      iconType,
      isMandatory,
      allowedFormats: allowedFormats.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
      maxSizeMB: Number(maxSizeMB) || 5,
      verificationMethod,
      description: description.trim(),
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
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
            {/* Document Name & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Document Name *</Label>
                <Input
                  placeholder="e.g. Aadhar Card, Driving License..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!documentToEdit) {
                      setCode(e.target.value.toUpperCase().replace(/\s+/g, "_"));
                    }
                  }}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">System Code Identifier</Label>
                <Input
                  placeholder="e.g. AADHAR_CARD"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-xs h-9 font-mono uppercase"
                />
              </div>
            </div>

            {/* Verification Method & Max Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Verification Method</Label>
                <Select value={verificationMethod} onValueChange={(val: any) => setVerificationMethod(val)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Verification Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual Admin Review">Manual Admin Review</SelectItem>
                    <SelectItem value="API / UIDAI Instant Verification">API / UIDAI Instant Verification</SelectItem>
                    <SelectItem value="Third-Party Background Check Agency">Third-Party Background Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Max File Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={25}
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="text-xs h-9"
                />
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

            {/* Description / Caregiver Guidance */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Caregiver Instructions / Verification Guidelines</Label>
              <Textarea
                placeholder="Specify instructions displayed to the caregiver when uploading this document in the mobile app..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs h-20 resize-none"
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
