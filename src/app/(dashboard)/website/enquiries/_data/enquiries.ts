export interface WebsiteEnquiry {
  id: string; // e.g. "ENQ-601"
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedDate: string; // YYYY-MM-DD
  status: "New" | "Contacted" | "Resolved";
  responseNotes?: string;
}

export const initialWebsiteEnquiries: WebsiteEnquiry[] = [
  {
    id: "ENQ-601",
    name: "Eleanor Vance",
    email: "e.vance@example.com",
    phone: "+1 (555) 901-3322",
    subject: "Inquiry Regarding Post-Op Cardiac Care Package Rates",
    message: "Hello, my father is being discharged after bypass surgery next week. I would like to inquire about 24/7 home nursing package costs and caregiver availability in North Austin.",
    submittedDate: "2026-07-31",
    status: "New",
  },
  {
    id: "ENQ-602",
    name: "Gregory Hayes",
    email: "g.hayes@example.com",
    phone: "+1 (555) 443-8811",
    subject: "Physical Therapy Home Visits for Stroke Recovery",
    message: "Seeking home visit physical therapy schedule for my mother following ischemic stroke. Please share list of licensed DPT therapists.",
    submittedDate: "2026-07-30",
    status: "Contacted",
    responseNotes: "Called client on July 30. Sent physical therapy brochure to email.",
  },
  {
    id: "ENQ-603",
    name: "Arthur Pendelton",
    email: "arthur.p@example.com",
    phone: "+1 (555) 223-9900",
    subject: "Elderly Dementia Support Membership Query",
    message: "Need evening caregiver assistant for Alzheimer's patient care. Want to confirm insurance coverage.",
    submittedDate: "2026-07-28",
    status: "Resolved",
    responseNotes: "Insurance copay confirmed and assigned caregiver Elena Rostova.",
  },
];
