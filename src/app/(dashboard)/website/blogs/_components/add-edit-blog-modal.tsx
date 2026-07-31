"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "../_data/blogs";
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
import { BookOpen, Plus, Image as ImageIcon } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogToEdit?: BlogPost | null;
  onSaveBlog: (blog: BlogPost) => void;
}

export function AddEditBlogModal({
  isOpen,
  onClose,
  blogToEdit,
  onSaveBlog,
}: AddEditBlogModalProps) {
  const [title, setTitle] = useState("");
  const [featuredImage, setFeaturedImage] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Dr. Sarah Jenkins");
  const [status, setStatus] = useState<"Published" | "Draft" | "Unpublished">("Published");

  useEffect(() => {
    if (blogToEdit) {
      setTitle(blogToEdit.title);
      setFeaturedImage(blogToEdit.featuredImage);
      setContent(blogToEdit.content);
      setAuthor(blogToEdit.author);
      setStatus(blogToEdit.status);
    } else {
      setTitle("");
      setFeaturedImage("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
      setContent("");
      setAuthor("Dr. Sarah Jenkins");
      setStatus("Published");
    }
  }, [blogToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Blog Title and Content.",
      });
      return;
    }

    const blog: BlogPost = {
      id: blogToEdit ? blogToEdit.id : `BLOG-${Math.floor(100 + Math.random() * 300)}`,
      title,
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      publishDate: blogToEdit ? blogToEdit.publishDate : new Date().toISOString().split("T")[0],
      status,
      content,
      author,
      readTimeMinutes: Math.max(3, Math.ceil(content.split(" ").length / 40)),
    };

    onSaveBlog(blog);
    swiftAlert.success({
      title: blogToEdit ? "Blog Post Updated" : "Blog Post Created",
      description: `Article "${title}" saved as ${status}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-teal-600" />
            {blogToEdit ? "Edit Health Article / News Post" : "Create New Health Article / News"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Publish clinical news, medical articles, and health updates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Blog Title / News Headline *</Label>
            <Input
              placeholder="e.g. Essential Post-Operative Cardiac Care at Home"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-xs w-full"
              required
            />
          </div>

          {/* Featured Image & Author */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Featured Image URL *</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Author / Medical Reviewer</Label>
              <Input
                placeholder="Dr. Sarah Jenkins"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-9 text-xs w-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Article Content / Body *</Label>
            <Textarea
              placeholder="Write the full health blog article content or news narrative..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-32 text-xs w-full resize-none"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Publish Status *</Label>
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Preview */}
          {featuredImage && (
            <div className="rounded-xl border p-2 bg-slate-50 dark:bg-slate-900 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Featured Image Preview:</span>
              <img
                src={featuredImage}
                alt="Preview"
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
              {blogToEdit ? "Update Article" : "Publish Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
