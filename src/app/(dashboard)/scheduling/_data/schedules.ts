export interface VisitSchedule {
  id: string;
  bookingId: string;
  patientName: string;
  patientAddress: string;
  patientPhone: string;
  caregiverId: string;
  caregiverName: string;
  caregiverRole: "Nurse" | "Caregiver" | "Physiotherapist";
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00 AM"
  endTime: string; // e.g. "12:00 PM"
  repeatFrequency: "Single Visit" | "Daily" | "Mon-Wed-Fri" | "Weekly";
  tasks: string[];
  status: "Scheduled" | "In-Progress" | "Completed" | "Cancelled" | "Replacement Required";
  notes?: string;
  replacementHistory?: {
    originalCaregiverName: string;
    replacedAt: string;
    reason: string;
  };
}

export const initialVisitSchedules: VisitSchedule[] = [
  {
    id: "VS-801",
    bookingId: "REQ-9012",
    patientName: "Robert Vance",
    patientAddress: "742 Evergreen Terrace, Downtown",
    patientPhone: "+1 (555) 234-9988",
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    caregiverRole: "Physiotherapist",
    date: "2026-08-01",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    repeatFrequency: "Daily",
    tasks: ["Gait Training", "Vitals Check", "Bed Transfer"],
    status: "Scheduled",
  },
  {
    id: "VS-802",
    bookingId: "REQ-9013",
    patientName: "Eleanor Vance",
    patientAddress: "1042 Elm Street, Westside",
    patientPhone: "+1 (555) 887-3321",
    caregiverId: "CG-101",
    caregiverName: "Dr. Sarah Jenkins",
    caregiverRole: "Nurse",
    date: "2026-08-01",
    startTime: "09:00 AM",
    endTime: "01:00 PM",
    repeatFrequency: "Daily",
    tasks: ["Sterile Wound Dressing", "IV Antibiotics Injection", "Oxygen Monitoring"],
    status: "In-Progress",
  },
  {
    id: "VS-803",
    bookingId: "REQ-9014",
    patientName: "Arthur Pendelton",
    patientAddress: "318 Maple Avenue, North Hills",
    patientPhone: "+1 (555) 112-4455",
    caregiverId: "CG-103",
    caregiverName: "Elena Rostova",
    caregiverRole: "Caregiver",
    date: "2026-08-01",
    startTime: "04:00 PM",
    endTime: "09:00 PM",
    repeatFrequency: "Mon-Wed-Fri",
    tasks: ["Hygiene Care", "Meal Prep", "Cognitive Exercise"],
    status: "Replacement Required",
    notes: "Assigned caregiver reported sick leave.",
  },
  {
    id: "VS-804",
    bookingId: "REQ-9010",
    patientName: "Margaret Higgins",
    patientAddress: "512 Oak Lane, Eastside",
    patientPhone: "+1 (555) 998-1122",
    caregiverId: "CG-102",
    caregiverName: "David Chen, RN",
    caregiverRole: "Nurse",
    date: "2026-08-02",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    repeatFrequency: "Weekly",
    tasks: ["Catheter Flush", "Elderly Vitals Check"],
    status: "Scheduled",
  },
];
