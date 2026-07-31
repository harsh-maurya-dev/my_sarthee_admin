"use client";

import { useState, useMemo } from "react";
import { PaymentTransaction, initialTransactions } from "./_data/transactions";
import { TransactionDetailsModal } from "./_components/transaction-details-modal";
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
  CreditCard,
  Download,
  Search,
  Filter,
  Eye,
  DollarSign,
  CheckCircle2,
  Clock,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.username.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.serviceCategory.toLowerCase().includes(q);

      const matchesMode = modeFilter === "All" || t.paymentMode === modeFilter;
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesDate = !dateFilter || t.date === dateFilter;

      return matchesSearch && matchesMode && matchesStatus && matchesDate;
    });
  }, [transactions, searchQuery, modeFilter, statusFilter, dateFilter]);

  const handleOpenDetails = (txn: PaymentTransaction) => {
    setSelectedTxn(txn);
    setIsDetailsOpen(true);
  };

  const handleProcessRefund = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refunded" } : t))
    );
  };

  const totalVolume = transactions
    .filter((t) => t.status === "Successful")
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulCount = transactions.filter((t) => t.status === "Successful").length;
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;
  const refundedVolume = transactions
    .filter((t) => t.status === "Refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-teal-600" />
            Transaction Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Audit patient payments, track gateway transactions, payment modes, and refund requests.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.success({
              title: "Export Ready",
              description: "Exported transaction ledger to CSV.",
            })
          }
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Transactions CSV</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Paid Volume</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">${totalVolume.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Successful Payments</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Successful Txns</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{successfulCount}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Cleared Transactions</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pending Settlements</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{pendingCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Gateway In-Flight</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Refunded Volume</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">${refundedVolume.toLocaleString()}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Processed Refunds</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <RotateCcw className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Name, Username, or Transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Payment Mode:</span>
              <Select value={modeFilter} onValueChange={(val: any) => setModeFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Modes</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Apple Pay">Apple Pay</SelectItem>
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

      {/* Transaction Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Transaction ID</TableHead>
              <TableHead className="font-bold text-xs">Username / Customer</TableHead>
              <TableHead className="font-bold text-xs">Transaction Date & Time</TableHead>
              <TableHead className="font-bold text-xs">Amount ($)</TableHead>
              <TableHead className="font-bold text-xs">Payment Mode</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No transaction records found matching your search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Transaction ID */}
                  <TableCell className="text-xs font-mono font-bold text-foreground">
                    {t.id}
                  </TableCell>

                  {/* Username */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">@{t.username}</span>
                      <span className="text-[10px] text-muted-foreground">{t.patientName}</span>
                    </div>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col font-mono">
                      <span className="text-foreground">{t.date}</span>
                      <span className="text-[10px] text-muted-foreground">{t.time}</span>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-xs font-extrabold text-foreground">
                    ${t.amount.toLocaleString()}
                  </TableCell>

                  {/* Payment Mode */}
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {t.paymentMode}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        t.status === "Successful"
                          ? "default"
                          : t.status === "Pending"
                          ? "outline"
                          : t.status === "Refunded"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] font-bold"
                    >
                      {t.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDetails(t)}
                      className="h-8 text-xs gap-1 border-slate-200 hover:bg-teal-50 hover:text-teal-700"
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
            Showing <strong className="text-foreground">{filteredTransactions.length}</strong> payment transactions
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Payment Gateway Sync Active
          </span>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTxn}
        onProcessRefund={handleProcessRefund}
      />
    </div>
  );
}
