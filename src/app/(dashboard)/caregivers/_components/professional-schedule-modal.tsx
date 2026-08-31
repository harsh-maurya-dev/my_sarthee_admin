"use client";

import { useState, useMemo } from "react";
import { CareProfessional } from "@/lib/admin-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  User,
  Sparkles,
  ArrowRight,
  Download,
  Activity,
  HeartPulse,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ScheduleSlot {
  id: string;
  timeRange: string;
  patientId: string;
  patientName: string;
  careType: string;
  locationArea: string;
  bookingCode: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Available";
  notes?: string;
}

interface ProfessionalScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: CareProfessional | null;
}

export function ProfessionalScheduleModal({
  isOpen,
  onClose,
  professional,
}: ProfessionalScheduleModalProps) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate 7 days starting today
  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        dateStr: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isToday: i === 0,
      };
    });
  }, []);

  const activeDate = weekDays[selectedDateIndex] || weekDays[0];

  // Mock schedule slots for the professional based on selected date
  const scheduleSlots: ScheduleSlot[] = useMemo(() => {
    if (!professional) return [];

    if (selectedDateIndex === 0) {
      // Today's schedule
      return [
        {
          id: "slot-1",
          timeRange: "08:00 AM - 10:00 AM",
          patientId: "MS-1024",
          patientName: "Dr. Arvind Kulkarni",
          careType: professional.type === "Nurse" ? "Clinical Nursing" : professional.type === "Physiotherapist" ? "Neuro-Rehab" : "Elderly Care",
          locationArea: "Juhu",
          bookingCode: "BK-2045",
          status: "Completed",
          notes: "Morning vitals taken (BP 128/84, SpO2 97%). Mobility routine completed.",
        },
        {
          id: "slot-2",
          timeRange: "11:00 AM - 01:00 PM",
          patientId: "MS-1104",
          patientName: "Meera Krishnan",
          careType: professional.type === "Nurse" ? "Sterile Wound Dressing" : professional.type === "Physiotherapist" ? "Gait Training" : "Hygiene & Feeding",
          locationArea: "Andheri West",
          bookingCode: "BK-2120",
          status: "In Progress",
          notes: "Active home visit in progress. Geo-fence verified check-in at 11:02 AM.",
        },
        {
          id: "slot-3",
          timeRange: "02:00 PM - 03:00 PM",
          patientId: "—",
          patientName: "Buffer & Travel Window",
          careType: "Transit Between Areas",
          locationArea: "Andheri -> Powai",
          bookingCode: "TR-AUTO",
          status: "Available",
          notes: "Designated rest, lunch, and transit buffer.",
        },
        {
          id: "slot-4",
          timeRange: "03:30 PM - 05:30 PM",
          patientId: "MS-1088",
          patientName: "Shalini Singhania",
          careType: professional.type === "Nurse" ? "IV Infusion & Vitals" : professional.type === "Physiotherapist" ? "TENS Therapy & ROM" : "Mobility & Companionship",
          locationArea: "Powai",
          bookingCode: "BK-2110",
          status: "Upcoming",
          notes: "Evening shift scheduled. Family confirmed attendance.",
        },
      ];
    } else if (selectedDateIndex === 1) {
      // Tomorrow's schedule
      return [
        {
          id: "slot-5",
          timeRange: "09:00 AM - 01:00 PM",
          patientId: "MS-1042",
          patientName: "Kamala Mehta",
          careType: professional.type === "Nurse" ? "Post-Op Nursing" : "Dementia Care Assistance",
          locationArea: "Bandra",
          bookingCode: "BK-2090",
          status: "Upcoming",
          notes: "4-Hour dedicated shift mapped.",
        },
        {
          id: "slot-6",
          timeRange: "03:00 PM - 06:00 PM",
          patientId: "MS-1070",
          patientName: "Ratan Tata",
          careType: "Personal Care & Mobility",
          locationArea: "Colaba",
          bookingCode: "BK-1980",
          status: "Upcoming",
          notes: "Confirmed by Care Coordinator.",
        },
      ];
    } else {
      // Future dates
      return [
        {
          id: "slot-7",
          timeRange: "09:00 AM - 01:00 PM",
          patientId: "MS-1104",
          patientName: "Meera Krishnan",
          careType: "Routine Care Shift",
          locationArea: "Andheri",
          bookingCode: "BK-2120",
          status: "Upcoming",
          notes: "Recurring package visit.",
        },
        {
          id: "slot-8",
          timeRange: "02:00 PM - 06:00 PM",
          patientId: "—",
          patientName: "Open Slot / On Call",
          careType: "Available For Booking",
          locationArea: professional.area,
          bookingCode: "OPEN-SLOT",
          status: "Available",
          notes: "Available for new patient assignment in Smart Matcher.",
        },
      ];
    }
  }, [professional, selectedDateIndex]);

  if (!professional) return null;

  const getSlotBadge = (status: ScheduleSlot["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">✓ Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-[#01265D] text-white font-bold animate-pulse text-[10px]">❤️ In Progress</Badge>;
      case "Upcoming":
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px]">Upcoming</Badge>;
      case "Available":
        return <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed">Open Slot</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
              Full Date Schedule & Roster
            </DialogTitle>
            <Badge className="bg-[#01265D] text-white text-[10px] font-bold">
              {professional.type}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Complete date-wise shift timeline, travel buffers, and patient appointments for {professional.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Professional Header Mini-Card */}
          <div className="rounded-2xl border bg-slate-50/70 dark:bg-slate-900/50 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                {professional.name}
                <span className="text-xs font-normal text-muted-foreground">({professional.qualification})</span>
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> {professional.phone}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> Base: {professional.area}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  swiftAlert.success({
                    title: "Schedule Exported",
                    description: `Downloaded full week schedule for ${professional.name}.`,
                  })
                }
                className="h-8 text-xs gap-1.5 border-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>

          {/* Date Selector Strip (Mon to Sun) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-foreground block">Select Date Schedule:</span>
            <div className="grid grid-cols-7 gap-1.5">
              {weekDays.map((w, idx) => {
                const isSelected = selectedDateIndex === idx;
                return (
                  <button
                    key={w.dateStr}
                    type="button"
                    onClick={() => setSelectedDateIndex(idx)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#01265D] text-white border-[#01265D] shadow-xs scale-102"
                        : "bg-card hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-foreground"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${isSelected ? "text-[#01265D]" : "text-muted-foreground"}`}>
                      {w.dayName}
                    </span>
                    <span className="text-xs font-extrabold mt-0.5">
                      {w.displayDate.split(" ")[1]}
                    </span>
                    {w.isToday && (
                      <span className={`text-[8px] font-bold mt-0.5 px-1 rounded-full ${isSelected ? "bg-white text-[#01265D] dark:text-blue-300" : "bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 dark:bg-blue-950 dark:text-blue-300"}`}>
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Summary Header */}
          <div className="flex items-center justify-between bg-blue-50/60 dark:bg-blue-950/30 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              <span className="text-xs font-bold text-[#01265D] dark:text-blue-300">
                Schedule for {activeDate.dayName}, {activeDate.displayDate}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#01265D] dark:text-blue-300">
              {scheduleSlots.filter((s) => s.status !== "Available").length} Assigned Visits
            </span>
          </div>

          {/* Schedule Timeline Slot List */}
          <div className="space-y-2.5">
            {scheduleSlots.map((slot) => (
              <div
                key={slot.id}
                className={`rounded-2xl border p-3.5 transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${
                  slot.status === "In Progress"
                    ? "bg-blue-50 dark:bg-blue-950/40/30 border-blue-300 dark:border-blue-800 dark:bg-blue-950/20 dark:border-blue-800 shadow-xs"
                    : slot.status === "Completed"
                    ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                    : slot.status === "Available"
                    ? "bg-slate-50/30 dark:bg-slate-900/20 border-dashed border-slate-300 dark:border-slate-700"
                    : "bg-card border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Time & Indicator */}
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground font-mono">{slot.timeRange}</span>
                      {getSlotBadge(slot.status)}
                    </div>

                    <h4 className="font-bold text-xs text-foreground">
                      {slot.patientName} {slot.patientId !== "—" && <span className="font-normal text-muted-foreground">({slot.patientId})</span>}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{slot.careType}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5 text-[#01265D] dark:text-blue-400" /> {slot.locationArea}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono">{slot.bookingCode}</span>
                    </div>

                    {slot.notes && (
                      <p className="text-[11px] text-muted-foreground bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800 mt-1">
                        {slot.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Quick Status Action */}
                <div className="flex items-center sm:self-center gap-1.5 shrink-0">
                  {slot.status === "In Progress" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        swiftAlert.info({
                          title: "Live GPS Telemetry",
                          description: `${professional.name} checked in at ${slot.patientName}'s residence in ${slot.locationArea}.`,
                        })
                      }
                      className="h-7 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-bold gap-1 shadow-xs"
                    >
                      <Activity className="h-3 w-3" />
                      Live Feed
                    </Button>
                  )}
                  {slot.status === "Available" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        swiftAlert.info({
                          title: "Assign Booking to Slot",
                          description: `Opening Smart Matcher for ${activeDate.displayDate} (${slot.timeRange}).`,
                        })
                      }
                      className="h-7 text-xs font-semibold border-blue-300 dark:border-blue-800 text-[#01265D] dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      + Assign Booking
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-3 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              swiftAlert.info({
                title: "Roster Synced",
                description: `Updated mobile calendar schedule for ${professional.name}.`,
              })
            }
            className="h-8 text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
            Sync Mobile Calendar
          </Button>

          <Button type="button" size="sm" onClick={onClose} className="h-8 text-xs">
            Close Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
