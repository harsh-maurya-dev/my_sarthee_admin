"use client";

import { useState } from "react";
import { systemRoles, UserRole } from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  Plus,
  Lock,
  MapPin,
  FileCode,
} from "lucide-react";


export default function SettingsAndRolesPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "pricing" | "locations" | "audit">("roles");

  const modules = [
    "Dashboard KPI Telemetry",
    "Patient Management & 360°",
    "Care Professionals Availability",
    "Smart Assignment Engine",
    "Care Plans & Clinical Protocols",
    "Escalation Centre Triage",
    "Family Communication Hub",
    "Payments & Revenue Dashboard",
    "Partners & Referral Networks",
    "Settings & Role Delegation",
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              System Settings & Role-Based Access Control (RBAC)
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              Healthcare Governance
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure enterprise roles, clinical privileges, service catalogues, coverage zones, and compliance audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto scrollbar-none">
        {[
          { key: "roles", label: "Users & Roles Matrix", icon: ShieldCheck },

          { key: "pricing", label: "Pricing & Rules", icon: Lock },
          { key: "locations", label: "Coverage Locations", icon: MapPin },
          { key: "audit", label: "Compliance Audit Logs", icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
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
      {/* TAB 1: USERS & ROLES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5.5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-foreground">Operational Role Profiles & Permissions</h2>
                <p className="text-xs text-muted-foreground">Each role accesses only clinical and financial data within their defined scope</p>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Role
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {systemRoles.map((roleObj) => (
                <div key={roleObj.role} className="rounded-xl border p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground">{roleObj.role}</h3>
                    <Badge className={roleObj.badgeColor}>{roleObj.role.split(" ")[0]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{roleObj.description}</p>
                  <div className="space-y-1 pt-1 border-t">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Key Scopes:</span>
                    <div className="flex flex-wrap gap-1">
                      {roleObj.permissions.map((p, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-background px-1.5 py-0.5 rounded border">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Permissions Matrix Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-foreground">Role Permissions Matrix Table</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Module / Feature
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Super Admin
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ops Manager
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Care Coordinator
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Clinical Manager
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Finance
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Support
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    BD
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                    <TableCell className="text-xs font-bold text-foreground py-2.5">
                      {mod}
                    </TableCell>
                    <TableCell className="text-xs text-emerald-600 font-bold">Full Access</TableCell>
                    <TableCell className="text-xs">{i < 6 ? "Read / Write" : "—"}</TableCell>
                    <TableCell className="text-xs">{i === 1 || i === 4 || i === 6 ? "Read / Write" : "Read Only"}</TableCell>
                    <TableCell className="text-xs">{i === 1 || i === 4 || i === 5 ? "Read / Write" : "—"}</TableCell>
                    <TableCell className="text-xs">{i === 7 ? "Read / Write" : "—"}</TableCell>
                    <TableCell className="text-xs">{i === 1 || i === 6 ? "Read Only" : "—"}</TableCell>
                    <TableCell className="text-xs">{i === 8 ? "Read / Write" : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* TAB 4: LOCATIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "locations" && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-foreground">Active Mumbai Care Zones</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { name: "Western Suburbs (Andheri, Juhu, Bandra)", activePros: "52 Pros", status: "Optimal Coverage" },
              { name: "Central Suburbs (Powai, Chembur, Ghatkopar)", activePros: "38 Pros", status: "Optimal Coverage" },
              { name: "South Mumbai (Colaba, Malabar Hill, Worli)", activePros: "24 Pros", status: "Expanding" },
            ].map((loc, idx) => (
              <div key={idx} className="rounded-xl border p-4 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-foreground">{loc.name}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground">{loc.activePros} on duty · <span className="text-emerald-600 font-semibold">{loc.status}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: AUDIT LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-foreground">Clinical & Operational Audit Trail</h3>
          <div className="space-y-2 text-xs">
            {[
              { action: "Smart Assignment Executed", actor: "Dr. Vikram Joshi (Coordinator)", target: "Booking BK-2120 assigned to Nurse Priya Sharma", time: "10 mins ago" },
              { action: "Critical Escalation Resolved", actor: "Dr. Vikram Joshi (Clinical Manager)", target: "Patient #MS1024 Telemetry Review & Dr. Udwadia Consult", time: "45 mins ago" },
              { action: "Invoice Generated", actor: "Finance Bot", target: "Invoice #INV-2026-08-1092 generated for Anand Rathi", time: "2 hours ago" },
              { action: "Caregiver Onboarding Verified", actor: "Operations Manager", target: "Police Verification & BLS Certificate cleared for Nurse Sanjay", time: "Yesterday" },
            ].map((log, idx) => (
              <div key={idx} className="rounded-lg border p-3 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-foreground">{log.action}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{log.actor} &bull; {log.target}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
