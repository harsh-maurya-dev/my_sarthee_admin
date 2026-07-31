export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: "New Booking" | "Assignment Pending" | "Visit Alert" | "Complaint Alert";
  status: "Unread" | "Read";
  priority: "Normal" | "Urgent" | "Critical";
  timestamp: string; // YYYY-MM-DD HH:mm
  referenceId: string; // e.g. "REQ-9012", "VM-501", "CMP-901"
  actorName?: string;
}

export const initialNotifications: AdminNotification[] = [
  {
    id: "NOTIF-101",
    title: "New Home Care Booking Received",
    message: "Patient Robert Vance created a new booking for Post-Stroke Physical Therapy.",
    category: "New Booking",
    status: "Unread",
    priority: "Normal",
    timestamp: "2026-08-01 08:30 AM",
    referenceId: "REQ-9012",
    actorName: "Robert Vance",
  },
  {
    id: "NOTIF-102",
    title: "Caregiver Assignment Pending",
    message: "Urgent Post-Op Cardiac Nursing request (REQ-9013) is waiting for caregiver allocation.",
    category: "Assignment Pending",
    status: "Unread",
    priority: "Urgent",
    timestamp: "2026-08-01 09:15 AM",
    referenceId: "REQ-9013",
  },
  {
    id: "NOTIF-103",
    title: "Caregiver Geofence Check-in Delayed",
    message: "Elena Rostova has not checked in for Visit VM-503 (04:00 PM shift) at 318 Maple Avenue.",
    category: "Visit Alert",
    status: "Unread",
    priority: "Critical",
    timestamp: "2026-08-01 04:25 PM",
    referenceId: "VM-503",
    actorName: "Elena Rostova",
  },
  {
    id: "NOTIF-104",
    title: "Patient Complaint Logged",
    message: "Patient Arthur Pendelton submitted a late arrival complaint regarding shift VS-803.",
    category: "Complaint Alert",
    status: "Read",
    priority: "Urgent",
    timestamp: "2026-07-31 06:10 PM",
    referenceId: "CMP-901",
    actorName: "Arthur Pendelton",
  },
  {
    id: "NOTIF-105",
    title: "New Service Booking Confirmed",
    message: "Patient Eleanor Vance confirmed booking for Post-Op Cardiac Nursing package.",
    category: "New Booking",
    status: "Read",
    priority: "Normal",
    timestamp: "2026-07-31 02:45 PM",
    referenceId: "REQ-9013",
    actorName: "Eleanor Vance",
  },
];
