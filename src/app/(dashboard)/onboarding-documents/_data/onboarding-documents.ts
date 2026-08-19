export interface KYCDocumentItem {
  id: string;
  name: string;
  code: string;
  iconType: "id-card" | "pan-card" | "vaccine" | "police" | "bank" | "insurance" | "generic";
  category: "Identity Proof" | "Financial & Tax" | "Medical & Health" | "Background & Legal" | "Insurance";
  isMandatory: boolean;
  allowedFormats: string[];
  maxSizeMB: number;
  description: string;
  verificationMethod: "Manual Admin Review" | "API / UIDAI Instant Verification" | "Third-Party Background Check Agency";
  status: "Active" | "Inactive";
  sampleTemplateUrl?: string;
  createdDate: string;
  totalSubmissions: number;
  verifiedCount: number;
}

export interface TrainingDocumentItem {
  id: string;
  title: string;
  code: string;
  category: "Clinical Protocols" | "Emergency & Safety" | "Patient Care & Vitals" | "Medication & Pharmacology" | "Hygiene & Sanitization";
  iconType: "sanitization" | "vitals" | "emergency" | "medication" | "protocol";
  targetRoles: ("Nurse" | "Caregiver" | "Physiotherapist")[];
  estimatedReadingTime: string;
  pagesCount: number;
  isAssessmentMandatory: boolean;
  passingScorePercent?: number;
  documentFileUrl: string;
  fileFormat: "PDF" | "DOCX" | "Video Guide";
  description: string;
  status: "Active" | "Draft" | "Archived";
  version: string;
  lastUpdated: string;
  completedCaregiversCount: number;
}

export const initialKYCDocuments: KYCDocumentItem[] = [
  {
    id: "KYC-01",
    name: "Aadhar Card",
    code: "AADHAR_CARD",
    iconType: "id-card",
    category: "Identity Proof",
    isMandatory: true,
    allowedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5,
    description: "Government of India 12-digit UIDAI identity document with front & back scan.",
    verificationMethod: "API / UIDAI Instant Verification",
    status: "Active",
    sampleTemplateUrl: "https://uidai.gov.in/sample-aadhaar.pdf",
    createdDate: "2026-01-10",
    totalSubmissions: 142,
    verifiedCount: 138,
  },
  {
    id: "KYC-02",
    name: "PAN Card",
    code: "PAN_CARD",
    iconType: "pan-card",
    category: "Financial & Tax",
    isMandatory: true,
    allowedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5,
    description: "Permanent Account Number issued by the Income Tax Department of India for tax compliance and payouts.",
    verificationMethod: "API / UIDAI Instant Verification",
    status: "Active",
    sampleTemplateUrl: "https://incometax.gov.in/pan-sample.jpg",
    createdDate: "2026-01-10",
    totalSubmissions: 140,
    verifiedCount: 135,
  },
  {
    id: "KYC-03",
    name: "Vaccination Certificate",
    code: "VACCINATION_CERT",
    iconType: "vaccine",
    category: "Medical & Health",
    isMandatory: true,
    allowedFormats: ["PDF", "JPG"],
    maxSizeMB: 5,
    description: "Mandatory double-dose COVID-19 & Hepatitis-B immunization certificate issued by CoWIN / Health Ministry.",
    verificationMethod: "Manual Admin Review",
    status: "Active",
    sampleTemplateUrl: "https://cowin.gov.in/certificate-sample.pdf",
    createdDate: "2026-01-15",
    totalSubmissions: 136,
    verifiedCount: 132,
  },
  {
    id: "KYC-04",
    name: "Police Verification",
    code: "POLICE_VERIFICATION",
    iconType: "police",
    category: "Background & Legal",
    isMandatory: true,
    allowedFormats: ["PDF"],
    maxSizeMB: 10,
    description: "State Police Department Criminal Clearance Certificate (PCC) certifying no adverse criminal record.",
    verificationMethod: "Third-Party Background Check Agency",
    status: "Active",
    sampleTemplateUrl: "https://mumbaipolice.gov.in/pcc-format.pdf",
    createdDate: "2026-01-12",
    totalSubmissions: 128,
    verifiedCount: 124,
  },
  {
    id: "KYC-05",
    name: "Bank Details",
    code: "BANK_DETAILS",
    iconType: "bank",
    category: "Financial & Tax",
    isMandatory: true,
    allowedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMB: 5,
    description: "Cancelled cheque leaf or bank passbook copy displaying Account Holder Name, Account Number & IFSC code for direct shift payouts.",
    verificationMethod: "Manual Admin Review",
    status: "Active",
    sampleTemplateUrl: "https://rbi.org.in/sample-cheque.jpg",
    createdDate: "2026-01-18",
    totalSubmissions: 141,
    verifiedCount: 139,
  },
  {
    id: "KYC-06",
    name: "Insurance Details",
    code: "INSURANCE_POLICY",
    iconType: "insurance",
    category: "Insurance",
    isMandatory: false,
    allowedFormats: ["PDF"],
    maxSizeMB: 10,
    description: "Personal health insurance or professional medical indemnity cover policy document.",
    verificationMethod: "Manual Admin Review",
    status: "Active",
    sampleTemplateUrl: "https://my-sarthee.com/templates/insurance-guidelines.pdf",
    createdDate: "2026-02-01",
    totalSubmissions: 89,
    verifiedCount: 84,
  },
];

