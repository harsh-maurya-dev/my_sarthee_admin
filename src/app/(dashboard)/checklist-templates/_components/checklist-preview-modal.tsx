"use client";

import { ChecklistTemplateItem } from "../_data/checklist-templates";
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
  Smartphone,
  Check,
} from "lucide-react";

interface ChecklistPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: ChecklistTemplateItem | null;
}

export function ChecklistPreviewModal({
  isOpen,
  onClose,
  template,
}: ChecklistPreviewModalProps) {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              Checklist Item Preview
            </DialogTitle>
            <Badge className="bg-[#01265D] text-white text-[10px]">
              {template.role}
              {template.subCategory ? ` · ${template.subCategory}` : ""}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Visit duty verification preview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-2xl border p-4 bg-slate-50 dark:bg-slate-900 flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-[#01265D] text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <span className="text-sm font-bold text-foreground">{template.title}</span>
          </div>
        </div>

        <DialogFooter className="border-t pt-3">
          <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
