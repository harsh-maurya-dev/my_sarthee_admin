"use client";

import { useState, useMemo } from "react";
import {
  EstimatedTimelineItem,
  initialEstimatedTimelines,
  formatHHMM,
  formatDurationDisplay,
} from "./_data/timeline-data";
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
  Timer,
  Clock,
  Search,
  Edit2,
  Save,
  X,
  CalendarCheck,
  RotateCcw,
  CalendarClock,
  UserCheck2,
  FileCheck2,
  CreditCard,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function EstimatedTimelinesPage() {
  const [timelines, setTimelines] = useState<EstimatedTimelineItem[]>(
    initialEstimatedTimelines
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Inline editing state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inlineHours, setInlineHours] = useState<number>(0);
  const [inlineMinutes, setInlineMinutes] = useState<number>(0);

  // Filtered Timelines
  const filteredTimelines = useMemo(() => {
    return timelines.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.updatedAt.toLowerCase().includes(q)
      );
    });
  }, [timelines, searchQuery]);

  // Handle start inline editing
  const handleStartInlineEdit = (item: EstimatedTimelineItem) => {
    setEditingRowId(item.id);
    setInlineHours(item.hours);
    setInlineMinutes(item.minutes);
  };

  // Handle cancel inline editing
  const handleCancelInlineEdit = () => {
    setEditingRowId(null);
  };

  // Handle save inline editing
  const handleSaveInlineEdit = (itemId: string) => {
    if (inlineHours === 0 && inlineMinutes === 0) {
      swiftAlert.warning({
        title: "Invalid Duration",
        description: "Timeline duration must be at least 1 minute.",
      });
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setTimelines((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            hours: Number(inlineHours) || 0,
            minutes: Number(inlineMinutes) || 0,
            updatedAt: formattedDate,
          };
        }
        return item;
      })
    );

    setEditingRowId(null);

    swiftAlert.success({
      title: "Estimated Timeline Saved",
      description: `Time updated to ${formatHHMM(inlineHours, inlineMinutes)} (${formatDurationDisplay(inlineHours, inlineMinutes)})`,
    });
  };

  // Get Icon for each title
  const getOptionIcon = (category: string) => {
    switch (category) {
      case "booking_confirmation":
        return <CalendarCheck className="h-4 w-4 text-[#01265D] dark:text-blue-400" />;
      case "replacement_request":
        return <RotateCcw className="h-4 w-4 text-rose-600" />;
      case "reschedule_request":
        return <CalendarClock className="h-4 w-4 text-amber-600" />;
      case "caregiver_profile_approval":
        return <UserCheck2 className="h-4 w-4 text-indigo-600" />;
      case "leave_request":
        return <FileCheck2 className="h-4 w-4 text-blue-600" />;
      case "refund_processing_time":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      default:
        return <Timer className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#01265D]/10 text-[#01265D] dark:text-blue-400 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 dark:border-blue-900/50">
              <Timer className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  Estimated Timeline
                </h1>
                <Badge className="bg-[#01265D] text-white font-bold text-[11px] px-2 py-0.5">
                  SLA Config
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage estimated completion time in hours and minutes for key operational workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {/* <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search timeline title..."
          className="pl-9 text-xs h-9 bg-card"
        />
      </div> */}

      {/* Main Listing Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="w-[340px] text-xs font-bold text-foreground">
                  Title
                </TableHead>
                <TableHead className="w-[200px] text-xs font-bold text-foreground">
                  Updated At
                </TableHead>
                <TableHead className="w-[240px] text-xs font-bold text-foreground">
                  Time (HH : MM)
                </TableHead>
                <TableHead className="text-right text-xs font-bold text-foreground w-[160px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimelines.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-muted-foreground text-xs"
                  >
                    No estimated timelines found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTimelines.map((item) => {
                  const isEditingThisRow = editingRowId === item.id;

                  return (
                    <TableRow
                      key={item.id}
                      className={`transition-colors ${
                        isEditingThisRow
                          ? "bg-blue-50 dark:bg-blue-950/40/40 dark:bg-blue-950/30"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-900/50"
                      }`}
                    >
                      {/* Column 1: Title */}
                      <TableCell className="align-middle py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border shrink-0">
                            {getOptionIcon(item.category)}
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {item.title}
                          </span>
                        </div>
                      </TableCell>

                      {/* Column 2: Updated At */}
                      <TableCell className="align-middle py-4">
                        <span className="text-xs font-mono font-medium text-muted-foreground">
                          {item.updatedAt}
                        </span>
                      </TableCell>

                      {/* Column 3: Time in HH:MM */}
                      <TableCell className="align-middle py-4">
                        {isEditingThisRow ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 bg-card border rounded-lg p-1 shadow-inner">
                              <div className="flex items-center">
                                <Input
                                  type="number"
                                  min={0}
                                  max={720}
                                  value={inlineHours}
                                  onChange={(e) =>
                                    setInlineHours(
                                      Math.max(0, parseInt(e.target.value) || 0)
                                    )
                                  }
                                  className="w-14 h-7 text-xs font-bold font-mono text-center px-1 border-0 focus-visible:ring-1"
                                  placeholder="HH"
                                  autoFocus
                                />
                                <span className="text-[10px] font-bold text-muted-foreground mr-1">
                                  h
                                </span>
                              </div>
                              <span className="text-xs font-bold text-muted-foreground">:</span>
                              <div className="flex items-center">
                                <Input
                                  type="number"
                                  min={0}
                                  max={59}
                                  value={inlineMinutes}
                                  onChange={(e) =>
                                    setInlineMinutes(
                                      Math.min(
                                        59,
                                        Math.max(0, parseInt(e.target.value) || 0)
                                      )
                                    )
                                  }
                                  className="w-14 h-7 text-xs font-bold font-mono text-center px-1 border-0 focus-visible:ring-1"
                                  placeholder="MM"
                                />
                                <span className="text-[10px] font-bold text-muted-foreground mr-1">
                                  m
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border">
                              <Clock className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
                              <span className="text-xs font-mono font-bold text-foreground">
                                {formatHHMM(item.hours, item.minutes)}
                              </span>
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">
                              ({formatDurationDisplay(item.hours, item.minutes)})
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Column 4: Action Buttons with Edit and Save */}
                      <TableCell className="text-right align-middle py-4">
                        {isEditingThisRow ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleSaveInlineEdit(item.id)}
                              className="h-8 px-3 text-xs font-bold bg-[#01265D] hover:bg-[#0a3375] text-white shadow-xs"
                            >
                              <Save className="h-3.5 w-3.5 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelInlineEdit}
                              className="h-8 px-2.5 text-xs text-muted-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartInlineEdit(item)}
                              className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#01265D] dark:text-blue-400 hover:border-blue-300 dark:border-blue-800"
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1 text-[#01265D] dark:text-blue-400" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
