"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  initialBookings,
  BookingItem,
  PaymentStatus,
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
  Search,
  Plus,
  CalendarCheck2,
  MapPin,
  Clock,
  Sparkles,
  DollarSign,
  ArrowRight,
  Filter,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.bookingCode.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.locationArea.toLowerCase().includes(q) ||
        b.careType.toLowerCase().includes(q);

      const matchesTab =
        activeTab === "All" || b.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, activeTab]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Bookings & Service Intake
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              {filteredBookings.length} Bookings
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            End-to-end booking pipeline with financial breakdown (Booking Value &rarr; Discount &rarr; Tax &rarr; Paid &rarr; Balance).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/smart-assignment">
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Matching Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { key: "All", label: "All Bookings", count: bookings.length },
            { key: "New", label: "New", count: bookings.filter((b) => b.status === "New").length },
            { key: "Pending Assignment", label: "Pending Assignment", count: bookings.filter((b) => b.status === "Pending Assignment").length },
            { key: "Upcoming", label: "Upcoming", count: bookings.filter((b) => b.status === "Upcoming").length },
            { key: "Ongoing", label: "Ongoing", count: bookings.filter((b) => b.status === "Ongoing").length },
            { key: "Completed", label: "Completed", count: bookings.filter((b) => b.status === "Completed").length },
            { key: "Cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search booking code, patient..."
            className="pl-9 text-xs rounded-xl bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-28">
                Booking ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Patient
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Care Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Duration & Schedule
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Professional
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Billing Breakdown (Value &rarr; Paid &rarr; Balance)
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
            {filteredBookings.map((b) => (
              <TableRow key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                <TableCell className="text-xs font-mono font-bold py-3">
                  {b.bookingCode}
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-xs font-bold text-foreground">{b.patientName}</div>
                  <span className="text-[10px] text-muted-foreground">{b.ageGender} · {b.patientId}</span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {b.careType}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground py-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-teal-600" /> {b.locationArea}
                  </span>
                </TableCell>
                <TableCell className="text-xs py-3">
                  <span className="font-semibold text-foreground block">{b.duration} ({b.frequency})</span>
                  <span className="text-[10px] text-muted-foreground">Starts: {b.startDate}</span>
                </TableCell>
                <TableCell className="py-3">
                  {b.assignedProfessional ? (
                    <div>
                      <span className="text-xs font-bold text-foreground block">{b.assignedProfessional.name}</span>
                      <span className="text-[10px] text-muted-foreground">{b.assignedProfessional.type}</span>
                    </div>
                  ) : (
                    <Link href="/smart-assignment">
                      <Button size="sm" variant="outline" className="h-6 text-[10px] border-amber-300 text-amber-800 bg-amber-50 font-bold">
                        Assign Now &rarr;
                      </Button>
                    </Link>
                  )}
                </TableCell>
                <TableCell className="text-xs py-3">
                  <div className="text-[11px] font-mono">
                    <span>Val: ₹{b.billing.bookingValue.toLocaleString()}</span>
                    <span className="text-muted-foreground"> &bull; Paid: </span>
                    <span className="text-emerald-600 font-bold">₹{b.billing.amountPaid.toLocaleString()}</span>
                  </div>
                  {b.billing.balance > 0 ? (
                    <span className="text-[10px] font-bold text-rose-600 block">
                      Balance: ₹{b.billing.balance.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700 block">
                      Fully Settled
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    className={`text-[10px] font-bold ${
                      b.status === "Ongoing"
                        ? "bg-teal-600 text-white"
                        : b.status === "Pending Assignment"
                        ? "bg-amber-100 text-amber-800"
                        : b.status === "New"
                        ? "bg-sky-100 text-sky-800"
                        : b.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-3">
                  <Link href="/smart-assignment">
                    <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-teal-700">
                      Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
