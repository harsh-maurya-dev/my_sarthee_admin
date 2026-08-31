export interface VisitSchedule {
  id: string;
  bookingId: string;
  patientName: string;
  patientAddress: string;
  patientPhone: string;
  caregiverId: string;
  caregiverName: string;
  caregiverRole: "Nurse" | "Caregiver" | "Physiotherapist";
  service: string; // e.g. "Essential Care", "Skilled Care", "Recovery"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00 AM" or "8 AM"
  endTime: string; // e.g. "06:00 PM" or "6 PM"
  timeSlotFormatted?: string; // e.g. "8 AM–6 PM"
  repeatFrequency: "Single Visit" | "Daily" | "Mon-Wed-Fri" | "Weekly";
  tasks: string[];
  status: "Confirmed" | "In-Progress" | "Completed" | "Scheduled" | "Replacement Required" | "Cancelled";
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
    bookingId: "BK-2026-01",
    patientName: "Patient A (Rameshwar Sharma)",
    patientAddress: "A-402, Sea Green Apts, Andheri West, Mumbai",
    patientPhone: "+91 98201 44512",
    caregiverId: "CG-101",
    caregiverName: "Caregiver X (Kavita Shinde)",
    caregiverRole: "Caregiver",
    service: "Essential Care",
    date: "2026-08-31",
    startTime: "08:00 AM",
    endTime: "06:00 PM",
    timeSlotFormatted: "8 AM–6 PM",
    repeatFrequency: "Daily",
    tasks: ["Elderly Assistance", "Vitals Monitoring", "Bed Transfer", "Meal Assistance"],
    status: "Confirmed",
    notes: "Requires full day assistance for mobility support.",
  },
  {
    id: "VS-802",
    bookingId: "BK-2026-02",
    patientName: "Patient B (Meera Nair)",
    patientAddress: "12B, Palm Grove, Bandra West, Mumbai",
    patientPhone: "+91 98330 99881",
    caregiverId: "CG-102",
    caregiverName: "Nurse Y (Priya Sharma)",
    caregiverRole: "Nurse",
    service: "Skilled Care",
    date: "2026-08-31",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    timeSlotFormatted: "10 AM–12 PM",
    repeatFrequency: "Daily",
    tasks: ["Sterile Wound Dressing", "IV Antibiotics Injection", "Oxygen Monitoring"],
    status: "Confirmed",
    notes: "Post-op dressing check and medication administration.",
  },
  {
    id: "VS-803",
    bookingId: "BK-2026-03",
    patientName: "Patient C (Arthur Pendelton)",
    patientAddress: "Flat 504, Oberoi Springs, Powai, Mumbai",
    patientPhone: "+91 99201 88412",
    caregiverId: "CG-103",
    caregiverName: "Physio Z (Dr. Alisha Merchant)",
    caregiverRole: "Physiotherapist",
    service: "Recovery",
    date: "2026-08-31",
    startTime: "05:00 PM",
    endTime: "06:00 PM",
    timeSlotFormatted: "5 PM–6 PM",
    repeatFrequency: "Mon-Wed-Fri",
    tasks: ["Gait Training", "Post-Stroke Muscle Activation", "Joint Mobility"],
    status: "Confirmed",
    notes: "Evening neuro-rehabilitation physical therapy session.",
  },
  {
    id: "VS-804",
    bookingId: "BK-2026-04",
    patientName: "Sarla Devi Patel",
    patientAddress: "318 Maple Avenue, Dadar West, Mumbai",
    patientPhone: "+91 98110 55432",
    caregiverId: "CG-104",
    caregiverName: "Caregiver Mahesh Patil",
    caregiverRole: "Caregiver",
    service: "Essential Care",
    date: "2026-08-31",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    timeSlotFormatted: "8 AM–8 PM",
    repeatFrequency: "Daily",
    tasks: ["Hygiene Care", "Medication Reminders", "Cognitive Exercise"],
    status: "In-Progress",
  },
  {
    id: "VS-805",
    bookingId: "BK-2026-05",
    patientName: "Dr. Ashok Mehta",
    patientAddress: "512 Oak Lane, Borivali East, Mumbai",
    patientPhone: "+91 98670 11928",
    caregiverId: "CG-105",
    caregiverName: "Nurse Sunita Deshmukh",
    caregiverRole: "Nurse",
    service: "Skilled Care",
    date: "2026-08-31",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    timeSlotFormatted: "2 PM–4 PM",
    repeatFrequency: "Single Visit",
    tasks: ["Catheter Flush", "Tracheostomy Suctioning", "Blood Sugar Profile"],
    status: "Scheduled",
  },
  {
    id: "VS-806",
    bookingId: "BK-2026-06",
    patientName: "Vikram Sethi",
    patientAddress: "701, Hiranandani Estate, Thane West, Mumbai",
    patientPhone: "+91 97551 22891",
    caregiverId: "CG-106",
    caregiverName: "Elena Rostova",
    caregiverRole: "Caregiver",
    service: "Recovery",
    date: "2026-08-31",
    startTime: "06:00 PM",
    endTime: "09:00 PM",
    timeSlotFormatted: "6 PM–9 PM",
    repeatFrequency: "Mon-Wed-Fri",
    tasks: ["Assisted Walking", "Range of Motion Exercises", "Evening Care"],
    status: "Replacement Required",
    notes: "Caregiver requested emergency leave; backup replacement pending.",
  },
];
