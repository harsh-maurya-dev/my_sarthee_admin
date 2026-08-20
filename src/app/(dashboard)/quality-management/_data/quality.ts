export interface PatientFeedback {
  id: string;
  patientName: string;
  caregiverName: string;
  serviceType: string;
  rating: number; // 1 to 5 stars
  feedbackText: string;
  date: string;
  category: "Punctuality" | "Care Quality" | "Communication" | "Clinical Skills" | "General";
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
  totalShiftsCompleted: number;
  satisfactionScore: number;
  qualityStatus: "Excellent" | "Good" | "Needs Improvement" | "Under Audit";
  strengths: string[];
}

export interface QualityBenchmark {
  id: string;
  metric: string;
  category: string;
  target: string;
  currentScore: string;
  status: "Exceeding" | "Compliant" | "Attention Needed";
  lastAudited: string;
  auditor: string;
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
    feedbackText: "Marcus was punctual and encouraged me through my gait exercises. Very patient and motivating!",
    date: "2026-08-01",
    category: "Punctuality",
    status: "Reviewed",
  },
  {
    id: "FB-303",
    patientName: "Arthur Pendelton",
    caregiverName: "Elena Rostova",
    serviceType: "Dementia & Elderly Care",
    rating: 3,
    feedbackText: "Caregiver was polite and patient with meals, but arrived 15 minutes late without a prior heads up.",
    date: "2026-07-31",
    category: "Punctuality",
    status: "Action Taken",
  },
  {
    id: "FB-304",
    patientName: "Sunita Sharma",
    caregiverName: "Samira Patel, RN",
    serviceType: "Palliative & Elderly Care",
    rating: 5,
    feedbackText: "Samira is a true angel. She managed medication schedules with supreme accuracy and comforted my mother warmly.",
    date: "2026-07-30",
    category: "Clinical Skills",
    status: "Reviewed",
  },
  {
    id: "FB-305",
    patientName: "David Goldstein",
    caregiverName: "Priya Sharma",
    serviceType: "Post-Stroke Recovery",
    rating: 4,
    feedbackText: "Great support with morning mobility routines. Clear communication throughout the session.",
    date: "2026-07-29",
    category: "Communication",
    status: "Reviewed",
  },
  {
    id: "FB-306",
    patientName: "Meera Krishnan",
    caregiverName: "Amitabh Sen",
    serviceType: "Orthopedic Post-Surgical Care",
    rating: 5,
    feedbackText: "Incredible attention to vital signs and pain management protocols. Very reassuring demeanor.",
    date: "2026-07-28",
    category: "Care Quality",
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
    totalShiftsCompleted: 142,
    satisfactionScore: 98,
    qualityStatus: "Excellent",
    strengths: ["Clinical Rigor", "Patient Empathy", "Medication Adherence"],
  },
  {
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    role: "Physiotherapist",
    averageRating: 4.8,
    totalReviewsCount: 62,
    fiveStarPercentage: 92,
    punctualityRate: "98%",
    totalShiftsCompleted: 98,
    satisfactionScore: 96,
    qualityStatus: "Excellent",
    strengths: ["Rehabilitation Expertise", "Motivational Communication", "Punctuality"],
  },
  {
    caregiverId: "CG-102",
    caregiverName: "Samira Patel, RN",
    role: "Nurse",
    averageRating: 4.7,
    totalReviewsCount: 51,
    fiveStarPercentage: 88,
    punctualityRate: "97%",
    totalShiftsCompleted: 110,
    satisfactionScore: 94,
    qualityStatus: "Excellent",
    strengths: ["Elderly Care", "Vital Signs Monitoring", "Dressing Protocols"],
  },
  {
    caregiverId: "CG-105",
    caregiverName: "Priya Sharma",
    role: "Caregiver",
    averageRating: 4.6,
    totalReviewsCount: 39,
    fiveStarPercentage: 82,
    punctualityRate: "95%",
    totalShiftsCompleted: 76,
    satisfactionScore: 91,
    qualityStatus: "Good",
    strengths: ["Assisted Daily Living", "Warm Demeanor", "Hygiene Standard"],
  },
  {
    caregiverId: "CG-103",
    caregiverName: "Elena Rostova",
    role: "Caregiver",
    averageRating: 4.1,
    totalReviewsCount: 45,
    fiveStarPercentage: 73,
    punctualityRate: "88%",
    totalShiftsCompleted: 85,
    satisfactionScore: 82,
    qualityStatus: "Needs Improvement",
    strengths: ["Meal Assistance", "Patience with Dementia"],
  },
];

export const initialQualityBenchmarks: QualityBenchmark[] = [
  {
    id: "QBM-01",
    metric: "Clinical Hygiene & Safety Compliance",
    category: "Infection Control",
    target: "≥ 98.0%",
    currentScore: "99.4%",
    status: "Exceeding",
    lastAudited: "2026-08-01",
    auditor: "Dr. Arvind Rao (Lead QA)",
  },
  {
    id: "QBM-02",
    metric: "Real-Time Vitals Logging Protocol",
    category: "Telemetry & Clinical Docs",
    target: "≥ 95.0%",
    currentScore: "97.8%",
    status: "Compliant",
    lastAudited: "2026-08-01",
    auditor: "Clinical Operations Team",
  },
  {
    id: "QBM-03",
    metric: "Shift On-Time Punctuality Index",
    category: "SLA Adherence",
    target: "≥ 95.0%",
    currentScore: "97.6%",
    status: "Compliant",
    lastAudited: "2026-07-30",
    auditor: "Automated Tele-Geofence",
  },
  {
    id: "QBM-04",
    metric: "Patient Overall Satisfaction Score",
    category: "Patient Experience",
    target: "≥ 4.5 / 5.0",
    currentScore: "4.8 / 5.0",
    status: "Exceeding",
    lastAudited: "2026-08-02",
    auditor: "Patient Quality Council",
  },
  {
    id: "QBM-05",
    metric: "Care Plan Adherence & Task Sign-off",
    category: "Care Delivery",
    target: "≥ 96.0%",
    currentScore: "98.2%",
    status: "Compliant",
    lastAudited: "2026-07-31",
    auditor: "Clinical Supervisor",
  },
];
