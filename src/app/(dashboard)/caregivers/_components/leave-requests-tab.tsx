"use client";

import { useState, useMemo } from "react";
import {
  CaregiverLeaveRequest,
  LeaveStatus,
  LeaveType,
  ReassignedStaffInfo,
  initialLeaveRequests,
} from "../_data/leave-requests";
import { RejectLeaveModal } from "./reject-leave-modal";
import { ReassignStaffModal } from "./reassign-staff-modal";
import { LeaveDetailsModal } from "./leave-details-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Check,
  X,
  Calendar,
  Eye,
  ArrowRightLeft,
  Plus,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export function LeaveRequestsTab() {
  const [leaveRequests, setLeaveRequests] = useState<CaregiverLeaveRequest[]>(initialLeaveRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Reject Modal State
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedLeaveForReject, setSelectedLeaveForReject] = useState<CaregiverLeaveRequest | null>(null);

  // View Details Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLeaveForDetails, setSelectedLeaveForDetails] = useState<CaregiverLeaveRequest | null>(null);

  // Reassign Staff Modal State
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [selectedLeaveForReassign, setSelectedLeaveForReassign] = useState<CaregiverLeaveRequest | null>(null);

  // Manual Add Leave State
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [newCaregiverName, setNewCaregiverName] = useState("");
  const [newRole, setNewRole] = useState<"Nurse" | "Caregiver" | "Physiotherapist">("Caregiver");
  const [newPhone, setNewPhone] = useState("");
  const [newLeaveType, setNewLeaveType] = useState<LeaveType>("Casual Leave");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newReason, setNewReason] = useState("");

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.caregiverName.toLowerCase().includes(q) ||
        req.caregiverId.toLowerCase().includes(q) ||
        req.phoneNumber.includes(q) ||
        req.reason.toLowerCase().includes(q) ||
        (req.reassignedTo && req.reassignedTo.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || req.status === statusFilter;
      const matchesRole = roleFilter === "All" || req.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [leaveRequests, searchQuery, statusFilter, roleFilter]);

  // Counts
  const totalCount = leaveRequests.length;
  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejectedCount = leaveRequests.filter((r) => r.status === "Rejected").length;

  // Handlers
  const handleApprove = (id: string, name: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Approved",
              reviewedBy: "Admin / Ops Manager",
              reviewedAt: new Date().toLocaleString(),
            }
          : req
      )
    );
    const approvedTarget = leaveRequests.find((r) => r.id === id);
    swiftAlert.success({
      title: "Leave Approved",
      description: `Leave request for ${name} has been approved. You can now reassign substitute staff.`,
    });

    // Automatically prompt for reassignment if desired
    if (approvedTarget) {
      setTimeout(() => {
        setSelectedLeaveForReassign({ ...approvedTarget, status: "Approved" });
        setIsReassignOpen(true);
      }, 400);
    }
  };

  const handleOpenRejectModal = (req: CaregiverLeaveRequest) => {
    setSelectedLeaveForReject(req);
    setIsRejectOpen(true);
  };

  const handleConfirmReject = (id: string, rejectionReason: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Rejected",
              rejectionReason,
              reviewedBy: "Admin / Ops Manager",
              reviewedAt: new Date().toLocaleString(),
            }
          : req
      )
    );
  };

  const handleOpenReassignModal = (req: CaregiverLeaveRequest) => {
    setSelectedLeaveForReassign(req);
    setIsReassignOpen(true);
  };

  const handleConfirmReassign = (
    leaveId: string,
    reassignedStaff: ReassignedStaffInfo,
    notes: string
  ) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === leaveId
          ? {
              ...req,
              reassignedTo: reassignedStaff,
              reassignedAt: new Date().toLocaleString(),
              reassignedBy: "Admin / Ops Manager",
              patientCoverageNotes: notes,
            }
          : req
      )
    );
  };

  const handleViewDetails = (req: CaregiverLeaveRequest) => {
    setSelectedLeaveForDetails(req);
    setIsDetailsOpen(true);
  };

  // Submit manual leave request
  const handleCreateManualLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaregiverName || !newStartDate || !newEndDate || !newReason) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill all required fields.",
      });
      return;
    }

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: CaregiverLeaveRequest = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      caregiverId: `CG-${Math.floor(100 + Math.random() * 900)}`,
      caregiverName: newCaregiverName.trim(),
      role: newRole,
      phoneNumber: newPhone.trim() || "+91 98000 00000",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      leaveType: newLeaveType,
      startDate: newStartDate,
      endDate: newEndDate,
      daysCount: isNaN(daysCount) ? 1 : daysCount,
      reason: newReason.trim(),
      appliedOn: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    swiftAlert.success({
      title: "Leave Request Logged",
      description: `New leave request logged for ${newCaregiverName}.`,
    });
    setIsAddLeaveOpen(false);
  };

  // Helper for Leave Type Badges
  const getLeaveTypeBadge = (type: LeaveType) => {
    switch (type) {
      case "Sick Leave":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
      case "Emergency Leave":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      case "Casual Leave":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800";
      case "Annual Leave":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Requests
          </p>
          <p className="text-2xl font-black text-foreground mt-1">{totalCount}</p>
        </div>

        <div className="rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Approvals
            </p>
            {pendingCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Approved Leaves
          </p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-xl border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Rejected Leaves
          </p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Caregiver Name, ID, Phone, or Reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val || "All")}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Role:</span>
              <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val || "All")}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Caregiver">Caregiver</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || statusFilter !== "All" || roleFilter !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setRoleFilter("All");
                }}
                className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => setIsAddLeaveOpen(true)}
              className="h-9 gap-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Leave Request</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                Care Professional
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-28">
                Leave Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-44">
                Dates & Duration
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reason for Leave
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center w-28">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-48">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-xs text-muted-foreground font-medium"
                >
                  No leave requests found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow
                  key={req.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                >
                  {/* Care Professional Info */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shrink-0">
                        <AvatarImage src={req.avatar} alt={req.caregiverName} />
                        <AvatarFallback className="text-xs font-bold bg-teal-100 text-teal-800">
                          {req.caregiverName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{req.caregiverName}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                          <span className="font-mono">{req.caregiverId}</span>
                          <span>&bull;</span>
                          <span className="font-medium text-teal-700 dark:text-teal-400">{req.role}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Leave Type */}
                  <TableCell className="py-3.5">
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border ${getLeaveTypeBadge(req.leaveType)}`}>
                      {req.leaveType}
                    </Badge>
                  </TableCell>

                  {/* Dates & Duration */}
                  <TableCell className="py-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Calendar className="h-3 w-3 text-teal-600 shrink-0" />
                        <span>{req.startDate}</span>
                        <span className="text-muted-foreground text-[10px]">to</span>
                        <span>{req.endDate}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                          {req.daysCount} {req.daysCount === 1 ? "Day" : "Days"} Leave
                        </Badge>
                        <span className="ml-1.5 text-[10px]">Applied: {req.appliedOn}</span>
                      </p>
                    </div>
                  </TableCell>

                  {/* Reason for Leave (Clean - no reject box in table) */}
                  <TableCell className="py-3.5">
                    <div className="max-w-md">
                      <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">
                        &ldquo;{req.reason}&rdquo;
                      </p>
                      {req.reassignedTo && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-teal-700 dark:text-teal-300">
                          <ArrowRightLeft className="h-3 w-3 shrink-0" />
                          <span>
                            Substitute: <strong>{req.reassignedTo.name}</strong> ({req.reassignedTo.role})
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5 text-center">
                    {req.status === "Pending" && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                        ⏳ Pending
                      </Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                        ✓ Approved
                      </Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-800">
                        ✕ Rejected
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(req)}
                        className="h-8 text-xs text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950 px-2 gap-1"
                        title="View Leave Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      {/* If Pending: Approve & Reject */}
                      {req.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id, req.caregiverName)}
                            className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 shadow-xs"
                            title="Approve Leave & Reassign"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRejectModal(req)}
                            className="h-8 gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold px-2"
                            title="Reject Leave"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}

                      {/* If Approved: Reassign Staff Button */}
                      {req.status === "Approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReassignModal(req)}
                          className="h-8 gap-1 text-teal-700 border-teal-200 hover:bg-teal-50 dark:text-teal-300 dark:border-teal-800 dark:hover:bg-teal-950 text-xs font-semibold px-2"
                          title="Reassign another substitute staff"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                          <span>{req.reassignedTo ? "Change Staff" : "Reassign Staff"}</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredRequests.length}</strong> of{" "}
            <strong className="text-foreground">{leaveRequests.length}</strong> leave requests
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Caregiver Roster Sync Active
          </span>
        </div>
      </div>

      {/* View Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        leaveRequest={selectedLeaveForDetails}
        onApprove={handleApprove}
        onOpenReject={handleOpenRejectModal}
        onOpenReassign={handleOpenReassignModal}
      />

      {/* Reject Leave Modal */}
      <RejectLeaveModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        leaveRequest={selectedLeaveForReject}
        onConfirmReject={handleConfirmReject}
      />

      {/* Reassign Staff Modal */}
      <ReassignStaffModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        leaveRequest={selectedLeaveForReassign}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* Manual Add Leave Modal */}
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Log Caregiver Leave Request</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manually register a phone-in or offline leave request on behalf of a caregiver.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateManualLeave} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Care Professional Name *</Label>
              <Input
                value={newCaregiverName}
                onChange={(e) => setNewCaregiverName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role *</Label>
                <Select value={newRole} onValueChange={(val: any) => setNewRole(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Caregiver">Caregiver</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Leave Type *</Label>
                <Select value={newLeaveType} onValueChange={(val: any) => setNewLeaveType(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reason for Leave *</Label>
              <Input
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Medical illness, family emergency..."
                className="h-9 text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddLeaveOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold"
              >
                Submit Leave Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
