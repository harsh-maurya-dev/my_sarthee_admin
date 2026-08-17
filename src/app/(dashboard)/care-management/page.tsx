"use client";

import { useState } from "react";
import {
  initialPatients360,
  Patient360,
  DailyVisitActivity,
} from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HeartHandshake,
  HeartPulse,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Stethoscope,
  Target,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Check,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CareManagementPage() {
  const [activeTab, setActiveTab] = useState<"care-plans" | "todays-care" | "progress">("care-plans");
  const [selectedPatient, setSelectedPatient] = useState<Patient360>(initialPatients360[0]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Care Management & Clinical Governance
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              Recovery-Led Care
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Care Plan Architecture (Type, Frequency, Duration, Goals) &rarr; Activities &rarr; Progress &rarr; Outcomes.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-3">
        {[
          { key: "care-plans", label: "Care Plans & Goals", icon: Target },
          { key: "todays-care", label: "Today's Care Stream", icon: HeartPulse },
          { key: "progress", label: "Recovery Milestones & Outcomes", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CARE PLANS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "care-plans" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Patients Selection List */}
          <div className="lg:col-span-4 rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Active Patient Care Plans ({initialPatients360.length})
            </h2>
            <div className="space-y-2">
              {initialPatients360.map((p) => {
                const isSelected = selectedPatient.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 ring-1 ring-teal-600"
                        : "border-slate-200/80 bg-slate-50/40 hover:bg-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-foreground">{p.fullName}</h3>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {p.patientId}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {p.carePlan.careType} · {p.carePlan.duration} ({p.carePlan.frequency})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Care Plan Details */}
          <div className="lg:col-span-8 rounded-2xl border bg-card p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {selectedPatient.fullName}&apos;s Recovery Plan
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Diagnosis: {selectedPatient.primaryDiagnosis}
                </p>
              </div>
              <Badge className="bg-teal-600 text-white font-bold">{selectedPatient.carePlan.careType}</Badge>
            </div>

            {/* Matrix Attributes: Care Type, Frequency, Duration, Goals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Care Type</span>
                <span className="font-bold text-foreground">{selectedPatient.carePlan.careType}</span>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Frequency</span>
                <span className="font-bold text-foreground">{selectedPatient.carePlan.frequency}</span>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Duration</span>
                <span className="font-bold text-foreground">{selectedPatient.carePlan.duration}</span>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-3 border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Period</span>
                <span className="font-bold text-foreground">{selectedPatient.carePlan.startDate} to {selectedPatient.carePlan.endDate}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground">Defined Clinical Recovery Goals:</h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-lg border border-teal-200 dark:border-teal-900">
                {selectedPatient.carePlan.goals}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">Special Protocols:</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedPatient.carePlan.specialRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded border">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-xs font-bold text-foreground">Activity Progression Tracker:</h4>
              <div className="space-y-2.5">
                {selectedPatient.carePlan.activitiesProgress.map((act, i) => {
                  const pct = Math.round((act.completed / act.total) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{act.activity} ({act.target})</span>
                        <span className="font-bold text-teal-700 dark:text-teal-400">{act.completed}/{act.total} {act.unit} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TODAY'S CARE STREAM */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "todays-care" && (
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-foreground">Live Telemetry Feed (Caregiver Mobile App Stream)</h3>
                <p className="text-xs text-muted-foreground">Start Care &rarr; Check-in &rarr; Care Activity &rarr; Vitals &rarr; Tasks &rarr; Discomfort &rarr; Check-out</p>
              </div>
              <Badge className="bg-emerald-600 text-white font-bold">12 Active Shifts Today</Badge>
            </div>

            {/* Detailed stream cards */}
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4.5 space-y-3 dark:border-rose-900/50 dark:bg-rose-950/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-teal-800 text-white font-bold">
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground">Patient #MS1024 · Dr. Arvind Kulkarni</h4>
                        <Badge className="bg-rose-600 text-white text-[10px] font-bold">🔴 Coordinator Review Required</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Assigned: <span className="font-semibold text-foreground">Nurse Anita Jadhav</span> · Juhu Scheme
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Check-in: 09:02 AM</span>
                </div>

                <div className="bg-background rounded-lg p-3.5 text-xs space-y-1.5 border">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Caregiver checked in – 9:02 AM
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Medication reminder completed
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Mobility assistance completed
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Vitals recorded: BP 152/94 mmHg, SpO2 91%, Pulse 86 bpm
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 font-bold bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>⚠️ Patient reported increased discomfort</span>
                  </div>
                  <div className="text-muted-foreground pt-1 italic">
                    ✓ Caregiver submitted note: &quot;Resting SpO2 94%, drops to 91% on walking. Advised oxygen standby.&quot;
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 space-y-3 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-teal-100 text-teal-800 font-bold">
                      <AvatarFallback>KM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Patient #MS1042 · Kamala Mehta</h4>
                      <p className="text-xs text-muted-foreground">
                        Assigned: <span className="font-semibold text-foreground">Caregiver Sunita Deshmukh</span> · Bandra West
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Check-in: 08:00 AM</span>
                </div>

                <div className="bg-background rounded-lg p-3.5 text-xs space-y-1.5 border">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Caregiver checked in – 8:00 AM
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Breakfast & Donepezil dementia dose administered
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Assisted garden walk completed
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Check className="h-3.5 w-3.5" /> Vitals recorded: BP 124/78 mmHg, SpO2 98%, Pulse 72 bpm
                  </div>
                  <div className="text-muted-foreground pt-1 italic">
                    ✓ Caregiver submitted note: &quot;Patient in great spirits. Memory album review completed.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PROGRESS & OUTCOMES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-foreground">Patient Recovery Outcomes & Milestones</h3>
          <p className="text-xs text-muted-foreground">Track recovery progression beyond simple attendance</p>

          <div className="grid gap-4 md:grid-cols-2">
            {initialPatients360.map((p) => (
              <div key={p.id} className="rounded-xl border p-4 space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">{p.fullName} ({p.patientId})</h4>
                  <Badge variant="outline">{p.carePlan.careType}</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  {p.carePlan.milestones.map((m) => (
                    <div key={m.id} className="rounded-lg bg-background p-2.5 border space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">{m.title}</span>
                        <Badge className={m.status === "Completed" ? "bg-emerald-100 text-emerald-800 text-[9px]" : "bg-amber-100 text-amber-800 text-[9px]"}>
                          {m.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{m.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
