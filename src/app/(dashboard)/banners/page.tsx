"use client";

import { useState, useMemo } from "react";
import { StaticBanner, initialStaticBanners } from "./_data/banners";
import { AddEditBannerModal } from "./_components/add-edit-banner-modal";
import { BannerViewModal } from "./_components/banner-view-modal";
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
  Image as ImageIcon,
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
  RefreshCw,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function BannersPage() {
  const [banners, setBanners] = useState<StaticBanner[]>(initialStaticBanners);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [dateFilter, setDateFilter] = useState("");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState<StaticBanner | null>(null);

  const [selectedBannerView, setSelectedBannerView] = useState<StaticBanner | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.shortDescription.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || b.status === statusFilter;
      const matchesDate = !dateFilter || b.creationDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [banners, searchQuery, statusFilter, dateFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setBannerToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (banner: StaticBanner) => {
    setBannerToEdit(banner);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (banner: StaticBanner) => {
    setSelectedBannerView(banner);
    setIsViewOpen(true);
  };

  const handleSaveBanner = (savedBanner: StaticBanner) => {
    setBanners((prev) => {
      const exists = prev.some((b) => b.id === savedBanner.id);
      if (exists) {
        return prev.map((b) => (b.id === savedBanner.id ? savedBanner : b));
      }
      return [savedBanner, ...prev];
    });
  };

  const handleToggleStatus = (banner: StaticBanner) => {
    const newStatus = banner.status === "Active" ? "Inactive" : "Active";
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, status: newStatus } : b))
    );

    if (newStatus === "Active") {
      swiftAlert.success({
        title: "Banner Enabled",
        description: `"${banner.title}" is now active on the public portal.`,
      });
    } else {
      swiftAlert.info({
        title: "Banner Disabled",
        description: `"${banner.title}" has been deactivated.`,
      });
    }
  };

  const handleDeleteBanner = (bannerId: string, bannerTitle: string) => {
    if (confirm(`Are you sure you want to delete banner "${bannerTitle}"?`)) {
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
      swiftAlert.error({
        title: "Banner Deleted",
        description: `Static banner "${bannerTitle}" was removed.`,
      });
    }
  };

  const activeCount = banners.filter((b) => b.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-teal-600" />
            Static Banner Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure promotional banners, home carousels, and announcement graphics on the public portal.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Static Banner</span>
        </Button>
      </div>

      {/* Filter Bar & View Toggle */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Banner Name or Title..."
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
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Creation Date:</span>
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
          {filteredBanners.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
              No static banners found matching your search.
            </div>
          ) : (
            filteredBanners.map((b) => (
              <div key={b.id} className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={b.status === "Active" ? "default" : "secondary"} className="font-bold text-[10px]">
                        {b.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{b.id}</span>
                      <span>Created: {b.creationDate}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">{b.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {b.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-1.5 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenView(b)}
                    className="h-8 text-xs gap-1 flex-1 border-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(b)}
                    className="h-8 text-xs gap-1 border-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(b)}
                    className={`h-8 text-xs gap-1 ${
                      b.status === "Active" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {b.status === "Active" ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{b.status === "Active" ? "Disable" : "Enable"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBanner(b.id, b.title)}
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
                <TableHead className="font-bold text-xs">Banner Image</TableHead>
                <TableHead className="font-bold text-xs">Banner Details</TableHead>
                <TableHead className="font-bold text-xs">Creation Date</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.map((b) => (
                <TableRow key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="w-24">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="h-12 w-20 object-cover rounded-lg border"
                    />
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{b.title}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[300px] block">
                      {b.shortDescription}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {b.creationDate}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant={b.status === "Active" ? "default" : "secondary"} className="text-[10px] font-bold">
                      {b.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenView(b)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(b)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(b)}
                        className="h-8 text-xs gap-1"
                      >
                        {b.status === "Active" ? "Disable" : "Enable"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBanner(b.id, b.title)}
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
      <AddEditBannerModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        bannerToEdit={bannerToEdit}
        onSaveBanner={handleSaveBanner}
      />

      <BannerViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        banner={selectedBannerView}
      />
    </div>
  );
}
