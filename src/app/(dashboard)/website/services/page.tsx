"use client";

import { useState, useMemo } from "react";
import { WebsiteService, initialWebsiteServices } from "./_data/website-services";
import { AddEditWebsiteServiceModal } from "./_components/add-edit-website-service-modal";
import { WebsiteServiceViewModal } from "./_components/website-service-view-modal";
import { WebsiteNavHeader } from "../_components/website-nav-header";
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
  Globe,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Grid,
  List,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function WebsiteServicesPage() {
  const [services, setServices] = useState<WebsiteService[]>(initialWebsiteServices);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<WebsiteService | null>(null);

  const [selectedServiceView, setSelectedServiceView] = useState<WebsiteService | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.serviceName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchQuery, statusFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setServiceToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (service: WebsiteService) => {
    setServiceToEdit(service);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (service: WebsiteService) => {
    setSelectedServiceView(service);
    setIsViewOpen(true);
  };

  const handleSaveService = (savedService: WebsiteService) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      }
      return [savedService, ...prev];
    });
  };

  const handleToggleStatus = (service: WebsiteService) => {
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s))
    );

    if (newStatus === "Active") {
      swiftAlert.success({
        title: "Service Published",
        description: `"${service.serviceName}" is now active on corporate website.`,
      });
    } else {
      swiftAlert.info({
        title: "Service Deactivated",
        description: `"${service.serviceName}" has been set to Inactive.`,
      });
    }
  };

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (confirm(`Are you sure you want to delete website service "${serviceName}"?`)) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      swiftAlert.error({
        title: "Service Removed",
        description: `Website service "${serviceName}" was deleted.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Globe className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Website Service Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage services displayed on the corporate public website, graphics, descriptions, and active status.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Nav Header */}
      {/* <WebsiteNavHeader /> */}

      {/* Filter Bar & View Toggle */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Website Service Name or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center border rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-7 w-7 p-0"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
              No website services found matching your search.
            </div>
          ) : (
            filteredServices.map((s) => (
              <div key={s.id} className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={s.imageUrl}
                      alt={s.serviceName}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={s.status === "Active" ? "default" : "secondary"} className="font-bold text-[10px]">
                        {s.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{s.id}</span>
                      <span>Created: {s.creationDate}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">{s.serviceName}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-1.5 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenView(s)}
                    className="h-8 text-xs gap-1 flex-1 border-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(s)}
                    className="h-8 text-xs gap-1 border-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(s)}
                    className={`h-8 text-xs gap-1 ${s.status === "Active" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                  >
                    {s.status === "Active" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{s.status === "Active" ? "Disable" : "Enable"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteService(s.id, s.serviceName)}
                    className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Image</TableHead>
                <TableHead className="font-bold text-xs">Service Name & Description</TableHead>
                <TableHead className="font-bold text-xs">Creation Date</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="w-24">
                    <img
                      src={s.imageUrl}
                      alt={s.serviceName}
                      className="h-12 w-20 object-cover rounded-lg border"
                    />
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{s.serviceName}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[300px] block">
                      {s.description}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {s.creationDate}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant={s.status === "Active" ? "default" : "secondary"} className="text-[10px] font-bold">
                      {s.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenView(s)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(s)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(s)}
                        className="h-8 text-xs gap-1"
                      >
                        {s.status === "Active" ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteService(s.id, s.serviceName)}
                        className="h-8 w-8 p-0 text-rose-600"
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

      {/* Modals */}
      <AddEditWebsiteServiceModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        serviceToEdit={serviceToEdit}
        onSaveService={handleSaveService}
      />

      <WebsiteServiceViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        service={selectedServiceView}
      />
    </div>
  );
}
