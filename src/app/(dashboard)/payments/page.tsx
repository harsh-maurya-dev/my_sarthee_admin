"use client";

import { useState } from "react";
import Link from "next/link";
import {
  initialBookings,
  initialPatients360,
  initialReferralPartners,
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
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  RotateCcw,
  Receipt,
  Download,
  Building,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PaymentsAndBillingDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Payments & Billing Operations
            </h1>
            <Badge className="bg-emerald-600 text-white font-semibold text-xs">
              Live Gateway Sync
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Revenue telemetry, partner settlements, outstanding collections, and booking billing ledgers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-semibold"
            onClick={() => swiftAlert.info({ title: "Report Export", description: "Exporting financial statement." })}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export Tally / GST Report
          </Button>
        </div>
      </div>

      {/* Top Level 5 Revenue Metric Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Today's Revenue */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground">Today&apos;s Revenue</span>
          <div className="mt-2 text-2xl font-black text-foreground">₹84,500</div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18% vs yesterday
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground">Monthly Revenue (MTD)</span>
          <div className="mt-2 text-2xl font-black text-foreground">₹24,80,000</div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">108% of monthly target</p>
        </div>

        {/* Pending Payments */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Pending Payments</span>
          <div className="mt-2 text-2xl font-black text-amber-950 dark:text-amber-100">₹2,45,000</div>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">14 pending invoices</p>
        </div>

        {/* Refunds */}
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground">Refunds Processed</span>
          <div className="mt-2 text-2xl font-black text-foreground">₹12,000</div>
          <p className="mt-1 text-[11px] text-muted-foreground font-medium">1 cancellation refund</p>
        </div>

        {/* Failed Payments */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 p-4 shadow-xs">
          <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Failed Gateway Drops</span>
          <div className="mt-2 text-2xl font-black text-rose-950 dark:text-rose-100">2</div>
          <p className="mt-1 text-[11px] text-rose-700 font-medium">Auto-retry link dispatched</p>
        </div>
      </div>

      {/* Revenue Distribution Breakdowns (By Service, By Partner) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue By Service */}
        <div className="rounded-2xl border bg-card p-5.5 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-foreground">Revenue by Service Line (MTD)</h2>
          <div className="space-y-3">
            {[
              { service: "Home Nursing (ICU & Post-Op)", amount: "₹10,50,000", pct: 42, color: "bg-teal-600" },
              { service: "Combination Recovery Packages", amount: "₹7,20,000", pct: 29, color: "bg-indigo-600" },
              { service: "Physiotherapy & Neuro-Rehab", amount: "₹4,10,000", pct: 16, color: "bg-sky-600" },
              { service: "Personal Care & Geriatric Assist", amount: "₹3,00,000", pct: 13, color: "bg-emerald-600" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{item.service}</span>
                  <span className="font-bold">{item.amount} ({item.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue By B2B Partner / Referral Source */}
        <div className="rounded-2xl border bg-card p-5.5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-foreground">Revenue by B2B Partner Network</h2>
            <Link href="/partners" className="text-xs text-teal-700 font-semibold hover:underline">
              Partner Hub &rarr;
            </Link>
          </div>
          <div className="space-y-2.5 divide-y">
            {initialReferralPartners.slice(0, 4).map((p) => (
              <div key={p.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground block">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.type} · {p.activePatients} active patients</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">₹{(p.totalRevenueGenerated / 100000).toFixed(2)} Lakhs</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">{p.conversionRate}% conv rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Invoices Ledger (Booking Value -> Discount -> Tax -> Amount Paid -> Balance) */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Booking Financial Breakdown & Ledger</h3>
            <p className="text-xs text-muted-foreground">Booking Value &rarr; Discount &rarr; Tax &rarr; Amount Paid &rarr; Balance</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoice or patient..."
              className="pl-9 text-xs rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Invoice / Booking
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Patient Name
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Booking Value
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Discount
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tax (GST 18%)
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Amount Paid
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Outstanding Balance
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBookings.map((b) => (
              <TableRow key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                <TableCell className="text-xs font-mono font-bold py-3">
                  {b.bookingCode}
                </TableCell>
                <TableCell className="text-xs font-semibold py-3">
                  {b.patientName} ({b.patientId})
                </TableCell>
                <TableCell className="text-xs font-bold py-3">
                  ₹{b.billing.bookingValue.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-emerald-600 font-semibold py-3">
                  {b.billing.discount > 0 ? `- ₹${b.billing.discount.toLocaleString()}` : "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground py-3">
                  + ₹{b.billing.tax.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-emerald-700 font-bold py-3">
                  ₹{b.billing.amountPaid.toLocaleString()}
                </TableCell>
                <TableCell className="py-3">
                  {b.billing.balance > 0 ? (
                    <span className="text-xs font-black text-rose-600">
                      ₹{b.billing.balance.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700">₹0</span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    className={
                      b.billing.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {b.billing.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-3">
                  {b.billing.balance > 0 ? (
                    <Button
                      size="sm"
                      className="h-6 text-[10px] bg-teal-600 hover:bg-teal-700 text-white font-bold"
                      onClick={() =>
                        swiftAlert.success({
                          title: "Payment Link Dispatched",
                          description: `Payment link for ₹${b.billing.balance} sent via SMS/WhatsApp.`,
                        })
                      }
                    >
                      Send Payment Link
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px]"
                      onClick={() =>
                        swiftAlert.info({
                          title: "Receipt Downloaded",
                          description: `Receipt for ${b.bookingCode} downloaded.`,
                        })
                      }
                    >
                      Receipt
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
