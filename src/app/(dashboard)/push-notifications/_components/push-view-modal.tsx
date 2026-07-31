"use client";

import { PushNotificationItem } from "../_data/push-notifications";
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
import { Send, Smartphone, Clock, Calendar, Users } from "lucide-react";

interface PushViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pushItem: PushNotificationItem | null;
}

export function PushViewModal({
  isOpen,
  onClose,
  pushItem,
}: PushViewModalProps) {
  if (!pushItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-teal-600" />
                Mobile Device Notification Preview
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Push ID: <strong className="font-mono text-foreground">{pushItem.id}</strong> · Scheduled:{" "}
                <strong className="text-foreground">{pushItem.scheduleDateTime}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={pushItem.status === "Enable" ? "default" : "secondary"}
              className="text-xs font-bold"
            >
              {pushItem.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Mobile Push Notification Mockup Box */}
          <div className="rounded-2xl border bg-slate-900 text-white p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-bold text-teal-400">
                <Send className="h-3 w-3" /> MySarthee Mobile App
              </span>
              <span>Now</span>
            </div>

            {pushItem.imageUrl && (
              <img
                src={pushItem.imageUrl}
                alt={pushItem.title}
                className="h-32 w-full object-cover rounded-xl border border-slate-800"
              />
            )}

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-100">{pushItem.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{pushItem.shortDescription}</p>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/60 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Audience:</span>
              <strong className="text-foreground">{pushItem.targetAudience}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creation Date:</span>
              <strong className="text-foreground">{pushItem.creationDate}</strong>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-9 text-xs">
            Close Mobile Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
