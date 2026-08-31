"use client";

import { useState, useMemo } from "react";
import {
  initialReferralPartners,
  ReferralPartner,
  ReferralSource,
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
  Building2,
  Stethoscope,
  ShieldCheck,
  Briefcase,
  Users,
  Search,
  Plus,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ArrowUpRight,
  Handshake,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PartnersAndReferralsPage() {
  const [partners, setPartners] = useState<ReferralPartner[]>(initialReferralPartners);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.contactPerson.toLowerCase().includes(q) ||
        p.cityArea.toLowerCase().includes(q);

      const matchesType = typeFilter === "All" || p.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [partners, searchQuery, typeFilter]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Partners & Referral Source Network
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs">
              B2B & Medical Channels
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track patient acquisition channels: Hospitals, Doctors, Physios, Insurance TPAs, Corporates, and Direct.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#01265D] hover:bg-[#0a3375] text-white font-semibold text-xs shadow-sm gap-1.5"
            onClick={() => swiftAlert.info({ title: "New Partner Onboarding", description: "Opening B2B contract onboarding wizard." })}
          >
            <Plus className="h-4 w-4" />
            Add Partner Network
          </Button>
        </div>
      </div>

      {/* Channel Source Breakdown Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Hospital Discharge Desks</span>
            <Building2 className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">330 Referrals</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Lilavati & Breach Candy Leads (89% conv)</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Doctor Direct Networks</span>
            <Stethoscope className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">64 Referrals</div>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">Ortho & Neuro Specialists (94% conv)</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Insurance / TPA Tie-ups</span>
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">95 Referrals</div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">HDFC ERGO & Star Health cashless</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Corporate Eldercare</span>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">52 Referrals</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">TCS, Infosys & L&T Employee Benefits</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {["All", "Hospital", "Doctor", "Insurance company", "Corporate"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                typeFilter === type
                  ? "bg-[#01265D] text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search partner or contact..."
            className="pl-9 text-xs rounded-xl bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Partners Directory Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Partner Organisation
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Channel Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact Lead & Area
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Referrals
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Patients
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Conversion Rate
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Revenue Generated
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Contract
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                <TableCell className="text-xs font-bold text-foreground py-3">
                  {p.name}
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {p.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs py-3">
                  <span className="font-semibold text-foreground block">{p.contactPerson}</span>
                  <span className="text-[10px] text-muted-foreground">{p.phone} · {p.cityArea}</span>
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground py-3">
                  {p.totalReferrals}
                </TableCell>
                <TableCell className="text-xs font-bold text-[#01265D] dark:text-blue-300 dark:text-blue-400 py-3">
                  {p.activePatients}
                </TableCell>
                <TableCell className="text-xs font-bold text-emerald-600 py-3">
                  {p.conversionRate}%
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground py-3">
                  ₹{(p.totalRevenueGenerated / 100000).toFixed(2)} Lakhs
                </TableCell>
                <TableCell className="text-right py-3">
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active (Comm: {p.payoutCommissionRate}%)
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
