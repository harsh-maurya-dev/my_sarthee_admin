"use client";

import { useState, useMemo } from "react";
import { CaregiverHealthReport, initialHealthReports } from "./_data/health-reports";
import { HealthReportViewModal } from "./_components/health-report-view-modal";
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
  FileText,
  Search,
  Filter,
  Eye,
  Activity,
  TrendingUp,
  AlertTriangle,
  Download,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function HealthReportPage() {
  const [reports, setReports] = useState<CaregiverHealthReport[]>(initialHealthReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState<"All" | "Improving" | "Stable" | "Needs Monitoring">("All");

  const [selectedReport, setSelectedReport] = useState<CaregiverHealthReport | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        r.patientName.toLowerCase().includes(q) ||
        r.caregiverName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.visitId.toLowerCase().includes(q);

      const matchesProgress = progressFilter === "All" || r.patientProgress === progressFilter;

      return matchesSearch && matchesProgress;
    });
  }, [reports, searchQuery, progressFilter]);

  const totalReportsCount = reports.length;
  const improvingCount = reports.filter((r) => r.patientProgress === "Improving").length;
  const monitoringCount = reports.filter((r) => r.patientProgress === "Needs Monitoring" || r.physicianFollowUpRequired).length;

  const handleOpenView = (report: CaregiverHealthReport) => {
    setSelectedReport(report);
    setIsViewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Caregiver Health Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access patient clinical telemetry, vital histories, uploaded observations, and physician follow-up flags.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Medical Export Ready",
              description: "Exported clinical health report logs to CSV.",
            })
          }
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export All Reports</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Reports Logged</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalReportsCount}</h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-semibold mt-0.5">Caregiver Submissions Active</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Patients Improving</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{improvingCount}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Positive Recovery Trajectory</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Physician Follow-up Needed</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{monitoringCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Alerts & Vitals Watchlist</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
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
              placeholder="Search by Report ID, Patient, or Caregiver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={progressFilter} onValueChange={(val: any) => setProgressFilter(val)}>
              <SelectTrigger className="h-9 text-xs w-44">
                <SelectValue placeholder="Patient Progress" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Progress Stages</SelectItem>
                <SelectItem value="Improving">Improving</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
                <SelectItem value="Needs Monitoring">Needs Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Health Reports Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Report ID / Date</TableHead>
              <TableHead className="font-bold text-xs">Patient</TableHead>
              <TableHead className="font-bold text-xs">Caregiver</TableHead>
              <TableHead className="font-bold text-xs">Vitals Summary</TableHead>
              <TableHead className="font-bold text-xs text-center">Images</TableHead>
              <TableHead className="font-bold text-xs text-center">Progress Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No caregiver health reports found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Report ID */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col font-mono">
                      <span className="font-bold text-foreground">{r.id}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.reportDate} ({r.reportTime})
                      </span>
                    </div>
                  </TableCell>

                  {/* Patient */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{r.patientName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.patientAge}y · {r.patientGender}
                      </span>
                    </div>
                  </TableCell>

                  {/* Caregiver */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{r.caregiverName}</span>
                      <span className="text-[10px] text-muted-foreground">{r.caregiverRole}</span>
                    </div>
                  </TableCell>

                  {/* Vitals Summary */}
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Activity className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                      <span>BP: <strong>{r.vitals.bloodPressure}</strong> · HR: <strong>{r.vitals.heartRateBpm}</strong></span>
                    </div>
                  </TableCell>

                  {/* Uploaded Images */}
                  <TableCell className="text-center">
                    {r.uploadedImages && r.uploadedImages.length > 0 ? (
                      <Badge variant="outline" className="text-[9px] bg-slate-50 gap-1">
                        <ImageIcon className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                        {r.uploadedImages.length} Photos
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">None</span>
                    )}
                  </TableCell>

                  {/* Progress */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        r.patientProgress === "Improving"
                          ? "default"
                          : r.patientProgress === "Stable"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {r.patientProgress} ({r.progressScorePercent}%)
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenView(r)}
                      className="h-8 text-xs gap-1 border-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#01265D] dark:text-blue-300"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredReports.length}</strong> submitted clinical reports
          </span>
          <span className="font-medium text-[#01265D] dark:text-blue-400">
            Caregiver Mobile Sync Active
          </span>
        </div>
      </div>

      {/* View Modal */}
      <HealthReportViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        report={selectedReport}
      />
    </div>
  );
}
