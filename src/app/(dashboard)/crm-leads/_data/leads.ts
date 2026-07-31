export interface CRMLead {
  id: string;
  leadName: string;
  phone: string;
  email: string;
  serviceRequested: string;
  leadSource: "Google Ads" | "Meta Ads" | "Organic Search" | "Referral" | "Partner Clinic" | "Direct App";
  conversionStatus: "New Lead" | "Contacted" | "Consultation Scheduled" | "Converted" | "Lost";
  estimatedValue: number;
  createdDate: string;
  assignedRepresentative: string;
  patientAge?: number;
  patientCondition?: string;
  historyLog?: {
    date: string;
    action: string;
    note: string;
  }[];
}

export const initialCRMLeads: CRMLead[] = [
  {
    id: "LD-601",
    leadName: "Jameson Sterling",
    phone: "+1 (555) 432-8890",
    email: "j.sterling@example.com",
    serviceRequested: "Post-Stroke Rehabilitation",
    leadSource: "Google Ads",
    conversionStatus: "Consultation Scheduled",
    estimatedValue: 2400,
    createdDate: "2026-07-28",
    assignedRepresentative: "Rachel Green",
    patientAge: 71,
    patientCondition: "Ischemic stroke recovery with gait weakness.",
    historyLog: [
      { date: "2026-07-28", action: "Lead Captured", note: "Submitted inquiry form via Google Search Landing Page." },
      { date: "2026-07-29", action: "Phone Call Completed", note: "Spoke with son. Scheduled home rehab assessment for Aug 3." },
    ],
  },
  {
    id: "LD-602",
    leadName: "Beatrice Thorne",
    phone: "+1 (555) 901-2244",
    email: "b.thorne@example.com",
    serviceRequested: "Elderly Dementia Care",
    leadSource: "Referral",
    conversionStatus: "New Lead",
    estimatedValue: 1800,
    createdDate: "2026-07-31",
    assignedRepresentative: "David Vance",
    patientAge: 82,
    patientCondition: "Alzheimer's stage 2, requires evening monitoring.",
    historyLog: [
      { date: "2026-07-31", action: "Referral Received", note: "Referred by Dr. Montgomery (St. Jude Neurology)." },
    ],
  },
  {
    id: "LD-603",
    leadName: "Gregory Hayes",
    phone: "+1 (555) 112-9988",
    email: "greg.hayes@example.com",
    serviceRequested: "Post-Op Cardiac Nursing",
    leadSource: "Partner Clinic",
    conversionStatus: "Converted",
    estimatedValue: 3500,
    createdDate: "2026-07-20",
    assignedRepresentative: "Rachel Green",
    patientAge: 65,
    patientCondition: "CABG Post-Op wound dressing and IV antibiotics.",
    historyLog: [
      { date: "2026-07-20", action: "Lead Captured", note: "Transferred from General Hospital Discharge Desk." },
      { date: "2026-07-22", action: "Converted to Patient", note: "Assigned Dr. Sarah Jenkins (Nurse) for 30-day care package." },
    ],
  },
  {
    id: "LD-604",
    leadName: "Samantha Miller",
    phone: "+1 (555) 667-3311",
    email: "smiller@example.com",
    serviceRequested: "Palliative Care",
    leadSource: "Meta Ads",
    conversionStatus: "Lost",
    estimatedValue: 1200,
    createdDate: "2026-07-15",
    assignedRepresentative: "David Vance",
    patientAge: 78,
    patientCondition: "Terminal care requirement.",
    historyLog: [
      { date: "2026-07-15", action: "Lead Captured", note: "Inquiry via Facebook Ad campaign." },
      { date: "2026-07-18", action: "Marked Lost", note: "Family decided on inpatient hospice facility." },
    ],
  },
];
