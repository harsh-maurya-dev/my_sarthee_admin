"use client";

import { useState, useMemo } from "react";
import { CaregiverLeaveRequest, ReassignedStaffInfo } from "../_data/leave-requests";
import { initialCareProfessionals, CareProfessional } from "@/lib/admin-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCheck,
  Search,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReassignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: CaregiverLeaveRequest | null;
  onConfirmReassign: (leaveId: string, staff: ReassignedStaffInfo, notes: string) => void;
}

export function ReassignStaffModal({
  isOpen,
  onClose,
  leaveRequest,
  onConfirmReassign,
}: ReassignStaffModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [coverageNotes, setCoverageNotes] = useState("");

  // Filter candidates matching the same role or available professionals
  const availableCandidates = useMemo(() => {
    if (!leaveRequest) return [];
    return initialCareProfessionals.filter((pro) => {
      // Role match
      const roleMatch =
        pro.type.toLowerCase() === leaveRequest.role.toLowerCase() ||
        (leaveRequest.role === "Caregiver" && pro.type === "Caregiver") ||
        (leaveRequest.role === "Nurse" && pro.type === "Nurse");

      // Don't include the person who is taking leave
      const notSamePerson = pro.name.toLowerCase() !== leaveRequest.caregiverName.toLowerCase();

      // Search match
      const searchMatch =
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.specializations.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return roleMatch && notSamePerson && searchMatch;
    });
  }, [leaveRequest, searchQuery]);

  if (!leaveRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      swiftAlert.error({
        title: "Selection Required",
        description: "Please select a substitute care professional to reassign.",
      });
      return;
    }

    const targetPro = initialCareProfessionals.find((p) => p.id === selectedStaffId);
    if (!targetPro) return;

    const reassignedInfo: ReassignedStaffInfo = {
      id: targetPro.id,
      name: targetPro.name,
      role: targetPro.type,
      phone: targetPro.phone,
      avatar: targetPro.avatar || "",
      zone: targetPro.area,
    };

    onConfirmReassign(leaveRequest.id, reassignedInfo, coverageNotes.trim());
    swiftAlert.success({
      title: "Staff Reassigned",
      description: `${targetPro.name} has been assigned to cover ${leaveRequest.caregiverName}'s shifts.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-teal-600">
            <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
              <ArrowRightLeft className="h-4 w-4 text-teal-600" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Reassign Replacement Staff
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Assign an active substitute professional to cover patient visits during this approved leave period.
          </DialogDescription>
        </DialogHeader>

        {/* Leave Summary */}
        <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">On-Leave Professional:</span>
              <span className="font-bold text-foreground">{leaveRequest.caregiverName}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                {leaveRequest.role}
              </Badge>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
              Leave Approved
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold text-foreground">
              {leaveRequest.startDate} to {leaveRequest.endDate}
            </span>
            <span>({leaveRequest.daysCount} days coverage needed)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Candidate Search & Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Select Substitute {leaveRequest.role} <span className="text-rose-500">*</span>
            </Label>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={`Search available ${leaveRequest.role}s by name, zone, or skills...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Candidate List */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border rounded-xl p-2 bg-card">
              {availableCandidates.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No matching active {leaveRequest.role}s found for substitution.
                </div>
              ) : (
                availableCandidates.map((pro) => {
                  const isSelected = selectedStaffId === pro.id;
                  return (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedStaffId(pro.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-teal-50/80 border-teal-500 dark:bg-teal-950/40 dark:border-teal-600 shadow-xs"
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage src={pro.avatar} alt={pro.name} />
                          <AvatarFallback className="text-xs font-bold bg-teal-100 text-teal-800">
                            {pro.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground">{pro.name}</span>
                            <span className="text-[10px] text-muted-foreground">({pro.id})</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>📍 {pro.area}</span>
                            <span>&bull;</span>
                            <span>⭐ {pro.rating}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-600 font-semibold">{pro.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isSelected ? (
                          <div className="h-5 w-5 rounded-full bg-[#01265D] text-white flex items-center justify-center">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-700" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Coverage Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="coverageNotes" className="text-xs font-semibold">
              Shift Coverage Handover Notes
            </Label>
            <Textarea
              id="coverageNotes"
              placeholder="e.g. Assigned to Patient #MS1024 (12h Shift - 8:00 AM to 8:00 PM). Handover clinical vitals checklist..."
              value={coverageNotes}
              onChange={(e) => setCoverageNotes(e.target.value)}
              className="text-xs min-h-[60px]"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold"
            >
              Confirm Reassignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
