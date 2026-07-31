"use client";

import { useState, useMemo } from "react";
import {
  Caregiver,
  CaregiverRegistrationRequest,
  initialCaregivers,
  initialRegistrationRequests,
} from "./_data/caregivers";
import { CaregiverDetailsSheet } from "./_components/caregiver-details-sheet";
import { AddCaregiverModal } from "./_components/add-caregiver-modal";
import { ReviewApplicantModal } from "./_components/review-applicant-modal";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  MoreVertical,
  HeartPulse,
  RefreshCw,
  Download,
  Calendar,
  Star,
  ClipboardList,
  Users,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CaregiverManagementPage() {
  const [activeTab, setActiveTab] = useState<"caregivers" | "requests">("caregivers");

  // Caregiver List State
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Blocked">("All");
  const [dateFilter, setDateFilter] = useState("");

  // Registration Requests State
  const [registrationRequests, setRegistrationRequests] = useState<CaregiverRegistrationRequest[]>(
    initialRegistrationRequests
  );

  // UI State
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<CaregiverRegistrationRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Filtered Caregivers
  const filteredCaregivers = useMemo(() => {
    return caregivers.filter((cg) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cg.fullName.toLowerCase().includes(q) ||
        cg.username.toLowerCase().includes(q) ||
        cg.skills.some((s) => s.toLowerCase().includes(q)) ||
        cg.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || cg.status === statusFilter;
      const matchesDate = !dateFilter || cg.registrationDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [caregivers, searchQuery, statusFilter, dateFilter]);

  // Pending requests count
  const pendingCount = registrationRequests.filter((r) => r.status === "Pending Review").length;

  // Handlers
  const handleViewCaregiver = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsSheetOpen(true);
  };

  const handleUpdateStatus = (caregiverId: string, newStatus: Caregiver["status"]) => {
    setCaregivers((prev) =>
      prev.map((cg) => (cg.id === caregiverId ? { ...cg, status: newStatus } : cg))
    );

    const target = caregivers.find((cg) => cg.id === caregiverId);
    const name = target?.fullName || "Caregiver";

    if (newStatus === "Active") {
      swiftAlert.success({ title: "Caregiver Enabled", description: `${name} has been enabled.` });
    } else if (newStatus === "Inactive") {
      swiftAlert.info({ title: "Caregiver Disabled", description: `${name} has been disabled.` });
    } else if (newStatus === "Blocked") {
      swiftAlert.error({ title: "Caregiver Blocked", description: `${name} has been blocked.` });
    }

    if (selectedCaregiver?.id === caregiverId) {
      setSelectedCaregiver((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddCaregiver = (newCaregiver: Caregiver) => {
    setCaregivers((prev) => [newCaregiver, ...prev]);
  };

  const handleApproveApplicant = (applicantId: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === applicantId ? { ...r, status: "Approved" as const } : r))
    );
    // Add to active caregivers
    const applicant = registrationRequests.find((r) => r.id === applicantId);
    if (applicant) {
      const newCaregiver: Caregiver = {
        id: `CG-${Date.now().toString().slice(-6)}`,
        fullName: applicant.fullName,
        username: applicant.username,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        age: applicant.age,
        gender: applicant.gender,
        dateOfBirth: applicant.dateOfBirth,
        skills: applicant.skills,
        experience: applicant.experience,
        certifications: applicant.certifications,
        status: "Active",
        registrationDate: new Date().toISOString().split("T")[0],
        rating: 5.0,
        completedVisits: 0,
        punctualityRate: "100%",
        kycStatus: "Verified",
        kycDetails: applicant.kycDetails,
      };
      setCaregivers((prev) => [newCaregiver, ...prev]);
    }
  };

  const handleRejectApplicant = (applicantId: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === applicantId ? { ...r, status: "Rejected" as const } : r))
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setDateFilter("");
    swiftAlert.info({ title: "Filters Reset", description: "Displaying all registered caregivers." });
  };

  const renderStatusBadge = (status: Caregiver["status"]) => {
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
            <HeartPulse className="h-7 w-7 text-teal-600" />
            Care Giver Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage caregiver roster, review registration requests, verify KYC, and monitor performance ratings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Exported caregiver roster to CSV format.",
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
            <span>Register Caregiver</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("caregivers")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "caregivers"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Registered Caregivers</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {caregivers.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "requests"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Registration Requests</span>
          {pendingCount > 0 && (
            <Badge className="bg-teal-600 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
              {pendingCount}
            </Badge>
          )}
        </button>
      </div>

      {/* TAB 1: REGISTERED CAREGIVERS */}
      {activeTab === "caregivers" && (
        <>
          {/* Search & Filter Bar */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Name, Username, or Skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
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

          {/* Caregiver Data Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Full Name</TableHead>
                  <TableHead className="font-bold text-xs">Age / Gender</TableHead>
                  <TableHead className="font-bold text-xs">Skills</TableHead>
                  <TableHead className="font-bold text-xs">Experience</TableHead>
                  <TableHead className="font-bold text-xs">Rating</TableHead>
                  <TableHead className="font-bold text-xs text-center">KYC</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCaregivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No registered caregivers found matching your search or filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCaregivers.map((cg) => (
                    <TableRow key={cg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      {/* Full Name & ID */}
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border shadow-sm">
                            <AvatarImage src={cg.avatar} alt={cg.fullName} />
                            <AvatarFallback className="bg-teal-700 text-white text-[10px] font-bold">
                              {cg.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{cg.fullName}</span>
                            <span className="text-[10px] font-mono text-muted-foreground font-normal">
                              @{cg.username} · {cg.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Age / Gender */}
                      <TableCell className="text-xs">
                        {cg.age} yrs · <span className="text-muted-foreground">{cg.gender}</span>
                      </TableCell>

                      {/* Skills */}
                      <TableCell className="text-xs max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {cg.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0">
                              {skill}
                            </Badge>
                          ))}
                          {cg.skills.length > 2 && (
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                              +{cg.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Experience */}
                      <TableCell className="text-xs font-medium text-foreground">
                        {cg.experience}
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{cg.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>

                      {/* KYC Status */}
                      <TableCell className="text-center">
                        {cg.kycStatus === "Verified" ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                            <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                          </Badge>
                        ) : cg.kycStatus === "Pending" ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px]">Pending</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">Rejected</Badge>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {renderStatusBadge(cg.status)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCaregiver(cg)}
                            className="h-8 text-xs gap-1 font-medium border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-background text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:border-slate-800 dark:hover:bg-slate-800">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                                  Account Actions
                                </DropdownMenuLabel>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(cg.id, "Active")}
                                disabled={cg.status === "Active"}
                                className="cursor-pointer text-xs text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
                              >
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                <span>Enable</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(cg.id, "Inactive")}
                                disabled={cg.status === "Inactive"}
                                className="cursor-pointer text-xs text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
                              >
                                <XCircle className="mr-2 h-3.5 w-3.5" />
                                <span>Disable</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(cg.id, "Blocked")}
                                disabled={cg.status === "Blocked"}
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
                Showing <strong className="text-foreground">{filteredCaregivers.length}</strong> of{" "}
                <strong className="text-foreground">{caregivers.length}</strong> registered caregivers
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Roster Live Sync Active
              </span>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: REGISTRATION REQUESTS */}
      {activeTab === "requests" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Application ID</TableHead>
                <TableHead className="font-bold text-xs">Applicant Name</TableHead>
                <TableHead className="font-bold text-xs">Experience</TableHead>
                <TableHead className="font-bold text-xs">Certifications</TableHead>
                <TableHead className="font-bold text-xs text-center">KYC Status</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                    No pending caregiver registration requests.
                  </TableCell>
                </TableRow>
              ) : (
                registrationRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                    <TableCell className="font-mono text-xs text-foreground font-semibold">
                      <div className="flex flex-col">
                        <span>{req.id}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Applied: {req.appliedDate}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px] dark:bg-teal-950 dark:text-teal-300">
                          {req.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{req.fullName}</span>
                          <span className="text-[10px] text-muted-foreground">{req.age}y · {req.gender} · {req.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-foreground">
                      {req.experience}
                    </TableCell>

                    <TableCell className="text-xs max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {req.certifications.slice(0, 1).map((cert, idx) => (
                          <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 truncate max-w-[150px]">
                            {cert}
                          </Badge>
                        ))}
                        {req.certifications.length > 1 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            +{req.certifications.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {req.kycDetails.idProof && req.kycDetails.nursingLicense && req.kycDetails.backgroundCheck ? (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                          <ShieldCheck className="h-3 w-3 mr-0.5" /> Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px]">Incomplete</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {req.status === "Approved" ? (
                        <Badge className="bg-emerald-600 text-white font-semibold text-[11px]">Approved</Badge>
                      ) : req.status === "Rejected" ? (
                        <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-[11px]">Rejected</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-[11px] font-semibold">Pending Review</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplicant(req);
                          setIsReviewOpen(true);
                        }}
                        className="h-8 text-xs gap-1 font-medium border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Review Application</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{registrationRequests.length}</strong> total registration
              requests · <strong className="text-amber-600">{pendingCount} pending</strong>
            </span>
            <span className="font-medium text-teal-600 dark:text-teal-400">
              Mobile App Sync Active
            </span>
          </div>
        </div>
      )}

      {/* Caregiver Details Sheet */}
      <CaregiverDetailsSheet
        caregiver={selectedCaregiver}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Add Caregiver Modal */}
      <AddCaregiverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCaregiver={handleAddCaregiver}
      />

      {/* Review Applicant Modal */}
      <ReviewApplicantModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        applicant={selectedApplicant}
        onApprove={handleApproveApplicant}
        onReject={handleRejectApplicant}
      />
    </div>
  );
}
