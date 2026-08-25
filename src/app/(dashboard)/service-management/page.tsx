"use client";

import { useState, useMemo } from "react";
import {
  initialServiceCategories,
  ServiceCategory,
} from "./_data/service-categories";
import { AddEditCategoryModal } from "./_components/add-edit-category-modal";
import { DeleteCategoryDialog } from "./_components/delete-category-dialog";
import { PreferredSkillsetsTab } from "./_components/preferred-skillsets-tab";
import { ServiceDetailsTab } from "./_components/service-details-tab";
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
import { Switch } from "@/components/ui/switch";
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
  Pencil,
  Trash2,
  MoreVertical,
  Layers,
  RefreshCw,
  Download,
  Briefcase,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function ServiceManagementModulePage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(
    initialServiceCategories
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"catalogue" | "skillsets" | "pricing">("catalogue");

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<ServiceCategory | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(
    null
  );

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.id.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  // Counts
  const activeCount = categories.filter((c) => c.status === "Active").length;
  const inactiveCount = categories.filter(
    (c) => c.status === "Inactive"
  ).length;

  // Handlers
  const handleOpenAddModal = () => {
    setCategoryToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (category: ServiceCategory) => {
    setCategoryToEdit(category);
    setIsAddEditOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setCategoryToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleSaveCategory = (saved: ServiceCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      if (exists) {
        return prev.map((c) => (c.id === saved.id ? saved : c));
      }
      return [saved, ...prev];
    });
  };

  const handleToggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status === "Active" ? "Inactive" : "Active";
          swiftAlert.success({
            title: "Status Updated",
            description: `"${c.title}" is now ${nextStatus}.`,
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleConfirmDelete = () => {
    if (!categoryToDeleteId) return;
    const target = categories.find((c) => c.id === categoryToDeleteId);
    setCategories((prev) =>
      prev.filter((c) => c.id !== categoryToDeleteId)
    );
    setCategoryToDeleteId(null);
    if (target) {
      swiftAlert.success({
        title: "Category Deleted",
        description: `"${target.title}" has been removed from the catalogue.`,
      });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    swiftAlert.info({
      title: "Filters Reset",
      description: "Displaying all service categories.",
    });
  };

  const targetDeleteCategory = categories.find(
    (c) => c.id === categoryToDeleteId
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl flex items-center gap-2.5">
              <Layers className="h-7 w-7 text-teal-600" />
              Service Management
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage the service categories offered on the platform. Add, edit, or
            deactivate service categories visible to consumers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Service catalogue exported to CSV.",
              })
            }
            className="h-9 gap-2 text-xs border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenAddModal}
            className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Service Category</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("catalogue")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "catalogue"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Service Catalogue</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {categories.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("skillsets")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "skillsets"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Preferred Skillsets</span>
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "pricing"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <IndianRupee className="h-4 w-4" />
          <span>Service Pricing & Details</span>
        </button>
      </div>

      {/* TAB 1: SERVICE CATALOGUE */}
      {activeTab === "catalogue" && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Service ID, Title, or Description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                {searchQuery && (
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

          {/* Service Catalogue Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-28">
                    Service ID
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Service Display Name
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-32">
                    Shift
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-center w-36">
                    Service Status
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right w-28">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-16 text-muted-foreground text-xs font-medium"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Layers className="h-8 w-8 text-muted-foreground/40" />
                        <span>No service categories found.</span>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-xs mt-1"
                          >
                            Clear Search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Service ID */}
                      <TableCell className="font-mono text-xs text-muted-foreground font-medium">
                        {category.id}
                      </TableCell>

                      {/* Service Display Name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border shrink-0">
                            <img
                              src={category.icon}
                              alt={category.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&q=80";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {category.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Shift */}
                      <TableCell className="text-xs font-medium text-foreground">
                        <Badge variant="outline" className="text-[10px] font-semibold border-slate-300 dark:border-slate-700">
                          {category.shift}
                        </Badge>
                      </TableCell>

                      {/* Service Status Toggle */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={category.status === "Active"}
                            onCheckedChange={() =>
                              handleToggleStatus(category.id)
                            }
                            className="data-[state=checked]:bg-emerald-600"
                          />
                          <Badge
                            variant={
                              category.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              category.status === "Active"
                                ? "bg-emerald-600 text-white font-semibold text-[10px]"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[10px]"
                            }
                          >
                            {category.status}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-background text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:border-slate-800 dark:hover:bg-slate-800">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 bg-card border shadow-lg"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                                Category Actions
                              </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModal(category)}
                              className="cursor-pointer text-xs"
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5 text-teal-600" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenDeleteDialog(category.id)
                              }
                              className="cursor-pointer text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Table Footer */}
            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filteredCategories.length}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{categories.length}</strong>{" "}
                service categories
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Catalogue Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREFERRED SKILLSETS */}
      {activeTab === "skillsets" && <PreferredSkillsetsTab />}

      {/* TAB 3: SERVICE PRICING & DETAILS */}
      {activeTab === "pricing" && <ServiceDetailsTab />}

      {/* Add / Edit Modal */}
      <AddEditCategoryModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        categoryToEdit={categoryToEdit}
        onSaveCategory={handleSaveCategory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        categoryName={targetDeleteCategory?.title}
      />
    </div>
  );
}
