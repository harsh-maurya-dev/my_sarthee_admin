"use client";

import { useState, useMemo } from "react";
import {
  KYCDocumentItem,
  TrainingDocumentItem,
  initialKYCDocuments,
  initialTrainingDocuments,
} from "./_data/onboarding-documents";
import { AddEditKYCModal } from "./_components/add-edit-kyc-modal";
import { AddEditTrainingModal } from "./_components/add-edit-training-modal";
import { DocumentPreviewModal } from "./_components/document-preview-modal";
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
  FileCheck,
  ShieldCheck,
  GraduationCap,
  Plus,
  Search,
  Upload,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  CheckCircle2,
  Smartphone,
  Grid,
  List,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function OnboardingDocumentsPage() {
  const [activeTab, setActiveTab] = useState<"kyc" | "training">("kyc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // KYC State
  const [kycDocs, setKycDocs] = useState<KYCDocumentItem[]>(initialKYCDocuments);
  const [kycSearch, setKycSearch] = useState("");
  const [kycCategoryFilter, setKycCategoryFilter] = useState<string>("All");

  // Training State
  const [trainingDocs, setTrainingDocs] = useState<TrainingDocumentItem[]>(
    initialTrainingDocuments
  );
  const [trainingSearch, setTrainingSearch] = useState("");
  const [trainingCategoryFilter, setTrainingCategoryFilter] = useState<string>("All");

  // Modals
  const [isAddEditKYCOpen, setIsAddEditKYCOpen] = useState(false);
  const [kycToEdit, setKycToEdit] = useState<KYCDocumentItem | null>(null);

  const [isAddEditTrainingOpen, setIsAddEditTrainingOpen] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState<TrainingDocumentItem | null>(null);

  const [previewKycDoc, setPreviewKycDoc] = useState<KYCDocumentItem | null>(null);
  const [previewTrainingDoc, setPreviewTrainingDoc] = useState<TrainingDocumentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filtered KYC
  const filteredKYC = useMemo(() => {
    return kycDocs.filter((doc) => {
      const q = kycSearch.toLowerCase();
      const matchesSearch =
        doc.name.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q);

      const matchesCat = kycCategoryFilter === "All" || doc.category === kycCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [kycDocs, kycSearch, kycCategoryFilter]);

  // Filtered Training
  const filteredTraining = useMemo(() => {
    return trainingDocs.filter((doc) => {
      const q = trainingSearch.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(q) ||
        doc.code.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q);

      const matchesCat = trainingCategoryFilter === "All" || doc.category === trainingCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [trainingDocs, trainingSearch, trainingCategoryFilter]);

  // Handlers for KYC
  const handleSaveKYC = (savedDoc: KYCDocumentItem) => {
    setKycDocs((prev) => {
      const exists = prev.some((d) => d.id === savedDoc.id);
      if (exists) {
        return prev.map((d) => (d.id === savedDoc.id ? savedDoc : d));
      }
      return [...prev, savedDoc];
    });
  };

  const handleDeleteKYC = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from required onboarding documents?`)) {
      setKycDocs((prev) => prev.filter((d) => d.id !== id));
      swiftAlert.error({
        title: "KYC Requirement Removed",
        description: `"${name}" was deleted.`,
      });
    }
  };

  // Handlers for Training
  const handleSaveTraining = (savedDoc: TrainingDocumentItem) => {
    setTrainingDocs((prev) => {
      const exists = prev.some((d) => d.id === savedDoc.id);
      if (exists) {
        return prev.map((d) => (d.id === savedDoc.id ? savedDoc : d));
      }
      return [...prev, savedDoc];
    });
  };

  const handleDeleteTraining = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete training protocol "${title}"?`)) {
      setTrainingDocs((prev) => prev.filter((d) => d.id !== id));
      swiftAlert.error({
        title: "Training Document Removed",
        description: `"${title}" was removed from the academy.`,
      });
    }
  };

  const getKYCIcon = (iconType: KYCDocumentItem["iconType"]) => {
    switch (iconType) {
      case "id-card":
        return <span className="text-xl">🪪</span>;
      case "pan-card":
        return <span className="text-xl">💳</span>;
      case "vaccine":
        return <span className="text-xl">💉</span>;
      case "police":
        return <span className="text-xl">👮</span>;
      case "bank":
        return <span className="text-xl">🏛️</span>;
      case "insurance":
        return <span className="text-xl">🛡️</span>;
      default:
        return <span className="text-xl">📄</span>;
    }
  };

  const getTrainingIcon = (iconType: TrainingDocumentItem["iconType"]) => {
    switch (iconType) {
      case "sanitization":
        return <span className="text-xl">🦠</span>;
      case "vitals":
        return <span className="text-xl">🧍</span>;
      case "emergency":
        return <span className="text-xl">🚨</span>;
      case "medication":
        return <span className="text-xl">💊</span>;
      default:
        return <span className="text-xl">📋</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <FileCheck className="h-7 w-7 text-teal-600" />
              Onboarding Documents
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              Caregiver Compliance Hub
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure mandatory KYC verification documents and clinical training SOPs for caregiver mobile onboarding.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "kyc" ? (
            <Button
              size="sm"
              onClick={() => {
                setKycToEdit(null);
                setIsAddEditKYCOpen(true);
              }}
              className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add KYC Document</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                setTrainingToEdit(null);
                setIsAddEditTrainingOpen(true);
              }}
              className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Training SOP</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          {/* Tab 1: KYC Document */}
          <button
            onClick={() => setActiveTab("kyc")}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === "kyc"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>KYC Documents</span>
            {/* <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {kycDocs.length}
            </Badge> */}
          </button>

          {/* Tab 2: Training Document */}
          <button
            onClick={() => setActiveTab("training")}
            className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === "training"
                ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Training Documents</span>
            {/* <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {trainingDocs.length}
            </Badge> */}
          </button>
        </div>

        {/* View Mode Toggle: Cards vs Table */}
        {/* <div className="flex items-center gap-1 pb-2">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={`h-8 px-2.5 text-xs font-semibold ${
              viewMode === "cards" ? "bg-teal-600 text-white" : "text-muted-foreground"
            }`}
          >
            <Grid className="h-3.5 w-3.5 mr-1" />
            <span>Mobile UI Cards</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`h-8 px-2.5 text-xs font-semibold ${
              viewMode === "table" ? "bg-teal-600 text-white" : "text-muted-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5 mr-1" />
            <span>Data Table</span>
          </Button>
        </div> */}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: KYC DOCUMENTS (IMAGE 1 SPECIFICATIONS) */}
      {/* ========================================================= */}
      {activeTab === "kyc" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search KYC document by name or description..."
                  className="pl-9 h-9 text-xs"
                  value={kycSearch}
                  onChange={(e) => setKycSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Category:</span>
                  <Select value={kycCategoryFilter} onValueChange={(val) => val && setKycCategoryFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-44">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Identity Proof">Identity Proof</SelectItem>
                      <SelectItem value="Financial & Tax">Financial & Tax</SelectItem>
                      <SelectItem value="Medical & Health">Medical & Health</SelectItem>
                      <SelectItem value="Background & Legal">Background & Legal</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(kycSearch || kycCategoryFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setKycSearch("");
                      setKycCategoryFilter("All");
                    }}
                    className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Cards View (Exact Mobile Styling from Image 1) */}
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredKYC.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-4 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center shadow-xs shrink-0">
                        {getKYCIcon(doc.iconType)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          {doc.name}
                          {doc.isMandatory && (
                            <Badge className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 text-[9px] px-1.5 py-0">
                              Mandatory
                            </Badge>
                          )}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {doc.category} · Max {doc.maxSizeMB}MB ({doc.allowedFormats.join(", ")})
                        </p>
                      </div>
                    </div>

                    <div
                      className="h-9 w-9 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-700 flex items-center justify-center shadow-xs shrink-0 cursor-pointer hover:bg-amber-100 transition-all"
                      title="Upload Status Button"
                      onClick={() => {
                        setPreviewKycDoc(doc);
                        setPreviewTrainingDoc(null);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {doc.verifiedCount} / {doc.totalSubmissions} Verified
                      </span>
                      <Badge variant="outline" className="text-[9px] py-0">
                        {doc.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setPreviewKycDoc(doc);
                          setPreviewTrainingDoc(null);
                          setIsPreviewOpen(true);
                        }}
                        className="h-7 text-xs px-2 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setKycToEdit(doc);
                          setIsAddEditKYCOpen(true);
                        }}
                        className="h-7 text-xs px-2"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteKYC(doc.id, doc.name)}
                        className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
                    <TableHead className="text-xs font-bold uppercase w-12">Icon</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Document Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Category</TableHead>
                    {/* <TableHead className="text-xs font-bold uppercase">Verification Method</TableHead> */}
                    <TableHead className="text-xs font-bold uppercase">Formats & Size</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-center">Requirement</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-center">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKYC.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      <TableCell className="py-3 text-center">{getKYCIcon(doc.iconType)}</TableCell>
                      <TableCell className="py-3">
                        <div className="text-xs font-bold text-foreground">{doc.name}</div>
                        <span className="text-[10px] text-muted-foreground font-mono">{doc.code}</span>
                      </TableCell>
                      <TableCell className="py-3 text-xs">{doc.category}</TableCell>
                      {/* <TableCell className="py-3 text-xs font-medium text-teal-700 dark:text-teal-400">
                        {doc.verificationMethod}
                      </TableCell> */}
                      <TableCell className="py-3 text-xs text-muted-foreground">
                        {doc.allowedFormats.join(", ")} · Max {doc.maxSizeMB}MB
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        {doc.isMandatory ? (
                          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                            Mandatory
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Optional
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Badge variant={doc.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setPreviewKycDoc(doc);
                              setPreviewTrainingDoc(null);
                              setIsPreviewOpen(true);
                            }}
                            className="h-7 text-xs px-2 text-teal-700 hover:bg-teal-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button> */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setKycToEdit(doc);
                              setIsAddEditKYCOpen(true);
                            }}
                            className="h-7 text-xs px-2"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteKYC(doc.id, doc.name)}
                            className="h-7 text-xs px-2 text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TRAINING DOCUMENTS (IMAGE 2 SPECIFICATIONS) */}
      {/* ========================================================= */}
      {activeTab === "training" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search training SOPs, protocols, or guidelines..."
                  className="pl-9 h-9 text-xs"
                  value={trainingSearch}
                  onChange={(e) => setTrainingSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Category:</span>
                  <Select value={trainingCategoryFilter} onValueChange={(val) => val && setTrainingCategoryFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Hygiene & Sanitization">Hygiene & Sanitization</SelectItem>
                      <SelectItem value="Patient Care & Vitals">Patient Care & Vitals</SelectItem>
                      <SelectItem value="Emergency & Safety">Emergency & Safety</SelectItem>
                      <SelectItem value="Medication & Pharmacology">Medication & Pharmacology</SelectItem>
                      <SelectItem value="Clinical Protocols">Clinical Protocols</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(trainingSearch || trainingCategoryFilter !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTrainingSearch("");
                      setTrainingCategoryFilter("All");
                    }}
                    className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Cards View (Exact Styling from Image 2) */}
          {viewMode === "cards" ? (
            <div className="space-y-3">
              {filteredTraining.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setPreviewTrainingDoc(doc);
                    setPreviewKycDoc(null);
                    setIsPreviewOpen(true);
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-card p-4 hover:border-teal-400 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                      {getTrainingIcon(doc.iconType)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors flex items-center gap-2">
                        {doc.title}
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {doc.version}
                        </Badge>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{doc.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-foreground font-medium">
                          <Clock className="h-3 w-3 text-teal-600" /> {doc.estimatedReadingTime}
                        </span>
                        <span>&bull;</span>
                        <span>{doc.pagesCount} Pages</span>
                        <span>&bull;</span>
                        <span className="text-emerald-600 font-semibold">
                          {doc.completedCaregiversCount} Completed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrainingToEdit(doc);
                        setIsAddEditTrainingOpen(true);
                      }}
                      className="h-8 text-xs px-2.5 hidden sm:flex"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-muted-foreground group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
                    <TableHead className="text-xs font-bold uppercase w-12">Icon</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Training Title</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Category</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Duration & Pages</TableHead>
                    <TableHead className="text-xs font-bold uppercase">Target Roles</TableHead>
                    {/* <TableHead className="text-xs font-bold uppercase text-center">Quiz Pass %</TableHead> */}
                    <TableHead className="text-xs font-bold uppercase text-center">Completions</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTraining.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      <TableCell className="py-3 text-center">{getTrainingIcon(doc.iconType)}</TableCell>
                      <TableCell className="py-3">
                        <div className="text-xs font-bold text-foreground">{doc.title}</div>
                        <span className="text-[10px] text-muted-foreground font-mono">{doc.version} · {doc.code}</span>
                      </TableCell>
                      <TableCell className="py-3 text-xs">{doc.category}</TableCell>
                      <TableCell className="py-3 text-xs">
                        {doc.estimatedReadingTime} · {doc.pagesCount} pgs
                      </TableCell>
                      <TableCell className="py-3 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {doc.targetRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-[9px] px-1 py-0">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      {/* <TableCell className="py-3 text-center text-xs font-bold text-teal-600">
                        {doc.passingScorePercent}%
                      </TableCell> */}
                      <TableCell className="py-3 text-center text-xs font-semibold">
                        {doc.completedCaregiversCount}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setPreviewTrainingDoc(doc);
                              setPreviewKycDoc(null);
                              setIsPreviewOpen(true);
                            }}
                            className="h-7 text-xs px-2 text-teal-700 hover:bg-teal-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button> */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setTrainingToEdit(doc);
                              setIsAddEditTrainingOpen(true);
                            }}
                            className="h-7 text-xs px-2"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTraining(doc.id, doc.title)}
                            className="h-7 text-xs px-2 text-rose-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit KYC Modal */}
      <AddEditKYCModal
        isOpen={isAddEditKYCOpen}
        onClose={() => setIsAddEditKYCOpen(false)}
        documentToEdit={kycToEdit}
        onSave={handleSaveKYC}
      />

      {/* Add / Edit Training Modal */}
      <AddEditTrainingModal
        isOpen={isAddEditTrainingOpen}
        onClose={() => setIsAddEditTrainingOpen(false)}
        documentToEdit={trainingToEdit}
        onSave={handleSaveTraining}
      />

      {/* Document Mobile Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        kycDoc={previewKycDoc}
        trainingDoc={previewTrainingDoc}
      />
    </div>
  );
}
