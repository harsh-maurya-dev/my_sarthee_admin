"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function SchedulingPage() {
  const [schedules, setSchedules] = useState<VisitSchedule[]>(initialVisitSchedules);
  const [activeTab, setActiveTab] = useState<"calendar" | "table" | "replacements">("calendar");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Scheduled" | "In-Progress" | "Completed" | "Replacement Required">("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReplacementSchedule, setSelectedReplacementSchedule] = useState<VisitSchedule | null>(null);
  const [isReplacementOpen, setIsReplacementOpen] = useState(false);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.patientName.toLowerCase().includes(q) ||
        s.caregiverName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.patientAddress.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schedules, searchQuery, statusFilter]);

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
              status: "Scheduled",
              notes: `Replacement assigned: ${newCaregiverName}. Reason: ${reason}`,
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <CalendarIcon className="h-7 w-7 text-teal-600" />
            Scheduling & Calendar Dispatch
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage caregiver shifts, home visit calendars, and replacement dispatch.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Schedule Visit</span>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === "calendar"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Calendar Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab("table")}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === "table"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
            <span>Scheduled Visits Roster</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {schedules.length}
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab("replacements")}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === "replacements"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Replacement Requests</span>
            {replacementNeededSchedules.length > 0 && (
              <Badge className="bg-rose-600 text-white text-[10px] px-1.5 py-0">
                {replacementNeededSchedules.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: CALENDAR DISPATCH */}
      {activeTab === "calendar" && (
        <CalendarView
          schedules={schedules}
          onSelectSchedule={(s) => {}}
          onRequestReplacement={(s) => {
            setSelectedReplacementSchedule(s);
            setIsReplacementOpen(true);
          }}
        />
      )}

      {/* TAB 2: SCHEDULED VISITS ROSTER TABLE */}
      {activeTab === "table" && (
        <>
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Patient, Caregiver, or Address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                  <SelectTrigger className="h-9 text-xs w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Replacement Required">Replacement Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Visit ID / Date</TableHead>
                  <TableHead className="font-bold text-xs">Patient & Address</TableHead>
                  <TableHead className="font-bold text-xs">Assigned Caregiver</TableHead>
                  <TableHead className="font-bold text-xs">Shift Timing</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No visit schedules found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="text-xs">
                        <div className="flex flex-col font-mono">
                          <span className="font-bold text-foreground">{s.id}</span>
                          <span className="text-[10px] text-muted-foreground">{s.date}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{s.patientName}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                            {s.patientAddress}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{s.caregiverName}</span>
                          <span className="text-[10px] text-muted-foreground">{s.caregiverRole}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>{s.startTime} - {s.endTime}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={
                            s.status === "Completed"
                              ? "default"
                              : s.status === "In-Progress"
                              ? "secondary"
                              : s.status === "Replacement Required"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-[10px] font-bold"
                        >
                          {s.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReplacementSchedule(s);
                            setIsReplacementOpen(true);
                          }}
                          className="h-8 text-xs gap-1 border-slate-200"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Re-Assign</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* TAB 3: REPLACEMENT REQUESTS */}
      {activeTab === "replacements" && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            Unassigned / Replacement Required Visits ({replacementNeededSchedules.length})
          </h3>

          {replacementNeededSchedules.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground border rounded-xl">
              All caregiver shifts are currently filled with active caregivers.
            </div>
          ) : (
            <div className="space-y-3">
              {replacementNeededSchedules.map((s) => (
                <div key={s.id} className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-foreground">{s.patientName} — {s.date} ({s.startTime})</h4>
                    <p className="text-muted-foreground mt-0.5">{s.patientAddress} · Replaced: {s.caregiverName}</p>
                    {s.notes && <p className="text-rose-700 font-semibold mt-1">{s.notes}</p>}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedReplacementSchedule(s);
                      setIsReplacementOpen(true);
                    }}
                    className="h-8 text-xs bg-rose-600 text-white hover:bg-rose-700 font-bold gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Assign Replacement
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
