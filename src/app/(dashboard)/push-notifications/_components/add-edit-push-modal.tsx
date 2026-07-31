"use client";

import { useState, useEffect } from "react";
import { PushNotificationItem } from "../_data/push-notifications";
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
import { Send, Plus, Calendar, Clock } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  pushToEdit?: PushNotificationItem | null;
  onSavePush: (push: PushNotificationItem) => void;
}

export function AddEditPushModal({
  isOpen,
  onClose,
  pushToEdit,
  onSavePush,
}: AddEditPushModalProps) {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
  const [scheduleDate, setScheduleDate] = useState("2026-08-03");
  const [scheduleTime, setScheduleTime] = useState("09:00 AM");
  const [targetAudience, setTargetAudience] = useState<PushNotificationItem["targetAudience"]>("All Mobile Users");
  const [status, setStatus] = useState<"Enable" | "Disable">("Enable");

  useEffect(() => {
    if (pushToEdit) {
      setTitle(pushToEdit.title);
      setShortDescription(pushToEdit.shortDescription);
      setImageUrl(pushToEdit.imageUrl);
      const [d, ...t] = pushToEdit.scheduleDateTime.split(" ");
      setScheduleDate(d || "2026-08-03");
      setScheduleTime(t.join(" ") || "09:00 AM");
      setTargetAudience(pushToEdit.targetAudience);
      setStatus(pushToEdit.status);
    } else {
      setTitle("");
      setShortDescription("");
      setImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800");
      setScheduleDate("2026-08-03");
      setScheduleTime("09:00 AM");
      setTargetAudience("All Mobile Users");
      setStatus("Enable");
    }
  }, [pushToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter Title and Short Description.",
      });
      return;
    }

    const pushItem: PushNotificationItem = {
      id: pushToEdit ? pushToEdit.id : `PUSH-${Math.floor(400 + Math.random() * 300)}`,
      title,
      shortDescription,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      scheduleDateTime: `${scheduleDate} ${scheduleTime}`,
      creationDate: pushToEdit ? pushToEdit.creationDate : new Date().toISOString().split("T")[0],
      status,
      targetAudience,
    };

    onSavePush(pushItem);
    swiftAlert.success({
      title: pushToEdit ? "Push Notification Updated" : "Push Notification Scheduled",
      description: `Push broadcast "${title}" has been saved.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Send className="h-5 w-5 text-teal-600" />
            {pushToEdit ? "Edit Mobile Push Notification" : "Compose Mobile Push Notification"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure mobile push title, short description, graphic asset & schedule time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Push Notification Title *</Label>
            <Input
              placeholder="e.g. New Post-Op Care Service Available!"
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
              placeholder="Brief message narrative displayed in mobile phone notification bar..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="h-20 text-xs w-full resize-none"
              required
            />
          </div>

          {/* Image URL & Target Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Notification Image URL</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-9 text-xs w-full"
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Target Audience</Label>
              <Select value={targetAudience} onValueChange={(val: any) => setTargetAudience(val)}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Mobile Users">All Mobile Users</SelectItem>
                  <SelectItem value="Caregivers Only">Caregivers Only</SelectItem>
                  <SelectItem value="Patients Only">Patients Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule Date & Time & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Schedule Date *</Label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Schedule Time *</Label>
              <Input
                placeholder="09:00 AM"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            {/* <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Status *</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enable">Enable</SelectItem>
                  <SelectItem value="Disable">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              {pushToEdit ? "Update Push Notification" : "Schedule Push Broadcast"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
