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
  Filter,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Download,
  X,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient360[]>(initialPatients360);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [careTypeFilter, setCareTypeFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [startDateFrom, setStartDateFrom] = useState<string>("");
  const [startDateTo, setStartDateTo] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient360 | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Helper to normalize care type
  const normalizeCareType = (care: string): "Nursing" | "Caregiving" | "Physiotherapy" => {
    if (care === "Nursing") return "Nursing";
    if (care === "Physiotherapy") return "Physiotherapy";
    return "Caregiving";
  };

  // Filter patients based on Search, Status, Care Type, Location, and Start Date Range
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.fullName.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.primaryContactPhone.includes(q) ||
        p.locationArea.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending Assignment"
          ? p.currentStatus === "Pending Assignment" || p.currentStatus === "Pending"
          : p.currentStatus === statusFilter);

      const normalizedCare = normalizeCareType(p.careRequired);
      const matchesCareType =
        careTypeFilter === "All" || normalizedCare === careTypeFilter;

      const matchesLocation =
        locationFilter === "All" || p.locationArea === locationFilter;

      // Start Date Range Filter
      const patientDate = p.careStartDate; // format YYYY-MM-DD
      const matchesDateFrom = !startDateFrom || patientDate >= startDateFrom;
      const matchesDateTo = !startDateTo || patientDate <= startDateTo;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCareType &&
        matchesLocation &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [patients, searchQuery, statusFilter, careTypeFilter, locationFilter, startDateFrom, startDateTo]);

  const handleOpen360 = (patient: Patient360) => {
    setSelectedPatient(patient);
    setIsSheetOpen(true);
  };

  const handleUpdatePatient = (updated: Patient360) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedPatient(updated);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCareTypeFilter("All");
    setLocationFilter("All");
    setStartDateFrom("");
    setStartDateTo("");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    careTypeFilter !== "All" ||
    locationFilter !== "All" ||
    startDateFrom !== "" ||
    startDateTo !== "";

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

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
            Active
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-bold">
            Scheduled
          </Badge>
        );
      case "Pending Assignment":
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
            Pending Assignment
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-bold">
            {status}
          </Badge>
        );
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
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card p-3 rounded-2xl border shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2.5 justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name, ID (#MS-1024), phone..."
              className="pl-8 h-9 text-xs rounded-xl bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Care Required Filter */}
            <Select value={careTypeFilter} onValueChange={(val) => val && setCareTypeFilter(val)}>
              <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl bg-background">
                <SelectValue placeholder="Care Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Care Types</SelectItem>
                <SelectItem value="Nursing">Nursing</SelectItem>
                <SelectItem value="Caregiving">Caregiving</SelectItem>
                <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-[155px] h-9 text-xs rounded-xl bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Pending Assignment">Pending Assignment</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Area Filter */}
            <Select value={locationFilter} onValueChange={(val) => val && setLocationFilter(val)}>
              <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl bg-background">
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
          </div>
        </div>

        {/* Start Date Range Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>Start Date Range:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">From</span>
              <Input
                type="date"
                value={startDateFrom}
                onChange={(e) => setStartDateFrom(e.target.value)}
                className="h-8 w-34 text-xs rounded-lg bg-background px-2"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">To</span>
              <Input
                type="date"
                value={startDateTo}
                onChange={(e) => setStartDateTo(e.target.value)}
                className="h-8 w-34 text-xs rounded-lg bg-background px-2"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <X className="h-3 w-3" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Patient Table */}
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
                const careDisplay = normalizeCareType(p.careRequired);

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
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          careDisplay === "Nursing"
                            ? "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300"
                            : careDisplay === "Physiotherapy"
                            ? "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300"
                            : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}
                      >
                        {careDisplay}
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
                        <span className="text-xs font-bold text-amber-600">Pending Assignment</span>
                      )}
                    </TableCell>

                    {/* Start Date */}
                    <TableCell className="text-xs text-muted-foreground py-3 font-mono">
                      {p.careStartDate}
                    </TableCell>

                    {/* Current Status */}
                    <TableCell className="py-3">
                      {getStatusBadge(p.currentStatus)}
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
