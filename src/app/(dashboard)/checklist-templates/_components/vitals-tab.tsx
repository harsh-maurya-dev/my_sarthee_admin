"use client";

import { useState, useMemo } from "react";
import {
  VitalSignItem,
  VitalService,
  initialVitalSigns,
} from "../_data/vitals-data";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  HeartPulse,
  Activity,
  Stethoscope,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export function VitalsTab() {
  const [vitals, setVitals] = useState<VitalSignItem[]>(initialVitalSigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVital, setEditingVital] = useState<VitalSignItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [description, setDescription] = useState("");
  const [selectedServices, setSelectedServices] = useState<VitalService[]>(["Nurse", "Caregiver"]);

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [vitalToDelete, setVitalToDelete] = useState<VitalSignItem | null>(null);

  // Filtered Vitals
  const filteredVitals = useMemo(() => {
    return vitals.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesService =
        serviceFilter === "All" || v.services.includes(serviceFilter as VitalService);

      return matchesSearch && matchesService;
    });
  }, [vitals, searchQuery, serviceFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingVital(null);
    setName("");
    setUnit("");
    setNormalRange("");
    setDescription("");
    setSelectedServices(["Nurse", "Caregiver"]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (vital: VitalSignItem) => {
    setEditingVital(vital);
    setName(vital.name);
    setUnit(vital.unit);
    setNormalRange(vital.normalRange);
    setDescription(vital.description);
    setSelectedServices([...vital.services]);
    setIsModalOpen(true);
  };

  // Toggle Service in Form
  const toggleService = (srv: VitalService) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  // Save Vital
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter a vital sign name.",
      });
      return;
    }

    if (selectedServices.length === 0) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please select at least one applicable service.",
      });
      return;
    }

    if (editingVital) {
      setVitals((prev) =>
        prev.map((v) =>
          v.id === editingVital.id
            ? {
                ...v,
                name: name.trim(),
                unit: unit.trim() || "unit",
                normalRange: normalRange.trim() || "N/A",
                description: description.trim(),
                services: selectedServices,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : v
        )
      );
      swiftAlert.success({
        title: "Vital Sign Updated",
        description: `"${name}" has been updated successfully.`,
      });
    } else {
      const newVital: VitalSignItem = {
        id: `VIT-${String(vitals.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        unit: unit.trim() || "unit",
        normalRange: normalRange.trim() || "N/A",
        description: description.trim(),
        services: selectedServices,
        status: "Active",
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setVitals((prev) => [...prev, newVital]);
      swiftAlert.success({
        title: "Vital Sign Added",
        description: `"${name}" has been added to the vitals checklist.`,
      });
    }

    setIsModalOpen(false);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const next = v.status === "Active" ? "Inactive" : "Active";
          swiftAlert.success({
            title: "Status Changed",
            description: `"${v.name}" is now ${next}.`,
          });
          return { ...v, status: next };
        }
        return v;
      })
    );
  };

  // Delete
  const handleDelete = () => {
    if (!vitalToDelete) return;
    setVitals((prev) => prev.filter((v) => v.id !== vitalToDelete.id));
    swiftAlert.success({
      title: "Vital Deleted",
      description: `"${vitalToDelete.name}" has been removed.`,
    });
    setVitalToDelete(null);
    setIsDeleteOpen(false);
  };

  // Service Badge Styles
  const getServiceBadge = (srv: VitalService) => {
    switch (srv) {
      case "Nurse":
        return "bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-300 border-blue-200 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
      case "Caregiver":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
      case "Physiotherapist":
        return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Service Filter Controls */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vital signs by name, unit, or description..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border">
              {["All", "Nurse", "Caregiver", "Physiotherapist"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setServiceFilter(filter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    serviceFilter === filter
                      ? "bg-white dark:bg-slate-800 text-[#01265D] dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="h-9 gap-1.5 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Vital Sign</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Vitals Listing Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-16">
                #
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                Vital Sign Parameter
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                Applicable Clinical Services
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5">
                Standard Range / Unit
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center w-28">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right w-28">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVitals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-xs text-muted-foreground font-medium"
                >
                  No vital signs found matching your criteria. Click &ldquo;Add Vital Sign&rdquo; to register one.
                </TableCell>
              </TableRow>
            ) : (
              filteredVitals.map((vital, index) => (
                <TableRow
                  key={vital.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                >
                  {/* Index */}
                  <TableCell className="py-3.5 font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  {/* Vital Sign Name & Description */}
                  <TableCell className="py-3.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                        <span className="text-xs font-bold text-foreground">
                          {vital.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {vital.description}
                      </p>
                    </div>
                  </TableCell>

                  {/* Applicable Services */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {vital.services.map((srv) => (
                        <Badge
                          key={srv}
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 border ${getServiceBadge(srv)}`}
                        >
                          {srv === "Nurse" && "👩‍⚕️ Nurse"}
                          {srv === "Caregiver" && "🤝 Caregiver"}
                          {srv === "Physiotherapist" && "🏃 Physiotherapist"}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Normal Range & Unit */}
                  <TableCell className="py-3.5">
                    <div>
                      <span className="text-xs font-bold text-foreground font-mono">
                        {vital.normalRange}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Unit: <span className="font-semibold text-foreground">{vital.unit}</span>
                      </p>
                    </div>
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell className="py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Switch
                        checked={vital.status === "Active"}
                        onCheckedChange={() => handleToggleStatus(vital.id)}
                        className="data-[state=checked]:bg-emerald-600 scale-90"
                      />
                      <Badge
                        className={
                          vital.status === "Active"
                            ? "bg-emerald-600 text-white font-semibold text-[9px]"
                            : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[9px]"
                        }
                      >
                        {vital.status}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(vital)}
                        className="h-7 text-xs px-2 text-[#01265D] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 dark:hover:bg-blue-950"
                        title="Edit Vital Sign"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setVitalToDelete(vital);
                          setIsDeleteOpen(true);
                        }}
                        className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete Vital Sign"
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
            Showing <strong className="text-foreground">{filteredVitals.length}</strong> of{" "}
            <strong className="text-foreground">{vitals.length}</strong> vital sign parameters
          </span>
          <span className="font-medium text-[#01265D] dark:text-blue-400">
            Telemetry & Vital Check Protocol Active
          </span>
        </div>
      </div>

      {/* Add / Edit Vital Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingVital ? "Edit Vital Sign Parameter" : "Add Vital Sign Parameter"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the vital sign name, applicable healthcare services, and normal ranges.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            {/* Vital Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Vital Sign Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Blood Pressure, Pulse Rate, SpO2(oxygen)"
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Applicable Services Checkboxes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Applicable Clinical Services <span className="text-rose-500">*</span>
              </Label>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border">
                {[
                  { key: "Nurse", label: "Nurse", icon: Stethoscope },
                  { key: "Caregiver", label: "Caregiver", icon: HeartPulse },
                  { key: "Physiotherapist", label: "Physiotherapist", icon: Activity },
                ].map((srv) => {
                  const isChecked = selectedServices.includes(srv.key as VitalService);
                  return (
                    <label
                      key={srv.key}
                      className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleService(srv.key as VitalService)}
                      />
                      <span>{srv.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Unit and Normal Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Standard Unit</Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. mmHg, bpm, %"
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Normal Range</Label>
                <Input
                  value={normalRange}
                  onChange={(e) => setNormalRange(e.target.value)}
                  placeholder="e.g. 120/80 mmHg, 95-100%"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description / Protocol Notes</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Clinical observation and measurement frequency..."
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold"
              >
                {editingVital ? "Save Changes" : "Create Vital Sign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Vital Sign Parameter?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">&quot;{vitalToDelete?.name}&quot;</strong>?
              This vital sign will no longer appear on field checklists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-xs h-9 bg-rose-600 text-white hover:bg-rose-700 font-semibold"
            >
              Delete Vital
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
