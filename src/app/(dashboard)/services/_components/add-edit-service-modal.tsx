"use client";

import { useState, useEffect } from "react";
import { MedicalService } from "../_data/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit: MedicalService | null;
  onSaveService: (service: MedicalService) => void;
}

export function AddEditServiceModal({
  isOpen,
  onClose,
  serviceToEdit,
  onSaveService,
}: AddEditServiceModalProps) {
  const isEditing = Boolean(serviceToEdit);

  const [serviceName, setServiceName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [price, setPrice] = useState("$100 / session");
  const [status, setStatus] = useState<"Enabled" | "Disabled">("Enabled");

  useEffect(() => {
    if (serviceToEdit) {
      setServiceName(serviceToEdit.serviceName);
      setImage(serviceToEdit.image);
      setDescription(serviceToEdit.description);
      setCategory(serviceToEdit.category);
      setPrice(serviceToEdit.price);
      setStatus(serviceToEdit.status);
    } else {
      setServiceName("");
      setImage("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80");
      setDescription("");
      setCategory("Telehealth");
      setPrice("$100 / session");
      setStatus("Enabled");
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

    const updatedService: MedicalService = {
      id: serviceToEdit ? serviceToEdit.id : `SVC-${Math.floor(100 + Math.random() * 900)}`,
      serviceName,
      image: image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
      description,
      category,
      price,
      status,
      createdDate: serviceToEdit ? serviceToEdit.createdDate : new Date().toISOString().split("T")[0],
    };

    onSaveService(updatedService);
    swiftAlert.success({
      title: isEditing ? "Service Updated" : "Service Added",
      description: `Successfully ${isEditing ? "updated" : "added"} "${serviceName}".`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Edit Medical Service" : "Add New Medical Service"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure the healthcare service details displayed to patients on the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Service Name */}
          <div className="space-y-1.5">
            <Label htmlFor="serviceName" className="text-xs font-semibold">
              Service Name *
            </Label>
            <Input
              id="serviceName"
              placeholder="e.g. 24/7 Virtual Telehealth Consultation"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Pricing Rate */}
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-xs font-semibold">
              Pricing Rate
            </Label>
            <Input
              id="price"
              placeholder="e.g. ₹1,200 / shift or ₹25,000 / month"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Image URL & Live Preview */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-xs font-semibold">
              Service Image URL *
            </Label>
            <Input
              id="image"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="h-9 text-xs font-mono"
            />
            {image && (
              <div className="relative h-28 w-full rounded-xl border overflow-hidden bg-slate-100 dark:bg-slate-900 mt-2">
                <img
                  src={image}
                  alt="Service preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80";
                  }}
                />
                <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white font-medium flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> Preview
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed explanation of medical procedures, care packages, and patient benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs min-h-[90px]"
              required
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold">
              {isEditing ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
