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
import { Target, UserPlus } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (newLead: CRMLead) => void;
}

export function AddLeadModal({
  isOpen,
  onClose,
  onAddLead,
}: AddLeadModalProps) {
  const [leadName, setLeadName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceRequested, setServiceRequested] = useState("Post-Op Care & Rehabilitation");
  const [leadSource, setLeadSource] = useState<CRMLead["leadSource"]>("Google Ads");
  const [estimatedValue, setEstimatedValue] = useState<number>(2000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadName || !phone) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Lead Name and Phone Number.",
      });
      return;
    }

    const newLead: CRMLead = {
      id: `LD-${Math.floor(600 + Math.random() * 300)}`,
      leadName,
      phone,
      email: email || `${leadName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      serviceRequested,
      leadSource,
      conversionStatus: "New Lead",
      estimatedValue: Number(estimatedValue) || 2000,
      createdDate: new Date().toISOString().split("T")[0],
      assignedRepresentative: "Rachel Green",
      historyLog: [
        {
          date: new Date().toISOString().split("T")[0],
          action: "Lead Registered",
          note: `Registered manually via Admin Console from source: ${leadSource}`,
        },
      ],
    };

    onAddLead(newLead);
    swiftAlert.success({
      title: "Lead Registered",
      description: `${leadName} added to sales pipeline (${leadSource}).`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-teal-600" />
            Register Prospective Patient Lead
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Capture new inquiry lead with source attribution & service details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Lead Name & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Lead Contact Name *</Label>
              <Input
                placeholder="e.g. Jameson Sterling"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Phone Number *</Label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>
          </div>

          {/* Email & Estimated Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input
                type="email"
                placeholder="jameson@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs w-full"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Estimated Deal Value ($)</Label>
              <Input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="h-9 text-xs w-full"
              />
            </div>
          </div>

          {/* Lead Source & Service Requested */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Lead Acquisition Source *</Label>
              <Select value={leadSource} onValueChange={(val: any) => setLeadSource(val)}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Lead Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Google Ads">Google Search Ads</SelectItem>
                  <SelectItem value="Meta Ads">Meta Social Ads (FB/IG)</SelectItem>
                  <SelectItem value="Organic Search">Organic Search / SEO</SelectItem>
                  <SelectItem value="Referral">Doctor & Patient Referral</SelectItem>
                  <SelectItem value="Partner Clinic">Partner Clinic / Hospital</SelectItem>
                  <SelectItem value="Direct App">Direct Mobile App Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Requested Care Service</Label>
              <Input
                placeholder="Post-Op Nursing, Elderly Care..."
                value={serviceRequested}
                onChange={(e) => setServiceRequested(e.target.value)}
                className="h-9 text-xs w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              Add Lead to Pipeline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
