"use client";

import { useState, useMemo, Suspense } from "react";
import { VisitSchedule, initialVisitSchedules } from "./_data/schedules";
import { CalendarView } from "./_components/calendar-view";
import { CreateScheduleModal } from "./_components/create-schedule-modal";
import { ReplacementManagementModal } from "./_components/replacement-management-modal";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Grid,
  List,
  CalendarDays,
  Activity,
  HeartPulse,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

function SchedulingContent() {
  const [schedules, setSchedules] = useState<VisitSchedule[]>(initialVisitSchedules);
  const [activeTab, setActiveTab] = useState<"snapshot" | "calendar" | "replacements">("snapshot");

  // Date selection for daily snapshot
  const [selectedDate, setSelectedDate] = useState("2026-08-31");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReplacementSchedule, setSelectedReplacementSchedule] = useState<VisitSchedule | null>(null);
  const [isReplacementOpen, setIsReplacementOpen] = useState(false);

  // Filtered schedules for the daily shift snapshot view
  const filteredDailySchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchesDate = s.date === selectedDate;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.patientName.toLowerCase().includes(q) ||
        s.caregiverName.toLowerCase().includes(q) ||
        s.service.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);

      const matchesService = serviceFilter === "All" || s.service === serviceFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;

      return matchesDate && matchesSearch && matchesService && matchesStatus;
    });
  }, [schedules, selectedDate, searchQuery, serviceFilter, statusFilter]);

  const replacementNeededSchedules = useMemo(() => {
    return schedules.filter((s) => s.status === "Replacement Required");
  }, [schedules]);

  const handleAddSchedule = (newSchedule: VisitSchedule) => {
    setSchedules((prev) => [newSchedule, ...prev]);
  };

  const handleAssignReplacement = (scheduleId: string, newCaregiverName: string, reason: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === scheduleId
          ? {
            ...s,
            caregiverName: newCaregiverName,
            status: "Confirmed",
            notes: `Replacement assigned: ${newCaregiverName}. Reason: ${reason}`,
          }
          : s
      )
    );
  };

  const handleStatusChange = (scheduleId: string, newStatus: VisitSchedule["status"]) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, status: newStatus } : s))
    );
    swiftAlert.success({
      title: "Status Updated",
      description: `Shift status changed to ${newStatus}.`,
    });
  };

  // Metrics for daily snapshot
  const dailyMetrics = useMemo(() => {
    const todays = schedules.filter((s) => s.date === selectedDate);
    return {
      total: todays.length,
      confirmed: todays.filter((s) => s.status === "Confirmed").length,
      inProgress: todays.filter((s) => s.status === "In-Progress").length,
      completed: todays.filter((s) => s.status === "Completed").length,
      replacementNeeded: todays.filter((s) => s.status === "Replacement Required").length,
    };
  }, [schedules, selectedDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Scheduling
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-amber-400" />
              Daily Shift Snapshot
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time daily shift snapshot view, patient-professional allocation, and calendar dispatch.
          </p>
        </div>

        {/* <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 gap-1.5 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule New Shift</span>
          </Button>
        </div> */}
      </div>

      <div className="space-y-4">
        {/* Snapshot Controls & Day Selector */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card p-3 rounded-xl border">
          {/* Quick Day Toggle */}
          {/* <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">Snapshot Date:</span>
            <div className="inline-flex rounded-lg border bg-slate-50 p-0.5 dark:bg-slate-900">
              <button
                onClick={() => setSelectedDate("2026-08-31")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedDate === "2026-08-31"
                    ? "bg-[#01265D] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Today (31 Aug)
              </button>
              <button
                onClick={() => setSelectedDate("2026-09-01")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${selectedDate === "2026-09-01"
                    ? "bg-[#01265D] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Tomorrow (01 Sep)
              </button>
            </div>
          </div> */}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient, professional..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={serviceFilter} onValueChange={(val) => setServiceFilter(val || "All")}>
              <SelectTrigger className="h-9 text-xs w-40">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Services</SelectItem>
                <SelectItem value="Essential Care">Essential Care</SelectItem>
                <SelectItem value="Skilled Care">Skilled Care</SelectItem>
                <SelectItem value="Recovery">Recovery</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "All")}>
              <SelectTrigger className="h-9 text-xs w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In-Progress">In-Progress</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Replacement Required">Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* EXACT TABLE: Time | Patient | Professional | Service | Status */}
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/60">
                <TableHead className="font-extrabold text-xs text-foreground py-3.5 w-44">
                  Time
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3.5">
                  Patient
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3.5">
                  Professional
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3.5">
                  Service
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3.5 text-center">
                  Status
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3.5 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDailySchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-36 text-center text-muted-foreground text-xs font-medium">
                    No shift records found for {selectedDate} matching the active filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDailySchedules.map((schedule) => (
                  <TableRow
                    key={schedule.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    {/* Column 1: Time */}
                    <TableCell className="font-semibold text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {schedule.timeSlotFormatted || `${schedule.startTime}–${schedule.endTime}`}
                        </span>
                      </div>
                    </TableCell>

                    {/* Column 2: Patient */}
                    <TableCell>
                      <div>
                        <p className="font-bold text-xs text-foreground">{schedule.patientName}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          <span className="truncate max-w-[220px]">{schedule.patientAddress}</span>
                        </p>
                      </div>
                    </TableCell>

                    {/* Column 3: Professional */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border">
                          <AvatarFallback className="bg-blue-50 text-[#01265D] font-bold text-[10px]">
                            {schedule.caregiverRole === "Nurse" ? "RN" : schedule.caregiverRole === "Physiotherapist" ? "PT" : "CG"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{schedule.caregiverName}</p>
                          <Badge variant="outline" className="text-[9px] font-medium py-0 px-1 text-muted-foreground">
                            {schedule.caregiverRole}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Column 4: Service */}
                    <TableCell>
                      <Badge
                        className={`text-xs font-bold ${schedule.service === "Essential Care"
                            ? "bg-amber-100 text-amber-900 border-amber-200"
                            : schedule.service === "Skilled Care"
                              ? "bg-blue-100 text-[#01265D] border-blue-200"
                              : "bg-emerald-100 text-emerald-900 border-emerald-200"
                          }`}
                      >
                        {schedule.service}
                      </Badge>
                    </TableCell>

                    {/* Column 5: Status */}
                    <TableCell className="text-center">
                      <Badge
                        className={`text-[11px] font-bold ${schedule.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : schedule.status === "In-Progress"
                              ? "bg-blue-100 text-[#01265D] border-blue-200 animate-pulse"
                              : schedule.status === "Replacement Required"
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : "bg-slate-100 text-slate-800"
                          }`}
                      >
                        {schedule.status === "Confirmed" && "✓ "}
                        {schedule.status === "In-Progress" && "⏳ "}
                        {schedule.status === "Replacement Required" && "⚠️ "}
                        {schedule.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {schedule.status === "Replacement Required" ? (
                          <Button
                            size="sm"
                            className="h-7 text-[11px] bg-rose-600 hover:bg-rose-700 text-white font-bold"
                            onClick={() => {
                              setSelectedReplacementSchedule(schedule);
                              setIsReplacementOpen(true);
                            }}
                          >
                            Reassign
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] font-medium"
                            onClick={() => {
                              swiftAlert.info({
                                title: `Shift Details: ${schedule.patientName}`,
                                description: `Assigned: ${schedule.caregiverName} | Service: ${schedule.service} | Timing: ${schedule.timeSlotFormatted} | Status: ${schedule.status}`,
                              });
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
      <CreateScheduleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddSchedule={handleAddSchedule}
      />

      <ReplacementManagementModal
        isOpen={isReplacementOpen}
        onClose={() => setIsReplacementOpen(false)}
        schedule={selectedReplacementSchedule}
        onAssignReplacement={handleAssignReplacement}
      />
    </div>
  );
}

export default function SchedulingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Scheduling...</div>}>
      <SchedulingContent />
    </Suspense>
  );
}
