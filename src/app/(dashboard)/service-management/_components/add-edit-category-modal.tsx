"use client";

import { useState, useEffect, useRef } from "react";
import { ServiceCategory } from "../_data/service-categories";
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
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: ServiceCategory | null;
  onSaveCategory: (category: ServiceCategory) => void;
}

export function AddEditCategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  onSaveCategory,
}: AddEditCategoryModalProps) {
  const isEditing = Boolean(categoryToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shift, setShift] = useState("");
  const [icon, setIcon] = useState("");
  const [iconFileName, setIconFileName] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setTitle(categoryToEdit.title);
      setDescription(categoryToEdit.description);
      setShift(categoryToEdit.shift);
      setIcon(categoryToEdit.icon);
      setIconFileName("");
    } else {
      setTitle("");
      setDescription("");
      setShift("");
      setIcon("");
      setIconFileName("");
    }
  }, [categoryToEdit, isOpen]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      swiftAlert.error({
        title: "Invalid File",
        description: "Please upload an image file (PNG, JPG, SVG, etc.)",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      swiftAlert.error({
        title: "File Too Large",
        description: "Maximum file size is 2MB. Please compress and retry.",
      });
      return;
    }

    setIconFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setIcon(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setIcon("");
    setIconFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Service Title is required.",
      });
      return;
    }

    if (!description.trim()) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Short Consumer Description is required.",
      });
      return;
    }

    const savedCategory: ServiceCategory = {
      id: categoryToEdit
        ? categoryToEdit.id
        : `SCAT-${String(Math.floor(100 + Math.random() * 900))}`,
      title: title.trim(),
      description: description.trim(),
      icon:
        icon ||
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80",
      shift: shift.trim() || "Per Session",
      status: categoryToEdit ? categoryToEdit.status : "Active",
      servicesCount: categoryToEdit ? categoryToEdit.servicesCount : 0,
      createdDate: categoryToEdit
        ? categoryToEdit.createdDate
        : new Date().toISOString().split("T")[0],
    };

    onSaveCategory(savedCategory);
    swiftAlert.success({
      title: isEditing ? "Category Updated" : "Category Created",
      description: `Successfully ${isEditing ? "updated" : "created"} "${title}".`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing
              ? "Edit Service Category"
              : "➕ Create New Service Category"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Update the service category details displayed to consumers."
              : "Add a new service category offered on the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Service Title */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryTitle" className="text-xs font-semibold">
              Service Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="categoryTitle"
              placeholder="e.g. Home Nursing, Physiotherapy, Geriatric Care"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Shift */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryShift" className="text-xs font-semibold">
              Shift
            </Label>
            <Input
              id="categoryShift"
              placeholder="e.g. 12h Shift, 24h Shift, Per Session"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Specify the shift duration for this service category.
            </p>
          </div>

          {/* Short Consumer Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="categoryDescription"
              className="text-xs font-semibold"
            >
              Short Consumer Description{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="categoryDescription"
              placeholder="Brief description visible to consumers on the platform..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs min-h-[80px]"
              required
            />
            <p className="text-[10px] text-muted-foreground">
              This description will be shown to consumers browsing services.
            </p>
          </div>

          {/* Upload Category Icon */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Upload Category Icon
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-6 cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40/30 dark:hover:border-[#01265D] dark:hover:bg-blue-950/20"
            >
              {icon ? (
                <div className="relative">
                  <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                    <img
                      src={icon}
                      alt="Category icon preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveIcon();
                    }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm hover:bg-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {iconFileName && (
                    <p className="text-[10px] text-muted-foreground text-center mt-2 max-w-[120px] truncate">
                      {iconFileName}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-blue-100 dark:hover:bg-blue-900/40 dark:group-hover:bg-blue-100 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-[#01265D] dark:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Click to upload icon
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    PNG, JPG, SVG up to 2MB
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="hidden"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold"
            >
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
