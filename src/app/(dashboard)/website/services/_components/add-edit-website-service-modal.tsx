"use client";

import { useState, useEffect } from "react";
import { WebsiteService } from "../_data/website-services";
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
import { Globe, Plus, CheckCircle2 } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditWebsiteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: WebsiteService | null;
  onSaveService: (service: WebsiteService) => void;
}

export function AddEditWebsiteServiceModal({
  isOpen,
  onClose,
  serviceToEdit,
  onSaveService,
}: AddEditWebsiteServiceModalProps) {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    if (serviceToEdit) {
      setServiceName(serviceToEdit.serviceName);
      setDescription(serviceToEdit.description);
      setImageUrl(serviceToEdit.imageUrl);
      setStatus(serviceToEdit.status);
    } else {
      setServiceName("");
      setDescription("");
      setImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
      setStatus("Active");
    }
  }, [serviceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !description) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter Service Name and Description.",
      });
      return;
    }

    const service: WebsiteService = {
      id: serviceToEdit ? serviceToEdit.id : `WS-${Math.floor(300 + Math.random() * 300)}`,
      serviceName,
      description,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      status,
      creationDate: serviceToEdit ? serviceToEdit.creationDate : new Date().toISOString().split("T")[0],
    };

    onSaveService(service);
    swiftAlert.success({
      title: serviceToEdit ? "Website Service Updated" : "Website Service Added",
      description: `Service "${serviceName}" has been published to corporate website.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
            {serviceToEdit ? "Edit Corporate Website Service" : "Add New Corporate Website Service"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure service title, banner graphic image, full description & status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Service Name */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Service Name *</Label>
            <Input
              placeholder="e.g. Post-Op Cardiac & Wound Nursing Care"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="h-9 text-xs w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Service Description *</Label>
            <Textarea
              placeholder="Detailed description displayed on corporate website landing page..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24 text-xs w-full resize-none"
              required
            />
          </div>

          {/* Image URL & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Image URL *</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Status *</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Service Banner Preview:</span>
              <img
                src={imageUrl}
                alt="Service Preview"
                className="h-28 w-full object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold">
              {serviceToEdit ? "Update Website Service" : "Add Website Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
