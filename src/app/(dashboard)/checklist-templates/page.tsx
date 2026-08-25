"use client";

import { useState, useMemo } from "react";
import {
  ChecklistTemplateItem,
  ChecklistRole,
  PhysioSubCategory,
  initialChecklistTemplates,
} from "./_data/checklist-templates";
import { AddEditChecklistModal } from "./_components/add-edit-checklist-modal";
import { VitalsTab } from "./_components/vitals-tab";
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
  CheckSquare,
  HeartPulse,
  Stethoscope,
  Activity,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Dumbbell,
  Zap,
  ListChecks,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function ChecklistTemplatesPage() {
  const [topTab, setTopTab] = useState<"templates" | "vitals">("templates");
  const [templates, setTemplates] = useState<ChecklistTemplateItem[]>(
    initialChecklistTemplates
  );
  const [mainTab, setMainTab] = useState<ChecklistRole>("Caregiver");
  const [physioSubTab, setPhysioSubTab] = useState<PhysioSubCategory>("Exercise");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ChecklistTemplateItem | null>(null);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Role match
      if (tpl.role !== mainTab) return false;

      // Physio sub-category match
      if (mainTab === "Physiotherapist") {
        if (tpl.subCategory !== physioSubTab) return false;
      }

      // Search match
      const q = searchQuery.toLowerCase();
      return tpl.title.toLowerCase().includes(q);
    });
  }, [templates, mainTab, physioSubTab, searchQuery]);

  // Counts
  const caregiverCount = templates.filter((t) => t.role === "Caregiver").length;
  const nurseCount = templates.filter((t) => t.role === "Nurse").length;
  const physioExerciseCount = templates.filter(
    (t) => t.role === "Physiotherapist" && t.subCategory === "Exercise"
  ).length;
  const physioModalitiesCount = templates.filter(
    (t) => t.role === "Physiotherapist" && t.subCategory === "Modalities Applied"
  ).length;

  const handleSave = (savedTemplate: ChecklistTemplateItem) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === savedTemplate.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTemplate.id ? savedTemplate : t));
      }
      return [...prev, savedTemplate];
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      swiftAlert.error({
        title: "Checklist Option Removed",
        description: `"${title}" has been deleted.`,
      });
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
              <CheckSquare className="h-7 w-7 text-teal-600" />
              Checklists & Vitals Protocols
            </h1>
            <Badge className="bg-teal-600 text-white font-semibold text-xs">
              Clinical Protocols
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure field visit checklist templates and patient vital sign telemetry parameters across Caregiver, Nurse, and Physiotherapist services.
          </p>
        </div>
        {topTab === "templates" && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setTemplateToEdit(null);
                setIsAddEditOpen(true);
              }}
              className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                Add {mainTab === "Physiotherapist" ? `${physioSubTab} Checklist` : `${mainTab} Checklist`}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Top-Level Tabs: 1. Checklist Templates, 2. Vitals */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setTopTab("templates")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            topTab === "templates"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListChecks className="h-4 w-4" />
          <span>Checklist Templates</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {templates.length}
          </Badge>
        </button>

        <button
          onClick={() => setTopTab("vitals")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            topTab === "vitals"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Vitals Checklist & Parameters</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            5
          </Badge>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: CHECKLIST TEMPLATES (Caregiver, Nurse, Physio)         */}
      {/* ------------------------------------------------------------- */}
      {topTab === "templates" && (
        <div className="space-y-6">
          {/* Sub-Tabs: Caregiver, Nurse, Physiotherapist */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
            {/* Sub-Tab 1: Caregiver */}
            <button
              onClick={() => {
                setMainTab("Caregiver");
                setSearchQuery("");
              }}
              className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-2 relative ${
                mainTab === "Caregiver"
                  ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartPulse className="h-4 w-4" />
              <span>Caregiver</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {caregiverCount}
              </Badge>
            </button>

            {/* Sub-Tab 2: Nurse */}
            <button
              onClick={() => {
                setMainTab("Nurse");
                setSearchQuery("");
              }}
              className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-2 relative ${
                mainTab === "Nurse"
                  ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              <span>Nurse</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {nurseCount}
              </Badge>
            </button>

            {/* Sub-Tab 3: Physiotherapist */}
            <button
              onClick={() => {
                setMainTab("Physiotherapist");
                setSearchQuery("");
              }}
              className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-2 relative ${
                mainTab === "Physiotherapist"
                  ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Physiotherapist</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {physioExerciseCount + physioModalitiesCount}
              </Badge>
            </button>
          </div>

          {/* Sub-Tabs for Physiotherapist (Exercise vs Modalities Applied) */}
          {mainTab === "Physiotherapist" && (
            <div className="bg-slate-100/70 dark:bg-slate-900/50 p-1.5 rounded-xl flex items-center gap-1.5 w-fit border border-slate-200 dark:border-slate-800">
              {/* Sub-Tab A: Exercise */}
              <button
                onClick={() => {
                  setPhysioSubTab("Exercise");
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  physioSubTab === "Exercise"
                    ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200 dark:border-slate-700"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Exercises</span>
                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5">
                  {physioExerciseCount}
                </Badge>
              </button>

              {/* Sub-Tab B: Modalities Applied */}
              <button
                onClick={() => {
                  setPhysioSubTab("Modalities Applied");
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  physioSubTab === "Modalities Applied"
                    ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200 dark:border-slate-700"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Modalities Applied</span>
                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5">
                  {physioModalitiesCount}
                </Badge>
              </button>
            </div>
          )}

      {/* Search Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${mainTab} ${mainTab === "Physiotherapist" ? physioSubTab : ""} checklist...`}
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-9 text-xs px-2.5 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reset Search
            </Button>
          )}
        </div>
      </div>

      {/* Templates Data Table: Shows ONLY Checklist and Actions */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Checklist
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-36">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-12 text-xs text-muted-foreground font-medium">
                  No checklist found matching your search. Click &ldquo;Add {mainTab} Checklist&rdquo; to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((tpl) => (
                <TableRow key={tpl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                  {/* Checklist (Single Word / Item Name) */}
                  <TableCell className="py-3.5">
                    <span className="text-xs font-bold text-foreground">{tpl.title}</span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTemplateToEdit(tpl);
                          setIsAddEditOpen(true);
                        }}
                        className="h-7 text-xs px-2 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950"
                        title="Edit Checklist"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(tpl.id, tpl.title)}
                        className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete Checklist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total <strong className="text-foreground">{filteredTemplates.length}</strong> checklist options for{" "}
            <strong className="text-foreground">
              {mainTab} {mainTab === "Physiotherapist" ? `(${physioSubTab})` : ""}
            </strong>
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Care Protocol Sync Active
          </span>
        </div>
      </div>

        {/* Add / Edit Checklist Modal */}
        <AddEditChecklistModal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          templateToEdit={templateToEdit}
          defaultRole={mainTab}
          defaultSubCategory={physioSubTab}
          onSave={handleSave}
        />
      </div>
    )}

    {/* ------------------------------------------------------------- */}
    {/* TAB 2: VITALS CHECKLIST & CLINICAL PARAMETERS                 */}
    {/* ------------------------------------------------------------- */}
    {topTab === "vitals" && <VitalsTab />}
  </div>
);
}
