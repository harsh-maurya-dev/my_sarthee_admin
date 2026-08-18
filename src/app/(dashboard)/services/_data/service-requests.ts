export interface ServiceRequestPricing {
  basePrice: number;
  addonFee: number;
  discount: number;
  finalPrice: number;
}

export interface ServiceRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  age: number;
  gender: string;
  medicalCondition: string;
  careRequirement: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  recommendedServiceId?: string;
  recommendedServiceName?: string;
  pricing: ServiceRequestPricing;
  status: "Pending" | "Under Review" | "Service Recommended" | "Approved" | "Rejected";
  createdAt: string;
  notes?: string;
}

export const initialServiceRequests: ServiceRequest[] = [
  {
    id: "REQ-2026-0891",
    patientId: "PAT-1092",
    patientName: "Eleanor Vance",
    patientPhone: "+91 98201 44521",
    patientEmail: "eleanor.vance@example.com",
    age: 72,
    gender: "Female",
    medicalCondition: "Post-Stroke Mobility Loss & Joint Stiffness",
    careRequirement: "Daily physical therapy assistance, gait re-training, and passive range-of-motion exercises.",
    preferredDate: "2026-08-05",
    preferredTime: "09:00 AM - 11:00 AM",
    address: "Bandra West, Mumbai, MH",
    recommendedServiceId: "SVC-102",
    recommendedServiceName: "Physiotherapy & Neuro-Rehabilitation",
    pricing: {
      basePrice: 800,
      addonFee: 100,
      discount: 50,
      finalPrice: 850,
    },
    status: "Pending",
    createdAt: "2026-07-31T08:30:00Z",
    notes: "Patient prefers morning sessions. Requires senior neuro-physiotherapist.",
  },
  {
    id: "REQ-2026-0892",
    patientId: "PAT-1095",
    patientName: "Robert Sterling",
    patientPhone: "+91 98334 11290",
    patientEmail: "robert.sterling@example.com",
    age: 65,
    gender: "Male",
    medicalCondition: "Post-Surgical ICU Recovery & IV Therapy",
    careRequirement: "12-hour nursing shift for IV antibiotic infusions, wound dressing, Foley catheter care, and continuous vital telemetry.",
    preferredDate: "2026-08-03",
    preferredTime: "08:00 AM - 08:00 PM",
    address: "Andheri East, Mumbai, MH",
    recommendedServiceId: "SVC-103",
    recommendedServiceName: "Clinical Nursing Care & Vital Monitoring",
    pricing: {
      basePrice: 1800,
      addonFee: 200,
      discount: 100,
      finalPrice: 1900,
    },
    status: "Under Review",
    createdAt: "2026-07-30T14:15:00Z",
    notes: "Requires B.Sc ICU certified nurse. Doctor prescription verified.",
  },
  {
    id: "REQ-2026-0893",
    patientId: "PAT-1102",
    patientName: "Sophia Martinez",
    patientPhone: "+91 97690 88412",
    patientEmail: "sophia.martinez@example.com",
    age: 79,
    gender: "Female",
    medicalCondition: "Geriatric Dementia & Bedridden Mobility Assistance",
    careRequirement: "24-hour caregiver for daily hygiene, sponge bath, diaper change, feeding assistance, and emotional companionship.",
    preferredDate: "2026-08-02",
    preferredTime: "Full Day (24h)",
    address: "Powai, Mumbai, MH",
    recommendedServiceId: "SVC-101",
    recommendedServiceName: "Caregiver Support & Bedside Assistance",
    pricing: {
      basePrice: 1200,
      addonFee: 150,
      discount: 50,
      finalPrice: 1300,
    },
    status: "Service Recommended",
    createdAt: "2026-07-29T11:00:00Z",
    notes: "Family requested female caregiver with Marathi/Hindi fluency.",
  },
  {
    id: "REQ-2026-0894",
    patientId: "PAT-1088",
    patientName: "Arthur Pendelton",
    patientPhone: "+91 98199 33456",
    patientEmail: "arthur.p@example.com",
    age: 81,
    gender: "Male",
    medicalCondition: "Parkinson's Disease & Fall Risk",
    careRequirement: "Daytime caregiver assistance for transfer from bed to wheelchair, medication timing reminders, and supervised walks.",
    preferredDate: "2026-08-01",
    preferredTime: "09:00 AM - 06:00 PM",
    address: "Juhu, Mumbai, MH",
    recommendedServiceId: "SVC-101",
    recommendedServiceName: "Caregiver Support & Bedside Assistance",
    pricing: {
      basePrice: 1200,
      addonFee: 100,
      discount: 100,
      finalPrice: 1200,
    },
    status: "Approved",
    createdAt: "2026-07-28T09:45:00Z",
    notes: "Approved for 30-day monthly caregiver subscription package.",
  },
  {
    id: "REQ-2026-0895",
    patientId: "PAT-1110",
    patientName: "Clara Hughes",
    patientPhone: "+91 99200 66781",
    patientEmail: "clara.h@example.com",
    age: 59,
    gender: "Female",
    medicalCondition: "Total Knee Replacement (TKR) Rehab",
    careRequirement: "Home physiotherapy sessions for knee flexion exercises, quadriceps strengthening, and balance therapy.",
    preferredDate: "2026-08-04",
    preferredTime: "04:00 PM - 05:30 PM",
    address: "Worli, South Mumbai, MH",
    recommendedServiceId: "SVC-102",
    recommendedServiceName: "Physiotherapy & Neuro-Rehabilitation",
    pricing: {
      basePrice: 800,
      addonFee: 100,
      discount: 0,
      finalPrice: 900,
    },
    status: "Approved",
    createdAt: "2026-07-27T16:20:00Z",
    notes: "10-session rehab package booked by orthopedist referral.",
  },
];
