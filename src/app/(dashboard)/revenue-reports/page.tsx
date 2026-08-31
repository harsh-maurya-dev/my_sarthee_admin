"use client";

import { useState, useMemo } from "react";
import {
  RevenueReportItem,
  PatientGrowthItem,
  CaregiverUtilizationItem,
  CACTrackingItem,
  initialRevenueReports,
  initialPatientGrowth,
  initialCaregiverUtilization,
  initialCACTracking,
} from "./_data/reports";
import { ReportViewModal } from "./_components/report-view-modal";
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
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  PieChart,
  Download,
  Eye,
  Search,
  ArrowUpRight,
  TrendingDown,
  Target,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function RevenueReportsPage() {
  const [activeTab, setActiveTab] = useState<"revenue" | "growth" | "utilization" | "cac">("revenue");

  const [revenueReports] = useState<RevenueReportItem[]>(initialRevenueReports);
  const [patientGrowth] = useState<PatientGrowthItem[]>(initialPatientGrowth);
  const [utilization] = useState<CaregiverUtilizationItem[]>(initialCaregiverUtilization);
  const [cacTracking] = useState<CACTrackingItem[]>(initialCACTracking);

  // Modal
  const [selectedModalType, setSelectedModalType] = useState<"revenue" | "growth" | "utilization" | "cac">("revenue");
  const [selectedModalData, setSelectedModalData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenView = (type: "revenue" | "growth" | "utilization" | "cac", data: any) => {
    setSelectedModalType(type);
    setSelectedModalData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Revenue & Operational Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Financial analytics, patient acquisition telemetry, caregiver shift utilization, and CAC channel tracking.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Export Ready",
              description: "Exported executive report dataset to CSV.",
            })
          }
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Executive Report</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">July Gross Revenue</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">$148,500</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +12.5% vs last month
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Patients</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">1,420</h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-semibold mt-0.5">+185 new this quarter</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Caregiver Utilization</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">86.3%</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Optimal Duty Load</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Blended CAC</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">$32.55</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Per Acquired Patient</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("revenue")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "revenue"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Revenue Report</span>
        </button>

        <button
          onClick={() => setActiveTab("growth")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "growth"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Patient Growth</span>
        </button>

        <button
          onClick={() => setActiveTab("utilization")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "utilization"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Care Giver Utilization</span>
        </button>

        <button
          onClick={() => setActiveTab("cac")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "cac"
              ? "text-[#01265D] dark:text-blue-400 border-b-2 border-[#01265D] dark:border-blue-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Target className="h-4 w-4" />
          <span>CAC Tracking</span>
        </button>
      </div>

      {/* TAB 1: REVENUE REPORT */}
      {activeTab === "revenue" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Period</TableHead>
                <TableHead className="font-bold text-xs">Gross Billings</TableHead>
                <TableHead className="font-bold text-xs">Caregiver Payouts</TableHead>
                <TableHead className="font-bold text-xs">Net Margin ($)</TableHead>
                <TableHead className="font-bold text-xs">Margin %</TableHead>
                <TableHead className="font-bold text-xs">Top Category</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueReports.map((r, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs font-bold text-foreground">{r.period}</TableCell>

                  <TableCell className="text-xs font-bold text-foreground">
                    ${r.grossBillings.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    ${r.caregiverPayouts.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${r.netMargin.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground">
                    {r.marginPercent}%
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="outline">{r.topServiceCategory}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenView("revenue", r)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 2: PATIENT GROWTH */}
      {activeTab === "growth" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Quarter / Period</TableHead>
                <TableHead className="font-bold text-xs">Active Patient Roster</TableHead>
                <TableHead className="font-bold text-xs">New Signups</TableHead>
                <TableHead className="font-bold text-xs">Retention Rate</TableHead>
                <TableHead className="font-bold text-xs">Churn Rate</TableHead>
                <TableHead className="font-bold text-xs">Top Channel</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientGrowth.map((g, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs font-bold text-foreground">{g.period}</TableCell>

                  <TableCell className="text-xs font-bold text-foreground">
                    {g.totalActivePatients.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-xs font-bold text-emerald-600">
                    +{g.newPatientsAdded}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-[#01265D] dark:text-blue-400">
                    {g.retentionRatePercent}%
                  </TableCell>

                  <TableCell className="text-xs font-medium text-rose-600">
                    {g.churnRatePercent}%
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="outline">{g.topAcquisitionChannel}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenView("growth", g)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 3: CAREGIVER UTILIZATION */}
      {activeTab === "utilization" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Caregiver ID / Name</TableHead>
                <TableHead className="font-bold text-xs">Role</TableHead>
                <TableHead className="font-bold text-xs">Duty Hours</TableHead>
                <TableHead className="font-bold text-xs">Utilization Rate</TableHead>
                <TableHead className="font-bold text-xs">Completed Visits</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilization.map((u) => (
                <TableRow key={u.caregiverId} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{u.caregiverName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{u.caregiverId}</span>
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="outline">{u.role}</Badge>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-foreground">
                    {u.activeDutyHours} / {u.totalAvailableHours} hrs
                  </TableCell>

                  <TableCell className="text-xs font-extrabold text-[#01265D] dark:text-blue-400">
                    {u.utilizationPercent}%
                  </TableCell>

                  <TableCell className="text-xs font-bold text-foreground">
                    {u.completedVisitsCount} Visits
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenView("utilization", u)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 4: CAC TRACKING */}
      {activeTab === "cac" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Acquisition Channel</TableHead>
                <TableHead className="font-bold text-xs">Ad Spend ($)</TableHead>
                <TableHead className="font-bold text-xs">Leads Generated</TableHead>
                <TableHead className="font-bold text-xs">Patients Acquired</TableHead>
                <TableHead className="font-bold text-xs">Blended CAC ($)</TableHead>
                <TableHead className="font-bold text-xs">Conversion Rate</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cacTracking.map((c, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs font-bold text-foreground">{c.channel}</TableCell>

                  <TableCell className="text-xs font-medium text-foreground">
                    ${c.adSpend.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground">
                    {c.leadsGenerated} Leads
                  </TableCell>

                  <TableCell className="text-xs font-bold text-emerald-600">
                    +{c.patientsAcquired} Patients
                  </TableCell>

                  <TableCell className="text-xs font-extrabold text-[#01265D] dark:text-blue-400">
                    ${c.cacPerPatient}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground">
                    {c.conversionRatePercent}%
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenView("cac", c)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <ReportViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedModalType}
        data={selectedModalData}
      />
    </div>
  );
}
