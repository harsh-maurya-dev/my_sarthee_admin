export type TimelineCategory =
  | "booking_confirmation"
  | "replacement_request"
  | "reschedule_request"
  | "caregiver_profile_approval"
  | "leave_request"
  | "refund_processing_time";

export interface EstimatedTimelineItem {
  id: string;
  title: string;
  category: TimelineCategory;
  hours: number;
  minutes: number;
  updatedAt: string;
}

export const initialEstimatedTimelines: EstimatedTimelineItem[] = [
  {
    id: "etl-001",
    title: "Booking confirmation",
    category: "booking_confirmation",
    hours: 0,
    minutes: 30,
    updatedAt: "2026-08-24 16:45",
  },
  {
    id: "etl-002",
    title: "Replacement request",
    category: "replacement_request",
    hours: 2,
    minutes: 0,
    updatedAt: "2026-08-24 14:15",
  },
  {
    id: "etl-003",
    title: "Reschedule request",
    category: "reschedule_request",
    hours: 1,
    minutes: 0,
    updatedAt: "2026-08-24 15:30",
  },
  {
    id: "etl-004",
    title: "Caregiver profile approval",
    category: "caregiver_profile_approval",
    hours: 24,
    minutes: 0,
    updatedAt: "2026-08-24 11:20",
  },
  {
    id: "etl-005",
    title: "Leave request",
    category: "leave_request",
    hours: 4,
    minutes: 0,
    updatedAt: "2026-08-24 09:40",
  },
  {
    id: "etl-006",
    title: "Refund processing time",
    category: "refund_processing_time",
    hours: 48,
    minutes: 0,
    updatedAt: "2026-08-24 12:00",
  },
];

export function formatHHMM(hours: number, minutes: number): string {
  const paddedH = String(hours).padStart(2, "0");
  const paddedM = String(minutes).padStart(2, "0");
  return `${paddedH}:${paddedM}`;
}

export function formatDurationDisplay(hours: number, minutes: number): string {
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes}m`);
  }
  return parts.join(" ");
}
