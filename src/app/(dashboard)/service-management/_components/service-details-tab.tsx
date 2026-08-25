"use client";

import { useState } from "react";
import {
  CaregiverPlan,
  NursingCoveragePlan,
  PhysioSessionPlan,
  initialCaregiverPlans,
  initialNursingPlans,
  initialPhysioPlans,
} from "../_data/service-plans";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  Pencil,
  Trash2,
  Stethoscope,
  HeartHandshake,
  Activity,
  IndianRupee,
  Layers,
  Sparkles,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export function ServiceDetailsTab() {
  const [activeDomain, setActiveDomain] = useState<"Caregiver" | "Nursing" | "Physiotherapist">("Caregiver");

  // State for plans
  const [caregiverPlans, setCaregiverPlans] = useState<CaregiverPlan[]>(initialCaregiverPlans);
  const [nursingPlans, setNursingPlans] = useState<NursingCoveragePlan[]>(initialNursingPlans);
  const [physioPlans, setPhysioPlans] = useState<PhysioSessionPlan[]>(initialPhysioPlans);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states
  const [fieldName1, setFieldName1] = useState(""); // Plan name or Coverage or Sessions
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [weeklyPrice, setWeeklyPrice] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [singlePrice, setSinglePrice] = useState(""); // for physio
  const [planDesc, setPlanDesc] = useState("");

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);

  // Open modal handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFieldName1("");
    setMonthlyPrice("");
    setWeeklyPrice("");
    setDailyPrice("");
    setSinglePrice("");
    setPlanDesc("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeDomain === "Caregiver") {
      setFieldName1(item.planName);
      setMonthlyPrice(item.monthly);
      setWeeklyPrice(item.weekly);
      setDailyPrice(item.daily);
      setPlanDesc(item.description || "");
    } else if (activeDomain === "Nursing") {
      setFieldName1(item.coverage);
      setMonthlyPrice(item.monthly);
      setWeeklyPrice(item.weekly);
      setDailyPrice(item.daily);
      setPlanDesc(item.description || "");
    } else {
      setFieldName1(item.sessions);
      setSinglePrice(item.price);
      setPlanDesc(item.description || "");
    }
    setIsModalOpen(true);
  };

  // Save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName1.trim()) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please enter the required name or tier title.",
      });
      return;
    }

    if (activeDomain === "Caregiver") {
      if (editingItem) {
        setCaregiverPlans((prev) =>
          prev.map((p) =>
            p.id === editingItem.id
              ? {
                  ...p,
                  planName: fieldName1,
                  monthly: monthlyPrice || "₹0",
                  weekly: weeklyPrice || "₹0",
                  daily: dailyPrice || "₹0",
                  description: planDesc,
                }
              : p
          )
        );
        swiftAlert.success({ title: "Plan Updated", description: `Updated plan "${fieldName1}".` });
      } else {
        const newPlan: CaregiverPlan = {
          id: `CG-PLAN-${Date.now().toString().slice(-4)}`,
          planName: fieldName1,
          monthly: monthlyPrice || "₹0",
          weekly: weeklyPrice || "₹0",
          daily: dailyPrice || "₹0",
          description: planDesc,
          status: "Active",
        };
        setCaregiverPlans((prev) => [...prev, newPlan]);
        swiftAlert.success({ title: "Plan Created", description: `Created new plan "${fieldName1}".` });
      }
    } else if (activeDomain === "Nursing") {
      if (editingItem) {
        setNursingPlans((prev) =>
          prev.map((p) =>
            p.id === editingItem.id
              ? {
                  ...p,
                  coverage: fieldName1,
                  monthly: monthlyPrice || "₹0",
                  weekly: weeklyPrice || "₹0",
                  daily: dailyPrice || "₹0",
                  description: planDesc,
                }
              : p
          )
        );
        swiftAlert.success({ title: "Coverage Updated", description: `Updated coverage tier "${fieldName1}".` });
      } else {
        const newPlan: NursingCoveragePlan = {
          id: `NUR-COV-${Date.now().toString().slice(-4)}`,
          coverage: fieldName1,
          monthly: monthlyPrice || "₹0",
          weekly: weeklyPrice || "₹0",
          daily: dailyPrice || "₹0",
          description: planDesc,
          status: "Active",
        };
        setNursingPlans((prev) => [...prev, newPlan]);
        swiftAlert.success({ title: "Coverage Tier Added", description: `Added coverage tier "${fieldName1}".` });
      }
    } else {
      // Physiotherapist
      if (editingItem) {
        setPhysioPlans((prev) =>
          prev.map((p) =>
            p.id === editingItem.id
              ? {
                  ...p,
                  sessions: fieldName1,
                  price: singlePrice || "₹0",
                  description: planDesc,
                }
              : p
          )
        );
        swiftAlert.success({ title: "Session Tier Updated", description: `Updated sessions tier "${fieldName1}".` });
      } else {
        const newPlan: PhysioSessionPlan = {
          id: `PT-SESS-${Date.now().toString().slice(-4)}`,
          sessions: fieldName1,
          price: singlePrice || "₹0",
          description: planDesc,
          status: "Active",
        };
        setPhysioPlans((prev) => [...prev, newPlan]);
        swiftAlert.success({ title: "Session Tier Added", description: `Added sessions tier "${fieldName1}".` });
      }
    }

    setIsModalOpen(false);
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    if (activeDomain === "Caregiver") {
      setCaregiverPlans((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item))
      );
    } else if (activeDomain === "Nursing") {
      setNursingPlans((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item))
      );
    } else {
      setPhysioPlans((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" } : item))
      );
    }
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (activeDomain === "Caregiver") {
      setCaregiverPlans((prev) => prev.filter((p) => p.id !== itemToDelete.id));
    } else if (activeDomain === "Nursing") {
      setNursingPlans((prev) => prev.filter((p) => p.id !== itemToDelete.id));
    } else {
      setPhysioPlans((prev) => prev.filter((p) => p.id !== itemToDelete.id));
    }
    swiftAlert.success({
      title: "Deleted",
      description: `"${itemToDelete.name}" has been removed.`,
    });
    setItemToDelete(null);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Service Domain Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: "Caregiver", label: "Caregiver Service Plans", icon: HeartHandshake, count: caregiverPlans.length },
          { key: "Nursing", label: "Nursing Service Coverage", icon: Stethoscope, count: nursingPlans.length },
          { key: "Physiotherapist", label: "Physiotherapy Service Sessions", icon: Activity, count: physioPlans.length },
        ].map((domain) => {
          const Icon = domain.icon;
          const isActive = activeDomain === domain.key;
          return (
            <button
              key={domain.key}
              onClick={() => setActiveDomain(domain.key as any)}
              className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all relative ${
                isActive
                  ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{domain.label}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {domain.count}
              </Badge>
            </button>
          );
        })}

        <div className="ml-auto pb-3">
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-8 gap-1.5 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {activeDomain === "Caregiver" && "Add Caregiver Plan"}
              {activeDomain === "Nursing" && "Add Coverage Tier"}
              {activeDomain === "Physiotherapist" && "Add Session Tier"}
            </span>
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DOMAIN 1: CAREGIVER PLANS (Plan | Monthly | Weekly | Daily)   */}
      {/* ------------------------------------------------------------- */}
      {activeDomain === "Caregiver" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-teal-600" />
                Caregiver Service Pricing & Package Plans
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure monthly, weekly, and daily rates for caregiver packages offered to clients.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100/80 dark:bg-slate-900/70 border-b">
                <TableRow>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/4">
                    Plan
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Monthly
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Weekly
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Daily
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-center w-24">
                    Status
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-right w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caregiverPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No caregiver plans configured.
                    </TableCell>
                  </TableRow>
                ) : (
                  caregiverPlans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="font-semibold text-xs text-foreground">
                        <div>
                          <p className="font-bold text-foreground">{plan.planName}</p>
                          {plan.description && (
                            <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{plan.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground font-mono">
                        {plan.monthly}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {plan.weekly}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {plan.daily}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Switch
                            checked={plan.status === "Active"}
                            onCheckedChange={() => handleToggleStatus(plan.id)}
                            className="data-[state=checked]:bg-emerald-600 scale-90"
                          />
                          <Badge
                            className={
                              plan.status === "Active"
                                ? "bg-emerald-600 text-white font-semibold text-[9px]"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[9px]"
                            }
                          >
                            {plan.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(plan)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItemToDelete({ id: plan.id, name: plan.planName });
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOMAIN 2: NURSING (Coverage | Monthly | Weekly | Daily)        */}
      {/* ------------------------------------------------------------- */}
      {activeDomain === "Nursing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Nursing Service Hourly & Daily Coverage Tiers
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Defined shift and hour-based nursing rates for home medical & critical care requirements.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100/80 dark:bg-slate-900/70 border-b">
                <TableRow>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/4">
                    Coverage
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Monthly
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Weekly
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/5">
                    Daily
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-center w-24">
                    Status
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-right w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nursingPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No nursing coverage plans configured.
                    </TableCell>
                  </TableRow>
                ) : (
                  nursingPlans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="font-semibold text-xs text-foreground">
                        <div>
                          <p className="font-bold text-foreground">{plan.coverage}</p>
                          {plan.description && (
                            <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{plan.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground font-mono">
                        {plan.monthly}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {plan.weekly}
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {plan.daily}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Switch
                            checked={plan.status === "Active"}
                            onCheckedChange={() => handleToggleStatus(plan.id)}
                            className="data-[state=checked]:bg-emerald-600 scale-90"
                          />
                          <Badge
                            className={
                              plan.status === "Active"
                                ? "bg-emerald-600 text-white font-semibold text-[9px]"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[9px]"
                            }
                          >
                            {plan.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(plan)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItemToDelete({ id: plan.id, name: plan.coverage });
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DOMAIN 3: PHYSIOTHERAPIST (Sessions | Price)                  */}
      {/* ------------------------------------------------------------- */}
      {activeDomain === "Physiotherapist" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-teal-600" />
                Physiotherapy Sessions & Rehabilitation Pricing
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configured per session, weekly packages, and monthly rehabilitation pricing structures.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden max-w-full">
            <Table>
              <TableHeader className="bg-slate-100/80 dark:bg-slate-900/70 border-b">
                <TableRow>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/2">
                    Sessions
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider w-1/3">
                    Price
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-center w-24">
                    Status
                  </TableHead>
                  <TableHead className="font-extrabold text-xs text-foreground uppercase tracking-wider text-right w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {physioPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-xs font-medium">
                      No physiotherapy session plans configured.
                    </TableCell>
                  </TableRow>
                ) : (
                  physioPlans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="font-semibold text-xs text-foreground">
                        <div>
                          <p className="font-bold text-foreground">{plan.sessions}</p>
                          {plan.description && (
                            <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{plan.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground font-mono">
                        {plan.price}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Switch
                            checked={plan.status === "Active"}
                            onCheckedChange={() => handleToggleStatus(plan.id)}
                            className="data-[state=checked]:bg-emerald-600 scale-90"
                          />
                          <Badge
                            className={
                              plan.status === "Active"
                                ? "bg-emerald-600 text-white font-semibold text-[9px]"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[9px]"
                            }
                          >
                            {plan.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(plan)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItemToDelete({ id: plan.id, name: plan.sessions });
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingItem ? "Edit Service Tier" : `Add ${activeDomain} Pricing Tier`}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure the pricing and package rates displayed on the platform.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            {/* Field 1: Plan Name / Coverage / Sessions */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {activeDomain === "Caregiver" && "Plan Name * (e.g. Essential Care)"}
                {activeDomain === "Nursing" && "Coverage Duration * (e.g. 2 hours/day, 12 hours/day)"}
                {activeDomain === "Physiotherapist" && "Sessions Frequency * (e.g. 12 sessions/month, 1 session/day)"}
              </Label>
              <Input
                value={fieldName1}
                onChange={(e) => setFieldName1(e.target.value)}
                placeholder={
                  activeDomain === "Caregiver"
                    ? "e.g. Essential Care"
                    : activeDomain === "Nursing"
                    ? "e.g. 2 hours/day"
                    : "e.g. 12 sessions/month"
                }
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Pricing Rates for Caregiver & Nursing */}
            {(activeDomain === "Caregiver" || activeDomain === "Nursing") && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Monthly Rate</Label>
                  <Input
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    placeholder="e.g. ₹25,000"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Weekly Rate</Label>
                  <Input
                    value={weeklyPrice}
                    onChange={(e) => setWeeklyPrice(e.target.value)}
                    placeholder="e.g. ₹7,000"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Daily Rate</Label>
                  <Input
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(e.target.value)}
                    placeholder="e.g. ₹1,100"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Price Rate for Physiotherapist */}
            {activeDomain === "Physiotherapist" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Price * (e.g. ₹12,000/month, ₹700/session)</Label>
                <Input
                  value={singlePrice}
                  onChange={(e) => setSinglePrice(e.target.value)}
                  placeholder="e.g. ₹12,000/month or ₹700/session"
                  className="h-9 text-xs"
                  required
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description / Clinical Notes</Label>
              <Input
                value={planDesc}
                onChange={(e) => setPlanDesc(e.target.value)}
                placeholder="Short explanation of included services..."
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
                className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold"
              >
                {editingItem ? "Save Changes" : "Create Pricing Tier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Pricing Tier?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">&quot;{itemToDelete?.name}&quot;</strong>?
              This pricing tier will no longer be visible to consumers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="text-xs h-9 bg-rose-600 text-white hover:bg-rose-700 font-semibold"
            >
              Delete Tier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
