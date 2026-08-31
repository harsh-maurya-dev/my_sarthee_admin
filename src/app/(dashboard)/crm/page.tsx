import { Metadata } from "next";
import {
  Calendar as CalendarIcon,
  Download,
  Plus,
  Share,
  Users,
  Briefcase,
  Wallet,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata: Metadata = {
  title: "CRM Dashboard | MySarthee Admin",
  description: "Enterprise CRM Dashboard & Pipeline Telemetry",
};

const crmTasks = [
  {
    id: "task-1",
    title: "Follow up with Acme Inc.",
    description: "Send proposal and schedule medical equipment procurement meeting.",
    priority: "High",
    priorityVariant: "destructive" as const,
    dueDate: "Due Today",
    completed: false,
  },
  {
    id: "task-2",
    title: "Prepare quarterly clinical report",
    description: "Compile hospital telemetry data and patient satisfaction forecasts.",
    priority: "Medium",
    priorityVariant: "secondary" as const,
    dueDate: "Due Tomorrow",
    completed: false,
  },
  {
    id: "task-3",
    title: "Update customer & patient profiles",
    description: "Verify insurance contact information and healthcare preferences.",
    priority: "Low",
    priorityVariant: "outline" as const,
    dueDate: "Due Oct 15",
    completed: true,
  },
];

const pipelineStages = [
  { name: "Lead", count: "235 deals", value: "$420,500", percentage: 38 },
  { name: "Qualified", count: "146 deals", value: "$267,800", percentage: 24 },
  { name: "Proposal", count: "84 deals", value: "$192,400", percentage: 18 },
  { name: "Negotiation", count: "52 deals", value: "$129,600", percentage: 12 },
  { name: "Closed Won", count: "36 deals", value: "$87,200", percentage: 8 },
];

export default function CRMDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header & Date Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            CRM Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-xs font-normal border-slate-200 shadow-xs"
          >
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span>03 Jul 2026 - 30 Jul 2026</span>
          </Button>
          <Button
            size="sm"
            className="h-9 gap-2 bg-black text-white text-xs font-semibold hover:bg-slate-800 dark:bg-white dark:text-black"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Row 1: Top Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Target Progress Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-foreground">
            Your target is incomplete
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-foreground text-xs font-bold">
              %48
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You have completed <span className="font-semibold text-[#01265D] dark:text-blue-400">48%</span> of the given target, you can also check your status.
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Total Customers
            </span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              1890
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
              +10.4% <span className="text-muted-foreground">from last month</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-foreground dark:bg-slate-800">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Deals */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Total Deals
            </span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              1,300
            </div>
            <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1">
              -0.8% <span className="text-muted-foreground">from last month</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-foreground dark:bg-slate-800">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">
              Total Revenue
            </span>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
              $435,578
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
              +20.1% <span className="text-muted-foreground">from last month</span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-foreground dark:bg-slate-800">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Row 2: Charts, Tasks & Sales Pipeline */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Leads by Source Donut Chart Widget */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Leads by Source
            </h2>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-slate-200">
              <Share className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>

          {/* SVG Donut Chart */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
              {/* Social Segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#09090b"
                strokeWidth="16"
                strokeDasharray="70 238"
                strokeDashoffset="0"
              />
              {/* Email Segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#52525b"
                strokeWidth="16"
                strokeDasharray="50 238"
                strokeDashoffset="-70"
              />
              {/* Call Segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#a1a1aa"
                strokeWidth="16"
                strokeDasharray="72 238"
                strokeDashoffset="-120"
              />
              {/* Others Segment */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#e4e4e7"
                strokeWidth="16"
                strokeDasharray="46 238"
                strokeDashoffset="-192"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                935
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Leads
              </span>
            </div>
          </div>

          {/* Breakdown Badges */}
          <div className="grid grid-cols-4 gap-2 border-t pt-4 text-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-black dark:bg-white" />
                Social
              </span>
              <p className="mt-1 text-sm font-bold text-foreground">275</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                Email
              </span>
              <p className="mt-1 text-sm font-bold text-foreground">200</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-400" />
                Call
              </span>
              <p className="mt-1 text-sm font-bold text-foreground">287</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-200" />
                Others
              </span>
              <p className="mt-1 text-sm font-bold text-foreground">173</p>
            </div>
          </div>
        </div>

        {/* Tasks Checklist Widget */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Tasks</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track and manage your upcoming tasks.
              </p>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-slate-200">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Task</span>
            </Button>
          </div>

          <div className="my-4 space-y-3">
            {crmTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 rounded-xl border p-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <Checkbox id={task.id} defaultChecked={task.completed} className="mt-0.5" />
                <div className="flex-1 space-y-1 overflow-hidden">
                  <label
                    htmlFor={task.id}
                    className={`text-xs font-semibold cursor-pointer ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {task.title}
                  </label>
                  <p className="text-[11px] text-muted-foreground leading-snug truncate">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant={task.priorityVariant}
                      className="text-[10px] px-2 py-0 font-medium"
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 text-center">
            <span className="text-xs text-muted-foreground font-medium">
              3 tasks remaining for this week
            </span>
          </div>
        </div>

        {/* Sales Pipeline Widget */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Sales Pipeline</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current deals in your sales pipeline.
            </p>

            {/* Pipeline Segment Bar */}
            <div className="my-5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div style={{ width: "38%" }} className="bg-black dark:bg-white" />
              <div style={{ width: "24%" }} className="bg-zinc-700" />
              <div style={{ width: "18%" }} className="bg-zinc-500" />
              <div style={{ width: "12%" }} className="bg-zinc-400" />
              <div style={{ width: "8%" }} className="bg-zinc-300" />
            </div>

            {/* Pipeline Breakdown List */}
            <div className="space-y-4">
              {pipelineStages.map((stage, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-zinc-800 dark:bg-zinc-200" />
                      <span className="font-semibold text-foreground">{stage.name}</span>
                      <span className="text-muted-foreground text-[11px]">{stage.count} · {stage.value}</span>
                    </div>
                    <span className="font-semibold text-foreground">{stage.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${stage.percentage}%` }}
                      className="h-full rounded-full bg-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 text-center">
            <span className="text-xs font-semibold text-[#01265D] dark:text-blue-400">
              Total Active Deals Value: $997,500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
