export interface JobPosting {
  id: string; // e.g. "JOB-501"
  jobTitle: string;
  location: string; // e.g. "Austin, TX (On-Site / Home Visits)"
  description: string;
  department: string; // e.g. "Clinical Nursing", "Physiotherapy"
  postedDate: string; // YYYY-MM-DD
  status: "Active" | "Inactive";
}

export const initialJobPostings: JobPosting[] = [
  {
    id: "JOB-501",
    jobTitle: "Senior ICU Home Care Nurse Practitioner",
    location: "Austin, TX (Home Visits)",
    description: "Seeking a licensed RN with 4+ years ICU/ER experience for 24/7 post-op and critical home care patients. Competitive compensation and flexible shift scheduling.",
    department: "Clinical Nursing",
    postedDate: "2026-07-28",
    status: "Active",
  },
  {
    id: "JOB-502",
    jobTitle: "Pediatric Physical Therapist (DPT)",
    location: "Dallas, TX (Field Rehabilitation)",
    description: "Doctor of Physical Therapy needed for pediatric mobility rehab, cerebral palsy support, and neuromuscular exercises.",
    department: "Physiotherapy",
    postedDate: "2026-07-25",
    status: "Active",
  },
  {
    id: "JOB-503",
    jobTitle: "Geriatric Care Assistant & Memory Specialist",
    location: "Houston, TX (On-Site)",
    description: "Dedicated caregiver assistant with Alzheimer's & dementia support experience to manage senior home routines and daily care.",
    department: "Senior Care",
    postedDate: "2026-07-20",
    status: "Inactive",
  },
];
