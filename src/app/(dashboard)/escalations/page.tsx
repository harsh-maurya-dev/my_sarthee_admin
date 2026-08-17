"use client";

import { useState, useMemo } from "react";
import {
  initialEscalations,
  EscalationRecord,
  EscalationPriority,
} from "@/lib/admin-data";
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
import { Textarea } from "@/components/ui/textarea";
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
import {
  AlertTriangle,
  AlertOctagon,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Plus,
  Send,
  Stethoscope,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function EscalationCentrePage() {
  const [escalations, setEscalations] = useState<EscalationRecord[]>(initialEscalations);
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationRecord | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const filteredEscalations = useMemo(() => {
    return escalations.filter((esc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        esc.patientName.toLowerCase().includes(q) ||
        esc.professionalName.toLowerCase().includes(q) ||
        esc.issue.toLowerCase().includes(q) ||
        esc.escalationId.toLowerCase().includes(q);

      const matchesTab =
        selectedTab === "All" ||
        (selectedTab === "Critical" && esc.priority === "Critical") ||
        (selectedTab === "High" && esc.priority === "High") ||
        (selectedTab === "Medium" && esc.priority === "Medium") ||
        (selectedTab === "Resolved" && esc.priority === "Resolved");

      return matchesSearch && matchesTab;
    });
  }, [escalations, searchQuery, selectedTab]);

  const handleResolve = () => {
    if (!selectedEscalation) return;

    setEscalations((prev) =>
      prev.map((e) =>
        e.id === selectedEscalation.id
          ? {
              ...e,
              priority: "Resolved",
              status: "Resolved",
              resolutionNotes: resolutionNote || "Resolved with patient sign-off and clinical review.",
              closureTime: new Date().toLocaleTimeString(),
            }
          : e
      )
    );

    swiftAlert.success({
      title: "Escalation Closed & Resolved",
      description: `${selectedEscalation.escalationId} closed. Quality audit logged.`,
    });

    setIsResolveModalOpen(false);
    setResolutionNote("");
    setSelectedEscalation(null);
  };

  const getPriorityBadge = (p: EscalationPriority) => {
    switch (p) {
      case "Critical":
        return <Badge className="bg-rose-600 text-white font-extrabold animate-pulse">🔴 Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-500 text-white font-bold">🟠 High</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500 text-white font-bold">🟡 Medium</Badge>;
      case "Resolved":
        return <Badge className="bg-emerald-600 text-white font-bold">🟢 Resolved</Badge>;
      default:
        return <Badge variant="outline">{p}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Escalation Centre
            </h1>
            <Badge variant="destructive" className="font-semibold text-xs flex items-center gap-1">
              <AlertOctagon className="h-3.5 w-3.5" /> Clinical Quality & Patient Safety
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Standardized triage for medical concerns, emergency alerts, caregiver no-shows, and schedule changes.
          </p>
        </div>
        {/* <Button
          size="sm"
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm gap-1.5"
          onClick={() => swiftAlert.info({ title: "Raise Manual Escalation", description: "Opening rapid clinical triage form." })}
        >
          <Plus className="h-4 w-4" />
          Raise Incident
        </Button> */}
      </div>

      {/* Triage Priority Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => setSelectedTab("Critical")}
          className="cursor-pointer rounded-xl border border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20 p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">🔴 Critical Severity</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-950 dark:text-rose-100">
            {escalations.filter((e) => e.priority === "Critical").length}
          </div>
          <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">Medical concern / emergency / vitals spike</p>
        </div>

        <div
          onClick={() => setSelectedTab("High")}
          className="cursor-pointer rounded-xl border border-orange-200 bg-orange-50/50 dark:border-orange-900/60 dark:bg-orange-950/20 p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-900 dark:text-orange-200">🟠 High Priority</span>
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-orange-950 dark:text-orange-100">
            {escalations.filter((e) => e.priority === "High").length}
          </div>
          <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-1">Missed visit / patient complaint / delayed care</p>
        </div>

        <div
          onClick={() => setSelectedTab("Medium")}
          className="cursor-pointer rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20 p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200">🟡 Medium Priority</span>
            <UserCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-950 dark:text-amber-100">
            {escalations.filter((e) => e.priority === "Medium").length}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">Schedule change / replacement required</p>
        </div>

        <div
          onClick={() => setSelectedTab("Resolved")}
          className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20 p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">🟢 Resolved Cases</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-950 dark:text-emerald-100">
            {escalations.filter((e) => e.priority === "Resolved").length}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">Closed with root-cause analysis</p>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {["All", "Critical", "High", "Medium", "Resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                selectedTab === tab
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patient, professional, issue..."
            className="pl-9 text-xs rounded-xl bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Escalation Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table className="min-w-[1200px] w-full">
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80 border-b">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[110px] min-w-[110px]">
                Escalation ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[120px] min-w-[120px]">
                Priority
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                Patient & Area
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                Professional
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[280px] min-w-[280px]">
                Issue Description
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px] min-w-[160px]">
                Assigned To
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[280px] min-w-[280px]">
                Action Taken & Resolution
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-[130px] min-w-[130px] text-right">
                Triage Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEscalations.map((esc) => (
              <TableRow key={esc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b">
                <TableCell className="text-xs font-mono font-bold py-3.5 align-top whitespace-nowrap">
                  {esc.escalationId}
                </TableCell>
                <TableCell className="py-3.5 align-top whitespace-nowrap">
                  {getPriorityBadge(esc.priority)}
                </TableCell>
                <TableCell className="py-3.5 align-top">
                  <div className="text-xs font-bold text-foreground">{esc.patientName}</div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{esc.patientId} · {esc.patientLocation}</span>
                </TableCell>
                <TableCell className="py-3.5 align-top">
                  <div className="text-xs font-semibold text-foreground">{esc.professionalName}</div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{esc.professionalRole}</span>
                </TableCell>
                <TableCell className="text-xs py-3.5 align-top whitespace-normal break-words max-w-[280px]">
                  <span className="font-bold text-foreground block">{esc.category}</span>
                  <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">{esc.issue}</p>
                </TableCell>
                <TableCell className="py-3.5 align-top">
                  <div className="text-xs font-semibold text-foreground">{esc.assignedTo}</div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{esc.assignedRole}</span>
                </TableCell>
                <TableCell className="text-xs py-3.5 align-top whitespace-normal break-words max-w-[280px]">
                  <p className="text-xs text-foreground font-medium leading-relaxed">{esc.actionTaken}</p>
                  {esc.resolutionNotes && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded border border-emerald-200 dark:border-emerald-900">
                      ✓ Closed: {esc.resolutionNotes}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right py-3.5 align-top whitespace-nowrap">
                  {esc.status !== "Resolved" ? (
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 shadow-xs"
                      onClick={() => {
                        setSelectedEscalation(esc);
                        setIsResolveModalOpen(true);
                      }}
                    >
                      Resolve Case
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px] font-bold">
                      Closed ({esc.closureTime})
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Resolution Dialog */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Resolve Escalation: {selectedEscalation?.escalationId}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record the clinical / operational resolution details and root-cause fix for {selectedEscalation?.patientName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border space-y-1">
              <span className="font-bold text-foreground">Issue:</span> {selectedEscalation?.issue}
            </div>

            <div className="space-y-3 pt-1">
              <label className="font-bold text-foreground pb-2">Resolution Notes & Quality Audit Remarks:</label>
              <Textarea
                placeholder="Enter actions taken, doctor consultations, or caregiver replacement notes..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="text-xs min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsResolveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={handleResolve}>
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
