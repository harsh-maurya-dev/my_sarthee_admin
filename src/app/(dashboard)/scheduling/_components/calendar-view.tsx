"use client";

import { useState } from "react";
import { VisitSchedule } from "../_data/schedules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, RefreshCw } from "lucide-react";

interface CalendarViewProps {
  schedules: VisitSchedule[];
  onSelectSchedule: (schedule: VisitSchedule) => void;
  onRequestReplacement: (schedule: VisitSchedule) => void;
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarView({
  schedules,
  onSelectSchedule,
  onRequestReplacement,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date("2026-08-01"));

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const formattedDateString = currentDate.toISOString().split("T")[0];

  const todaysSchedules = schedules.filter((s) => s.date === formattedDateString);

  return (
    <div className="space-y-4">
      {/* Calendar Date Navigator */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
          <div>
            <h3 className="font-bold text-sm text-foreground">
              {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </h3>
            <p className="text-xs text-muted-foreground">
              {todaysSchedules.length} shifts scheduled for this date
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevDay} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date("2026-08-01"))}
            className="h-8 text-xs font-semibold px-2.5"
          >
            Today
          </Button>

          <Button variant="outline" size="sm" onClick={handleNextDay} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Daily Shift Timeline Grid */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Shift Dispatch Timeline ({formattedDateString})
        </h4>

        {todaysSchedules.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground border rounded-xl border-dashed">
            No caregiver shifts scheduled on {formattedDateString}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todaysSchedules.map((s) => {
              const isReplacementNeeded = s.status === "Replacement Required";

              return (
                <div
                  key={s.id}
                  className={`rounded-xl border p-4 transition-all space-y-3 ${
                    isReplacementNeeded
                      ? "border-rose-300 bg-rose-50/40 dark:bg-rose-950/30"
                      : "bg-slate-50/70 dark:bg-slate-900/50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{s.patientName}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {s.repeatFrequency}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" /> {s.patientAddress}
                      </p>
                    </div>

                    <Badge
                      variant={
                        s.status === "Completed"
                          ? "default"
                          : s.status === "In-Progress"
                          ? "secondary"
                          : s.status === "Replacement Required"
                          ? "destructive"
                          : "outline"
                      }
                      className="text-[10px] font-bold"
                    >
                      {s.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-medium text-foreground">{s.startTime} - {s.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-semibold text-foreground">{s.caregiverName}</span>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="flex flex-wrap gap-1 border-t pt-2">
                    {s.tasks.map((task, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] bg-card">
                        {task}
                      </Badge>
                    ))}
                  </div>

                  {/* Action */}
                  {isReplacementNeeded && (
                    <Button
                      size="sm"
                      onClick={() => onRequestReplacement(s)}
                      className="w-full h-8 text-xs bg-rose-600 text-white hover:bg-rose-700 font-bold gap-1 mt-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Assign Replacement Caregiver
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
