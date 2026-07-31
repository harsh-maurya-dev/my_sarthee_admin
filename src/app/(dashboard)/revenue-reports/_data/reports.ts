export interface RevenueReportItem {
  period: string; // e.g. "July 2026"
  grossBillings: number; // e.g. 142500
  caregiverPayouts: number; // e.g. 92000
  netMargin: number; // e.g. 50500
  marginPercent: number; // e.g. 35.4%
  topServiceCategory: string;
  totalCompletedBookings: number;
}

export interface PatientGrowthItem {
  period: string;
  totalActivePatients: number;
  newPatientsAdded: number;
  retentionRatePercent: number;
  churnRatePercent: number;
  topAcquisitionChannel: string;
}

export interface CaregiverUtilizationItem {
  caregiverId: string;
  caregiverName: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  totalAvailableHours: number;
  activeDutyHours: number;
  utilizationPercent: number;
  completedVisitsCount: number;
  idleHours: number;
}

export interface CACTrackingItem {
  channel: string; // e.g. "Google Ads", "Meta Ads", "Organic Search", "Referral"
  adSpend: number;
  leadsGenerated: number;
  patientsAcquired: number;
  cacPerPatient: number; // e.g. 42
  conversionRatePercent: number;
}

export const initialRevenueReports: RevenueReportItem[] = [
  {
    period: "July 2026",
    grossBillings: 148500,
    caregiverPayouts: 94000,
    netMargin: 54500,
    marginPercent: 36.7,
    topServiceCategory: "Post-Op Clinical Nursing",
    totalCompletedBookings: 320,
  },
  {
    period: "June 2026",
    grossBillings: 132000,
    caregiverPayouts: 85000,
    netMargin: 47000,
    marginPercent: 35.6,
    topServiceCategory: "Physiotherapy Rehab",
    totalCompletedBookings: 285,
  },
  {
    period: "May 2026",
    grossBillings: 118000,
    caregiverPayouts: 76000,
    netMargin: 42000,
    marginPercent: 35.5,
    topServiceCategory: "Elderly Home Care",
    totalCompletedBookings: 250,
  },
];

export const initialPatientGrowth: PatientGrowthItem[] = [
  {
    period: "Q3 2026 (Jul-Sep)",
    totalActivePatients: 1420,
    newPatientsAdded: 185,
    retentionRatePercent: 94.2,
    churnRatePercent: 5.8,
    topAcquisitionChannel: "Google Search Ads",
  },
  {
    period: "Q2 2026 (Apr-Jun)",
    totalActivePatients: 1235,
    newPatientsAdded: 160,
    retentionRatePercent: 93.8,
    churnRatePercent: 6.2,
    topAcquisitionChannel: "Doctor Referrals",
  },
  {
    period: "Q1 2026 (Jan-Mar)",
    totalActivePatients: 1075,
    newPatientsAdded: 140,
    retentionRatePercent: 92.5,
    churnRatePercent: 7.5,
    topAcquisitionChannel: "Meta Social Ads",
  },
];

export const initialCaregiverUtilization: CaregiverUtilizationItem[] = [
  {
    caregiverId: "CG-101",
    caregiverName: "Dr. Sarah Jenkins",
    role: "Nurse",
    totalAvailableHours: 160,
    activeDutyHours: 148,
    utilizationPercent: 92.5,
    completedVisitsCount: 38,
    idleHours: 12,
  },
  {
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    role: "Physiotherapist",
    totalAvailableHours: 160,
    activeDutyHours: 142,
    utilizationPercent: 88.75,
    completedVisitsCount: 34,
    idleHours: 18,
  },
  {
    caregiverId: "CG-103",
    caregiverName: "Elena Rostova",
    role: "Caregiver",
    totalAvailableHours: 160,
    activeDutyHours: 124,
    utilizationPercent: 77.5,
    completedVisitsCount: 28,
    idleHours: 36,
  },
];

export const initialCACTracking: CACTrackingItem[] = [
  {
    channel: "Doctor & Clinic Referrals",
    adSpend: 1500,
    leadsGenerated: 120,
    patientsAcquired: 95,
    cacPerPatient: 15.78,
    conversionRatePercent: 79.1,
  },
  {
    channel: "Organic Search / SEO",
    adSpend: 2400,
    leadsGenerated: 210,
    patientsAcquired: 110,
    cacPerPatient: 21.81,
    conversionRatePercent: 52.3,
  },
  {
    channel: "Google Search Ads",
    adSpend: 5400,
    leadsGenerated: 280,
    patientsAcquired: 125,
    cacPerPatient: 43.2,
    conversionRatePercent: 44.6,
  },
  {
    channel: "Meta Social Ads (FB/IG)",
    adSpend: 4200,
    leadsGenerated: 240,
    patientsAcquired: 85,
    cacPerPatient: 49.41,
    conversionRatePercent: 35.4,
  },
];
