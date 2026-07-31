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
    patientPhone: "+1 (555) 349-2018",
    patientEmail: "eleanor.vance@example.com",
    age: 72,
    gender: "Female",
    medicalCondition: "Post-Stroke Mobility Loss & Hypertension",
    careRequirement: "Daily physical therapy assistance, gait training, and blood pressure telemetry monitoring.",
    preferredDate: "2026-08-05",
    preferredTime: "09:00 AM - 12:00 PM",
    address: "452 Maplewood Ave, Suite 4B, Springfield",
    recommendedServiceId: "SRV-102",
    recommendedServiceName: "In-Home Physical Therapy & Rehab",
    pricing: {
      basePrice: 180,
      addonFee: 30,
      discount: 10,
      finalPrice: 200,
    },
    status: "Pending",
    createdAt: "2026-07-31T08:30:00Z",
    notes: "Patient prefers morning sessions. Requires wheelchair assistance.",
  },
  {
    id: "REQ-2026-0892",
    patientId: "PAT-1095",
    patientName: "Robert Sterling",
    patientPhone: "+1 (555) 782-9912",
    patientEmail: "robert.sterling@example.com",
    age: 65,
    gender: "Male",
    medicalCondition: "Type 2 Diabetes Mellitus",
    careRequirement: "Weekly glucose checking, dietary plan consultation, and insulin management guidance.",
    preferredDate: "2026-08-03",
    preferredTime: "02:00 PM - 04:00 PM",
    address: "789 Pine Ridge Rd, Austin, TX",
    recommendedServiceId: "SRV-101",
    recommendedServiceName: "24/7 Virtual Telehealth Consultation",
    pricing: {
      basePrice: 75,
      addonFee: 15,
      discount: 0,
      finalPrice: 90,
    },
    status: "Under Review",
    createdAt: "2026-07-30T14:15:00Z",
    notes: "Requires video call setup assistance.",
  },
  {
    id: "REQ-2026-0893",
    patientId: "PAT-1102",
    patientName: "Sophia Martinez",
    patientPhone: "+1 (555) 912-4431",
    patientEmail: "sophia.martinez@example.com",
    age: 48,
    gender: "Female",
    medicalCondition: "Post-Operative Orthopedic Rehabilitation",
    careRequirement: "Post-knee replacement wound dressing, pain telemetry tracking, and light range-of-motion exercises.",
    preferredDate: "2026-08-02",
    preferredTime: "10:00 AM - 01:00 PM",
    address: "1208 Crestview Terrace, San Jose, CA",
    recommendedServiceId: "SRV-103",
    recommendedServiceName: "Senior Chronic Care Management",
    pricing: {
      basePrice: 250,
      addonFee: 40,
      discount: 25,
      finalPrice: 265,
    },
    status: "Service Recommended",
    createdAt: "2026-07-29T11:00:00Z",
    notes: "Surgeon recommendation letter attached.",
  },
  {
    id: "REQ-2026-0894",
    patientId: "PAT-1088",
    patientName: "Arthur Pendelton",
    patientPhone: "+1 (555) 234-8876",
    patientEmail: "arthur.p@example.com",
    age: 81,
    gender: "Male",
    medicalCondition: "Mild Cognitive Impairment & Memory Care",
    careRequirement: "Companionship, medication administration reminders, and daily vital tracking.",
    preferredDate: "2026-08-01",
    preferredTime: "08:00 AM - 05:00 PM",
    address: "330 Oakridge Dr, Denver, CO",
    recommendedServiceId: "SRV-103",
    recommendedServiceName: "Senior Chronic Care Management",
    pricing: {
      basePrice: 300,
      addonFee: 50,
      discount: 30,
      finalPrice: 320,
    },
    status: "Approved",
    createdAt: "2026-07-28T09:45:00Z",
    notes: "Daughter is primary contact point.",
  },
  {
    id: "REQ-2026-0895",
    patientId: "PAT-1110",
    patientName: "Clara Hughes",
    patientPhone: "+1 (555) 654-1029",
    patientEmail: "clara.h@example.com",
    age: 59,
    gender: "Female",
    medicalCondition: "Asthma & Respiratory Syncytial Virus",
    careRequirement: "Emergency nebulizer administration, oxygen level check, and remote respiratory monitoring.",
    preferredDate: "2026-08-04",
    preferredTime: "11:00 AM - 01:00 PM",
    address: "15 Beacon St, Boston, MA",
    recommendedServiceId: "SRV-105",
    recommendedServiceName: "24/7 Emergency Dispatch Care",
    pricing: {
      basePrice: 150,
      addonFee: 20,
      discount: 0,
      finalPrice: 170,
    },
    status: "Rejected",
    createdAt: "2026-07-27T16:20:00Z",
    notes: "Patient requested cancellation.",
  },
];
