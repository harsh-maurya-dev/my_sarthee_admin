"use client";

import { useState, useMemo } from "react";
import {
  PatientFeedback,
  CaregiverRatingItem,
  initialPatientFeedback,
  initialCaregiverRatings,
} from "./_data/quality";
import { QualityItemModal } from "./_components/quality-item-modal";
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
  ShieldCheck,
  Star,
  MessageSquare,
  Search,
  Filter,
  Award,
  Eye,
  Download,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function QualityManagementPage() {
  const [activeTab, setActiveTab] = useState<"feedback" | "ratings">("feedback");

  const [feedbacks, setFeedbacks] = useState<PatientFeedback[]>(initialPatientFeedback);
  const [ratings, setRatings] = useState<CaregiverRatingItem[]>(initialCaregiverRatings);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>("All");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<string>("All");
  const [caregiverRoleFilter, setCaregiverRoleFilter] = useState<string>("All");
  const [caregiverStatusFilter, setCaregiverStatusFilter] = useState<string>("All");

  // Modal State
  const [selectedModalType, setSelectedModalType] = useState<"feedback" | "caregiver">("feedback");
  const [selectedModalData, setSelectedModalData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers
  const handleOpenModal = (type: "feedback" | "caregiver", data: any) => {
    setSelectedModalType(type);
    setSelectedModalData(data);
    setIsModalOpen(true);
  };

  const handleResolveFeedback = (id: string, notes: string) => {
    if (selectedModalType === "feedback") {
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, status: "Reviewed" } : fb))
      );
    }
  };

  // Filtered Patient Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchesSearch =
        fb.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        feedbackCategoryFilter === "All" || fb.category === feedbackCategoryFilter;

      const matchesRating =
        feedbackRatingFilter === "All" ||
        (feedbackRatingFilter === "5" && fb.rating === 5) ||
        (feedbackRatingFilter === "4" && fb.rating === 4) ||
        (feedbackRatingFilter === "<=3" && fb.rating <= 3);

      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [feedbacks, searchQuery, feedbackCategoryFilter, feedbackRatingFilter]);

  // Filtered Caregiver Ratings
  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      const matchesSearch =
        r.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.caregiverId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        caregiverRoleFilter === "All" || r.role === caregiverRoleFilter;

      const matchesStatus =
        caregiverStatusFilter === "All" || r.qualityStatus === caregiverStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [ratings, searchQuery, caregiverRoleFilter, caregiverStatusFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-teal-600 dark:text-teal-400" />
            Quality Assurance & Service Compliance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor patient satisfaction ratings, review clinical feedback, and track caregiver performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              swiftAlert.info({
                title: "Report Exported",
                description: "Quality Assurance summary report generated as PDF.",
              })
            }
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export QA Report</span>
          </Button>
          <Button
            size="sm"
            onClick={() =>
              swiftAlert.success({
                title: "Quality Audit Triggered",
                description: "Automated caregiver compliance & telemetry audit completed successfully.",
              })
            }
            className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Run Quality Audit</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("feedback")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "feedback"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Patient Feedback & Reviews</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {feedbacks.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("ratings")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "ratings"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className="h-4 w-4" />
          <span>Caregiver Ratings & Performance</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {ratings.length}
          </Badge>
        </button>
      </div>

      {/* TAB 1: PATIENT FEEDBACK & REVIEWS */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-xl border shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search patient, caregiver, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Category:</span>
              </div>
              <select
                aria-label="Filter by category"
                value={feedbackCategoryFilter}
                onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Categories</option>
                <option value="Care Quality">Care Quality</option>
                <option value="Punctuality">Punctuality</option>
                <option value="Communication">Communication</option>
                <option value="Clinical Skills">Clinical Skills</option>
              </select>

              <select
                aria-label="Filter by rating"
                value={feedbackRatingFilter}
                onChange={(e) => setFeedbackRatingFilter(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars Only</option>
                <option value="4">4 Stars</option>
                <option value="<=3">3 Stars & Below</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Feedback ID / Date</TableHead>
                  <TableHead className="font-bold text-xs">Patient & Service</TableHead>
                  <TableHead className="font-bold text-xs">Caregiver</TableHead>
                  <TableHead className="font-bold text-xs">Rating & Category</TableHead>
                  <TableHead className="font-bold text-xs">Patient Review</TableHead>
                  <TableHead className="font-bold text-xs text-center">Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                      No feedback entries found matching your search and filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <TableRow key={fb.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="text-xs font-mono">
                        <span className="font-bold text-foreground">{fb.id}</span>
                        <span className="text-[10px] text-muted-foreground block">{fb.date}</span>
                      </TableCell>

                      <TableCell className="text-xs">
                        <span className="font-bold text-foreground block">{fb.patientName}</span>
                        <span className="text-[10px] text-muted-foreground">{fb.serviceType}</span>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {fb.caregiverName}
                      </TableCell>

                      <TableCell className="text-xs">
                        <div className="flex items-center text-amber-500 font-bold mb-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {fb.rating} / 5
                        </div>
                        <Badge variant="outline" className="text-[9px]">{fb.category}</Badge>
                      </TableCell>

                      <TableCell className="text-xs max-w-[280px]">
                        <p className="truncate italic text-muted-foreground">&quot;{fb.feedbackText}&quot;</p>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={fb.status === "Reviewed" ? "default" : "outline"}
                          className={`text-[10px] ${
                            fb.status === "Action Taken" ? "border-amber-500 text-amber-600 bg-amber-50" : ""
                          }`}
                        >
                          {fb.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal("feedback", fb)}
                          className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-800"
                        >
                          <Eye className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Review</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* TAB 2: CAREGIVER RATINGS ROSTER */}
      {activeTab === "ratings" && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-xl border shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search caregiver name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Role:</span>
              </div>
              <select
                aria-label="Filter by role"
                value={caregiverRoleFilter}
                onChange={(e) => setCaregiverRoleFilter(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Roles</option>
                <option value="Nurse">Nurses</option>
                <option value="Caregiver">Caregivers</option>
                <option value="Physiotherapist">Physiotherapists</option>
              </select>

              <select
                aria-label="Filter by quality status"
                value={caregiverStatusFilter}
                onChange={(e) => setCaregiverStatusFilter(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Quality Statuses</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                <TableRow>
                  <TableHead className="font-bold text-xs">Caregiver ID / Name</TableHead>
                  <TableHead className="font-bold text-xs">Role</TableHead>
                  <TableHead className="font-bold text-xs">Avg Rating & Reviews</TableHead>
                  <TableHead className="font-bold text-xs">5-Star Ratio</TableHead>
                  <TableHead className="font-bold text-xs">Punctuality Rate</TableHead>
                  <TableHead className="font-bold text-xs">Shifts Completed</TableHead>
                  <TableHead className="font-bold text-xs text-center">Quality Status</TableHead>
                  <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRatings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                      No caregivers found matching the filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRatings.map((r) => (
                    <TableRow key={r.caregiverId} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                      <TableCell className="text-xs">
                        <span className="font-bold text-foreground block">{r.caregiverName}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{r.caregiverId}</span>
                      </TableCell>

                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">{r.role}</Badge>
                      </TableCell>

                      <TableCell className="text-xs font-bold text-amber-500">
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {r.averageRating.toFixed(1)}
                          <span className="text-[10px] text-muted-foreground font-normal ml-1">
                            ({r.totalReviewsCount} reviews)
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {r.fiveStarPercentage}%
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {r.punctualityRate}
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {r.totalShiftsCompleted} shifts
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={r.qualityStatus === "Excellent" ? "default" : "outline"}
                          className={`text-[10px] font-bold ${
                            r.qualityStatus === "Needs Improvement" ? "border-amber-500 text-amber-600 bg-amber-50" : ""
                          }`}
                        >
                          {r.qualityStatus}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal("caregiver", r)}
                          className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-800"
                        >
                          <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Audit Profile</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Quality Item Modal */}
      <QualityItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedModalType}
        data={selectedModalData}
        onResolve={handleResolveFeedback}
      />
    </div>
  );
}
