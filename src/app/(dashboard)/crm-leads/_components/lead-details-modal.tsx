"use client";

import { useState } from "react";
import { CRMLead } from "../_data/leads";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Phone, Mail, Calendar, User, DollarSign, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CRMLead | null;
  onUpdateStatus: (leadId: string, newStatus: CRMLead["conversionStatus"], note: string) => void;
}

export function LeadDetailsModal({
  isOpen,
  onClose,
  lead,
  onUpdateStatus,
}: LeadDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState<CRMLead["conversionStatus"]>("New Lead");
  const [newNote, setNewNote] = useState("");

  if (!lead) return null;

  const handleStatusChange = (val: CRMLead["conversionStatus"]) => {
    setCurrentStatus(val);
  };

  const handleSaveUpdate = () => {
    onUpdateStatus(lead.id, currentStatus, newNote || `Updated stage to ${currentStatus}`);
    swiftAlert.success({
      title: "Lead Pipeline Updated",
      description: `${lead.leadName} conversion stage updated to ${currentStatus}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                Lead Telemetry & Conversion Pipeline
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Lead ID: <strong className="font-mono text-foreground">{lead.id}</strong> · Created on{" "}
                <strong className="text-foreground">{lead.createdDate}</strong>
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-teal-50 text-teal-900 border-teal-300 font-bold text-xs">
              {lead.leadSource}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Contact Card */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">{lead.leadName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Requested: <strong className="text-foreground">{lead.serviceRequested}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block font-medium">Estimated Value</span>
                <span className="font-extrabold text-emerald-600 text-sm">${lead.estimatedValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-mono text-foreground">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate text-foreground">{lead.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Assigned Rep: <strong className="text-foreground">{lead.assignedRepresentative}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>Current Stage: <strong className="text-teal-600">{lead.conversionStatus}</strong></span>
              </div>
            </div>
          </div>

          {/* Update Stage Section */}
          <div className="rounded-xl border p-4 bg-card space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowRight className="h-4 w-4 text-teal-600" />
              Update Conversion Stage
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Stage</Label>
                <Select
                  defaultValue={lead.conversionStatus}
                  onValueChange={(val: any) => handleStatusChange(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Lead">New Lead</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Consultation Scheduled">Consultation Scheduled</SelectItem>
                    <SelectItem value="Converted">Converted (Active Patient)</SelectItem>
                    <SelectItem value="Lost">Lost / Unqualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Interaction Notes</Label>
                <Input
                  placeholder="e.g. Spoke on phone, sent pricing brochure..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Interaction History Timeline */}
          {lead.historyLog && lead.historyLog.length > 0 && (
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-teal-600" />
                Interaction History Log
              </h4>

              <div className="space-y-2">
                {lead.historyLog.map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{log.date}</span>
                    </div>
                    <p className="text-muted-foreground">{log.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            Update Lead Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
