"use client";

import { AdminNotification } from "../_data/notifications";
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
import { Bell, Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface NotificationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: AdminNotification | null;
  onMarkAsRead: (id: string) => void;
}

export function NotificationViewModal({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
}: NotificationViewModalProps) {
  if (!notification) return null;

  const handleRead = () => {
    onMarkAsRead(notification.id);
    swiftAlert.success({
      title: "Notification Updated",
      description: `Marked alert ${notification.id} as Read.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">System Alert Notification</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Alert ID: <strong className="font-mono text-foreground">{notification.id}</strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <Badge
              variant={
                notification.priority === "Critical"
                  ? "destructive"
                  : notification.priority === "Urgent"
                  ? "default"
                  : "outline"
              }
              className="text-[10px] font-bold"
            >
              {notification.priority} Priority
            </Badge>

            <span className="font-mono text-muted-foreground">{notification.timestamp}</span>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground">{notification.title}</h4>
            <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border text-muted-foreground leading-relaxed">
              {notification.message}
            </p>
          </div>

          <div className="rounded-xl border p-3 bg-card space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notification Category:</span>
              <Badge variant="outline" className="text-[10px]">{notification.category}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entity Reference:</span>
              <strong className="font-mono text-foreground">{notification.referenceId}</strong>
            </div>
            {notification.actorName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Associated User:</span>
                <strong className="text-foreground">{notification.actorName}</strong>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>
          {notification.status === "Unread" && (
            <Button
              type="button"
              size="sm"
              onClick={handleRead}
              className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark as Read
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
