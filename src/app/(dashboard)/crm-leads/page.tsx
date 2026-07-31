"use client";

import { useState, useMemo } from "react";
import { CRMLead, initialCRMLeads } from "./_data/leads";
import { AddLeadModal } from "./_components/add-lead-modal";
import { LeadDetailsModal } from "./_components/lead-details-modal";
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
  Target,
  Plus,
  Search,
  Filter,
  Users,
  TrendingUp,
  DollarSign,
  Phone,
  Eye,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function CRMLeadsPage() {
  const [leads, setLeads] = useState<CRMLead[]>(initialCRMLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        l.leadName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.serviceRequested.toLowerCase().includes(q);

      const matchesSource = sourceFilter === "All" || l.leadSource === sourceFilter;
      const matchesStatus = statusFilter === "All" || l.conversionStatus === statusFilter;

      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [leads, searchQuery, sourceFilter, statusFilter]);

  const handleAddLead = (newLead: CRMLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleOpenDetails = (lead: CRMLead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const handleUpdateLeadStatus = (
    leadId: string,
    newStatus: CRMLead["conversionStatus"],
    note: string
  ) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              conversionStatus: newStatus,
              historyLog: [
                ...(l.historyLog || []),
                {
                  date: new Date().toISOString().split("T")[0],
                  action: `Stage Changed to ${newStatus}`,
                  note,
                },
              ],
            }
          : l
      )
    );
  };

  const totalLeadsCount = leads.length;
  const convertedCount = leads.filter((l) => l.conversionStatus === "Converted").length;
  const conversionRate = Math.round((convertedCount / (totalLeadsCount || 1)) * 100);
  const pipelineValue = leads
    .filter((l) => l.conversionStatus !== "Lost")
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Target className="h-7 w-7 text-teal-600" />
            CRM & Patient Lead Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track patient acquisition pipeline, lead source attribution (Google Ads, Meta, Referrals), and conversion stages.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Register New Lead</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Pipeline Leads</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalLeadsCount}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Active Contacts</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Converted Patients</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{convertedCount}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active Care Plans</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Conversion Rate</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{conversionRate}%</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">+4.2% benchmark</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pipeline Deal Value</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">${pipelineValue.toLocaleString()}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Estimated Potential</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Lead Name, Phone, Email, or Service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Lead Source:</span>
              <Select value={sourceFilter} onValueChange={(val: any) => setSourceFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-40">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sources</SelectItem>
                  <SelectItem value="Google Ads">Google Search Ads</SelectItem>
                  <SelectItem value="Meta Ads">Meta Social Ads</SelectItem>
                  <SelectItem value="Organic Search">Organic Search</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Partner Clinic">Partner Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Conversion Stage:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stages</SelectItem>
                  <SelectItem value="New Lead">New Lead</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Consultation Scheduled">Consult Scheduled</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Lead Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
            <TableRow>
              <TableHead className="font-bold text-xs">Lead ID / Date</TableHead>
              <TableHead className="font-bold text-xs">Contact Name & Phone</TableHead>
              <TableHead className="font-bold text-xs">Service Needed</TableHead>
              <TableHead className="font-bold text-xs">Lead Source</TableHead>
              <TableHead className="font-bold text-xs">Value ($)</TableHead>
              <TableHead className="font-bold text-xs text-center">Conversion Status</TableHead>
              <TableHead className="font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs font-medium">
                  No leads found matching your search or filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((l) => (
                <TableRow key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  {/* Lead ID */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col font-mono">
                      <span className="font-bold text-foreground">{l.id}</span>
                      <span className="text-[10px] text-muted-foreground">{l.createdDate}</span>
                    </div>
                  </TableCell>

                  {/* Contact Name & Phone */}
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{l.leadName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {l.phone}
                      </span>
                    </div>
                  </TableCell>

                  {/* Service Needed */}
                  <TableCell className="text-xs font-medium text-foreground">
                    {l.serviceRequested}
                  </TableCell>

                  {/* Lead Source */}
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      {l.leadSource}
                    </Badge>
                  </TableCell>

                  {/* Value ($) */}
                  <TableCell className="text-xs font-extrabold text-emerald-600">
                    ${l.estimatedValue.toLocaleString()}
                  </TableCell>

                  {/* Conversion Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        l.conversionStatus === "Converted"
                          ? "default"
                          : l.conversionStatus === "Lost"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {l.conversionStatus}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDetails(l)}
                      className="h-8 text-xs gap-1 border-slate-200 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{filteredLeads.length}</strong> patient leads in pipeline
          </span>
          <span className="font-medium text-teal-600 dark:text-teal-400">
            Source Attribution Tracker Active
          </span>
        </div>
      </div>

      {/* Modals */}
      <AddLeadModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddLead={handleAddLead}
      />

      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        onUpdateStatus={handleUpdateLeadStatus}
      />
    </div>
  );
}
