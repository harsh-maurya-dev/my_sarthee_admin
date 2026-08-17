"use client";

import { useState } from "react";
import {
  Patient360,
  DailyVisitActivity,
  PatientInvoice,
  CommunicationTouchpoint,
  CareTeamMember,
} from "@/lib/admin-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Stethoscope,
  ClipboardList,
  History,
  FileCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  Send,
  FileText,
  Building,
  Check,
  Flame,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface PatientDetailsSheetProps {
  patient: Patient360 | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (updatedPatient: Patient360) => void;
}

export function PatientDetailsSheet({
  patient,
  isOpen,
  onClose,
  onUpdatePatient,
}: PatientDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [newNote, setNewNote] = useState("");
  const [newWhatsAppMsg, setNewWhatsAppMsg] = useState("");

  if (!patient) return null;

  const handleAddAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem = {
      id: `an-${Date.now()}`,
      author: "Admin Coordinator",
      role: "Care Operations",
      date: new Date().toLocaleString(),
      content: newNote,
    };

    const updated: Patient360 = {
      ...patient,
      adminNotes: [noteItem, ...(patient.adminNotes || [])],
    };

    onUpdatePatient(updated);
    setNewNote("");
    swiftAlert.success({
      title: "Admin Note Saved",
      description: "Note recorded in Patient 360 audit timeline.",
    });
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhatsAppMsg.trim()) return;

    const commItem: CommunicationTouchpoint = {
      id: `comm-${Date.now()}`,
      type: "WhatsApp Update",
      channel: "WhatsApp",
      timestamp: "Just now",
      sender: "Coordinator",
      summary: newWhatsAppMsg,
      deliveryStatus: "Delivered",
    };

    const updated: Patient360 = {
      ...patient,
      communicationHistory: [commItem, ...patient.communicationHistory],
    };

    onUpdatePatient(updated);
    setNewWhatsAppMsg("");
    swiftAlert.success({
      title: "WhatsApp Dispatched",
      description: `Message sent to ${patient.primaryContactName} (${patient.primaryContactPhone}).`,
    });
  };

  const getRiskBadge = (risk: Patient360["riskIndicator"]) => {
    switch (risk) {
      case "Critical":
        return <Badge className="bg-rose-600 text-white font-bold animate-pulse">🔴 Critical Risk</Badge>;
      case "High":
        return <Badge className="bg-orange-600 text-white font-bold">🟠 High Risk</Badge>;
      case "Medium":
        return <Badge className="bg-amber-500 text-white font-bold">🟡 Medium Risk</Badge>;
      default:
        return <Badge className="bg-emerald-600 text-white font-bold">🟢 Normal / Low</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-3xl md:max-w-7xl overflow-y-auto p-0 border-l">
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white p-6 sticky top-0 z-20 shadow-md">
          <div className="flex flex-col items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-14 w-14 border-2 border-teal-400 bg-teal-800 text-white text-lg font-bold">
                <AvatarFallback>{patient.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-xl font-black text-white">{patient.fullName}</h2>
                  <Badge className="bg-teal-700 text-teal-100 text-xs font-mono">{patient.patientId}</Badge>
                  {getRiskBadge(patient.riskIndicator)}
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{patient.age} yrs · {patient.gender}</span>
                  <span>·</span>
                  <span>Blood: <strong className="text-white">{patient.bloodGroup}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-teal-400" /> {patient.locationArea}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs px-3 py-1 font-semibold">
                Care: {patient.careRequired}
              </Badge>
              <Badge
                className={`text-xs px-3 py-1 font-semibold ${
                  patient.currentStatus === "Active"
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                {patient.currentStatus}
              </Badge>
            </div>
          </div>

          {patient.riskReason && (
            <div className="mt-3.5 rounded-lg bg-rose-950/80 border border-rose-500/50 p-2.5 text-xs text-rose-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Active Risk Notice:</span> {patient.riskReason}
              </div>
            </div>
          )}
        </div>

        {/* Patient 360 Tabs Navigation */}
        <div className="p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
              <TabsTrigger value="profile" className="text-xs py-2 font-bold">
                Profile
              </TabsTrigger>
              <TabsTrigger value="careplan" className="text-xs py-2 font-bold">
                Care Plan
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs py-2 font-bold">
                Care Team
              </TabsTrigger>
              <TabsTrigger value="journey" className="text-xs py-2 font-bold">
                Care Journey
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs py-2 font-bold">
                Payments
              </TabsTrigger>
              <TabsTrigger value="communication" className="text-xs py-2 font-bold">
                Communication
              </TabsTrigger>
            </TabsList>

            {/* ------------------------------------------------------------- */}
            {/* TAB 1: PATIENT PROFILE */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="profile" className="space-y-5 pt-4">
              <div className="grid gap-4">
                {/* Personal & Family Information */}
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-teal-600" /> Family & Contact Information
                  </h3>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Primary Contact</span>
                      <span className="font-semibold text-foreground">{patient.primaryContactName} ({patient.primaryContactRelation})</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Contact Phone</span>
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3 text-teal-600" /> {patient.primaryContactPhone}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">WhatsApp Sync</span>
                      <span className="font-semibold text-emerald-600">{patient.primaryContactWhatsapp}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Emergency Contact</span>
                      <span className="font-semibold text-rose-600">{patient.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-muted-foreground">Home Address</span>
                      <span className="font-semibold text-foreground text-right max-w-[200px]">{patient.address}</span>
                    </div>
                  </div>
                </div>

                {/* Medical & Recovery Information */}
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-teal-600" /> Medical & Clinical Profile
                  </h3>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Primary Diagnosis</span>
                      <span className="font-bold text-foreground text-right max-w-[220px]">{patient.primaryDiagnosis}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Known Allergies</span>
                      <span className="font-semibold text-rose-600">{patient.allergies.join(", ") || "None reported"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Mobility Level</span>
                      <Badge variant="outline" className="font-bold">{patient.mobilityLevel}</Badge>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Treating Doctor</span>
                      <span className="font-semibold text-foreground">{patient.doctorName} ({patient.doctorHospital})</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-muted-foreground">Referral Channel</span>
                      <Badge className="bg-teal-100 text-teal-800 text-[10px]">{patient.referralSource} ({patient.referralPartnerName || "Direct"})</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              <div className="rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-teal-600" /> Treating Physician Clinical Orders
                </h4>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &quot;{patient.doctorNotes}&quot;
                </p>
              </div>
            </TabsContent>

            {/* ------------------------------------------------------------- */}
            {/* TAB 2: CARE PLAN */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="careplan" className="space-y-4 pt-4">
              <div className="rounded-xl border bg-card p-4.5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground">Care Plan Specification</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Recovery-led structured clinical regime</p>
                  </div>
                  <Badge className="bg-teal-600 text-white font-bold">{patient.carePlan.careType}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2.5 border">
                    <span className="text-muted-foreground text-[10px] block uppercase font-bold">Care Type</span>
                    <span className="font-bold text-foreground">{patient.carePlan.careType}</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2.5 border">
                    <span className="text-muted-foreground text-[10px] block uppercase font-bold">Frequency</span>
                    <span className="font-bold text-foreground">{patient.carePlan.frequency}</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2.5 border">
                    <span className="text-muted-foreground text-[10px] block uppercase font-bold">Duration</span>
                    <span className="font-bold text-foreground">{patient.carePlan.duration}</span>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-2.5 border">
                    <span className="text-muted-foreground text-[10px] block uppercase font-bold">Schedule Dates</span>
                    <span className="font-bold text-foreground">{patient.carePlan.startDate} to {patient.carePlan.endDate}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-foreground">Clinical Recovery Goals:</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-lg border border-teal-200 dark:border-teal-900">
                    {patient.carePlan.goals}
                  </p>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground">Special Requirements & Protocols:</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {patient.carePlan.specialRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded border">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities Progress Tracker */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-foreground">Activities & Recovery Milestones Tracker:</h4>
                  <div className="space-y-2">
                    {patient.carePlan.activitiesProgress.map((act, i) => {
                      const pct = Math.round((act.completed / act.total) * 100);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{act.activity} ({act.target})</span>
                            <span className="font-bold text-teal-700 dark:text-teal-400">{act.completed}/{act.total} {act.unit} ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: ASSIGNED CARE TEAM */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="team" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-foreground">Assigned Multidisciplinary Care Team</h3>
                <Button size="sm" variant="outline" className="h-7 text-xs font-semibold">
                  + Reassign / Add Member
                </Button>
              </div>

              <div className="grid gap-3 grid-cols-1">
                {patient.assignedTeam.map((member) => (
                  <div key={member.id} className="rounded-xl border bg-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-teal-100 text-teal-800 font-bold">
                        <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-foreground">{member.name}</h4>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-teal-600" /> {member.phone} · ★ {member.rating}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold ${
                        member.status === "Care Started" || member.status === "En route"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ------------------------------------------------------------- */}
            {/* TAB 4: CARE JOURNEY (BOOKING -> ASSIGNMENT -> VISITS -> COMPLETION) */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="journey" className="space-y-4 pt-4">
              <div className="rounded-xl border bg-card p-4.5 space-y-4">
                <h3 className="text-sm font-extrabold text-foreground">Care Journey Progression Timeline</h3>

                {/* Stepper */}
                <div className="flex items-center justify-between text-xs font-bold border-b pb-4">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> 1. Booking
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> 2. Assignment
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> 3. Care Started
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-600 font-extrabold">
                    <Activity className="h-4 w-4 animate-pulse" /> 4. Daily Visits (Active)
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" /> 5. Completion
                  </div>
                </div>

                {/* Daily Visits Log */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-foreground">Recorded Shift Visits & Observations:</h4>
                  {patient.dailyVisits.map((vis) => (
                    <div key={vis.id} className="rounded-lg border bg-slate-50/50 dark:bg-slate-900/40 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{vis.date} · {vis.caregiverName} ({vis.caregiverRole})</span>
                          {vis.discomfortReported && (
                            <Badge className="bg-rose-600 text-white text-[10px]">⚠️ Discomfort Alert</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">Check-in: {vis.checkInTime}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-background p-2 rounded border">
                        <div><span className="text-muted-foreground">BP:</span> <strong>{vis.vitals.bp}</strong></div>
                        <div><span className="text-muted-foreground">SpO2:</span> <strong>{vis.vitals.spo2}</strong></div>
                        <div><span className="text-muted-foreground">Pulse:</span> <strong>{vis.vitals.pulse}</strong></div>
                        <div><span className="text-muted-foreground">Sugar:</span> <strong>{vis.vitals.sugar || "N/A"}</strong></div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {vis.tasksCompleted.map((task, tid) => (
                          <div key={tid} className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-emerald-600" /> {task}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ------------------------------------------------------------- */}
            {/* TAB 5: PAYMENTS & BILLING */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="payments" className="space-y-4 pt-4">
              <div className="rounded-xl border bg-card p-4.5 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-foreground">Invoices & Billing Ledger</h3>
                    <p className="text-xs text-muted-foreground">Booking value, tax, and outstanding balances</p>
                  </div>
                  <Button size="sm" className="h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white">
                    Generate New Invoice
                  </Button>
                </div>

                {patient.invoices.map((inv) => (
                  <div key={inv.id} className="rounded-lg border bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-foreground font-mono">{inv.id}</span>
                        <span className="text-xs text-muted-foreground ml-2">Booking: {inv.bookingId} ({inv.date})</span>
                      </div>
                      <Badge
                        className={
                          inv.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </div>

                    {/* Breakdown: Booking Value -> Discount -> Tax -> Amount Paid -> Balance */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs bg-background p-3 rounded-lg border">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Booking Value</span>
                        <span className="font-bold text-foreground">₹{inv.bookingValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Discount</span>
                        <span className="font-bold text-emerald-600">- ₹{inv.discount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Tax (GST 18%)</span>
                        <span className="font-bold text-foreground">+ ₹{inv.tax.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Amount Paid</span>
                        <span className="font-bold text-emerald-700">₹{inv.amountPaid.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Outstanding Balance</span>
                        <span className="font-black text-rose-600">₹{inv.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ------------------------------------------------------------- */}
            {/* TAB 6: COMMUNICATION & ADMIN NOTES */}
            {/* ------------------------------------------------------------- */}
            <TabsContent value="communication" className="space-y-4 pt-4">
              {/* Quick WhatsApp Dispatcher */}
              <form onSubmit={handleSendWhatsApp} className="rounded-xl border bg-card p-4 space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-emerald-600" /> Send Instant WhatsApp to Family ({patient.primaryContactPhone})
                </h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type update message to patient family..."
                    value={newWhatsAppMsg}
                    onChange={(e) => setNewWhatsAppMsg(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0">
                    Send WhatsApp
                  </Button>
                </div>
              </form>

              {/* Touchpoints Log */}
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                  Communication Touchpoints History
                </h4>
                <div className="space-y-2">
                  {patient.communicationHistory.map((comm) => (
                    <div key={comm.id} className="rounded-lg border bg-slate-50 dark:bg-slate-900 p-2.5 text-xs flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {comm.channel}
                          </Badge>
                          <span className="font-bold text-foreground">{comm.type}</span>
                        </div>
                        <p className="text-muted-foreground text-[11px]">{comm.summary}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{comm.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <form onSubmit={handleAddAdminNote} className="rounded-xl border bg-card p-4 space-y-2">
                <h4 className="text-xs font-bold text-foreground">Add Internal Coordinator Note:</h4>
                <Textarea
                  placeholder="Record clinical decisions, coordinator triage, or family requests..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-xs min-h-[60px]"
                />
                <Button size="sm" type="submit" className="text-xs bg-teal-600 hover:bg-teal-700 text-white">
                  Save Note
                </Button>
              </form>

              {patient.adminNotes?.length > 0 && (
                <div className="space-y-2">
                  {patient.adminNotes.map((note) => (
                    <div key={note.id} className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground text-[10px]">
                        <span className="font-bold text-foreground">{note.author} ({note.role})</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-foreground leading-snug">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
