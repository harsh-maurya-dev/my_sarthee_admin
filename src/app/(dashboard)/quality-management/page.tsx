"use client";

import { useState, useMemo } from "react";
import {
  PatientFeedback,
  CaregiverRatingItem,
  PatientComplaint,
  QualityAlert,
  initialPatientFeedback,
  initialCaregiverRatings,
  initialPatientComplaints,
  initialQualityAlerts,
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
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Users,
  TrendingUp,
  Award,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function QualityManagementPage() {
  const [activeTab, setActiveTab] = useState<"feedback" | "ratings" | "complaints" | "alerts">("feedback");

  const [feedbacks, setFeedbacks] = useState<PatientFeedback[]>(initialPatientFeedback);
  const [ratings, setRatings] = useState<CaregiverRatingItem[]>(initialCaregiverRatings);
  const [complaints, setComplaints] = useState<PatientComplaint[]>(initialPatientComplaints);
  const [alerts, setAlerts] = useState<QualityAlert[]>(initialQualityAlerts);

  const [searchQuery, setSearchQuery] = useState("");

  // Modal
  const [selectedModalType, setSelectedModalType] = useState<"complaint" | "alert" | "feedback">("complaint");
  const [selectedModalData, setSelectedModalData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers
  const handleOpenModal = (type: "complaint" | "alert" | "feedback", data: any) => {
    setSelectedModalType(type);
    setSelectedModalData(data);
    setIsModalOpen(true);
  };

  const handleResolveItem = (id: string, notes: string) => {
    if (selectedModalType === "complaint") {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Resolved", resolutionNotes: notes } : c))
      );
    } else if (selectedModalType === "alert") {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Dismissed" } : a))
      );
    }
  };

  const openComplaintsCount = complaints.filter((c) => c.status !== "Resolved").length;
  const activeAlertsCount = alerts.filter((a) => a.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-teal-600" />
            Quality Assurance & Service Compliance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor caregiver ratings, review patient feedback, audit complaints, and resolve automated compliance alerts.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            swiftAlert.info({
              title: "Quality Audit Triggered",
              description: "Initiated automated monthly caregiver performance audit.",
            })
          }
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Run Quality Audit</span>
        </Button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Avg Satisfaction Score</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1 flex items-center gap-1">
              4.8 <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">96% Positive Reviews</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Star className="h-5 w-5 fill-amber-500" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Open Complaints</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{openComplaintsCount}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Requires Audit Review</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Compliance Alerts</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">{activeAlertsCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Check-in / Vitals Flags</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Resolution Rate</p>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">98.4%</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Within SLA Timeframe</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
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
          <span>Patient Feedback</span>
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
          <span>Caregiver Ratings Roster</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {ratings.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("complaints")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "complaints"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Patient Complaints</span>
          {openComplaintsCount > 0 && (
            <Badge className="bg-rose-600 text-white text-[10px] px-1.5 py-0">
              {openComplaintsCount}
            </Badge>
          )}
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`pb-3 text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === "alerts"
              ? "text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Quality Compliance Alerts</span>
          {activeAlertsCount > 0 && (
            <Badge className="bg-amber-600 text-white text-[10px] px-1.5 py-0">
              {activeAlertsCount}
            </Badge>
          )}
        </button>
      </div>

      {/* TAB 1: PATIENT FEEDBACK */}
      {activeTab === "feedback" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Feedback ID / Date</TableHead>
                <TableHead className="font-bold text-xs">Patient & Service</TableHead>
                <TableHead className="font-bold text-xs">Caregiver</TableHead>
                <TableHead className="font-bold text-xs">Rating & Category</TableHead>
                <TableHead className="font-bold text-xs">Patient Review</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((fb) => (
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

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal("feedback", fb)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Review</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 2: CAREGIVER RATINGS ROSTER */}
      {activeTab === "ratings" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Caregiver ID / Name</TableHead>
                <TableHead className="font-bold text-xs">Role</TableHead>
                <TableHead className="font-bold text-xs">Avg Rating</TableHead>
                <TableHead className="font-bold text-xs">5-Star Ratio</TableHead>
                <TableHead className="font-bold text-xs">Punctuality Rate</TableHead>
                <TableHead className="font-bold text-xs text-center">Quality Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((r) => (
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
                      <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" /> {r.averageRating.toFixed(1)} ({r.totalReviewsCount} reviews)
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-foreground">
                    {r.fiveStarPercentage}%
                  </TableCell>

                  <TableCell className="text-xs font-medium text-foreground">
                    {r.punctualityRate}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={r.qualityStatus === "Excellent" ? "default" : "outline"}
                      className={`text-[10px] font-bold ${
                        r.qualityStatus === "Needs Improvement" ? "border-amber-500 text-amber-600" : ""
                      }`}
                    >
                      {r.qualityStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 3: PATIENT COMPLAINTS */}
      {activeTab === "complaints" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Complaint ID / Date</TableHead>
                <TableHead className="font-bold text-xs">Patient</TableHead>
                <TableHead className="font-bold text-xs">Caregiver</TableHead>
                <TableHead className="font-bold text-xs">Category</TableHead>
                <TableHead className="font-bold text-xs text-center">Severity</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs font-mono">
                    <span className="font-bold text-foreground">{c.id}</span>
                    <span className="text-[10px] text-muted-foreground block">{c.loggedDate}</span>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-foreground">{c.patientName}</TableCell>

                  <TableCell className="text-xs font-medium text-foreground">{c.caregiverName}</TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="outline" className="text-[10px]">{c.issueCategory}</Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant={c.severity === "High" ? "destructive" : "secondary"} className="text-[10px]">
                      {c.severity}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={c.status === "Resolved" ? "default" : "outline"}
                      className={`text-[10px] ${c.status === "Investigating" ? "border-amber-500 text-amber-600" : ""}`}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal("complaint", c)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                      <span>Investigate</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TAB 4: QUALITY COMPLIANCE ALERTS */}
      {activeTab === "alerts" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Alert ID / Time</TableHead>
                <TableHead className="font-bold text-xs">Caregiver</TableHead>
                <TableHead className="font-bold text-xs">Compliance Alert Type</TableHead>
                <TableHead className="font-bold text-xs">Audit Description</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="text-xs font-mono">
                    <span className="font-bold text-foreground">{a.id}</span>
                    <span className="text-[10px] text-muted-foreground block">{a.timestamp}</span>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-foreground">{a.caregiverName}</TableCell>

                  <TableCell className="text-xs">
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50 text-[10px]">
                      {a.alertType}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs max-w-[260px]">
                    <p className="truncate text-muted-foreground">{a.description}</p>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant={a.status === "Active" ? "destructive" : "outline"} className="text-[10px]">
                      {a.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenModal("alert", a)}
                      className="h-8 text-xs gap-1 border-slate-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                      <span>Review Alert</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <QualityItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedModalType}
        data={selectedModalData}
        onResolve={handleResolveItem}
      />
    </div>
  );
}
