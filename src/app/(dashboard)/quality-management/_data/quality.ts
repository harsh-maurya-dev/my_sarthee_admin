export interface PatientFeedback {
  id: string;
  patientName: string;
  caregiverName: string;
  serviceType: string;
  rating: number; // 1 to 5 stars
  feedbackText: string;
  date: string;
  category: "Punctuality" | "Care Quality" | "Communication" | "General";
  status: "Reviewed" | "Pending Review" | "Action Taken";
}

export interface CaregiverRatingItem {
  caregiverId: string;
  caregiverName: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  averageRating: number;
  totalReviewsCount: number;
  fiveStarPercentage: number;
  punctualityRate: string;
  complaintCount: number;
  qualityStatus: "Excellent" | "Good" | "Needs Improvement" | "Under Audit";
}

export interface PatientComplaint {
  id: string;
  patientName: string;
  caregiverName: string;
  issueCategory: "Late Arrival" | "Unprofessional Behavior" | "Care Task Omission" | "Billing Discrepancy";
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  loggedDate: string;
  status: "Open" | "Investigating" | "Resolved" | "Escalated";
  resolutionNotes?: string;
}

export interface QualityAlert {
  id: string;
  caregiverName: string;
  alertType: "Late Check-in Alert" | "Missing Vitals Log" | "Negative Feedback Flag" | "Geofence Mismatch";
  timestamp: string;
  description: string;
  severity: "Warning" | "Critical";
  status: "Active" | "Dismissed" | "Action Taken";
}

export const initialPatientFeedback: PatientFeedback[] = [
  {
    id: "FB-301",
    patientName: "Eleanor Vance",
    caregiverName: "Dr. Sarah Jenkins",
    serviceType: "Post-Op Cardiac Nursing",
    rating: 5,
    feedbackText: "Dr. Sarah was exceptionally professional, gentle with wound dressing, and verified my oxygen saturation thoroughly.",
    date: "2026-08-01",
    category: "Care Quality",
    status: "Reviewed",
  },
  {
    id: "FB-302",
    patientName: "Robert Vance",
    caregiverName: "Marcus Brody, PT",
    serviceType: "Physiotherapy Rehab",
    rating: 5,
    feedbackText: "Marcus was punctual and encouraged me through my gait exercises. Very patient!",
    date: "2026-08-01",
    category: "Punctuality",
    status: "Reviewed",
  },
  {
    id: "FB-303",
    patientName: "Arthur Pendelton",
    caregiverName: "Elena Rostova",
    serviceType: "Dementia & Elderly Care",
    rating: 2,
    feedbackText: "Caregiver arrived 25 minutes late for the evening shift without prior notification.",
    date: "2026-07-31",
    category: "Punctuality",
    status: "Pending Review",
  },
];

export const initialCaregiverRatings: CaregiverRatingItem[] = [
  {
    caregiverId: "CG-101",
    caregiverName: "Dr. Sarah Jenkins",
    role: "Nurse",
    averageRating: 4.9,
    totalReviewsCount: 84,
    fiveStarPercentage: 96,
    punctualityRate: "99%",
    complaintCount: 0,
    qualityStatus: "Excellent",
  },
  {
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    role: "Physiotherapist",
    averageRating: 4.8,
    totalReviewsCount: 62,
    fiveStarPercentage: 92,
    punctualityRate: "98%",
    complaintCount: 0,
    qualityStatus: "Excellent",
  },
  {
    caregiverId: "CG-103",
    caregiverName: "Elena Rostova",
    role: "Caregiver",
    averageRating: 4.2,
    totalReviewsCount: 45,
    fiveStarPercentage: 75,
    punctualityRate: "88%",
    complaintCount: 2,
    qualityStatus: "Needs Improvement",
  },
];

export const initialPatientComplaints: PatientComplaint[] = [
  {
    id: "CMP-901",
    patientName: "Arthur Pendelton",
    caregiverName: "Elena Rostova",
    issueCategory: "Late Arrival",
    description: "Caregiver arrived 25 mins late for 04:00 PM shift. Patient had to wait for dinner assistance.",
    severity: "Medium",
    loggedDate: "2026-07-31",
    status: "Investigating",
  },
  {
    id: "CMP-902",
    patientName: "Harold Miller",
    caregiverName: "Samira Patel",
    issueCategory: "Care Task Omission",
    description: "Caregiver forgot to log blood glucose reading before administering morning snack.",
    severity: "High",
    loggedDate: "2026-07-30",
    status: "Open",
  },
];

export const initialQualityAlerts: QualityAlert[] = [
  {
    id: "ALT-701",
    caregiverName: "Elena Rostova",
    alertType: "Late Check-in Alert",
    timestamp: "2026-08-01 04:25 PM",
    description: "Geofence check-in delayed by > 20 mins past scheduled start time.",
    severity: "Warning",
    status: "Active",
  },
  {
    id: "ALT-702",
    caregiverName: "David Chen, RN",
    alertType: "Missing Vitals Log",
    timestamp: "2026-07-31 02:00 PM",
    description: "Shift check-out submitted without recording Blood Pressure vitals.",
    severity: "Warning",
    status: "Dismissed",
  },
];
