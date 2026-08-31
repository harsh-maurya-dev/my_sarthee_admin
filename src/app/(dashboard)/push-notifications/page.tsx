"use client";

import { useState, useMemo } from "react";
import { PushNotificationItem, initialPushNotifications } from "./_data/push-notifications";
import { AddEditPushModal } from "./_components/add-edit-push-modal";
import { PushViewModal } from "./_components/push-view-modal";
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
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Grid,
  List,
  Clock,
  Smartphone,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function PushNotificationsPage() {
  const [pushes, setPushes] = useState<PushNotificationItem[]>(initialPushNotifications);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Enable" | "Disable">("All");
  const [dateFilter, setDateFilter] = useState("");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [pushToEdit, setPushToEdit] = useState<PushNotificationItem | null>(null);

  const [selectedPushView, setSelectedPushView] = useState<PushNotificationItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredPushes = useMemo(() => {
    return pushes.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesDate = !dateFilter || p.creationDate === dateFilter || p.scheduleDateTime.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [pushes, searchQuery, statusFilter, dateFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setPushToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (push: PushNotificationItem) => {
    setPushToEdit(push);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (push: PushNotificationItem) => {
    setSelectedPushView(push);
    setIsViewOpen(true);
  };

  const handleSavePush = (savedPush: PushNotificationItem) => {
    setPushes((prev) => {
      const exists = prev.some((p) => p.id === savedPush.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPush.id ? savedPush : p));
      }
      return [savedPush, ...prev];
    });
  };

  const handleToggleStatus = (push: PushNotificationItem) => {
    const newStatus = push.status === "Enable" ? "Disable" : "Enable";
    setPushes((prev) =>
      prev.map((p) => (p.id === push.id ? { ...p, status: newStatus } : p))
    );

    if (newStatus === "Enable") {
      swiftAlert.success({
        title: "Push Notification Enabled",
        description: `"${push.title}" will broadcast on schedule.`,
      });
    } else {
      swiftAlert.info({
        title: "Push Notification Disabled",
        description: `"${push.title}" has been disabled.`,
      });
    }
  };

  const handleDeletePush = (pushId: string, pushTitle: string) => {
    if (confirm(`Are you sure you want to delete push notification "${pushTitle}"?`)) {
      setPushes((prev) => prev.filter((p) => p.id !== pushId));
      swiftAlert.error({
        title: "Push Notification Deleted",
        description: `Push broadcast "${pushTitle}" was removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Send className="h-7 w-7 text-[#01265D] dark:text-blue-400" />
            Push Notification Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dispatch mobile push alerts to patient apps and caregiver handheld devices.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="h-9 gap-2 bg-[#01265D] text-white hover:bg-[#0a3375] text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Compose Push Notification</span>
        </Button>
      </div>

      {/* Filter Bar & View Mode Toggle */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Notification Title or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Enable">Enabled</SelectItem>
                  <SelectItem value="Disable">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Date:</span>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="h-9 text-xs pl-8 w-36"
                />
              </div>
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
          {filteredPushes.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
              No push notifications found matching your search.
            </div>
          ) : (
            filteredPushes.map((p) => (
              <div key={p.id} className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={p.status === "Enable" ? "default" : "secondary"} className="font-bold text-[10px]">
                        {p.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{p.id}</span>
                      <span>Target: {p.targetAudience}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>
                    <div className="text-[10px] text-[#01265D] dark:text-blue-400 font-mono font-semibold pt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Scheduled: {p.scheduleDateTime}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-1.5 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenView(p)}
                    className="h-8 text-xs gap-1 flex-1 border-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(p)}
                    className="h-8 text-xs gap-1 border-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(p)}
                    className={`h-8 text-xs gap-1 ${
                      p.status === "Enable" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {p.status === "Enable" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{p.status === "Enable" ? "Disable" : "Enable"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePush(p.id, p.title)}
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
                <TableHead className="font-bold text-xs">Push Title & Narrative</TableHead>
                <TableHead className="font-bold text-xs">Schedule Date & Time</TableHead>
                <TableHead className="font-bold text-xs">Creation Date</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPushes.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="w-24">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-12 w-20 object-cover rounded-lg border"
                    />
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{p.title}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[280px] block">
                      {p.shortDescription}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-[#01265D] dark:text-blue-400 font-semibold">
                    {p.scheduleDateTime}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {p.creationDate}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant={p.status === "Enable" ? "default" : "secondary"} className="text-[10px] font-bold">
                      {p.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenView(p)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(p)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(p)}
                        className="h-8 text-xs gap-1"
                      >
                        {p.status === "Enable" ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePush(p.id, p.title)}
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
      <AddEditPushModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        pushToEdit={pushToEdit}
        onSavePush={handleSavePush}
      />

      <PushViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        pushItem={selectedPushView}
      />
    </div>
  );
}
