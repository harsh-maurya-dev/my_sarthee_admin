"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { swiftAlert } from "@/lib/swift-alert";

export type FilterPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

interface DashboardFiltersProps {
  onFilterChange?: (period: FilterPeriod, startDate?: string, endDate?: string) => void;
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>("monthly");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-30");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handlePeriodSelect = (period: FilterPeriod) => {
    setSelectedPeriod(period);
    if (period === "custom") {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      if (onFilterChange) onFilterChange(period);
      swiftAlert.info({
        title: "Filter Applied",
        description: `Dashboard metrics updated for ${period} telemetry.`,
      });
    }
  };

  const handleApplyCustomRange = () => {
    if (!startDate || !endDate) {
      swiftAlert.warning({
        title: "Invalid Range",
        description: "Please select both Start Date and End Date.",
      });
      return;
    }
    if (onFilterChange) onFilterChange("custom", startDate, endDate);
    swiftAlert.success({
      title: "Date Range Filter Applied",
      description: `Filtering telemetry from ${startDate} to ${endDate}`,
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card p-3 rounded-2xl border shadow-xs">
      {/* Frequency Toggle Pills */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodSelect(period)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              selectedPeriod === period
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {period}
          </button>
        ))}
        <button
          onClick={() => handlePeriodSelect("custom")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
            selectedPeriod === "custom"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Date Range
        </button>
      </div>

      {/* Date Range Picker Controls */}
      {showCustomRange || selectedPeriod === "custom" ? (
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium">From:</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 text-xs w-36 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium">To:</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 text-xs w-36 rounded-lg"
            />
          </div>
          <Button
            size="sm"
            onClick={handleApplyCustomRange}
            className="h-8 px-3 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Apply
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <CalendarIcon className="h-4 w-4 text-teal-600" />
          <span>Active Period: {selectedPeriod.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}
