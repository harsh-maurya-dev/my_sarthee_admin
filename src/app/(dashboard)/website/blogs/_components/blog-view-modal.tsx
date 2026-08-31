"use client";

import { BlogPost } from "../_data/blogs";
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
import { BookOpen, Calendar, User, Clock } from "lucide-react";

interface BlogViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogPost | null;
}

export function BlogViewModal({
  isOpen,
  onClose,
  blog,
}: BlogViewModalProps) {
  if (!blog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Health Article & News Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Blog ID: <strong className="font-mono text-foreground">{blog.id}</strong> · Published:{" "}
                <strong className="text-foreground">{blog.publishDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                blog.status === "Published"
                  ? "default"
                  : blog.status === "Draft"
                  ? "outline"
                  : "secondary"
              }
              className="text-xs font-bold"
            >
              {blog.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Featured Image */}
          <div className="rounded-xl border overflow-hidden bg-slate-900 shadow-md">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="h-56 w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-base text-foreground leading-snug">{blog.title}</h3>
            <div className="flex items-center gap-3 text-muted-foreground font-medium text-[11px]">
              <span className="flex items-center gap-1 text-[#01265D] dark:text-blue-400">
                <User className="h-3.5 w-3.5" /> By {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" /> {blog.readTimeMinutes || 5} min read
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full bg-[#01265D] hover:bg-[#0a3375] text-white font-bold h-9 text-xs">
            Close Article Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
