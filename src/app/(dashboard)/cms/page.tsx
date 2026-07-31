"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { initialCMSSections, CMSSectionContent } from "./_data/cms";
import { CMSSectionEditor } from "./_components/cms-section-editor";
import { FileCode } from "lucide-react";

function CMSContentManager() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [sections, setSections] = useState<Record<string, CMSSectionContent>>(initialCMSSections);
  const [activeSectionId, setActiveSectionId] = useState<string>("why-mysarthee");

  useEffect(() => {
    if (tabParam && initialCMSSections[tabParam]) {
      setActiveSectionId(tabParam);
    }
  }, [tabParam]);

  const handleSaveSection = (updatedSection: CMSSectionContent) => {
    setSections((prev) => ({
      ...prev,
      [updatedSection.sectionId]: updatedSection,
    }));
  };

  const currentSection = sections[activeSectionId] || sections["why-mysarthee"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <FileCode className="h-7 w-7 text-teal-600" />
            CMS Content Management — {currentSection?.sectionTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Customize text content and publish website section ({currentSection?.sectionTitle}). Manage navigation sections directly from the sidebar.
          </p>
        </div>
      </div>

      {/* Editor Component */}
      {currentSection && (
        <CMSSectionEditor section={currentSection} onSave={handleSaveSection} />
      )}
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
