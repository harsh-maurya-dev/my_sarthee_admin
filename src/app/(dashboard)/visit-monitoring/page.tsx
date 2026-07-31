"use client";

import { useState, useMemo } from "react";
import { MonitoredVisit, initialMonitoredVisits } from "./_data/visits";
import { VisitDetailsModal } from "./_components/visit-details-modal";
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
  Eye,
  Search,
  Filter,
  Activity,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Compass,
  CheckSquare,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function VisitMonitoringPage() {
  const [visits, setVisits] = useState<MonitoredVisit[]>(initialMonitoredVisits);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "In-Progress (Check-In)" | "Completed (Check-Out)" | "Delayed">("All");

  const [selectedVisit, setSelectedVisit] = useState<MonitoredVisit | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        v.patientName.toLowerCase().includes(q) ||
        v.caregiverName.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.patientAddress.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || v.liveStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [visits, searchQuery, statusFilter]);

  const liveActiveCount = visits.filter((v) => v.liveStatus.includes("Check-In")).length;
  const completedCount = visits.filter((v) => v.liveStatus.includes("Check-Out")).length;
  const delayedCount = visits.filter((v) => v.liveStatus === "Delayed" || v.liveStatus === "Missed").length;

  const handleOpenDetails = (visit: MonitoredVisit) => {
    setSelectedVisit(visit);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Eye className="h-7 w-7 text-teal-600" />
            Visit Monitoring & Real-time Telemetry
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time GPS geofence check-ins, active visit telemetry, task progress, and check-out logs.
          </p>
        </div>
        {delayedCount > 0 && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              swiftAlert.error({
                title: "Delayed Visit Alert",
                description: `${delayedCount} visit requires immediate caregiver follow-up.`,
              })
            }
            className="h-9 gap-2 text-xs font-semibold shadow-xs"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Review Delayed Visits ({delayedCount})</span>
          </Button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Live Active Visits</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1 flex items-center gap-2">
              {liveActiveCount}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Checked-in & In Progress</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Radio className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Completed Today</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{completedCount}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Checked-out & Vitals Logged</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Delayed / Missed Visits</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{delayedCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Geofence Check-in Overdue</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Telemetry ID, Patient, Caregiver, or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
              <SelectTrigger className="h-9 text-xs w-44">
                <SelectValue placeholder="Live Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="In-Progress (Check-In)">In-Progress Only</SelectItem>
                <SelectItem value="Completed (Check-Out)">Completed Only</SelectItem>
                <SelectItem value="Delayed">Delayed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Live Visit Telemetry Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Telemetry ID / Date</TableHead>
              <TableHead className="font-bold text-xs">Patient & Location</TableHead>
              <TableHead className="font-bold text-xs">Caregiver</TableHead>
              <TableHead className="font-bold text-xs">Check-In Status</TableHead>
              <TableHead className="font-bold text-xs">Check-Out Status</TableHead>
              <TableHead className="font-bold text-xs">Duration & Task Status</TableHead>
              <TableHead className="font-bold text-xs text-center">Live Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No monitored visits found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((v) => {
                const completedTasks = v.tasks.filter((t) => t.completed).length;

                return (
                  <TableRow key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                    {/* Telemetry ID */}
                    <TableCell className="text-xs">
                      <div className="flex flex-col font-mono">
                        <span className="font-bold text-foreground">{v.id}</span>
                        <span className="text-[10px] text-muted-foreground">{v.date}</span>
                      </div>
                    </TableCell>

                    {/* Patient & Location */}
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{v.patientName}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[180px] flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          {v.patientAddress}
                        </span>
                      </div>
                    </TableCell>

                    {/* Caregiver */}
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{v.caregiverName}</span>
                        <span className="text-[10px] text-muted-foreground">{v.caregiverRole}</span>
                      </div>
                    </TableCell>

                    {/* Check-In */}
                    <TableCell className="text-xs">
                      {v.checkIn.status === "Verified Geofence" ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Compass className="h-3 w-3" /> Geofence Verified
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">{v.checkIn.timestamp}</span>
                        </div>
                      ) : (
                        <Badge variant="destructive" className="text-[9px]">Missed Check-In</Badge>
                      )}
                    </TableCell>

                    {/* Check-Out */}
                    <TableCell className="text-xs">
                      {v.checkOut.status === "Verified Check-Out" ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Checked-Out
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">{v.checkOut.timestamp}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-600">Pending Check-Out</span>
                      )}
                    </TableCell>

                    {/* Duration & Task Status */}
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {v.actualDurationMinutes} mins elapsed ({v.plannedDurationHours}h planned)
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <CheckSquare className="h-3 w-3 text-teal-600" />
                          Tasks: <strong className="text-foreground">{completedTasks}/{v.tasks.length} Done</strong>
                        </span>
                      </div>
                    </TableCell>

                    {/* Live Status */}
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          v.liveStatus.includes("Check-In")
                            ? "secondary"
                            : v.liveStatus.includes("Check-Out")
                            ? "default"
                            : "destructive"
                        }
                        className="text-[10px] font-bold"
                      >
                        {v.liveStatus}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetails(v)}
                        className="h-8 text-xs gap-1 border-slate-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredVisits.length}</strong> monitored caregiver visits
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            Live Telemetry Stream Active
          </span>
        </div>
      </div>

      {/* Visit Details Modal */}
      <VisitDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        visit={selectedVisit}
      />
    </div>
  );
}
