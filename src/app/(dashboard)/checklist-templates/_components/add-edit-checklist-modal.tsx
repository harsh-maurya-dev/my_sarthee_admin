"use client";

import { useState, useEffect } from "react";
import {
  ChecklistTemplateItem,
  ChecklistRole,
  PhysioSubCategory,
} from "../_data/checklist-templates";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Save,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit?: ChecklistTemplateItem | null;
  defaultRole?: ChecklistRole;
  defaultSubCategory?: PhysioSubCategory;
  onSave: (template: ChecklistTemplateItem) => void;
}

export function AddEditChecklistModal({
  isOpen,
  onClose,
  templateToEdit,
  defaultRole = "Caregiver",
  defaultSubCategory = "Exercise",
  onSave,
}: AddEditChecklistModalProps) {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<ChecklistRole>(defaultRole);
  const [physioSubCategory, setPhysioSubCategory] = useState<PhysioSubCategory>(defaultSubCategory);

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title);
      setRole(templateToEdit.role);
      if (templateToEdit.role === "Physiotherapist" && templateToEdit.subCategory) {
        setPhysioSubCategory(templateToEdit.subCategory as PhysioSubCategory);
      }
    } else {
      setTitle("");
      setRole(defaultRole);
      setPhysioSubCategory(defaultSubCategory);
    }
  }, [templateToEdit, defaultRole, defaultSubCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      swiftAlert.error({
        title: "Checklist Required",
        description: "Please specify a checklist name.",
      });
      return;
    }

    const newTemplate: ChecklistTemplateItem = {
      id: templateToEdit ? templateToEdit.id : `CHK-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      role,
      subCategory: role === "Physiotherapist" ? physioSubCategory : undefined,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    onSave(newTemplate);
    swiftAlert.success({
      title: templateToEdit ? "Checklist Updated" : "Checklist Added",
      description: `"${newTemplate.title}" added to ${role} checklist options.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              {templateToEdit ? "Edit Checklist" : `Add ${role} Checklist`}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Add a new visit checklist option for care professionals.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-xs">
            {/* Target Role */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Target Care Professional</Label>
              <Select value={role} onValueChange={(val) => { if (val) setRole(val as ChecklistRole); }}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Caregiver">Caregiver</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Category (if Physiotherapist) */}
            {role === "Physiotherapist" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Physiotherapy Sub-Category *</Label>
                <Select
                  value={physioSubCategory}
                  onValueChange={(val) => { if (val) setPhysioSubCategory(val as PhysioSubCategory); }}
                >
                  <SelectTrigger className="text-xs h-9 bg-blue-50/50 dark:bg-blue-950/30 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800">
                    <SelectValue placeholder="Sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exercise">🏋️ Exercises</SelectItem>
                    <SelectItem value="Modalities Applied">⚡ Modalities Applied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Checklist Single Word / Title Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Checklist *</Label>
              <Input
                placeholder={
                  role === "Caregiver"
                    ? "e.g. Hygiene, Bathing, Feeding..."
                    : role === "Nurse"
                    ? "e.g. IV Administration, Dressing, Catheter Care..."
                    : physioSubCategory === "Exercise"
                    ? "e.g. Active-Assisted ROM, Gait Retraining..."
                    : "e.g. TENS Therapy, Hot Moist Pack..."
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9"
                required
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1.5 shadow-xs">
              <Save className="h-3.5 w-3.5" />
              <span>{templateToEdit ? "Update Checklist" : "Save Checklist"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
