"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  HeartPulse,
  Stethoscope,
  Activity,
  Upload,
  Camera,
  CheckCircle2,
  FileText,
  ShieldCheck,
  CreditCard,
  Building,
  Check,
  X,
  FileCode,
  Syringe,
  MapPin,
  Calendar,
} from "lucide-react";
import { CareProfessional } from "@/lib/admin-data";
import { swiftAlert } from "@/lib/swift-alert";

interface OnboardProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfessional?: (newPro: CareProfessional) => void;
}

export function OnboardProfessionalModal({
  isOpen,
  onClose,
  onAddProfessional,
}: OnboardProfessionalModalProps) {
  // Step / Active Tab Navigation
  const [activeSection, setActiveSection] = useState<"role_basic" | "professional" | "documents" | "bank_insurance">("role_basic");

  // 1. Role Selection
  const [selectedRole, setSelectedRole] = useState<"Nurse" | "Caregiver" | "Physiotherapist">("Nurse");

  // 2. [Basic Details]
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1994-06-15");
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<"Female" | "Male" | "Other">("Female");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Hindi"]);
  const [languageInput, setLanguageInput] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Andheri");

  // 3. [Professional Details]
  const [qualification, setQualification] = useState("B.Sc Nursing (KEM Hospital)");
  const [registrationNumber, setRegistrationNumber] = useState("MNC-849204-RN");
  const [certifications, setCertifications] = useState("BLS / ACLS, ICU Critical Care, Wound Management");
  const [experienceYears, setExperienceYears] = useState<number>(6);
  const [specializations, setSpecializations] = useState<string[]>(["Post-Op Recovery", "Wound Care", "IV Infusion"]);
  const [specInput, setSpecInput] = useState("");

  // 4. [Documents]
  const [aadharNumber, setAadharNumber] = useState("XXXX-XXXX-4892");
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [aadharUploaded, setAadharUploaded] = useState(true);
  const [panUploaded, setPanUploaded] = useState(true);
  const [degreeUploaded, setDegreeUploaded] = useState(true);
  const [vaccinationStatus, setVaccinationStatus] = useState("COVID-19 (Double Dose + Booster) & Hep-B Cleared");
  const [policeVerificationNo, setPoliceVerificationNo] = useState("PV-MUM-2026-9042");
  const [policeVerified, setPoliceVerified] = useState(true);

  // 5. [Bank & Insurance Details]
  const [accountNumber, setAccountNumber] = useState("98201010049281");
  const [ifscCode, setIfscCode] = useState("HDFC0000128");
  const [bankName, setBankName] = useState("HDFC Bank, Andheri West Branch");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("Star Health Professional Indemnity");
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("SH-PI-2026-88401");
  const [insuranceExpiry, setInsuranceExpiry] = useState("2027-08-31");

  // Toggle Language Pill
  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const addCustomLanguage = () => {
    if (languageInput.trim() && !selectedLanguages.includes(languageInput.trim())) {
      setSelectedLanguages((prev) => [...prev, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  // Add Specialization Tag
  const addSpecialization = () => {
    if (specInput.trim() && !specializations.includes(specInput.trim())) {
      setSpecializations((prev) => [...prev, specInput.trim()]);
      setSpecInput("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations((prev) => prev.filter((s) => s !== spec));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phoneNumber) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Full Name and Phone Number are required.",
      });
      return;
    }

    const newProfessional: CareProfessional = {
      id: `CP-${Date.now().toString().slice(-4)}`,
      name: fullName,
      type: selectedRole,
      phone: phoneNumber,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, ".")}@mysarthee.care`,
      area,
      status: "Available",
      specializations: specializations.length > 0 ? specializations : ["General Care", "Vital Monitoring"],
      experienceYears: Number(experienceYears) || 3,
      rating: 5.0,
      totalVisitsCompleted: 0,
      onDutyToday: true,
      qualification,
      languages: selectedLanguages,
      policeVerified,
    };

    if (onAddProfessional) {
      onAddProfessional(newProfessional);
    }

    swiftAlert.success({
      title: "Care Professional Onboarded!",
      description: `${fullName} has been successfully registered as an active ${selectedRole} in ${area}. Verification badge activated.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 border-l rounded-2xl">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 sticky top-0 z-20 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  Care Professional Onboarding & Verification
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Register Nurses, Caregivers, and Physios with credentialing, KYC documents, and banking setup.
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-semibold">
              Role: {selectedRole}
            </Badge>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveSection("role_basic")}
              className={`py-1.5 px-2 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                activeSection === "role_basic"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>1. Basic & Role</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("professional")}
              className={`py-1.5 px-2 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                activeSection === "professional"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>2. Professional</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("documents")}
              className={`py-1.5 px-2 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                activeSection === "documents"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>3. KYC Documents</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("bank_insurance")}
              className={`py-1.5 px-2 rounded-lg text-left transition-colors flex items-center gap-1.5 ${
                activeSection === "bank_insurance"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span>4. Bank & Insurance</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1: ROLE SELECTION & [BASIC DETAILS] */}
          {/* ========================================================================= */}
          {activeSection === "role_basic" && (
            <div className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Select Role & Category *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { role: "Nurse" as const, desc: "B.Sc / GNM Certified ICU & Clinical Nurse", icon: Stethoscope },
                    { role: "Caregiver" as const, desc: "Geriatric & Bedside Daily Care Specialist", icon: HeartPulse },
                    { role: "Physiotherapist" as const, desc: "BPT / MPT Neuro & Ortho Rehabilitation", icon: Activity },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <div
                        key={item.role}
                        onClick={() => setSelectedRole(item.role)}
                        className={`cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-600 shadow-sm"
                            : "border-slate-200 bg-slate-50/40 hover:bg-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`h-5 w-5 ${isSelected ? "text-teal-600" : "text-muted-foreground"}`} />
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-teal-600" />}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-black text-foreground">{item.role}</div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Profile Photo & Name */}
              <div className="grid gap-4 sm:grid-cols-12 items-center bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-xl border">
                <div className="sm:col-span-3 flex flex-col items-center gap-2 text-center">
                  <div className="relative group cursor-pointer">
                    <Avatar className="h-20 w-20 border-2 border-dashed border-teal-500 bg-teal-50 text-teal-800 text-xl font-bold">
                      <AvatarFallback>
                        {fullName ? fullName.slice(0, 2).toUpperCase() : <Camera className="h-6 w-6 text-teal-600" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">Upload Profile Photo</span>
                </div>

                <div className="sm:col-span-9 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Full Legal Name *</Label>
                    <Input
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!beneficiaryName) setBeneficiaryName(e.target.value);
                      }}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Primary Phone Number *</Label>
                    <Input
                      placeholder="+91 98201 23456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="priya.sharma@mysarthee.care"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* DOB, Age, Gender */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Date of Birth</Label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Age (Years)</Label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Gender</Label>
                  <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Languages Known */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Languages Known *</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["English", "Hindi", "Marathi", "Gujarati", "Bengali", "Kannada", "Tamil", "Telugu"].map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-700 shadow-xs"
                            : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Residential Address & Area */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs font-semibold">Current Residential Address</Label>
                  <Input
                    placeholder="Flat 204, Ganga Niwas, SV Road, Andheri West"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Operational Area / Zone</Label>
                  <Select value={area} onValueChange={(val) => val && setArea(val)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Andheri">Andheri</SelectItem>
                      <SelectItem value="Bandra">Bandra</SelectItem>
                      <SelectItem value="Powai">Powai</SelectItem>
                      <SelectItem value="Juhu">Juhu</SelectItem>
                      <SelectItem value="South Mumbai">South Mumbai</SelectItem>
                      <SelectItem value="Chembur">Chembur</SelectItem>
                      <SelectItem value="Thane">Thane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: [PROFESSIONAL DETAILS] */}
          {/* ========================================================================= */}
          {activeSection === "professional" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Education / Highest Qualification *</Label>
                  <Input
                    placeholder="e.g. B.Sc Nursing / GNM / MPT Neuro-Rehab"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">State Registration / License Number *</Label>
                  <Input
                    placeholder="e.g. MNC-849204-RN / IAP-20491"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Years of Clinical Experience</Label>
                  <Input
                    type="number"
                    placeholder="6"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Certifications (Comma Separated)</Label>
                  <Input
                    placeholder="BLS, ACLS, Tracheostomy, Wound Management"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Specializations Tags */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Clinical Specializations & Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill (e.g., Post-Op Recovery, Parkinson's Care, Catheter)..."
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecialization();
                      }
                    }}
                    className="h-9 text-xs"
                  />
                  <Button type="button" size="sm" onClick={addSpecialization} className="bg-teal-600 text-white text-xs h-9">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 flex items-center gap-1.5 dark:bg-teal-950 dark:text-teal-300"
                    >
                      {spec}
                      <X className="h-3 w-3 cursor-pointer hover:text-rose-600" onClick={() => removeSpecialization(spec)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: [DOCUMENTS] & KYC */}
          {/* ========================================================================= */}
          {activeSection === "documents" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Aadhar */}
                <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-teal-600" /> Aadhar Card Details *
                    </Label>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Verified</Badge>
                  </div>
                  <Input
                    placeholder="12-digit Aadhar Number"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                    <span>aadhar_front_back.pdf</span>
                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-teal-700">
                      Re-upload
                    </Button>
                  </div>
                </div>

                {/* PAN */}
                <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-teal-600" /> PAN Card Details *
                    </Label>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Verified</Badge>
                  </div>
                  <Input
                    placeholder="10-digit PAN (e.g. ABCDE1234F)"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="h-9 text-xs uppercase font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                    <span>pan_card_copy.pdf</span>
                    <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] text-teal-700">
                      Re-upload
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Professional Degree / Certificates */}
                <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold flex items-center gap-1.5">
                      <FileCode className="h-4 w-4 text-teal-600" /> Professional Degree / Certificate
                    </Label>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Uploaded</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">degree_certificate_kem_hospital.pdf</p>
                  <Button type="button" variant="outline" size="sm" className="w-full text-xs h-8">
                    <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Degree Document
                  </Button>
                </div>

                {/* Vaccination Certificate */}
                <div className="rounded-xl border p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold flex items-center gap-1.5">
                      <Syringe className="h-4 w-4 text-emerald-600" /> Vaccination Certificate
                    </Label>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Compliant</Badge>
                  </div>
                  <Input
                    placeholder="Vaccination status"
                    value={vaccinationStatus}
                    onChange={(e) => setVaccinationStatus(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Police Verification */}
              <div className="rounded-xl border p-3.5 bg-teal-50/40 dark:bg-teal-950/20 space-y-2 border-teal-200 dark:border-teal-900">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-600" /> Police Verification Certificate *
                  </Label>
                  <Badge className="bg-teal-700 text-white text-[10px] font-bold">Clearance Active</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Police Clearance Ref (e.g. PV-MUM-2026-9042)"
                    value={policeVerificationNo}
                    onChange={(e) => setPoliceVerificationNo(e.target.value)}
                    className="h-9 text-xs bg-background"
                  />
                  <div className="flex items-center justify-between px-3 py-1 bg-background rounded-lg border text-xs">
                    <span>Background Verification</span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">100% Cleared</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: [BANK DETAILS] & [INSURANCE DETAILS] */}
          {/* ========================================================================= */}
          {activeSection === "bank_insurance" && (
            <div className="space-y-4">
              {/* Bank Details */}
              <div className="rounded-xl border p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-teal-600" /> Bank Payout & Direct Deposit Setup
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Beneficiary Account Name *</Label>
                    <Input
                      placeholder="e.g. Priya Sharma"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Bank Account Number *</Label>
                    <Input
                      placeholder="e.g. 98201010049281"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="h-9 text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">IFSC Code *</Label>
                    <Input
                      placeholder="e.g. HDFC0000128"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="h-9 text-xs uppercase font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Bank Name & Branch</Label>
                    <Input
                      placeholder="e.g. HDFC Bank, Andheri West"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Details */}
              <div className="rounded-xl border p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-600" /> Professional Indemnity & Accidental Insurance
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold">Insurance Provider & Plan</Label>
                    <Input
                      placeholder="Star Health / ICICI Lombard Indemnity Policy"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Policy Expiry Date</Label>
                    <Input
                      type="date"
                      value={insuranceExpiry}
                      onChange={(e) => setInsuranceExpiry(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-3">
                    <Label className="text-xs font-semibold">Policy Certificate Number</Label>
                    <Input
                      placeholder="SH-PI-2026-88401"
                      value={insurancePolicyNo}
                      onChange={(e) => setInsurancePolicyNo(e.target.value)}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <DialogFooter className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              {activeSection !== "role_basic" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (activeSection === "professional") setActiveSection("role_basic");
                    if (activeSection === "documents") setActiveSection("professional");
                    if (activeSection === "bank_insurance") setActiveSection("documents");
                  }}
                  className="h-9 text-xs"
                >
                  &larr; Previous Step
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
                Cancel
              </Button>

              {activeSection !== "bank_insurance" ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (activeSection === "role_basic") setActiveSection("professional");
                    if (activeSection === "professional") setActiveSection("documents");
                    if (activeSection === "documents") setActiveSection("bank_insurance");
                  }}
                  className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  Next Step &rarr;
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Complete Onboarding
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
