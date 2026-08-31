"use client";

import { useState, useMemo } from "react";
import { CaregiverPayout, initialCaregiverPayouts } from "./_data/payouts";
import { PayoutDetailsModal } from "./_components/payout-details-modal";
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
  Receipt,
  Download,
  Search,
  Filter,
  Eye,
  DollarSign,
  Building2,
  Percent,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<CaregiverPayout[]>(initialCaregiverPayouts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedPayout, setSelectedPayout] = useState<CaregiverPayout | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.caregiverName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.bookingReference.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesDate = !dateFilter || p.payoutDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [payouts, searchQuery, statusFilter, dateFilter]);

  const handleOpenDetails = (payout: CaregiverPayout) => {
    setSelectedPayout(payout);
    setIsDetailsOpen(true);
  };

  const handleProcessPayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Paid" } : p))
    );
  };

  const totalDisbursed = payouts
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.netCaregiverPayout, 0);

  const totalCommission = payouts.reduce((sum, p) => sum + p.platformCommissionAmount, 0);
  const pendingCount = payouts.filter((p) => p.status === "Pending" || p.status === "Processing").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Receipt className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Caregiver Payout Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Deduct platform commission (%), manage caregiver bank disbursements, and audit settlement history.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Export Ready",
              description: "Exported payout ledger to CSV format.",
            })
          }
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Payouts CSV</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Disbursed Net Payouts</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">${totalDisbursed.toLocaleString()}</h3>
            <p className="text-[10px] text-[#01265D] dark:text-blue-400 font-semibold mt-0.5">Transferred to Caregivers</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Platform Commission Retained</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">${totalCommission.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Average 15% Platform Fee</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pending Settlements</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{pendingCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Awaiting Transfer</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Caregiver Name, Payout ID, or Booking Ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Date:</span>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-9 text-xs pl-8 w-36"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Payout ID / Date</TableHead>
              <TableHead className="font-bold text-xs">Caregiver & Role</TableHead>
              <TableHead className="font-bold text-xs">Gross Booking ($)</TableHead>
              <TableHead className="font-bold text-xs">Commission (15%)</TableHead>
              <TableHead className="font-bold text-xs">Net Caregiver Payout</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No payout records found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayouts.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Payout ID */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col font-mono">
                      <span className="font-bold text-foreground">{p.id}</span>
                      <span className="text-[10px] text-muted-foreground">{p.payoutDate}</span>
                    </div>
                  </TableCell>

                  {/* Caregiver */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{p.caregiverName}</span>
                      <span className="text-[10px] text-muted-foreground">{p.caregiverRole}</span>
                    </div>
                  </TableCell>

                  {/* Gross Booking */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    ${p.grossBookingAmount.toLocaleString()}
                  </TableCell>

                  {/* Commission */}
                  <TableCell className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    -${p.platformCommissionAmount.toLocaleString()} ({p.platformCommissionPercent}%)
                  </TableCell>

                  {/* Net Payout */}
                  <TableCell className="text-xs font-extrabold text-[#01265D] dark:text-blue-400">
                    ${p.netCaregiverPayout.toLocaleString()}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        p.status === "Paid"
                          ? "default"
                          : p.status === "Processing"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {p.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDetails(p)}
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
            Showing <strong className="text-foreground">{filteredPayouts.length}</strong> caregiver payout records
          </span>
          <span className="font-medium text-[#01265D] dark:text-blue-400">
            Automated Commission Calculation Active
          </span>
        </div>
      </div>

      {/* Payout Details Modal */}
      <PayoutDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        payout={selectedPayout}
        onProcessPayout={handleProcessPayout}
      />
    </div>
  );
}
