export interface JobApplication {
  id: string; // e.g. "APP-901"
  candidateName: string;
  email: string;
  phone: string;
  qualification: string; // e.g. "BSN, Registered Nurse (RN), 6 yrs experience"
  appliedJobTitle: string;
  resumeUrl: string; // PDF link
  appliedDate: string; // YYYY-MM-DD
  status: "New" | "Shortlisted" | "Rejected";
  rejectionReason?: string;
}

export const initialJobApplications: JobApplication[] = [
  {
    id: "APP-901",
    candidateName: "Dr. Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-9911",
    qualification: "BSN, Registered Nurse (RN), 6 Years ICU & Home Care Experience",
    appliedJobTitle: "Senior ICU Home Care Nurse Practitioner",
    resumeUrl: "/docs/resume_sarah_jenkins.pdf",
    appliedDate: "2026-07-29",
    status: "New",
  },
  {
    id: "APP-902",
    candidateName: "Marcus Brody, DPT",
    email: "marcus.b@example.com",
    phone: "+1 (555) 881-2244",
    qualification: "Doctor of Physical Therapy (DPT), Certified Stroke Rehab Specialist",
    appliedJobTitle: "Pediatric Physical Therapist (DPT)",
    resumeUrl: "/docs/resume_marcus_brody.pdf",
    appliedDate: "2026-07-27",
    status: "Shortlisted",
  },
  {
    id: "APP-903",
    candidateName: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+1 (555) 334-8800",
    qualification: "Certified Nursing Assistant (CNA), 3 Years Elderly Dementia Care",
    appliedJobTitle: "Geriatric Care Assistant & Memory Specialist",
    resumeUrl: "/docs/resume_elena_rostova.pdf",
    appliedDate: "2026-07-25",
    status: "Rejected",
    rejectionReason: "Does not meet 5+ years minimum acute geriatric care criteria.",
  },
];
