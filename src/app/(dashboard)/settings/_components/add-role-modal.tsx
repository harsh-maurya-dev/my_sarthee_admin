"use client";

import { useState } from "react";
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
import { ShieldCheck, Plus, Check, Save } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export interface CustomRoleItem {
  id?: string;
  role: string;
  description: string;
  badgeColor: string;
  permissions: string[];
  moduleAccess?: Record<string, "Full Access" | "Read / Write" | "Read Only" | "—">;
  isCustom?: boolean;
}

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (newRole: CustomRoleItem) => void;
}

const availableModules = [
  "Dashboard KPI Telemetry",
  "Patient Management & 360°",
  "Care Professionals Availability",
  "Smart Allocation Engine",
  "Care Plans & Clinical Protocols",
  "Escalation Centre Triage",
  "Family Communication Hub",
  "Payments & Revenue Dashboard",
  "Partners & Referral Networks",
  "Settings & Role Delegation",
];

const colorOptions = [
  { label: "Teal / Cyan", value: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300" },
  { label: "Indigo", value: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" },
  { label: "Purple", value: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
  { label: "Blue", value: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  { label: "Emerald", value: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
  { label: "Amber", value: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  { label: "Rose", value: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" },
];

const standardScopeOptions = [
  "Patient 360 Records",
  "Shift Allocation & Rosters",
  "Caregiver Verification Review",
  "Clinical Telemetry Audits",
  "Escalation Response",
  "Family Communications",
  "Payment Invoicing & Ledgers",
  "Partner Referral Management",
  "System Compliance Settings",
];

export function AddRoleModal({ isOpen, onClose, onAddRole }: AddRoleModalProps) {
  const [roleTitle, setRoleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBadgeColor, setSelectedBadgeColor] = useState(colorOptions[0].value);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "Patient 360 Records",
    "Shift Allocation & Rosters",
  ]);
  const [modulePermissions, setModulePermissions] = useState<Record<string, "Full Access" | "Read / Write" | "Read Only" | "—">>({
    "Dashboard KPI Telemetry": "Read Only",
    "Patient Management & 360°": "Read / Write",
    "Care Professionals Availability": "Read / Write",
    "Smart Allocation Engine": "Read Only",
    "Care Plans & Clinical Protocols": "Read / Write",
    "Escalation Centre Triage": "Read Only",
    "Family Communication Hub": "Read / Write",
    "Payments & Revenue Dashboard": "—",
    "Partners & Referral Networks": "—",
    "Settings & Role Delegation": "—",
  });

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleModuleAccessChange = (moduleName: string, access: "Full Access" | "Read / Write" | "Read Only" | "—") => {
    setModulePermissions((prev) => ({
      ...prev,
      [moduleName]: access,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) {
      swiftAlert.error({
        title: "Role Title Required",
        description: "Please enter a title for the new operational role.",
      });
      return;
    }

    const newRole: CustomRoleItem = {
      id: `role-${Date.now()}`,
      role: roleTitle.trim(),
      description: description.trim() || `Operational role for ${roleTitle.trim()} with defined scopes.`,
      badgeColor: selectedBadgeColor,
      permissions: selectedScopes.length > 0 ? selectedScopes : ["Standard Access"],
      moduleAccess: modulePermissions,
      isCustom: true,
    };

    onAddRole(newRole);
    swiftAlert.success({
      title: "Role Created",
      description: `Role "${newRole.role}" has been added with ${selectedScopes.length} key scopes and updated matrix.`,
    });

    // Reset form
    setRoleTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              Create New Role & Permission Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Define operational privileges, clinical scoping, and module read/write access for team members.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Title & Badge Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Role Title *</Label>
                <Input
                  placeholder="e.g. Tele-Health Consultant, Field Supervisor..."
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Role Responsibilities & Description</Label>
              <Textarea
                placeholder="Brief summary of duties and data confidentiality scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs min-h-[60px]"
                rows={2}
              />
            </div>

            {/* Key Scopes Checkboxes */}
            <div className="rounded-xl border p-3.5 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground">Key Operational Scopes</Label>
                <span className="text-[11px] text-muted-foreground">{selectedScopes.length} selected</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {standardScopeOptions.map((scope) => {
                  const isChecked = selectedScopes.includes(scope);
                  return (
                    <button
                      type="button"
                      key={scope}
                      onClick={() => toggleScope(scope)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors ${
                        isChecked
                          ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-[#01265D] dark:text-blue-200 font-semibold"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${
                          isChecked
                            ? "bg-[#01265D] text-white border-[#01265D]"
                            : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                      <span>{scope}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module Permissions Matrix Configuration */}
            <div className="rounded-xl border p-3.5 bg-slate-50 dark:bg-slate-900/50 space-y-2.5">
              <Label className="text-xs font-bold text-foreground block">
                Module-Level Access Privileges
              </Label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableModules.map((mod) => (
                  <div
                    key={mod}
                    className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border text-xs"
                  >
                    <span className="font-medium text-foreground">{mod}</span>
                    <Select
                      value={modulePermissions[mod] || "—"}
                      onValueChange={(val: any) => handleModuleAccessChange(mod, val)}
                    >
                      <SelectTrigger className="h-7 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Access">Full Access</SelectItem>
                        <SelectItem value="Read / Write">Read / Write</SelectItem>
                        <SelectItem value="Read Only">Read Only</SelectItem>
                        <SelectItem value="—">No Access (—)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex items-center justify-between gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1.5 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save & Activate Role</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
