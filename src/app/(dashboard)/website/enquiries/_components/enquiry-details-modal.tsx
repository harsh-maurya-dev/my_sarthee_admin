"use client";

import { useState, useEffect } from "react";
import { WebsiteEnquiry } from "../_data/enquiries";
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
import { MessageSquare, Phone, Mail, Calendar, User, CheckCircle2, ArrowRight } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface EnquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: WebsiteEnquiry | null;
  onUpdateStatus: (id: string, newStatus: WebsiteEnquiry["status"], notes: string) => void;
}

export function EnquiryDetailsModal({
  isOpen,
  onClose,
  enquiry,
  onUpdateStatus,
}: EnquiryDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState<WebsiteEnquiry["status"]>("New");
  const [responseNotes, setResponseNotes] = useState("");

  useEffect(() => {
    if (enquiry) {
      setCurrentStatus(enquiry.status);
      setResponseNotes(enquiry.responseNotes || "");
    }
  }, [enquiry, isOpen]);

  if (!enquiry) return null;

  const handleSaveUpdate = () => {
    onUpdateStatus(enquiry.id, currentStatus, responseNotes);
    swiftAlert.success({
      title: "Enquiry Status Updated",
      description: `Enquiry from ${enquiry.name} marked as ${currentStatus}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-600" />
                Website Contact Form Enquiry
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Enquiry ID: <strong className="font-mono text-foreground">{enquiry.id}</strong> · Submitted:{" "}
                <strong className="text-foreground">{enquiry.submittedDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                enquiry.status === "Resolved"
                  ? "default"
                  : enquiry.status === "Contacted"
                  ? "secondary"
                  : "outline"
              }
              className="text-xs font-bold"
            >
              {enquiry.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Sender Details Card */}
          <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
            <h3 className="font-extrabold text-base text-foreground">{enquiry.name}</h3>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-500" /> {enquiry.phone}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-500" /> {enquiry.email}
              </span>
            </div>
          </div>

          {/* Subject & Full Message Narrative */}
          <div className="rounded-xl border p-4 bg-card space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Subject:</span>
              <h4 className="font-bold text-sm text-foreground">{enquiry.subject}</h4>
            </div>

            <div className="space-y-1 pt-2 border-t">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Enquiry Message:</span>
              <p className="text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border leading-relaxed whitespace-pre-line">
                {enquiry.message}
              </p>
            </div>
          </div>

          {/* Update Status & Response Notes */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowRight className="h-4 w-4 text-teal-600" /> Update Enquiry Status
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 w-full">
                <Label className="text-xs font-semibold">Enquiry Status *</Label>
                <Select value={currentStatus} onValueChange={(val: any) => setCurrentStatus(val)}>
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 w-full">
                <Label className="text-xs font-semibold">Response Log Notes</Label>
                <Input
                  placeholder="e.g. Called client, emailed pricing brochure..."
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  className="h-9 text-xs w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveUpdate}
            className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Update Enquiry Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
