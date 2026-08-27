"use client";

import { useState } from "react";
import {
  initialBookings,
  initialCareProfessionals,
  BookingItem,
  CareProfessional,
} from "@/lib/admin-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  Search,
  Filter,
  Check,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function SmartAssignmentEnginePage() {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem>(bookings[0]);
  const [professionals, setProfessionals] = useState<CareProfessional[]>(initialCareProfessionals);

  // Available professionals ranked for smart matching
  const matchingCandidates = professionals
    .filter((p) => p.status === "Available" || p.status === "Care Completed")
    .map((p) => {
      let score = 80;
      const reasons: string[] = [];

      if (p.area === selectedBooking.locationArea) {
        score += 15;
        reasons.push(`Area Match (${p.area})`);
      } else {
        reasons.push(`Nearby (${p.area} - 4.2 km)`);
      }

      if (
        (selectedBooking.careType === "Nursing" && p.type === "Nurse") ||
        (selectedBooking.careType === "Personal Care" && p.type === "Caregiver") ||
        (selectedBooking.careType === "Physiotherapy" && p.type === "Physiotherapist") ||
        selectedBooking.careType === "Combination"
      ) {
        score += 10;
        reasons.push(`Skill & Role Perfect Match (${p.type})`);
      }

      if (p.rating >= 4.8) {
        score += 5;
        reasons.push(`High Satisfaction Rating (★ ${p.rating})`);
      }

      const finalScore = Math.min(score, 99);
      return {
        ...p,
        matchScore: finalScore,
        matchReasons: reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const handleAssignProfessional = (pro: typeof matchingCandidates[0]) => {
    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: "Upcoming",
              assignedProfessional: {
                name: pro.name,
                type: pro.type,
                phone: pro.phone,
              },
            }
          : b
      )
    );

    // Update professional status to Assigned
    setProfessionals((prev) =>
      prev.map((p) => (p.id === pro.id ? { ...p, status: "Assigned" } : p))
    );

    swiftAlert.success({
      title: "Smart Allocation Confirmed!",
      description: `${pro.name} (${pro.type}) successfully allocated to ${selectedBooking.patientName} (${selectedBooking.bookingCode}). WhatsApp dispatch notification sent.`,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Smart Allocation Engine
            </h1>
            <Badge className="bg-[#01265D] text-white font-semibold text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> AI Proximity & Skill Allocator
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recommends best available Nurses, Caregivers, and Physios matching patient area, clinical needs, and rating.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Bookings Queue, Right Match Recommendations */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Bookings Awaiting Allocation */}
        <div className="lg:col-span-5 rounded-2xl border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-foreground">Open Bookings Queue</h2>
              <p className="text-[11px] text-muted-foreground">Select a booking to run smart matching</p>
            </div>
            <Badge variant="outline" className="text-xs font-bold text-amber-700 bg-amber-50 border-amber-300">
              {bookings.filter((b) => b.status === "Pending Assignment" || b.status === "New").length} Awaiting
            </Badge>
          </div>

          <div className="space-y-3">
            {bookings.map((booking) => {
              const isSelected = selectedBooking.id === booking.id;
              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-[#01265D] bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-[#01265D] shadow-sm"
                      : "border-slate-200/80 bg-slate-50/40 hover:bg-slate-100/60 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground font-mono">
                      {booking.bookingCode}
                    </span>
                    <Badge
                      className={`text-[10px] font-bold ${
                        booking.status === "Pending Assignment"
                          ? "bg-amber-100 text-amber-800"
                          : booking.status === "New"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-xs font-bold text-foreground">{booking.patientName}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {booking.ageGender} · Care: <strong className="text-foreground">{booking.careType}</strong>
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> {booking.locationArea}
                    </span>
                    <span>Starts: {booking.startDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smart Matching Recommendations for Selected Booking */}
        <div className="lg:col-span-7 rounded-2xl border bg-card p-5.5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-foreground">
                  Smart Allocation Recommendations for {selectedBooking.patientName}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target: {selectedBooking.careType} · Location: {selectedBooking.locationArea} · Start Date: {selectedBooking.startDate}
              </p>
            </div>
            <Badge className="bg-[#01265D] text-white text-xs font-mono">
              Booking {selectedBooking.bookingCode}
            </Badge>
          </div>

          {/* Candidates List */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Top Ranked Available Professionals ({matchingCandidates.length})
            </h3>

            {matchingCandidates.map((pro, index) => (
              <div
                key={pro.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 p-4 space-y-3 transition-all hover:border-[#01265D]/50 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 bg-blue-100 text-[#01265D] font-bold border-2 border-[#01265D]">
                      <AvatarFallback>{pro.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-foreground">{pro.name}</h4>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {pro.type}
                        </Badge>
                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                          {pro.matchScore}% Match Score
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#01265D] dark:text-blue-400" /> {pro.area}
                        </span>
                        <span>·</span>
                        <span>★ {pro.rating} ({pro.totalVisitsCompleted} visits)</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-[#01265D] hover:bg-[#0a3375] text-white text-xs font-bold shrink-0 gap-1"
                    onClick={() => handleAssignProfessional(pro)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Allocate & Dispatch
                  </Button>
                </div>

                {/* Match Reasons Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {pro.matchReasons.map((reason, rid) => (
                    <span
                      key={rid}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#01265D] border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900"
                    >
                      ✓ {reason}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    Languages: {pro.languages.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
