"use client";

import { useState, useMemo } from "react";
import { initialPatients, Patient } from "./_data/patients";
import { PatientDetailsSheet } from "./_components/patient-details-sheet";
import { AddPatientModal } from "./_components/add-patient-modal";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Download,
  Calendar,
  RefreshCw,
  UserCheck,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PatientManagementPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Blocked">("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter patients based on Search (Full Name / Phone Number) and Filters (Status, Date)
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        patient.fullName.toLowerCase().includes(q) ||
        patient.phoneNumber.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || patient.status === statusFilter;

      const matchesDate = !dateFilter || patient.registrationDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [patients, searchQuery, statusFilter, dateFilter]);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsSheetOpen(true);
  };

  const handleUpdateStatus = (patientId: string, newStatus: Patient["status"]) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );

    const targetPatient = patients.find((p) => p.id === patientId);
    const name = targetPatient?.fullName || "Patient";

    if (newStatus === "Active") {
      swiftAlert.success({
        title: "Patient Enabled",
        description: `${name} has been enabled and marked as Active.`,
      });
    } else if (newStatus === "Inactive") {
      swiftAlert.info({
        title: "Patient Disabled",
        description: `${name} has been disabled and marked as Inactive.`,
      });
    } else if (newStatus === "Blocked") {
      swiftAlert.error({
        title: "Patient Blocked",
        description: `${name} has been blocked from system access.`,
      });
    }

    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setDateFilter("");
    swiftAlert.info({
      title: "Filters Reset",
      description: "Displaying all registered patient records.",
    });
  };

  const renderStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-600 text-white font-semibold text-[11px]">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium text-[11px]">Inactive</Badge>;
      case "Blocked":
        return <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-[11px]">Blocked</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-teal-600" />
            Patient Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage patient records, care requirements, care plans, and status actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Exported patient list to CSV format.",
              })
            }
            className="h-9 gap-2 text-xs border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Patient</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search by Username / Full Name or Phone Number */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Patient Name or Phone Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select
                value={statusFilter}
                onValueChange={(val: any) => setStatusFilter(val)}
              >
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                  <SelectItem value="Blocked">Blocked Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Reg. Date:</span>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-9 text-xs pl-8 w-36"
                />
              </div>
            </div>

            {/* Reset Button */}
            {(searchQuery || statusFilter !== "All" || dateFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Full Name</TableHead>
              <TableHead className="font-bold text-xs">Age / Gender</TableHead>
              <TableHead className="font-bold text-xs">DOB</TableHead>
              <TableHead className="font-bold text-xs">Phone Number</TableHead>
              <TableHead className="font-bold text-xs">Address / Location</TableHead>
              <TableHead className="font-bold text-xs">Medical Condition</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No registered patients found matching your search or filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="font-semibold text-xs text-foreground">
                    <div className="flex flex-col">
                      <span>{patient.fullName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground font-normal">
                        {patient.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {patient.age} yrs · <span className="text-muted-foreground">{patient.gender}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {patient.dateOfBirth}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {patient.phoneNumber}
                  </TableCell>
                  <TableCell className="text-xs max-w-[180px] truncate text-muted-foreground">
                    {patient.address}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-teal-700 dark:text-teal-400 max-w-[200px] truncate">
                    {patient.medicalCondition}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderStatusBadge(patient.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPatient(patient)}
                        className="h-8 text-xs gap-1 font-medium border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      {/* Action Button Dropdown (Enable, Disable, Block User) */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-background text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:border-slate-800 dark:hover:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Patient Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                              Account Actions
                            </DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(patient.id, "Active")}
                            disabled={patient.status === "Active"}
                            className="cursor-pointer text-xs text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
                          >
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                            <span>Enable</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(patient.id, "Inactive")}
                            disabled={patient.status === "Inactive"}
                            className="cursor-pointer text-xs text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
                          >
                            <XCircle className="mr-2 h-3.5 w-3.5" />
                            <span>Disable</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(patient.id, "Blocked")}
                            disabled={patient.status === "Blocked"}
                            className="cursor-pointer text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                          >
                            <Ban className="mr-2 h-3.5 w-3.5" />
                            <span>Block User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer Summary */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredPatients.length}</strong> of{" "}
            <strong className="text-foreground">{patients.length}</strong> registered patients
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            System Live Sync Active
          </span>
        </div>
      </div>

      {/* Patient Details Sheet Drawer */}
      <PatientDetailsSheet
        patient={selectedPatient}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdatePatient={handleUpdatePatient}
      />

      {/* Register Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}
