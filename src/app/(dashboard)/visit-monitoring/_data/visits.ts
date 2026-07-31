export interface MonitoredVisit {
  id: string;
  scheduleId: string;
  patientName: string;
  patientAddress: string;
  patientPhone: string;
  caregiverName: string;
  caregiverRole: "Nurse" | "Caregiver" | "Physiotherapist";
  caregiverPhone: string;
  date: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  liveStatus: "In-Progress (Check-In)" | "Completed (Check-Out)" | "Scheduled" | "Delayed" | "Missed";
  checkIn: {
    timestamp?: string; // e.g. "08:58 AM"
    status: "Verified Geofence" | "Pending" | "GPS Offset (0.2 mi)" | "Missed Check-In";
    locationName?: string;
  };
  checkOut: {
    timestamp?: string; // e.g. "01:02 PM"
    status: "Verified Check-Out" | "Pending Check-Out" | "Auto Closed";
    summaryNotes?: string;
  };
  plannedDurationHours: number;
  actualDurationMinutes: number; // e.g. 244 mins
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
  }[];
  vitalSignsRecorded?: {
    bloodPressure: string;
    heartRateBpm: number;
    spO2Percent: number;
    temperatureF: number;
  };
}

export const initialMonitoredVisits: MonitoredVisit[] = [
  {
    id: "VM-501",
    scheduleId: "VS-802",
    patientName: "Eleanor Vance",
    patientAddress: "1042 Elm Street, Westside, Springfield",
    patientPhone: "+1 (555) 887-3321",
    caregiverName: "Dr. Sarah Jenkins",
    caregiverRole: "Nurse",
    caregiverPhone: "+1 (555) 892-1123",
    date: "2026-08-01",
    scheduledStartTime: "09:00 AM",
    scheduledEndTime: "01:00 PM",
    liveStatus: "In-Progress (Check-In)",
    checkIn: {
      timestamp: "08:57 AM",
      status: "Verified Geofence",
      locationName: "1042 Elm Street Geofence OK",
    },
    checkOut: {
      status: "Pending Check-Out",
    },
    plannedDurationHours: 4.0,
    actualDurationMinutes: 185,
    tasks: [
      { id: "T1", title: "Sterile Post-Op Wound Dressing", completed: true, completedAt: "09:30 AM" },
      { id: "T2", title: "IV Antibiotics Infusion (500ml)", completed: true, completedAt: "10:15 AM" },
      { id: "T3", title: "Oxygen Saturation & Vitals Log", completed: true, completedAt: "11:00 AM" },
      { id: "T4", title: "Incentive Spirometry Breathing Exercises", completed: false },
    ],
    vitalSignsRecorded: {
      bloodPressure: "124/82 mmHg",
      heartRateBpm: 76,
      spO2Percent: 98,
      temperatureF: 98.6,
    },
  },
  {
    id: "VM-502",
    scheduleId: "VS-801",
    patientName: "Robert Vance",
    patientAddress: "742 Evergreen Terrace, Downtown, Springfield",
    patientPhone: "+1 (555) 234-9988",
    caregiverName: "Marcus Brody, PT",
    caregiverRole: "Physiotherapist",
    caregiverPhone: "+1 (555) 341-9982",
    date: "2026-08-01",
    scheduledStartTime: "08:00 AM",
    scheduledEndTime: "12:00 PM",
    liveStatus: "Completed (Check-Out)",
    checkIn: {
      timestamp: "07:55 AM",
      status: "Verified Geofence",
      locationName: "742 Evergreen Terrace",
    },
    checkOut: {
      timestamp: "12:05 PM",
      status: "Verified Check-Out",
      summaryNotes: "Patient completed 45 mins gait rehab with zero loss of balance. Patient reported mild fatigue.",
    },
    plannedDurationHours: 4.0,
    actualDurationMinutes: 250,
    tasks: [
      { id: "T1", title: "Gait Rehab & Ambulation Training", completed: true, completedAt: "08:45 AM" },
      { id: "T2", title: "Blood Pressure & Glucose Monitoring", completed: true, completedAt: "09:30 AM" },
      { id: "T3", title: "Bed-to-Chair Transfer Practice", completed: true, completedAt: "10:30 AM" },
      { id: "T4", title: "Post-Rehab Hydration & Vitals Log", completed: true, completedAt: "11:45 AM" },
    ],
    vitalSignsRecorded: {
      bloodPressure: "130/85 mmHg",
      heartRateBpm: 82,
      spO2Percent: 97,
      temperatureF: 98.4,
    },
  },
  {
    id: "VM-503",
    scheduleId: "VS-803",
    patientName: "Arthur Pendelton",
    patientAddress: "318 Maple Avenue, North Hills, Springfield",
    patientPhone: "+1 (555) 112-4455",
    caregiverName: "Elena Rostova",
    caregiverRole: "Caregiver",
    caregiverPhone: "+1 (555) 901-4432",
    date: "2026-08-01",
    scheduledStartTime: "04:00 PM",
    scheduledEndTime: "09:00 PM",
    liveStatus: "Delayed",
    checkIn: {
      status: "Missed Check-In",
    },
    checkOut: {
      status: "Pending Check-Out",
    },
    plannedDurationHours: 5.0,
    actualDurationMinutes: 0,
    tasks: [
      { id: "T1", title: "Assisted Bathing & Personal Hygiene", completed: false },
      { id: "T2", title: "Meal Preparation & Feeding", completed: false },
      { id: "T3", title: "Cognitive Engagement Games", completed: false },
    ],
  },
];
