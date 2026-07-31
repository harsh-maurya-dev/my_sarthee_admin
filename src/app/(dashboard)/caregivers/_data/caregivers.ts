export interface KYCVerification {
  idProof: boolean;
  nursingLicense: boolean;
  backgroundCheck: boolean;
}

export interface Caregiver {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  skills: string[];
  experience: string;
  certifications: string[];
  status: "Active" | "Inactive" | "Blocked";
  registrationDate: string;
  rating: number;
  completedVisits: number;
  punctualityRate: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  kycDetails: KYCVerification;
  avatar?: string;
  address?: string;
}

export interface CaregiverRegistrationRequest {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  skills: string[];
  experience: string;
  certifications: string[];
  appliedDate: string;
  kycDetails: KYCVerification;
  idProofDocumentUrl: string;
  licenseDocumentUrl: string;
  backgroundCheckStatus: "Passed" | "Pending" | "Failed";
  status: "Pending Review" | "Approved" | "Rejected";
  notes?: string;
}

export const initialCaregivers: Caregiver[] = [
  {
    id: "CG-2026-001",
    fullName: "Dr. Hannah Vance",
    username: "hannah.vance",
    email: "hannah.vance@healthpulse.com",
    phoneNumber: "+1 (555) 234-5678",
    age: 38,
    gender: "Female",
    dateOfBirth: "1988-04-12",
    skills: ["Post-Stroke Care", "Gait Training", "Telemetry Monitoring", "Insulin Admin"],
    experience: "10 Years",
    certifications: ["Registered Nurse (RN)", "CPR & AED Certified", "Advanced Cardiac Life Support"],
    status: "Active",
    registrationDate: "2026-01-15",
    rating: 4.9,
    completedVisits: 342,
    punctualityRate: "99.2%",
    kycStatus: "Verified",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: true,
    },
    avatar: "https://images.unsplash.com/photo-1594824813566-888554746401?w=150",
    address: "742 Evergreen Terrace, Springfield, IL",
  },
  {
    id: "CG-2026-002",
    fullName: "Marcus Thorne",
    username: "marcus.thorne",
    email: "marcus.t@healthpulse.com",
    phoneNumber: "+1 (555) 876-5432",
    age: 31,
    gender: "Male",
    dateOfBirth: "1995-09-24",
    skills: ["Physical Therapy", "Wound Dressing", "Orthopedic Rehab"],
    experience: "6 Years",
    certifications: ["Licensed Practical Nurse (LPN)", "Certified Physical Therapy Assistant"],
    status: "Active",
    registrationDate: "2026-03-10",
    rating: 4.8,
    completedVisits: 189,
    punctualityRate: "97.8%",
    kycStatus: "Verified",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: true,
    },
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150",
    address: "108 Ocean Drive, Miami, FL",
  },
  {
    id: "CG-2026-003",
    fullName: "Elena Rostova",
    username: "elena.r",
    email: "elena.rostova@example.com",
    phoneNumber: "+1 (555) 345-6789",
    age: 44,
    gender: "Female",
    dateOfBirth: "1982-11-05",
    skills: ["Dementia & Memory Care", "Elderly Assistance", "Medication Management"],
    experience: "12 Years",
    certifications: ["Certified Nursing Assistant (CNA)", "Alzheimer's Care Specialist"],
    status: "Inactive",
    registrationDate: "2025-11-20",
    rating: 4.7,
    completedVisits: 512,
    punctualityRate: "96.5%",
    kycStatus: "Verified",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: true,
    },
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    address: "450 Pine Street, Austin, TX",
  },
  {
    id: "CG-2026-004",
    fullName: "Samuel Oak",
    username: "samuel.oak",
    email: "samuel.oak@example.com",
    phoneNumber: "+1 (555) 901-2345",
    age: 29,
    gender: "Male",
    dateOfBirth: "1997-02-18",
    skills: ["Respiratory Care", "Nebulizer Therapy", "Vital Sign Tracking"],
    experience: "4 Years",
    certifications: ["Certified Medical Assistant (CMA)", "Basic Life Support (BLS)"],
    status: "Blocked",
    registrationDate: "2026-05-04",
    rating: 3.2,
    completedVisits: 45,
    punctualityRate: "82.0%",
    kycStatus: "Rejected",
    kycDetails: {
      idProof: true,
      nursingLicense: false,
      backgroundCheck: false,
    },
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    address: "88 Maple Ave, Denver, CO",
  },
];

export const initialRegistrationRequests: CaregiverRegistrationRequest[] = [
  {
    id: "REQ-CG-901",
    fullName: "Sophia Rodriguez",
    username: "sophia.rodriguez",
    email: "sophia.rodriguez@example.com",
    phoneNumber: "+1 (555) 432-1098",
    age: 33,
    gender: "Female",
    dateOfBirth: "1993-07-14",
    skills: ["Pediatric Care", "Vital Tracking", "IV Therapy", "Post-Op Rehab"],
    experience: "7 Years",
    certifications: ["Registered Nurse (RN)", "Pediatric Advanced Life Support (PALS)"],
    appliedDate: "2026-07-30",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: true,
    },
    idProofDocumentUrl: "Passport / Govt ID Verified",
    licenseDocumentUrl: "RN State Board License #RN-890123",
    backgroundCheckStatus: "Passed",
    status: "Pending Review",
    notes: "Applied via HealthPulse Mobile App. All documents uploaded.",
  },
  {
    id: "REQ-CG-902",
    fullName: "David Chen",
    username: "david.chen",
    email: "david.chen@example.com",
    phoneNumber: "+1 (555) 678-9012",
    age: 41,
    gender: "Male",
    dateOfBirth: "1985-03-30",
    skills: ["Geriatric Nursing", "Stroke Rehabilitation", "Mobility Assistance"],
    experience: "9 Years",
    certifications: ["Licensed Vocational Nurse (LVN)", "CPR Certified"],
    appliedDate: "2026-07-29",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: false,
    },
    idProofDocumentUrl: "Driver's License #DL-449102",
    licenseDocumentUrl: "LVN License #LVN-771204",
    backgroundCheckStatus: "Pending",
    status: "Pending Review",
    notes: "Background check verification pending response from state portal.",
  },
  {
    id: "REQ-CG-903",
    fullName: "Amara Okonjo",
    username: "amara.o",
    email: "amara.o@example.com",
    phoneNumber: "+1 (555) 123-9876",
    age: 36,
    gender: "Female",
    dateOfBirth: "1990-12-01",
    skills: ["Palliative Care", "Pain Management", "Vital Monitoring"],
    experience: "8 Years",
    certifications: ["Certified Nursing Assistant (CNA)", "Hospice & Palliative Specialist"],
    appliedDate: "2026-07-28",
    kycDetails: {
      idProof: true,
      nursingLicense: true,
      backgroundCheck: true,
    },
    idProofDocumentUrl: "Govt ID Card Verified",
    licenseDocumentUrl: "CNA License #CNA-331092",
    backgroundCheckStatus: "Passed",
    status: "Approved",
    notes: "Approved by Admin on 2026-07-29.",
  },
];
