"use client";

import { useState, useMemo, Suspense } from "react";
import {
  Coins,
  HeartPulse,
  Stethoscope,
  Activity,
  Edit3,
  Download,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { swiftAlert } from "@/lib/swift-alert";

export interface EarningTier {
  id: string;
  role: "Caregiver" | "Nurse" | "Physio";
  assignment: string;
  earnings: string;
  baseAmount: number;
  rateType: "flat" | "per_hour" | "per_session";
  effectiveDate: string;
  notes?: string;
}

const initialEarningTiers: EarningTier[] = [
  // 1. Caregiver
  {
    id: "ET-CG-1",
    role: "Caregiver",
    assignment: "Daily – 10 hrs",
    earnings: "₹800",
    baseAmount: 800,
    rateType: "flat",
    effectiveDate: "Active Rate Card",
    notes: "Standard 10-hour daily caregiver shift payout",
  },
  {
    id: "ET-CG-2",
    role: "Caregiver",
    assignment: "Additional hour",
    earnings: "₹80/hour",
    baseAmount: 80,
    rateType: "per_hour",
    effectiveDate: "Active Rate Card",
    notes: "Overtime compensation rate per completed additional hour",
  },

  // 2. Nurse
  {
    id: "ET-NU-1",
    role: "Nurse",
    assignment: "2 hrs – Daily",
    earnings: "₹300",
    baseAmount: 300,
    rateType: "flat",
    effectiveDate: "Active Rate Card",
    notes: "Short-duration injection, dressing & telemetry visit",
  },
  {
    id: "ET-NU-2",
    role: "Nurse",
    assignment: "5 hrs – Daily",
    earnings: "₹750",
    baseAmount: 750,
    rateType: "flat",
    effectiveDate: "Active Rate Card",
    notes: "Half-day post-operative & monitoring care",
  },
  {
    id: "ET-NU-3",
    role: "Nurse",
    assignment: "10 hrs – Daily",
    earnings: "₹1600",
    baseAmount: 1600,
    rateType: "flat",
    effectiveDate: "Active Rate Card",
    notes: "Full-day critical / skilled nursing care shift",
  },
  {
    id: "ET-NU-4",
    role: "Nurse",
    assignment: "Additional hour",
    earnings: "₹140/hour",
    baseAmount: 140,
    rateType: "per_hour",
    effectiveDate: "Active Rate Card",
    notes: "Skilled nursing overtime compensation per additional hour",
  },

  // 3. Physio
  {
    id: "ET-PT-1",
    role: "Physio",
    assignment: "60 minutes Single session",
    earnings: "₹500",
    baseAmount: 500,
    rateType: "per_session",
    effectiveDate: "Active Rate Card",
    notes: "Comprehensive neuro/orthopedic 60-min home rehabilitation",
  },
];

function EarningSystemContent() {
  const [rates, setRates] = useState<EarningTier[]>(initialEarningTiers);

  // Rate Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<EarningTier | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const caregiverRates = useMemo(() => rates.filter((r) => r.role === "Caregiver"), [rates]);
  const nurseRates = useMemo(() => rates.filter((r) => r.role === "Nurse"), [rates]);
  const physioRates = useMemo(() => rates.filter((r) => r.role === "Physio"), [rates]);

  const handleEditRate = (tier: EarningTier) => {
    setEditingTier(tier);
    setEditAmount(tier.earnings.replace(/[^\d]/g, ""));
    setIsEditModalOpen(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    const num = Number(editAmount);
    if (!num || num <= 0) {
      swiftAlert.error({
        title: "Invalid Amount",
        description: "Please enter a valid earning amount.",
      });
      return;
    }

    const formatted =
      editingTier.rateType === "per_hour"
        ? `₹${num}/hour`
        : `₹${num}`;

    setRates((prev) =>
      prev.map((r) =>
        r.id === editingTier.id
          ? { ...r, earnings: formatted, baseAmount: num }
          : r
      )
    );

    setIsEditModalOpen(false);
    swiftAlert.success({
      title: "Rate Updated",
      description: `Earning rate for ${editingTier.role} (${editingTier.assignment}) updated to ${formatted}.`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Professional Earning System
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <Coins className="h-3 w-3 text-amber-400" />
              Standardized Rate Matrix
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Care professional payout tier matrix, shift compensations, hourly overtime rates, and session fee schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold"
            onClick={() => {
              swiftAlert.info({
                title: "Rate Card Export",
                description: "Generating official PDF Rate Card for Care Professionals.",
              });
            }}
          >
            <Download className="h-4 w-4 text-[#01265D]" />
            <span>Export Rate Card</span>
          </Button>
        </div>
      </div>

      {/* THREE OFFICIAL EARNING SYSTEM TABLES */}
      <div className="space-y-6">
        {/* ========================================================
            1. CAREGIVER EARNING SYSTEM TABLE
        ======================================================== */}
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-800 dark:text-amber-200">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-foreground">
                  1. Caregiver
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Standard shifts & hourly compensation matrix for Caregivers
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold border-amber-300 text-amber-800 bg-amber-50">
              Caregiver Rate Card
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableHead className="font-extrabold text-xs text-foreground py-3 w-1/2">
                  Assignment
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3">
                  Care Professional Earnings
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caregiverRates.map((tier) => (
                <TableRow key={tier.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                  <TableCell className="font-bold text-xs text-foreground">
                    {tier.assignment}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-black text-sm text-foreground bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100">
                      {tier.earnings}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs font-semibold text-[#01265D] hover:bg-blue-50"
                      onClick={() => handleEditRate(tier)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ========================================================
            2. NURSE EARNING SYSTEM TABLE
        ======================================================== */}
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[#01265D] dark:text-blue-200">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-foreground">
                  2. Nurse
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Multi-tier duration assignments and skilled clinical nursing hourly rate
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold border-blue-300 text-[#01265D] bg-blue-50">
              Nurse Rate Card
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableHead className="font-extrabold text-xs text-foreground py-3 w-1/2">
                  Assignment
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3">
                  Nurse Earnings
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nurseRates.map((tier) => (
                <TableRow key={tier.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                  <TableCell className="font-bold text-xs text-foreground">
                    {tier.assignment}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-black text-sm text-foreground bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 text-[#01265D] dark:text-blue-200">
                      {tier.earnings}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs font-semibold text-[#01265D] hover:bg-blue-50"
                      onClick={() => handleEditRate(tier)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ========================================================
            3. PHYSIO EARNING SYSTEM TABLE
        ======================================================== */}
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-800 dark:text-emerald-200">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-foreground">
                  3. Physio
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Single session physiotherapy and rehabilitation fee schedule
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-bold border-emerald-300 text-emerald-800 bg-emerald-50">
              Physiotherapist Rate Card
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                <TableHead className="font-extrabold text-xs text-foreground py-3 w-1/2">
                  Assignment
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3">
                  Physio Earnings
                </TableHead>
                <TableHead className="font-extrabold text-xs text-foreground py-3 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {physioRates.map((tier) => (
                <TableRow key={tier.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                  <TableCell className="font-bold text-xs text-foreground">
                    {tier.assignment}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-black text-sm text-foreground bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100">
                      {tier.earnings}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs font-semibold text-[#01265D] hover:bg-blue-50"
                      onClick={() => handleEditRate(tier)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL: Configure Rate */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Configure Rate: {editingTier?.role} ({editingTier?.assignment})
            </DialogTitle>
          </DialogHeader>

          {editingTier && (
            <form onSubmit={handleSaveRate} className="space-y-4 text-xs py-2">
              <div className="rounded-xl border p-3 bg-slate-50/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">{editingTier.role}</span>
                  <Badge className="bg-blue-100 text-[#01265D] text-[10px] font-bold">
                    {editingTier.assignment}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{editingTier.notes}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  New Rate Amount (₹) {editingTier.rateType === "per_hour" ? "per hour" : ""}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-muted-foreground font-bold">₹</span>
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="pl-7 h-8 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-bold"
                >
                  Save Rate
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EarningSystemPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Earning System...</div>}>
      <EarningSystemContent />
    </Suspense>
  );
}
