"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  FileCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Plus,
  Eye,
  ArrowRight,
  Check,
  AlertTriangle,
  Award,
  Stethoscope,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { swiftAlert } from "@/lib/swift-alert";

export interface OnboardingApplicant {
  id: string;
  applicantCode: string;
  name: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  phone: string;
  email: string;
  area: string;
  experienceYears: number;
  qualification: string;
  appliedDate: string;
  stage: "application" | "verified" | "eligible";
  screeningStatus: "Pending Screen" | "Screening Passed" | "Interview Scheduled" | "Rejected";
  policeVerified: boolean;
  medicalCertVerified: boolean;
  blsVerified: boolean;
  referenceCheckDone: boolean;
  specializations: string[];
  languages: string[];
  availability: "Day Shift (8 AM - 8 PM)" | "Night Shift (8 PM - 8 AM)" | "24x7 Live-in" | "Flexible";
  notes?: string;
}

const initialApplicants: OnboardingApplicant[] = [
  {
    id: "APP-101",
    applicantCode: "ONB-2026-081",
    name: "Sunita Deshmukh",
    role: "Nurse",
    phone: "+91 98201 44512",
    email: "sunita.d@gmail.com",
    area: "Andheri West, Mumbai",
    experienceYears: 4,
    qualification: "B.Sc Nursing (MUHS)",
    appliedDate: "2026-08-25",
    stage: "application",
    screeningStatus: "Pending Screen",
    policeVerified: false,
    medicalCertVerified: false,
    blsVerified: true,
    referenceCheckDone: false,
    specializations: ["Post-Operative Care", "IV Infusion", "Tracheostomy"],
    languages: ["English", "Hindi", "Marathi"],
    availability: "Day Shift (8 AM - 8 PM)",
    notes: "Applied via MySarthee careers portal. 4 years hospital ICU experience.",
  },
  {
    id: "APP-102",
    applicantCode: "ONB-2026-082",
    name: "Rameshwar Yadav",
    role: "Caregiver",
    phone: "+91 97652 11890",
    email: "rameshwar.y@yahoo.com",
    area: "Powai, Mumbai",
    experienceYears: 6,
    qualification: "Senior Geriatric Care Diploma",
    appliedDate: "2026-08-24",
    stage: "application",
    screeningStatus: "Interview Scheduled",
    policeVerified: false,
    medicalCertVerified: false,
    blsVerified: false,
    referenceCheckDone: false,
    specializations: ["Elderly Assistance", "Bedridden Patient Care", "Dementia Care"],
    languages: ["Hindi", "Marathi"],
    availability: "24x7 Live-in",
    notes: "Interview scheduled with Clinical Coordinator for tomorrow 2:30 PM.",
  },
  {
    id: "APP-103",
    applicantCode: "ONB-2026-083",
    name: "Dr. Alisha Merchant (PT)",
    role: "Physiotherapist",
    phone: "+91 98190 33211",
    email: "alisha.merchant@outlook.com",
    area: "Bandra West, Mumbai",
    experienceYears: 5,
    qualification: "Master of Physiotherapy (Neuro)",
    appliedDate: "2026-08-22",
    stage: "verified",
    screeningStatus: "Screening Passed",
    policeVerified: true,
    medicalCertVerified: true,
    blsVerified: true,
    referenceCheckDone: true,
    specializations: ["Stroke Rehabilitation", "Orthopedic Mobility", "Geriatric Physio"],
    languages: ["English", "Hindi", "Gujarati"],
    availability: "Flexible",
    notes: "All 4 verification checks cleared. Ready for final eligibility signoff.",
  },
  {
    id: "APP-104",
    applicantCode: "ONB-2026-084",
    name: "Pooja Varma",
    role: "Nurse",
    phone: "+91 98450 77123",
    email: "pooja.varma@gmail.com",
    area: "Borivali East, Mumbai",
    experienceYears: 3,
    qualification: "GNM Diploma (Maharashtra Nursing Council)",
    appliedDate: "2026-08-20",
    stage: "verified",
    screeningStatus: "Screening Passed",
    policeVerified: true,
    medicalCertVerified: true,
    blsVerified: false,
    referenceCheckDone: true,
    specializations: ["Wound Dressing", "Catheterization", "Vitals Telemetry"],
    languages: ["English", "Hindi"],
    availability: "Night Shift (8 PM - 8 AM)",
    notes: "Police & Nursing council verified. Awaiting updated BLS certificate copy.",
  },
  {
    id: "APP-105",
    applicantCode: "ONB-2026-085",
    name: "Kavita Shinde",
    role: "Nurse",
    phone: "+91 99200 88765",
    email: "kavita.shinde@gmail.com",
    area: "Dadar, Mumbai",
    experienceYears: 7,
    qualification: "B.Sc Nursing, Critical Care Certified",
    appliedDate: "2026-08-15",
    stage: "eligible",
    screeningStatus: "Screening Passed",
    policeVerified: true,
    medicalCertVerified: true,
    blsVerified: true,
    referenceCheckDone: true,
    specializations: ["Ventilator Care", "Palliative Care", "Cardiac Support"],
    languages: ["English", "Hindi", "Marathi"],
    availability: "Flexible",
    notes: "Fully cleared. Active and eligible for Smart Allocation dispatch.",
  },
  {
    id: "APP-106",
    applicantCode: "ONB-2026-086",
    name: "Mahesh Patil",
    role: "Caregiver",
    phone: "+91 98331 22904",
    email: "mahesh.patil@rediffmail.com",
    area: "Thane West, Mumbai",
    experienceYears: 5,
    qualification: "Certified Patient Care Assistant",
    appliedDate: "2026-08-14",
    stage: "eligible",
    screeningStatus: "Screening Passed",
    policeVerified: true,
    medicalCertVerified: true,
    blsVerified: true,
    referenceCheckDone: true,
    specializations: ["Stroke Assistance", "Mobility Support", "Hygiene Management"],
    languages: ["Hindi", "Marathi"],
    availability: "Day Shift (8 AM - 8 PM)",
    notes: "Onboarding complete. Eligible for active booking allocations.",
  },
];

function CareProfessionalOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [applicants, setApplicants] = useState<OnboardingApplicant[]>(initialApplicants);
  const [activeTab, setActiveTab] = useState<"application" | "verified" | "eligible">(
    (tabParam as any) || "application"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState<OnboardingApplicant | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isNewApplicantOpen, setIsNewApplicantOpen] = useState(false);

  // New Applicant Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"Nurse" | "Caregiver" | "Physiotherapist">("Nurse");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newExp, setNewExp] = useState("3");
  const [newQual, setNewQual] = useState("");
  const [newSpec, setNewSpec] = useState("");

  const handleTabSwitch = (tab: "application" | "verified" | "eligible") => {
    setActiveTab(tab);
    router.push(`/care-professional-onboarding?tab=${tab}`);
  };

  // Filtered list based on active tab and filters
  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const matchesTab = a.stage === activeTab;
      const matchesRole = roleFilter === "All" || a.role === roleFilter;
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.applicantCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.qualification.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesRole && matchesSearch;
    });
  }, [applicants, activeTab, roleFilter, searchQuery]);

  // Stage transition handlers
  const handleMoveToVerification = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicantId
          ? { ...a, stage: "verified", screeningStatus: "Screening Passed" }
          : a
      )
    );
    setIsReviewOpen(false);
    swiftAlert.success({
      title: "Application Screened",
      description: "Applicant moved to Credential & Police Verification stage.",
    });
  };

  const handleMarkEligible = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              stage: "eligible",
              policeVerified: true,
              medicalCertVerified: true,
              blsVerified: true,
              referenceCheckDone: true,
            }
          : a
      )
    );
    setIsVerifyModalOpen(false);
    swiftAlert.success({
      title: "Applicant Approved & Eligible!",
      description: "Care professional is now fully cleared and eligible for Smart Allocation.",
    });
  };

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newArea) {
      swiftAlert.error({
        title: "Missing Information",
        description: "Please fill in Name, Phone, and Coverage Area.",
      });
      return;
    }

    const newApp: OnboardingApplicant = {
      id: `APP-${Date.now().toString().slice(-3)}`,
      applicantCode: `ONB-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      area: newArea,
      experienceYears: Number(newExp) || 2,
      qualification: newQual || `${newRole} Professional Certificate`,
      appliedDate: new Date().toISOString().split("T")[0],
      stage: "application",
      screeningStatus: "Pending Screen",
      policeVerified: false,
      medicalCertVerified: false,
      blsVerified: false,
      referenceCheckDone: false,
      specializations: newSpec ? newSpec.split(",").map((s) => s.trim()) : ["General Patient Care"],
      languages: ["English", "Hindi"],
      availability: "Day Shift (8 AM - 8 PM)",
      notes: "Directly added by Operations Administrator.",
    };

    setApplicants([newApp, ...applicants]);
    setIsNewApplicantOpen(false);
    // Reset form
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewArea("");
    setNewQual("");
    setNewSpec("");

    swiftAlert.success({
      title: "Applicant Registered",
      description: `${newApp.name} has been added to the Application Screening queue.`,
    });
  };

  const counts = {
    application: applicants.filter((a) => a.stage === "application").length,
    verified: applicants.filter((a) => a.stage === "verified").length,
    eligible: applicants.filter((a) => a.stage === "eligible").length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Care Professional Onboarding
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-amber-400" />
              Standardized Clinical Verification
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            End-to-end recruitment, credential verification, police background screening, and allocation readiness.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsNewApplicantOpen(true)}
            className="h-9 gap-1.5 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Applicant</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => handleTabSwitch("application")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "application"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Application</span>
        </button>

        <button
          onClick={() => handleTabSwitch("verified")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "verified"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Verified</span>
        </button>

        <button
          onClick={() => handleTabSwitch("eligible")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "eligible"
              ? "border-[#01265D] text-[#01265D] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Eligible for Assignment</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, area, degree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "All")}>
            <SelectTrigger className="h-9 text-xs w-44">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Nurse">Nurses</SelectItem>
              <SelectItem value="Caregiver">Caregivers</SelectItem>
              <SelectItem value="Physiotherapist">Physiotherapists</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Table by Stage */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
              <TableHead className="text-xs font-bold">Applicant</TableHead>
              <TableHead className="text-xs font-bold">Role & Qualification</TableHead>
              <TableHead className="text-xs font-bold">Location & Exp</TableHead>
              {activeTab === "application" && <TableHead className="text-xs font-bold">Screening Status</TableHead>}
              {activeTab === "verified" && <TableHead className="text-xs font-bold">Verification Checklist</TableHead>}
              {activeTab === "eligible" && <TableHead className="text-xs font-bold">Shift & Specializations</TableHead>}
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-muted-foreground text-xs">
                  No applicants found in this stage matching your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((app) => (
                <TableRow key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  {/* Applicant Details */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-blue-50 text-[#01265D] font-bold text-xs">
                          {app.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-foreground">{app.name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono py-0">
                            {app.applicantCode}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{app.phone}</span>
                          <span>&bull;</span>
                          <span>Applied: {app.appliedDate}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role & Qualification */}
                  <TableCell>
                    <div>
                      <Badge
                        className={`text-[10px] font-bold ${
                          app.role === "Nurse"
                            ? "bg-blue-100 text-[#01265D]"
                            : app.role === "Physiotherapist"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.role}
                      </Badge>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {app.qualification}
                      </p>
                    </div>
                  </TableCell>

                  {/* Location & Experience */}
                  <TableCell>
                    <div>
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                        {app.area}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {app.experienceYears} Years Exp
                      </p>
                    </div>
                  </TableCell>

                  {/* Stage-Specific Column */}
                  {activeTab === "application" && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-bold ${
                          app.screeningStatus === "Pending Screen"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : app.screeningStatus === "Interview Scheduled"
                            ? "bg-blue-50 text-[#01265D] border-blue-300"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {app.screeningStatus}
                      </Badge>
                    </TableCell>
                  )}

                  {activeTab === "verified" && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            app.policeVerified
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {app.policeVerified ? "✓ Police Verified" : "⏳ Police Pending"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            app.medicalCertVerified
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {app.medicalCertVerified ? "✓ Council Verified" : "⏳ Council Pending"}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            app.blsVerified
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {app.blsVerified ? "✓ BLS Active" : "⏳ BLS Pending"}
                        </span>
                      </div>
                    </TableCell>
                  )}

                  {activeTab === "eligible" && (
                    <TableCell>
                      <div className="space-y-1 max-w-xs">
                        <span className="text-[11px] font-semibold text-foreground">
                          {app.availability}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {app.specializations.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  )}

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {activeTab === "application" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold"
                            onClick={() => {
                              setSelectedApplicant(app);
                              setIsReviewOpen(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-semibold"
                            onClick={() => handleMoveToVerification(app.id)}
                          >
                            <ArrowRight className="h-3.5 w-3.5 mr-1" />
                            Move to Verify
                          </Button>
                        </>
                      )}

                      {activeTab === "verified" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold"
                            onClick={() => {
                              setSelectedApplicant(app);
                              setIsVerifyModalOpen(true);
                            }}
                          >
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                            Checklist
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                            onClick={() => handleMarkEligible(app.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Make Eligible
                          </Button>
                        </>
                      )}

                      {activeTab === "eligible" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold border-emerald-300 text-emerald-800 bg-emerald-50/50"
                            onClick={() => {
                              swiftAlert.info({
                                title: `${app.name} (${app.role})`,
                                description: `Status: Eligible for Assignment. Active area: ${app.area}. Shift: ${app.availability}.`,
                              });
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                            Cleared
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-semibold"
                            onClick={() => router.push("/smart-assignment")}
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
                            Allocate Shift
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL: Review Application */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Review Application: {selectedApplicant?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4 text-xs py-2">
              <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground text-sm">{selectedApplicant.name}</span>
                  <Badge className="bg-blue-100 text-[#01265D] font-bold">{selectedApplicant.role}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Qualification: <strong className="text-foreground">{selectedApplicant.qualification}</strong> ({selectedApplicant.experienceYears} Years Exp)
                </p>
                <p className="text-muted-foreground">
                  Contact: {selectedApplicant.phone} &bull; {selectedApplicant.email}
                </p>
                <p className="text-muted-foreground">
                  Coverage Zone: <strong className="text-foreground">{selectedApplicant.area}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Clinical Specializations</Label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.specializations.map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Application Notes</Label>
                <p className="text-xs text-muted-foreground border rounded-lg p-2 bg-slate-50/50">
                  {selectedApplicant.notes || "Standard web applicant submission."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setIsReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-bold"
              onClick={() => selectedApplicant && handleMoveToVerification(selectedApplicant.id)}
            >
              Approve & Move to Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Verification Checklist */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Verification Status: {selectedApplicant?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-3.5 text-xs py-2">
              <p className="text-muted-foreground">
                Verify each item in the clinical governance checklist prior to marking this professional eligible for patient assignments.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-foreground">Police Criminal Background Verification</p>
                      <p className="text-[10px] text-muted-foreground">Cleared via local jurisdictional police station</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-foreground">Nursing Council / Paramedical Registration</p>
                      <p className="text-[10px] text-muted-foreground">State medical board license verified</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-foreground">BLS & CPR Active Certification</p>
                      <p className="text-[10px] text-muted-foreground">AHA / Red Cross Certified</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-foreground">Reference Checks (2 Previous Employers)</p>
                      <p className="text-[10px] text-muted-foreground">Positive clinical conduct verified</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setIsVerifyModalOpen(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              onClick={() => selectedApplicant && handleMarkEligible(selectedApplicant.id)}
            >
              Sign Off & Make Eligible
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Add New Applicant */}
      <Dialog open={isNewApplicantOpen} onOpenChange={setIsNewApplicantOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Register New Care Professional Applicant
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateApplicant} className="space-y-4 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Full Name *</Label>
                <Input
                  placeholder="e.g. Priya Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Professional Role *</Label>
                <Select
                  value={newRole}
                  onValueChange={(val: any) => setNewRole(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nurse">Nurse (GNM/B.Sc)</SelectItem>
                    <SelectItem value="Caregiver">Caregiver / Attendant</SelectItem>
                    <SelectItem value="Physiotherapist">Physiotherapist (BPT/MPT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Mobile Phone *</Label>
                <Input
                  placeholder="+91 98200 12345"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Email Address</Label>
                <Input
                  placeholder="name@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Coverage Area / Zone *</Label>
                <Input
                  placeholder="e.g. Andheri, Mumbai"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Experience (Years)</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Degree / Registration Qualification</Label>
              <Input
                placeholder="e.g. B.Sc Nursing, Maharashtra Nursing Council Reg #8921"
                value={newQual}
                onChange={(e) => setNewQual(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Clinical Specializations (comma separated)</Label>
              <Input
                placeholder="e.g. Tracheostomy, Geriatric Care, ICU Telemetry"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsNewApplicantOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-bold"
              >
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CareProfessionalOnboardingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Care Professional Onboarding...</div>}>
      <CareProfessionalOnboardingContent />
    </Suspense>
  );
}