export const initialTrainingDocuments: TrainingDocumentItem[] = [
  {
    id: "TRN-01",
    title: "Infection Control & Sanitization Protocol",
    code: "INF_CONTROL_SOP",
    category: "Hygiene & Sanitization",
    iconType: "sanitization",
    targetRoles: ["Nurse", "Caregiver", "Physiotherapist"],
    estimatedReadingTime: "15 mins",
    pagesCount: 8,
    isAssessmentMandatory: true,
    passingScorePercent: 80,
    documentFileUrl: "https://my-sarthee.com/docs/infection-control-protocol-v2.pdf",
    fileFormat: "PDF",
    description: "Standard operating procedure for sterile hand hygiene, PPE donning/doffing, sterile dressing changes, and clinical waste disposal at home care settings.",
    status: "Active",
    version: "v2.4",
    lastUpdated: "2026-07-15",
    completedCaregiversCount: 134,
  },
  {
    id: "TRN-02",
    title: "Patient Vital Signs & Incident Logging",
    code: "VITALS_INCIDENT_SOP",
    category: "Patient Care & Vitals",
    iconType: "vitals",
    targetRoles: ["Nurse", "Caregiver", "Physiotherapist"],
    estimatedReadingTime: "20 mins",
    pagesCount: 12,
    isAssessmentMandatory: true,
    passingScorePercent: 85,
    documentFileUrl: "https://my-sarthee.com/docs/vital-signs-incident-logging.pdf",
    fileFormat: "PDF",
    description: "Detailed instructions for logging Blood Pressure, SpO2, Pulse, Blood Glucose via Mobile App and threshold escalation triggers for critical patient anomalies.",
    status: "Active",
    version: "v3.1",
    lastUpdated: "2026-08-01",
    completedCaregiversCount: 129,
  },
  {
    id: "TRN-03",
    title: "Emergency Response & Escalation SOP",
    code: "EMERGENCY_ESCALATION_SOP",
    category: "Emergency & Safety",
    iconType: "emergency",
    targetRoles: ["Nurse", "Caregiver", "Physiotherapist"],
    estimatedReadingTime: "25 mins",
    pagesCount: 14,
    isAssessmentMandatory: true,
    passingScorePercent: 90,
    documentFileUrl: "https://my-sarthee.com/docs/emergency-response-sop.pdf",
    fileFormat: "PDF",
    description: "Emergency protocols for acute cardiac distress, patient fall incidents, sudden loss of consciousness, and direct integration with 108 Ambulance / Lilavati ER.",
    status: "Active",
    version: "v4.0",
    lastUpdated: "2026-08-10",
    completedCaregiversCount: 126,
  },
  {
    id: "TRN-04",
    title: "Medication Administration Guidelines",
    code: "MEDICATION_ADMIN_SOP",
    category: "Medication & Pharmacology",
    iconType: "medication",
    targetRoles: ["Nurse", "Caregiver"],
    estimatedReadingTime: "30 mins",
    pagesCount: 18,
    isAssessmentMandatory: true,
    passingScorePercent: 90,
    documentFileUrl: "https://my-sarthee.com/docs/medication-administration-guidelines.pdf",
    fileFormat: "PDF",
    description: "Five Rights of Medication Administration (Right Patient, Right Drug, Right Dose, Right Route, Right Time), insulin injection protocols, and adverse reaction tracking.",
    status: "Active",
    version: "v2.8",
    lastUpdated: "2026-08-05",
    completedCaregiversCount: 118,
  },
];
