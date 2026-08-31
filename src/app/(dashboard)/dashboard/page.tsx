"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarPlus,
  CalendarCheck,
  HeartPulse,
  Clock,
  Activity,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Stethoscope,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  PhoneCall,
  Flame,
  ArrowRight,
  Check,
  XCircle,
  AlertOctagon,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  initialCareProfessionals,
  initialPatients360,
  initialEscalations,
  initialOperationFeed,
  initialBookings,
  CareProfessional,
  Patient360,
} from "@/lib/admin-data";
import { swiftAlert } from "@/lib/swift-alert";

export default function AdminPersonalizedDashboard() {
  const [selectedOpTab, setSelectedOpTab] = useState<string>("All");

  const operationsStages = [
    { key: "All", label: "All Operations", count: 83, color: "bg-slate-100 text-slate-800" },
    { key: "new_booking", label: "New Booking", count: 18, color: "bg-sky-100 text-sky-800" },
    { key: "assignment_pending", label: "Assignment Pending", count: 7, color: "bg-amber-100 text-amber-800" },
    { key: "professional_accepted", label: "Professional Accepted", count: 14, color: "bg-indigo-100 text-indigo-800" },
    { key: "care_started", label: "Care Started", count: 12, color: "bg-emerald-100 text-emerald-800" },
    { key: "care_completed", label: "Care Completed", count: 28, color: "bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200" },
    { key: "escalation", label: "Escalation", count: 3, color: "bg-rose-100 text-rose-800" },
    { key: "cancellation", label: "Cancellation", count: 1, color: "bg-zinc-100 text-zinc-800" },
  ];

  const filteredOperations = initialOperationFeed.filter((item) => {
    if (selectedOpTab === "All") return true;
    return item.type === selectedOpTab;
  });

  return (
    <div className="space-y-7 pb-10">
      {/* Header Banner with Welcome & Quick Status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Operations Command Centre
            </h1>
            <Badge className="bg-[#01265D] hover:bg-[#0a3375] text-white text-[11px] font-semibold px-2 py-0.5">
              Live Real-Time
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time telemetry, care delivery workflow, caregiver availability, and clinical triage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/smart-assignment">
            <Button size="sm" className="bg-[#01265D] hover:bg-[#0a3375] text-white font-medium text-xs shadow-sm gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Auto-Assign (7)
            </Button>
          </Link>
          <Link href="/escalations">
            <Button size="sm" variant="destructive" className="font-medium text-xs shadow-sm gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Escalation Centre (3)
            </Button>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP LEVEL 8 KPI CARDS */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            Top-Level Key Performance Indicators
          </h2>
          <span className="text-[11px] font-medium text-muted-foreground">Updated 1 min ago</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Active Patients */}
          <Link href="/patients?tab=Active" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-[#01265D]/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Active Patients</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-400 dark:bg-blue-950 dark:text-blue-400">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">142</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +14% this month
                  </span>
                  <span className="text-muted-foreground">Receiving care</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: New Bookings */}
          <Link href="/bookings?tab=New" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-sky-500/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">New Bookings</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                  <CalendarPlus className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">18 <span className="text-sm font-bold text-muted-foreground">today</span></div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-sky-600 font-semibold">86 this week</span>
                  <span className="text-muted-foreground">+22% vs last week</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Care Starting Today */}
          <Link href="/care-management?tab=todays-care" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-indigo-500/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Care Starting Today</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <CalendarCheck className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">12</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-600 font-semibold">8 already dispatched</span>
                  <span className="text-muted-foreground">4 starting afternoon</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 4: Care Professionals On Duty */}
          <Link href="/caregivers?tab=availability" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Care Pros On Duty</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <HeartPulse className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">114</div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                  <span className="text-foreground font-bold">38</span> Nurses · <span className="text-foreground font-bold">54</span> Caregivers · <span className="text-foreground font-bold">22</span> Physios
                </div>
              </div>
            </div>
          </Link>

          {/* Card 5: Pending Assignments */}
          <Link href="/bookings?tab=Pending Assignment" className="group block">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-4.5 shadow-xs transition-all hover:border-amber-500/80 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Pending Assignments</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  <Clock className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-amber-950 dark:text-amber-100">7</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-amber-700 dark:text-amber-300 font-semibold">Awaiting professional allocation</span>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200 underline">Assign &rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 6: Ongoing Care */}
          <Link href="/visit-monitoring" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-[#01265D]/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Ongoing Care</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-400 dark:bg-blue-950 dark:text-blue-400">
                  <Activity className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">128</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold">Active cases in progress</span>
                  <span className="text-muted-foreground">98.5% adherence</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 7: Escalations */}
          <Link href="/escalations" className="group block">
            <div className="rounded-xl border border-rose-300/80 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30 p-4.5 shadow-xs transition-all hover:border-rose-500 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  Escalations
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-rose-950 dark:text-rose-100">
                  3 <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Critical</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-rose-800 dark:text-rose-300">
                  <span>Medical / Service triage</span>
                  <span className="font-bold underline">Review Now &rarr;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 8: Payments Pending */}
          <Link href="/payments" className="group block">
            <div className="rounded-xl border bg-card p-4.5 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Payments Pending</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black tracking-tight text-foreground">₹2,45,000</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-amber-600 font-semibold">14 invoices pending action</span>
                  <span className="text-muted-foreground">₹8.4L collected</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TODAY'S OPERATIONS PIPELINE & LIVE OPERATIONAL FEED */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border bg-card p-5.5 shadow-xs space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground">Today&apos;s Operations</h2>
              <Badge variant="outline" className="text-xs font-semibold border-blue-200 dark:border-blue-900 text-[#01265D] dark:text-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300">
                83 Lifecycle Events Today
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live tracking from new booking intake to professional assignment, care started, and shift completion.
            </p>
          </div>
          <Link href="/smart-assignment">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 border-blue-300 dark:border-blue-800 text-[#01265D] dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40">
              <Sparkles className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              Smart Matching Engine
            </Button>
          </Link>
        </div>

        {/* Operational Stages Interactive Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {operationsStages.map((stage) => {
            const isSelected = selectedOpTab === stage.key;
            return (
              <button
                key={stage.key}
                onClick={() => setSelectedOpTab(stage.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#01265D] text-white shadow-sm ring-1 ring-[#01265D]/30"
                    : "bg-slate-100/80 text-muted-foreground hover:bg-slate-200/80 hover:text-foreground dark:bg-slate-800/60"
                }`}
              >
                <span>{stage.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-white/25 text-white" : stage.color
                  }`}
                >
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Operational Triage List */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredOperations.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all hover:shadow-xs ${
                item.priority === "Critical"
                  ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20"
                  : "border-slate-200/80 bg-slate-50/40 dark:border-slate-800/80 dark:bg-slate-900/30"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.2 font-bold ${
                      item.type === "escalation"
                        ? "border-rose-400 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : item.type === "care_started"
                        ? "border-emerald-400 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : item.type === "new_booking"
                        ? "border-sky-400 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                        : "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800"
                    }`}
                  >
                    {item.title}
                  </Badge>
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.timestamp}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.patientName} ({item.patientId})</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> {item.area}
                </span>
                <Link href={item.type === "escalation" ? "/escalations" : item.type === "new_booking" || item.type === "assignment_pending" ? "/smart-assignment" : "/patients"}>
                  <Button size="sm" variant="ghost" className="h-6 text-[11px] font-bold text-[#01265D] dark:text-blue-300 hover:text-[#01265D] dark:text-blue-200 p-0 hover:bg-transparent">
                    {item.actionLabel || "View Details"} &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CAREGIVER DAILY ACTIVITY STREAM & CARE PRO AVAILABILITY */}
      {/* ------------------------------------------------------------- */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Columns: Caregiver Daily Activity Telemetry Stream */}
        <div className="lg:col-span-7 rounded-2xl border bg-card p-5.5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-300 dark:bg-blue-950 dark:text-blue-300">
                  <HeartPulse className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">Caregiver Daily Activity Stream</h3>
                  <p className="text-[11px] text-muted-foreground">Live check-in, checklists, vitals telemetry & observations</p>
                </div>
              </div>
              <Link href="/care-management?tab=todays-care">
                <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-[#01265D] dark:text-blue-300">
                  View Full Log &rarr;
                </Button>
              </Link>
            </div>

            {/* Live Telemetry Card 1 (with alert) */}
            <div className="my-4 space-y-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50/30 dark:border-rose-900/50 dark:bg-rose-950/20 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Patient #MS1024 · Dr. Arvind Kulkarni</span>
                      <Badge className="bg-rose-600 text-white text-[10px] font-bold">🔴 Coordinator Review Required</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Assigned: <span className="font-semibold text-foreground">Nurse Anita Jadhav</span> · Juhu Scheme
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-800 bg-emerald-50">
                    Live Active Shift
                  </Badge>
                </div>

                <div className="rounded-lg bg-background p-3 text-xs space-y-1.5 border">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Caregiver checked in – 9:02 AM (GPS Verified)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Medication reminder completed (Ecosprin, Telmisartan)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mobility assistance completed (10 min assisted walk)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Vitals recorded: BP 152/94 mmHg, SpO2 91%, Pulse 86 bpm
                  </div>
                  <div className="flex items-start gap-2 text-amber-700 font-bold text-[11px] bg-amber-50 dark:bg-amber-950/60 p-2 rounded border border-amber-200 dark:border-amber-800 mt-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>⚠️ Patient reported increased discomfort & shortness of breath on standing.</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground pt-1 italic">
                    Caregiver note: &quot;Resting SpO2 is 94%, drops to 91% on exertion. Alerted Coordinator Dr. Joshi.&quot;
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-semibold text-rose-700">Action: Tele-consult with Dr. Udwadia scheduled</span>
                  <Link href="/escalations">
                    <Button size="sm" variant="destructive" className="h-7 text-xs font-semibold">
                      Triage Alert
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Live Telemetry Card 2 (Standard smooth visit) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Patient #MS1042 · Kamala Mehta</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50 font-semibold">
                        Routine Stable Care
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Assigned: <span className="font-semibold text-foreground">Caregiver Sunita Deshmukh</span> · Bandra West
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">Started 8:00 AM</span>
                </div>

                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Donepezil morning dose administered
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Assisted garden walk completed (15 mins)
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Vitals logged: BP 124/78 mmHg, SpO2 98%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Live telemetry sync active from Caregiver Mobile App</span>
            <Link href="/patients" className="font-semibold text-[#01265D] dark:text-blue-300 hover:underline">
              Patient 360° Records &rarr;
            </Link>
          </div>
        </div>

        {/* Right 5 Columns: Care Professional Availability Dashboard */}
        <div className="lg:col-span-5 rounded-2xl border bg-card p-5.5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-sm font-extrabold text-foreground">Care Professional Availability</h3>
                <p className="text-[11px] text-muted-foreground">Live lifecycle & assignment tracker</p>
              </div>
              <Link href="/caregivers?tab=availability">
                <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-[#01265D] dark:text-blue-300">
                  Full Roster &rarr;
                </Button>
              </Link>
            </div>

            {/* Table of Care Pros */}
            <div className="my-3 divide-y divide-border/60">
              {initialCareProfessionals.slice(0, 5).map((pro) => (
                <div key={pro.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 text-xs font-bold">
                        {pro.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground truncate">{pro.name}</span>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-medium">
                          {pro.type}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" /> {pro.area} · ★ {pro.rating}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Badge
                      className={`text-[10px] font-bold px-2 py-0.5 ${
                        pro.status === "Available"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : pro.status === "Care Started"
                          ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                          : pro.status === "En route"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                          : pro.status === "Accepted"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {pro.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {pro.currentAssignment ? pro.currentAssignment.patientId : "— Ready to Assign"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Available &rarr; Assigned &rarr; Accepted &rarr; En route &rarr; Care Started</span>
            <Link href="/smart-assignment">
              <Button size="sm" className="h-7 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-medium">
                Assign Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
