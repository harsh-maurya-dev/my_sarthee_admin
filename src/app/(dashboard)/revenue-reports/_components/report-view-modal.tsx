"use client";

import {
  RevenueReportItem,
  PatientGrowthItem,
  CaregiverUtilizationItem,
  CACTrackingItem,
} from "../_data/reports";
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
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  PieChart,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "revenue" | "growth" | "utilization" | "cac";
  data: any;
}

export function ReportViewModal({
  isOpen,
  onClose,
  type,
  data,
}: ReportViewModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {type === "revenue"
                  ? "Financial Revenue Telemetry"
                  : type === "growth"
                  ? "Patient Growth Analysis"
                  : type === "utilization"
                  ? "Caregiver Utilization Breakdown"
                  : "CAC Channel Acquisition Details"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Period / Channel: <strong className="text-foreground">{data.period || data.channel || data.caregiverName}</strong>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {/* REVENUE REPORT TYPE */}
          {type === "revenue" && (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Gross Billings:</span>
                <span className="font-bold text-foreground text-sm">${(data.grossBillings || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Caregiver Payouts:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">${(data.caregiverPayouts || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Net Profit Margin:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  ${(data.netMargin || 0).toLocaleString()} ({data.marginPercent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Completed Bookings:</span>
                <span className="font-bold text-foreground">{data.totalCompletedBookings} Bookings</span>
              </div>
            </div>
          )}

          {/* PATIENT GROWTH TYPE */}
          {type === "growth" && (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Total Active Patient Roster:</span>
                <span className="font-bold text-foreground text-sm">{(data.totalActivePatients || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">New Patient Signups:</span>
                <span className="font-semibold text-emerald-600">+{data.newPatientsAdded} Patients</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Patient Retention Rate:</span>
                <span className="font-bold text-[#01265D] dark:text-blue-400">{data.retentionRatePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Top Acquisition Source:</span>
                <Badge variant="outline">{data.topAcquisitionChannel}</Badge>
              </div>
            </div>
          )}

          {/* CAREGIVER UTILIZATION TYPE */}
          {type === "utilization" && (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Caregiver Role:</span>
                <Badge variant="outline">{data.role}</Badge>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Total Active Duty Hours:</span>
                <span className="font-bold text-foreground">{data.activeDutyHours} / {data.totalAvailableHours} hrs</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Duty Utilization Rate:</span>
                <span className="font-extrabold text-[#01265D] dark:text-blue-400 text-sm">{data.utilizationPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Completed Home Visits:</span>
                <span className="font-bold text-foreground">{data.completedVisitsCount} Visits</span>
              </div>
            </div>
          )}

          {/* CAC TRACKING TYPE */}
          {type === "cac" && (
            <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Marketing Ad Spend:</span>
                <span className="font-bold text-foreground">${(data.adSpend || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Patients Acquired:</span>
                <span className="font-bold text-emerald-600">+{data.patientsAcquired} Patients</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground font-medium">Blended CAC per Patient:</span>
                <span className="font-extrabold text-[#01265D] dark:text-blue-400 text-sm">${data.cacPerPatient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Conversion Rate:</span>
                <span className="font-bold text-foreground">{data.conversionRatePercent}%</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: `Exported financial report to CSV.`,
              })
            }
            className="h-9 text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button type="button" onClick={onClose} className="h-9 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
