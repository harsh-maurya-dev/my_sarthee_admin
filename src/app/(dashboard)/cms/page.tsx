"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { initialCMSSections, CMSSectionContent } from "./_data/cms";
import { CMSSectionEditor } from "./_components/cms-section-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileCode,
  Sparkles,
  HeartPulse,
  Phone,
  ShieldCheck,
  FileText,
  Users,
  HelpCircle,
  Eye,
  Edit3,
  Columns,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
} from "lucide-react";

interface SectionMeta {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  category: "Marketing" | "Legal" | "Support";
}

const SECTION_TABS: SectionMeta[] = [
  { id: "why-mysarthee", title: "Why MySarthee", icon: Sparkles, badge: "Hero", category: "Marketing" },
  { id: "join-as-caregiver", title: "Join as Caregiver", icon: HeartPulse, badge: "Careers", category: "Marketing" },
  { id: "about-us", title: "About Us", icon: Users, category: "Marketing" },
  { id: "contact-us", title: "Contact Us", icon: Phone, category: "Support" },
  { id: "faqs", title: "FAQs", icon: HelpCircle, badge: "FAQ", category: "Support" },
  { id: "privacy-policy", title: "Privacy Policy", icon: ShieldCheck, badge: "HIPAA", category: "Legal" },
  { id: "terms-conditions", title: "Terms & Conditions", icon: FileText, category: "Legal" },
];

function CMSContentManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [sections, setSections] = useState<Record<string, CMSSectionContent>>(initialCMSSections);
  const [activeSectionId, setActiveSectionId] = useState<string>("why-mysarthee");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

  useEffect(() => {
    if (tabParam && initialCMSSections[tabParam]) {
      setActiveSectionId(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (sectionId: string) => {
    setActiveSectionId(sectionId);
    router.push(`/cms?tab=${sectionId}`);
  };

  const handleSaveSection = (updatedSection: CMSSectionContent) => {
    setSections((prev) => ({
      ...prev,
      [updatedSection.sectionId]: updatedSection,
    }));
  };

  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return SECTION_TABS;
    const q = searchQuery.toLowerCase();
    return SECTION_TABS.filter((tab) =>
      tab.title.toLowerCase().includes(q) || tab.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentSection = sections[activeSectionId] || sections["why-mysarthee"];
  const currentMeta = SECTION_TABS.find((t) => t.id === activeSectionId) || SECTION_TABS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <FileCode className="h-7 w-7 text-[#01265D] dark:text-blue-400 shrink-0" />
              Content Management System (CMS)
            </h1>
            <Badge className="bg-emerald-600 text-white text-xs font-bold">
              ● Live Sync
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage, edit, and publish copy for all 7 public-facing web pages and legal compliance documents.
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/40 p-1">
            <Button
              size="sm"
              variant={viewMode === "editor" ? "default" : "ghost"}
              className={`h-7 px-2.5 text-xs font-semibold ${viewMode === "editor" ? "bg-[#01265D] text-white" : ""}`}
              onClick={() => setViewMode("editor")}
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Editor
            </Button>
            <Button
              size="sm"
              variant={viewMode === "split" ? "default" : "ghost"}
              className={`h-7 px-2.5 text-xs font-semibold ${viewMode === "split" ? "bg-[#01265D] text-white" : ""}`}
              onClick={() => setViewMode("split")}
            >
              <Columns className="h-3.5 w-3.5 mr-1" />
              Split View
            </Button>
            <Button
              size="sm"
              variant={viewMode === "preview" ? "default" : "ghost"}
              className={`h-7 px-2.5 text-xs font-semibold ${viewMode === "preview" ? "bg-[#01265D] text-white" : ""}`}
              onClick={() => setViewMode("preview")}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Live Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Section Quick Navigator Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {filteredTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeSectionId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? "bg-[#01265D] text-white border-[#01265D] shadow-sm"
                      : "bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground border-border"
                  }`}
                >
                  <TabIcon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-[#01265D] dark:text-blue-400"}`} />
                  <span>{tab.title}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isActive
                          ? "bg-[#01265D]/60 text-[#01265D]"
                          : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-48 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter sections..."
              className="h-8 pl-8 text-xs bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div
        className={`grid gap-6 ${
          viewMode === "split"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Editor Column */}
        {(viewMode === "editor" || viewMode === "split") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                Content Editor
              </span>
              <span className="text-[11px] text-muted-foreground">
                Target: <strong className="text-foreground">/{currentSection.sectionId}</strong>
              </span>
            </div>

            <CMSSectionEditor
              section={currentSection}
              onSave={handleSaveSection}
            />
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                Live Website Public Preview
              </span>
              <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300">
                mysarthee.health/{currentSection.sectionId}
              </Badge>
            </div>

            {/* Public Page Mockup Frame */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-slate-200 dark:border-slate-800">
              {/* Browser Header Bar */}
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2.5 border-b flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-slate-950 border text-[11px] text-muted-foreground font-mono w-72 max-w-full truncate">
                  <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>https://mysarthee.health/{currentSection.sectionId}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                  <CheckCircle2 className="h-3 w-3 text-[#01265D] dark:text-blue-400" />
                  Published
                </div>
              </div>

              {/* Simulated Public Web Page Content */}
              <div className="p-6 space-y-6 bg-gradient-to-b from-blue-50/20 via-background to-background min-h-[500px]">
                {/* Hero Section Banner */}
                <div className="space-y-3 pb-6 border-b">
                  <Badge className="bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px]">
                    {currentMeta.title}
                  </Badge>
                  <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight">
                    {currentSection.headline}
                  </h2>
                  {currentSection.subheadline && (
                    <p className="text-sm font-medium text-[#01265D] dark:text-blue-300 dark:text-blue-400 leading-relaxed">
                      {currentSection.subheadline}
                    </p>
                  )}
                </div>

                {/* Main Body Paragraph */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {currentSection.bodyContent}
                </div>

                {/* Items / FAQ Highlights */}
                {currentSection.items && currentSection.items.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {currentSection.sectionId === "faqs" ? "Frequently Asked Questions" : "Key Highlights & Assurances"}
                    </h3>
                    <div className="grid gap-3">
                      {currentSection.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl border bg-slate-50/80 dark:bg-slate-900/60 space-y-1 hover:border-blue-300 dark:border-blue-800 transition-colors"
                        >
                          <div className="text-xs font-bold text-foreground flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 dark:bg-blue-950 dark:text-blue-300 text-[10px] flex items-center justify-center font-black">
                              {i + 1}
                            </span>
                            {item.title}
                          </div>
                          <p className="text-[11px] text-muted-foreground pl-7 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Meta */}
                <div className="pt-6 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>© 2026 MySarthee Home Health Inc.</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Updated: {currentSection.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CMSManagementPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-muted-foreground">Loading CMS section content...</div>}>
      <CMSContentManager />
    </Suspense>
  );
}
