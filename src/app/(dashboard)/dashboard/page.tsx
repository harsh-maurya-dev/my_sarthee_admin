import { Metadata } from "next";
import {
  Users,
  HeartPulse,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  FileUser,
  BookOpen,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardFilters } from "../_components/dashboard-filters";

export const metadata: Metadata = {
  title: "Admin Personalized Dashboard | MySarthee",
  description: "Overview of Patients, Caregivers, Revenue, Alerts, and Website Analytics.",
};

const recentActivities = [
  {
    id: 1,
    type: "enquiry",
    title: "New Patient Service Enquiry",
    description: "Eleanor Vance requested home healthcare assessment in Sector 4.",
    time: "10 mins ago",
    badge: "Enquiry",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    id: 2,
    type: "career",
    title: "Career Application Received",
    description: "Nurse David Miller submitted resume for Senior ICU Caregiver.",
    time: "45 mins ago",
    badge: "Career App",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    id: 3,
    type: "blog",
    title: "Blog Published",
    description: "'10 Essential Home Care Tips for Elderly Patients' published by Dr. Sarah.",
    time: "2 hours ago",
    badge: "Published",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    id: 4,
    type: "enquiry",
    title: "Corporate Wellness Consultation",
    description: "Apex Health Group requested annual corporate health checkup quote.",
    time: "4 hours ago",
    badge: "Enquiry",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
];

const alertItems = [
  {
    id: "alert-1",
    type: "Missed Visit",
    patient: "Robert Chen (ID: #4092)",
    caregiver: "Nurse Sarah Jenkins",
    location: "Downtown Clinic Branch",
    time: "09:30 AM Today",
    severity: "High",
  },
  {
    id: "alert-2",
    type: "Complaint",
    patient: "Maria Garcia (ID: #3108)",
    caregiver: "Caregiver John Doe",
    location: "Home Care Shift #102",
    time: "11:15 AM Today",
    severity: "Medium",
  },
];

export default function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Overview Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Personalized health telemetry, caregiver alerts, and website performance analytics.
          </p>
        </div>
      </div>

      {/* Filter Options Component */}
      <DashboardFilters />

      {/* Section 1: Core Admin Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Patients
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              3,842
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.8% this month</span>
            </div>
          </div>
        </div>

        {/* Total Active CareGiver */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active CareGivers
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              248
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>96.4% on active duty</span>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Revenue Metrics
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              $184,250
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% vs previous period</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-rose-950 dark:text-rose-100">
                12
              </span>
              <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 mt-0.5">
                8 Missed Visits · 4 Complaints
              </p>
            </div>
            <Button size="sm" variant="destructive" className="h-7 text-[11px] px-2.5">
              Review Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Website Performance Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Website Enquiries */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Total Website Enquiries
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              1,420
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground font-medium">
              42 pending review
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-foreground dark:bg-slate-800">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Total Career Applications */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Career Applications
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              318
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground font-medium">
              15 new applications today
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-foreground dark:bg-slate-800">
            <FileUser className="h-5 w-5" />
          </div>
        </div>

        {/* Total Blogs Published */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Blogs Published
            </span>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              84
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground font-medium">
              4 published this month
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-foreground dark:bg-slate-800">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Section 3: Alerts Action List & Recent Website Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Critical Care Alerts Triage List */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <h2 className="text-base font-bold text-foreground">
                Alerts Triage (Missed Visits & Complaints)
              </h2>
            </div>
            <Badge variant="outline" className="text-xs border-rose-200 text-rose-700 bg-rose-50">
              Needs Action
            </Badge>
          </div>

          <div className="my-4 space-y-3">
            {alertItems.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={alert.type === "Missed Visit" ? "destructive" : "secondary"}
                      className="text-[10px] px-2 py-0 font-semibold"
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">
                      {alert.patient}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned: <span className="font-medium text-foreground">{alert.caregiver}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2 pt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{alert.time}</span> · <span>{alert.location}</span>
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs shrink-0">
                  Resolve
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-center">
            <span className="text-xs text-muted-foreground font-medium">
              View all 12 operational alerts in Caregiver Management
            </span>
          </div>
        </div>

        {/* Recent Website Activities Timeline */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              <h2 className="text-base font-bold text-foreground">
                Recent Website Activities
              </h2>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-teal-600">
              View All
            </Button>
          </div>

          <div className="my-4 space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-teal-600 dark:bg-slate-800 mt-0.5">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-1">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-center">
            <span className="text-xs text-muted-foreground font-medium">
              Live updates enabled from website forms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
