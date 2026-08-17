"use client";

import { useState, useMemo } from "react";
import {
  initialCareProfessionals,
  CareProfessional,
  ProfessionalStatus,
} from "@/lib/admin-data";
import { OnboardProfessionalModal } from "./_components/onboard-professional-modal";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Activity,
  SlidersHorizontal,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CareProfessionalsPage() {
  const [professionals, setProfessionals] = useState<CareProfessional[]>(initialCareProfessionals);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [areaFilter, setAreaFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"roster" | "availability">("availability");
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Lifecycle status filters
  const filteredPros = useMemo(() => {
    return professionals.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.area.toLowerCase().includes(q) ||
        (p.currentAssignment && p.currentAssignment.patientName.toLowerCase().includes(q));

      const matchesType = typeFilter === "All" || p.type === typeFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesArea = areaFilter === "All" || p.area === areaFilter;

      return matchesSearch && matchesType && matchesStatus && matchesArea;
    });
  }, [professionals, searchQuery, typeFilter, statusFilter, areaFilter]);

  const handleAddProfessional = (newPro: CareProfessional) => {
    setProfessionals((prev) => [newPro, ...prev]);
  };

  const handleUpdateStatus = (proId: string, nextStatus: ProfessionalStatus) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === proId ? { ...p, status: nextStatus } : p))
    );
    swiftAlert.success({
      title: "Status Transition Updated",
      description: `Professional marked as ${nextStatus}.`,
    });
  };

  const getStatusBadge = (status: ProfessionalStatus) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">🟢 Available</Badge>;
      case "Assigned":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">🟡 Assigned</Badge>;
      case "Accepted":
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold">🔵 Accepted</Badge>;
      case "En route":
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">🚗 En Route</Badge>;
      case "Care Started":
        return <Badge className="bg-teal-600 text-white font-bold animate-pulse">❤️ Care Started</Badge>;
      case "Care Completed":
        return <Badge className="bg-slate-200 text-slate-800 font-bold">✓ Completed</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-600 font-bold">Off Duty</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Care Professionals & Availability
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              Unified Roster
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Common module for Nurses, Caregivers, and Physiotherapists tracking real-time availability lifecycle.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm gap-1.5"
            onClick={() => setIsOnboardModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Onboard Professional
          </Button>
        </div>
      </div>

      {/* Lifecycle Flow Header Breadcrumb */}
      {/* <div className="rounded-xl border bg-slate-900 text-white p-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Care Delivery Status Pipeline:
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-200 overflow-x-auto scrollbar-none">
            <span className="font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">1. Available</span>
            <span>&rarr;</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">2. Assigned</span>
            <span>&rarr;</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">3. Accepted</span>
            <span>&rarr;</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">4. En Route</span>
            <span>&rarr;</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-teal-800 text-teal-200 border border-teal-600">5. Care Started</span>
            <span>&rarr;</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">6. Care Completed</span>
          </div>
        </div>
      </div> */}

      {/* Filter Tabs: All, Nurses, Caregivers, Physiotherapists */}
      <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { key: "All", label: "All Professionals", count: professionals.length },
            { key: "Nurse", label: "Nurses", count: professionals.filter((p) => p.type === "Nurse").length },
            { key: "Caregiver", label: "Caregivers", count: professionals.filter((p) => p.type === "Caregiver").length },
            { key: "Physiotherapist", label: "Physiotherapists", count: professionals.filter((p) => p.type === "Physiotherapist").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                typeFilter === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  typeFilter === tab.key ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Area Filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search professional or area..."
              className="pl-9 text-xs rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
            <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="En route">En route</SelectItem>
              <SelectItem value="Care Started">Care Started</SelectItem>
              <SelectItem value="Care Completed">Care Completed</SelectItem>
              <SelectItem value="Off Duty">Off Duty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Availability Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-64">
                Professional
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Area
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Assignment
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Experience & Rating
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Quick Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                  No professionals match the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredPros.map((pro) => (
                <TableRow key={pro.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                  {/* Professional */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-teal-100 text-teal-800 text-xs font-bold">
                        <AvatarFallback>{pro.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          {pro.name}
                          {pro.policeVerified && (
                            <ShieldCheck className="h-3 w-3 text-teal-600" />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5 text-teal-600" /> {pro.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {pro.type}
                    </Badge>
                  </TableCell>

                  {/* Area */}
                  <TableCell className="text-xs font-medium text-foreground py-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-teal-600" />
                      {pro.area}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    {getStatusBadge(pro.status)}
                  </TableCell>

                  {/* Current Assignment */}
                  <TableCell className="py-3">
                    {pro.currentAssignment ? (
                      <div>
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                          Patient #{pro.currentAssignment.patientId} ({pro.currentAssignment.patientName})
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {pro.currentAssignment.shiftTime}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Experience & Rating */}
                  <TableCell className="py-3">
                    <div className="text-xs font-semibold text-foreground">
                      ★ {pro.rating} <span className="text-muted-foreground text-[10px]">({pro.totalVisitsCompleted} visits)</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {pro.experienceYears} yrs exp · {pro.qualification}
                    </div>
                  </TableCell>

                  {/* Quick Action */}
                  <TableCell className="text-right py-3">
                    {pro.status === "Available" ? (
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold"
                        onClick={() =>
                          swiftAlert.info({
                            title: `Assign ${pro.name}`,
                            description: "Connecting to open booking queue in Smart Matcher.",
                          })
                        }
                      >
                        Assign Patient
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-semibold"
                        onClick={() =>
                          swiftAlert.info({
                            title: `Shift Schedule: ${pro.name}`,
                            description: `Current active shift: ${pro.currentAssignment?.shiftTime || "Scheduled"}.`,
                          })
                        }
                      >
                        View Shift
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Care Professional Onboarding Modal */}
      <OnboardProfessionalModal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onAddProfessional={handleAddProfessional}
      />
    </div>
  );
}
