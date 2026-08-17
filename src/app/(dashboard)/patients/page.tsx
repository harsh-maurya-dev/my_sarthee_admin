"use client";

import { useState, useMemo } from "react";
import {
  initialPatients360,
  Patient360,
  RiskLevel,
  PatientStatus,
} from "@/lib/admin-data";
import { PatientDetailsSheet } from "./_components/patient-details-sheet";
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
  Eye,
  Calendar,
  Phone,
  MapPin,
  HeartPulse,
  Sparkles,
  Download,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient360[]>(initialPatients360);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient360 | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter patients based on Search, Status, Tab, and Location
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.fullName.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.primaryContactPhone.includes(q) ||
        p.locationArea.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || p.currentStatus === statusFilter;

      const matchesLocation =
        locationFilter === "All" || p.locationArea === locationFilter;

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Active" && p.currentStatus === "Active") ||
        (activeTab === "Completed" && p.currentStatus === "Completed") ||
        (activeTab === "Risk" && (p.riskIndicator === "Critical" || p.riskIndicator === "High")) ||
        (activeTab === "Pending" && p.currentStatus === "Pending");

      return matchesSearch && matchesStatus && matchesLocation && matchesTab;
    });
  }, [patients, searchQuery, statusFilter, locationFilter, activeTab]);

  const handleOpen360 = (patient: Patient360) => {
    setSelectedPatient(patient);
    setIsSheetOpen(true);
  };

  const handleUpdatePatient = (updated: Patient360) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPatient(updated);
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case "Critical":
        return <Badge className="bg-rose-600 text-white font-bold text-[10px] animate-pulse">🔴 Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-500 text-white font-bold text-[10px]">🟠 High</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500 text-white font-bold text-[10px]">🟡 Medium</Badge>;
      default:
        return <Badge className="bg-emerald-600 text-white font-bold text-[10px]">🟢 Normal</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px]">Paid</Badge>;
      case "Pending":
        return <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 text-[10px]">Pending</Badge>;
      case "Overdue":
        return <Badge variant="destructive" className="text-[10px]">Overdue</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Patient Management
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              {filteredPatients.length} Patients
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete directory of home care patients with risk indicators, care plans, and Patient 360° telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-semibold"
            onClick={() => swiftAlert.info({ title: "Export Started", description: "Exporting patient directory CSV." })}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
          {/* <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm"
            onClick={() => swiftAlert.info({ title: "New Patient Intake", description: "Opening intake onboarding workflow." })}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Patient Intake
          </Button> */}
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b pb-3 overflow-x-auto scrollbar-none">
        {[
          { key: "All", label: "All Patients", count: patients.length },
          { key: "Active", label: "Active Care", count: patients.filter((p) => p.currentStatus === "Active").length },
          { key: "Risk", label: "High Risk Triage", count: patients.filter((p) => p.riskIndicator === "Critical" || p.riskIndicator === "High").length },
          { key: "Completed", label: "Completed Care", count: patients.filter((p) => p.currentStatus === "Completed").length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.key
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-100/80 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Location Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, ID (#MS1024), phone, area..."
            className="pl-9 text-xs rounded-xl bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={locationFilter} onValueChange={(val) => val && setLocationFilter(val)}>
            <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-card">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Locations</SelectItem>
              <SelectItem value="Andheri">Andheri</SelectItem>
              <SelectItem value="Bandra">Bandra</SelectItem>
              <SelectItem value="Powai">Powai</SelectItem>
              <SelectItem value="Juhu">Juhu</SelectItem>
              <SelectItem value="South Mumbai">South Mumbai</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
            <SelectTrigger className="w-36 h-9 text-xs rounded-xl bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Patient Table with all required columns */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table className="min-w-[1100px] w-full">
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-64">
                Patient Name & ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Age / Gender
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Care Required
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Primary Contact
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Professional
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Start Date
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Payment Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Risk Indicator
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-xs text-muted-foreground">
                  No patients matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((p) => {
                const assignedPro = p.assignedTeam[0];
                const latestInvoice = p.invoices[0];

                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                    onClick={() => handleOpen360(p)}
                  >
                    {/* Patient Name & ID */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 bg-teal-100 text-teal-800 text-xs font-bold shrink-0">
                          <AvatarFallback>{p.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-bold text-foreground hover:text-teal-600 transition-colors">
                            {p.fullName}
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {p.patientId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Age / Gender */}
                    <TableCell className="text-xs font-medium text-foreground py-3">
                      {p.age}y / {p.gender.slice(0, 1)}
                    </TableCell>

                    {/* Care Required */}
                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {p.careRequired}
                      </Badge>
                    </TableCell>

                    {/* Location Area */}
                    <TableCell className="text-xs font-medium text-muted-foreground py-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-teal-600 shrink-0" />
                        {p.locationArea}
                      </span>
                    </TableCell>

                    {/* Primary Contact */}
                    <TableCell className="py-3">
                      <div className="text-xs font-semibold text-foreground">
                        {p.primaryContactName}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 text-teal-600" />
                        {p.primaryContactPhone}
                      </div>
                    </TableCell>

                    {/* Assigned Professional */}
                    <TableCell className="py-3">
                      {assignedPro ? (
                        <div>
                          <span className="text-xs font-bold text-foreground block">
                            {assignedPro.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {assignedPro.role}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-amber-600">Pending</span>
                      )}
                    </TableCell>

                    {/* Start Date */}
                    <TableCell className="text-xs text-muted-foreground py-3">
                      {p.careStartDate}
                    </TableCell>

                    {/* Current Status */}
                    <TableCell className="py-3">
                      <Badge
                        className={`text-[10px] font-bold ${
                          p.currentStatus === "Active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : p.currentStatus === "Scheduled"
                            ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.currentStatus}
                      </Badge>
                    </TableCell>

                    {/* Payment Status */}
                    <TableCell className="py-3">
                      {latestInvoice ? getPaymentStatusBadge(latestInvoice.status) : <Badge variant="outline" className="text-[10px]">N/A</Badge>}
                    </TableCell>

                    {/* Risk Indicator */}
                    <TableCell className="py-3">
                      {getRiskBadge(p.riskIndicator)}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="text-right py-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                        onClick={() => handleOpen360(p)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        360° View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Patient 360° Sheet Modal */}
      <PatientDetailsSheet
        patient={selectedPatient}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdatePatient={handleUpdatePatient}
      />
    </div>
  );
}
