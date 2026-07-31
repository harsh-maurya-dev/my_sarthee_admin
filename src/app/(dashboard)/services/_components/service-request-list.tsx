"use client";

import { useState, useMemo } from "react";
import { ServiceRequest, initialServiceRequests } from "../_data/service-requests";
import { MedicalService } from "../_data/services";
import { ReviewRequestModal } from "./review-request-modal";
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
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  RefreshCw,
  Sparkles,
  DollarSign,
  FileCheck,
  Calendar,
  User,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ServiceRequestListProps {
  availableServices: MedicalService[];
}

export function ServiceRequestList({ availableServices }: ServiceRequestListProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialServiceRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.patientName.toLowerCase().includes(q) ||
        req.careRequirement.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.medicalCondition.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleOpenReview = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsReviewOpen(true);
  };

  const handleSaveRequest = (updatedRequest: ServiceRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const handleQuickApprove = (request: ServiceRequest) => {
    const updated: ServiceRequest = {
      ...request,
      status: "Approved",
    };
    handleSaveRequest(updated);
    swiftAlert.success({
      title: "Booking Approved",
      description: `Request ${request.id} for ${request.patientName} approved successfully.`,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    swiftAlert.info({
      title: "Filters Reset",
      description: "Displaying all user service requests.",
    });
  };

  const renderStatusBadge = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-600 text-white font-semibold text-[11px]">Approved</Badge>;
      case "Pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 text-[11px] font-semibold">Pending</Badge>;
      case "Under Review":
        return <Badge className="bg-blue-600 text-white font-semibold text-[11px]">Under Review</Badge>;
      case "Service Recommended":
        return <Badge className="bg-teal-600 text-white font-semibold text-[11px]">Recommended</Badge>;
      case "Rejected":
        return <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-[11px]">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Filter Controls */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Patient Name, Condition, or Requirement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-40">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Requests</SelectItem>
                  <SelectItem value="Pending">Pending Only</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Service Recommended">Recommended</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || statusFilter !== "All") && (
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

      {/* Service Request Data Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Request ID</TableHead>
              <TableHead className="font-bold text-xs">Patient Details</TableHead>
              <TableHead className="font-bold text-xs max-w-xs">Care Requirement</TableHead>
              <TableHead className="font-bold text-xs">Recommended Service</TableHead>
              <TableHead className="font-bold text-xs">Pricing</TableHead>
              <TableHead className="font-bold text-xs text-center">Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No service requests found matching your filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Request ID & Date */}
                  <TableCell className="font-mono text-xs text-foreground font-semibold">
                    <div className="flex flex-col">
                      <span>{req.id}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {req.preferredDate}
                      </span>
                    </div>
                  </TableCell>

                  {/* Patient Name & Condition */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <User className="h-3 w-3 text-teal-600" />
                        {req.patientName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {req.age}y · {req.gender} · {req.medicalCondition}
                      </span>
                    </div>
                  </TableCell>

                  {/* Care Requirement */}
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {req.careRequirement}
                  </TableCell>

                  {/* Recommended Service */}
                  <TableCell className="text-xs">
                    {req.recommendedServiceName ? (
                      <span className="font-semibold text-teal-700 dark:text-teal-400">
                        {req.recommendedServiceName}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Not Recommended Yet</span>
                    )}
                  </TableCell>

                  {/* Pricing Review */}
                  <TableCell className="text-xs font-mono font-bold text-foreground">
                    ${req.pricing.finalPrice.toFixed(2)}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="text-center">
                    {renderStatusBadge(req.status)}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReview(req)}
                        className="h-8 text-xs gap-1 font-medium border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review & Process</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-background text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground dark:border-slate-800 dark:hover:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Request Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                              Request Flow Steps
                            </DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenReview(req)}
                            className="cursor-pointer text-xs"
                          >
                            <FileCheck className="mr-2 h-3.5 w-3.5 text-teal-600" />
                            <span>1. Review Request</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenReview(req)}
                            className="cursor-pointer text-xs"
                          >
                            <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-600" />
                            <span>2. Recommend Service</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenReview(req)}
                            className="cursor-pointer text-xs"
                          >
                            <DollarSign className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                            <span>3. Review Pricing</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleQuickApprove(req)}
                            disabled={req.status === "Approved"}
                            className="cursor-pointer text-xs text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
                          >
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                            <span>Approve Booking</span>
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

        {/* Footer Summary */}
        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredRequests.length}</strong> of{" "}
            <strong className="text-foreground">{requests.length}</strong> submitted service requests
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Request Dispatch Active
          </span>
        </div>
      </div>

      {/* Review Request Multi-Step Modal */}
      <ReviewRequestModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        request={selectedRequest}
        availableServices={availableServices}
        onSaveRequest={handleSaveRequest}
      />
    </div>
  );
}
