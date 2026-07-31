"use client";

import { useState, useMemo } from "react";
import { initialServices, MedicalService } from "./_data/services";
import { AddEditServiceModal } from "./_components/add-edit-service-modal";
import { ServiceViewSheet } from "./_components/service-view-sheet";
import { DeleteServiceDialog } from "./_components/delete-service-dialog";
import { ServiceRequestList } from "./_components/service-request-list";
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
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Layers,
  RefreshCw,
  Download,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function ServiceManagementPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "catalog">("requests");

  const [services, setServices] = useState<MedicalService[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Enabled" | "Disabled">("All");

  // Modals & Sheets state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<MedicalService | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [serviceToView, setServiceToView] = useState<MedicalService | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        service.serviceName.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.id.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "All" || service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchQuery, categoryFilter, statusFilter]);

  // Action Handlers
  const handleOpenAddModal = () => {
    setServiceToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (service: MedicalService) => {
    setServiceToEdit(service);
    setIsAddEditOpen(true);
  };

  const handleOpenViewSheet = (service: MedicalService) => {
    setServiceToView(service);
    setIsViewOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setServiceToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleSaveService = (savedService: MedicalService) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      }
      return [savedService, ...prev];
    });

    if (serviceToView && serviceToView.id === savedService.id) {
      setServiceToView(savedService);
    }
  };

  const handleToggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "Enabled" ? "Disabled" : "Enabled";
          swiftAlert.success({
            title: "Service Status Updated",
            description: `"${s.serviceName}" is now ${nextStatus}.`,
          });
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );

    if (serviceToView && serviceToView.id === id) {
      setServiceToView((prev) =>
        prev
          ? { ...prev, status: prev.status === "Enabled" ? "Disabled" : "Enabled" }
          : null
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!serviceToDeleteId) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceToDeleteId));
    setServiceToDeleteId(null);
  };

  const targetDeleteService = services.find((s) => s.id === serviceToDeleteId);

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setStatusFilter("All");
    swiftAlert.info({
      title: "Filters Reset",
      description: "Displaying all platform healthcare services.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Layers className="h-7 w-7 text-teal-600" />
            Service Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage user service requests, review requirements, recommend services, and manage platform catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Report Exported",
                description: "Exported service data to CSV format.",
              })
            }
            className="h-9 gap-2 text-xs border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenAddModal}
            className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Service</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "requests"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Service Requests Flow</span>
          <Badge className="bg-teal-600 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
            5
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "catalog"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Services Catalog</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {services.length}
          </Badge>
        </button>
      </div>

      {/* TAB 1: SERVICE REQUEST MANAGEMENT FLOW */}
      {activeTab === "requests" && (
        <ServiceRequestList availableServices={services} />
      )}

      {/* TAB 2: HEALTHCARE SERVICES CATALOG */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Service Name or Description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Category:</span>
                  <Select value={categoryFilter} onValueChange={(val: any) => setCategoryFilter(val || "All")}>
                    <SelectTrigger className="h-9 text-xs w-36">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Telehealth">Telehealth</SelectItem>
                      <SelectItem value="Home Care">Home Care</SelectItem>
                      <SelectItem value="Rehabilitation">Rehabilitation</SelectItem>
                      <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                      <SelectItem value="Senior Care">Senior Care</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
                  <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                    <SelectTrigger className="h-9 text-xs w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Enabled">Enabled Only</SelectItem>
                      <SelectItem value="Disabled">Disabled Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(searchQuery || categoryFilter !== "All" || statusFilter !== "All") && (
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

          {/* Service Data Table */}
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Image</TableHead>
                  <TableHead className="font-bold text-xs">Service Name</TableHead>
                  <TableHead className="font-bold text-xs">Category & Rate</TableHead>
                  <TableHead className="font-bold text-xs max-w-xs">Description</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No medical services found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="w-20">
                        <div className="h-12 w-16 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
                          <img
                            src={service.image}
                            alt={service.serviceName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-foreground">
                        <div className="flex flex-col">
                          <span>{service.serviceName}</span>
                          <span className="text-[10px] font-mono text-muted-foreground font-normal">
                            {service.id}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-0.5">
                          <Badge variant="outline" className="w-fit text-[10px]">
                            {service.category}
                          </Badge>
                          <span className="font-semibold text-foreground text-[11px]">
                            {service.price}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {service.description}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={service.status === "Enabled" ? "default" : "secondary"}
                          className={
                            service.status === "Enabled"
                              ? "bg-emerald-600 text-white font-semibold text-[11px]"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium text-[11px]"
                          }
                        >
                          {service.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenViewSheet(service)}
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
                            <DropdownMenuContent align="end" className="w-44 bg-card border shadow-lg">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                                  Service Actions
                                </DropdownMenuLabel>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenEditModal(service)}
                                className="cursor-pointer text-xs"
                              >
                                <Pencil className="mr-2 h-3.5 w-3.5 text-teal-600" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(service.id)}
                                className="cursor-pointer text-xs"
                              >
                                {service.status === "Enabled" ? (
                                  <>
                                    <XCircle className="mr-2 h-3.5 w-3.5 text-amber-600" />
                                    <span>Disable</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                                    <span>Enable</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteDialog(service.id)}
                                className="cursor-pointer text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                <span>Delete</span>
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

            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong className="text-foreground">{filteredServices.length}</strong> of{" "}
                <strong className="text-foreground">{services.length}</strong> active platform services
              </span>
              <span className="font-medium text-teal-600 dark:text-teal-400">
                Catalog Sync Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditServiceModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        serviceToEdit={serviceToEdit}
        onSaveService={handleSaveService}
      />

      {/* Service View Sheet Drawer */}
      <ServiceViewSheet
        service={serviceToView}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteServiceDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        serviceName={targetDeleteService?.serviceName}
      />
    </div>
  );
}
