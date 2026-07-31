"use client";

import { useState, useMemo } from "react";
import {
  PatientRequirement,
  CaregiverCandidate,
  initialPendingAssignments,
} from "./_data/assignments";
import { AnalyzeRequirementModal } from "./_components/analyze-requirement-modal";
import { AssignCaregiverModal } from "./_components/assign-caregiver-modal";
import { AssignmentConfirmationModal } from "./_components/assignment-confirmation-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
  MapPin,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function SmartAssignmentPage() {
  const [assignments, setAssignments] = useState<PatientRequirement[]>(initialPendingAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Nurse" | "Caregiver" | "Physiotherapist">("All");
  const [urgencyFilter, setUrgencyFilter] = useState<"All" | "Normal" | "High" | "Urgent">("All");

  // Modal states
  const [selectedRequirement, setSelectedRequirement] = useState<PatientRequirement | null>(null);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);

  const [assignRequirement, setAssignRequirement] = useState<PatientRequirement | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [confirmedReq, setConfirmedReq] = useState<PatientRequirement | null>(null);
  const [confirmedCaregiver, setConfirmedCaregiver] = useState<CaregiverCandidate | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Filtered
  const filteredAssignments = useMemo(() => {
    return assignments.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.patientName.toLowerCase().includes(q) ||
        req.condition.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.location.neighborhood.toLowerCase().includes(q);

      const matchesRole = roleFilter === "All" || req.requestedRole === roleFilter;
      const matchesUrgency = urgencyFilter === "All" || req.urgency === urgencyFilter;

      return matchesSearch && matchesRole && matchesUrgency;
    });
  }, [assignments, searchQuery, roleFilter, urgencyFilter]);

  // Handlers
  const handleOpenAnalyze = (req: PatientRequirement) => {
    setSelectedRequirement(req);
    setIsAnalyzeOpen(true);
  };

  const handleOpenAssign = (req: PatientRequirement) => {
    setAssignRequirement(req);
    setIsAssignOpen(true);
  };

  const handleConfirmAssignment = (req: PatientRequirement, caregiver: CaregiverCandidate) => {
    // Update assignment status
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === req.id
          ? {
              ...item,
              status: "Assigned",
              assignedCaregiverId: caregiver.id,
              assignedCaregiverName: caregiver.name,
            }
          : item
      )
    );

    setConfirmedReq(req);
    setConfirmedCaregiver(caregiver);
    setIsConfirmOpen(true);

    swiftAlert.success({
      title: "Smart Match Complete",
      description: `${caregiver.name} assigned to ${req.patientName}. Notifications dispatched.`,
    });
  };

  const pendingCount = assignments.filter((a) => a.status === "Pending Assignment").length;
  const assignedToday = assignments.filter((a) => a.status === "Assigned").length;
  const urgentCount = assignments.filter((a) => a.urgency === "Urgent" && a.status === "Pending Assignment").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-teal-600" />
            Smart Assignment Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Automated AI caregiver matching based on patient condition, proximity, availability, skills & gender preference.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (filteredAssignments.length > 0) {
              handleOpenAssign(filteredAssignments[0]);
            }
          }}
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Auto-Match Next Request</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pending Assignments</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{pendingCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Awaiting Caregiver Match</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Urgent Care Needs</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{urgentCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Requires Immediate Dispatch</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Matched Today</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{assignedToday}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% Match Accuracy</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Patient Name, Condition, or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Role Needed:</span>
              <Select value={roleFilter} onValueChange={(val: any) => setRoleFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Caregiver">Caregiver</SelectItem>
                  <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Urgency:</span>
              <Select value={urgencyFilter} onValueChange={(val: any) => setUrgencyFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Urgency</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Assignments Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Booking ID / Patient</TableHead>
              <TableHead className="font-bold text-xs">Health Condition</TableHead>
              <TableHead className="font-bold text-xs">Requested Role</TableHead>
              <TableHead className="font-bold text-xs">Shift & Location</TableHead>
              <TableHead className="font-bold text-xs text-center">Urgency</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No pending assignments found matching your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((req) => (
                <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Booking ID & Patient */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{req.patientName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {req.id} · {req.patientAge}y ({req.patientGender})
                      </span>
                    </div>
                  </TableCell>

                  {/* Condition */}
                  <TableCell className="text-xs max-w-[220px]">
                    <div className="font-semibold text-foreground truncate">{req.condition}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{req.careRequirement}</div>
                  </TableCell>

                  {/* Role Needed */}
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="bg-teal-50 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-200 font-semibold text-[10px]">
                      {req.requestedRole}
                    </Badge>
                  </TableCell>

                  {/* Shift & Location */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{req.scheduleSlot}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {req.location.neighborhood}, {req.location.city}
                      </span>
                    </div>
                  </TableCell>

                  {/* Urgency */}
                  <TableCell className="text-center">
                    {req.urgency === "Urgent" ? (
                      <Badge variant="destructive" className="text-[10px] font-bold">Urgent</Badge>
                    ) : req.urgency === "High" ? (
                      <Badge className="bg-amber-600 text-white text-[10px] font-bold">High</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Normal</Badge>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    {req.status === "Assigned" ? (
                      <Badge className="bg-emerald-600 text-white font-semibold text-[10px]">
                        Assigned ({req.assignedCaregiverName})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-[10px]">
                        Pending Assignment
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAnalyze(req)}
                        className="h-8 text-xs gap-1 border-slate-200 hover:bg-slate-100"
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span>Analyze</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOpenAssign(req)}
                        disabled={req.status === "Assigned"}
                        className="h-8 text-xs gap-1 bg-teal-600 text-white hover:bg-teal-700 font-semibold shadow-xs"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Assign Caregiver</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredAssignments.length}</strong> care requirements
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            AI Proximity & Skill Matching Active
          </span>
        </div>
      </div>

      {/* Modals */}
      <AnalyzeRequirementModal
        isOpen={isAnalyzeOpen}
        onClose={() => setIsAnalyzeOpen(false)}
        requirement={selectedRequirement}
        onProceedToAssign={(req) => {
          setAssignRequirement(req);
          setIsAssignOpen(true);
        }}
      />

      <AssignCaregiverModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        requirement={assignRequirement}
        onConfirmAssignment={handleConfirmAssignment}
      />

      <AssignmentConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        requirement={confirmedReq}
        assignedCaregiver={confirmedCaregiver}
      />
    </div>
  );
}
