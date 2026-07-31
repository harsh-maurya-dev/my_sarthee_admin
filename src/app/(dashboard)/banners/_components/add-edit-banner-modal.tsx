"use client";

import { useState, useEffect } from "react";
import { StaticBanner } from "../_data/banners";
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
import { Image as ImageIcon, Plus, CheckCircle2 } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bannerToEdit?: StaticBanner | null;
  onSaveBanner: (banner: StaticBanner) => void;
}

export function AddEditBannerModal({
  isOpen,
  onClose,
  bannerToEdit,
  onSaveBanner,
}: AddEditBannerModalProps) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
  const [targetLink, setTargetLink] = useState("/services");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    if (bannerToEdit) {
      setTitle(bannerToEdit.title);
      setShortDescription(bannerToEdit.shortDescription);
      setImageUrl(bannerToEdit.imageUrl);
      setTargetLink(bannerToEdit.targetLink || "/services");
      setStatus(bannerToEdit.status);
    } else {
      setTitle("");
      setShortDescription("");
      setImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
      setTargetLink("/services");
      setStatus("Active");
    }
  }, [bannerToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Title and Short Description.",
      });
      return;
    }

    const banner: StaticBanner = {
      id: bannerToEdit ? bannerToEdit.id : `BNR-${Math.floor(200 + Math.random() * 300)}`,
      title,
      shortDescription,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      targetLink,
      creationDate: bannerToEdit ? bannerToEdit.creationDate : new Date().toISOString().split("T")[0],
      status,
    };

    onSaveBanner(banner);
    swiftAlert.success({
      title: bannerToEdit ? "Banner Updated" : "Banner Created",
      description: `Static banner "${title}" has been saved.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-teal-600" />
            {bannerToEdit ? "Edit Static Banner" : "Add New Static Banner"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure promotional banner image, title, short description & status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Banner Title *</Label>
            <Input
              placeholder="e.g. Post-Op Cardiac Rehab Package"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-xs w-full"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Short Description *</Label>
            <Textarea
              placeholder="Brief promotional summary displayed on home banner..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="h-20 text-xs w-full resize-none"
              required
            />
          </div>

          {/* Image URL & Target Link */}
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

          {/* Image Preview Card */}
          {imageUrl && (
            <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Banner Image Preview:</span>
              <img
                src={imageUrl}
                alt="Banner Preview"
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
            <Button type="submit" size="sm" className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              {bannerToEdit ? "Update Banner" : "Create Static Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
