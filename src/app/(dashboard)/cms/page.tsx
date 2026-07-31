"use client";

import { useState } from "react";
import { initialCMSSections, CMSSectionContent } from "./_data/cms";
import { CMSSectionEditor } from "./_components/cms-section-editor";
import { FileCode, HelpCircle, Shield, FileText, Info, Phone, HeartHandshake, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { swiftAlert } from "@/lib/swift-alert";

export default function CMSManagementPage() {
  const [sections, setSections] = useState<Record<string, CMSSectionContent>>(initialCMSSections);
  const [activeSectionId, setActiveSectionId] = useState<string>("why-mysarthee");

  const handleSaveSection = (updatedSection: CMSSectionContent) => {
    setSections((prev) => ({
      ...prev,
      [updatedSection.sectionId]: updatedSection,
    }));
  };

  const currentSection = sections[activeSectionId];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <FileCode className="h-7 w-7 text-teal-600" />
            CMS Content Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Customize text content and publish website sections (Why MySarthee, Join as Caregiver, Contact Us, Privacy Policy, Terms & Conditions, About Us, FAQs).
          </p>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSectionId("why-mysarthee")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "why-mysarthee"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Why MySarthee</span>
        </button>

        <button
          onClick={() => setActiveSectionId("join-as-caregiver")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "join-as-caregiver"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartHandshake className="h-4 w-4 text-emerald-600" />
          <span>Join as Caregiver</span>
        </button>

        <button
          onClick={() => setActiveSectionId("contact-us")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "contact-us"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Contact Us</span>
        </button>

        <button
          onClick={() => setActiveSectionId("privacy-policy")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "privacy-policy"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveSectionId("terms-conditions")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "terms-conditions"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActiveSectionId("about-us")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "about-us"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="h-4 w-4" />
          <span>About Us</span>
        </button>

        <button
          onClick={() => setActiveSectionId("faqs")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
            activeSectionId === "faqs"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>FAQs</span>
        </button>
      </div>

      {/* Editor Component */}
      {currentSection && (
        <CMSSectionEditor section={currentSection} onSave={handleSaveSection} />
      )}
    </div>
  );
}
