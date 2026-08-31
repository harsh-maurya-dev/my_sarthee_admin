"use client";

import { StaticBanner } from "../_data/banners";
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
import { Image as ImageIcon, Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";

interface BannerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: StaticBanner | null;
}

export function BannerViewModal({
  isOpen,
  onClose,
  banner,
}: BannerViewModalProps) {
  if (!banner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Static Banner Telemetry & Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Banner ID: <strong className="font-mono text-foreground">{banner.id}</strong> · Created:{" "}
                <strong className="text-foreground">{banner.creationDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={banner.status === "Active" ? "default" : "secondary"}
              className="text-xs font-bold"
            >
              {banner.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Banner Image View */}
          <div className="rounded-xl border overflow-hidden bg-slate-900 shadow-md">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="h-56 w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-foreground">{banner.title}</h3>
            <p className="text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border leading-relaxed">
              {banner.shortDescription}
            </p>
          </div>

          {banner.targetLink && (
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card font-mono text-[11px]">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" /> Target URL:
              </span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                {banner.targetLink} <ExternalLink className="h-3 w-3 text-slate-400" />
              </span>
            </div>
          )}
        </div>

        <DialogFooter >
          <Button type="button" onClick={onClose} className="w-full bg-[#01265D] hover:bg-[#0a3375] text-white font-bold h-9 text-xs">
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
