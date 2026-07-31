export interface CMSSectionContent {
  sectionId: "why-mysarthee" | "join-as-caregiver" | "contact-us" | "privacy-policy" | "terms-conditions" | "about-us" | "faqs";
  sectionTitle: string;
  headline: string;
  subheadline: string;
  bodyContent: string;
  lastUpdated: string;
  items?: {
    title: string;
    description: string;
  }[];
}

export const initialCMSSections: Record<string, CMSSectionContent> = {
  "why-mysarthee": {
    sectionId: "why-mysarthee",
    sectionTitle: "Why MySarthee",
    headline: "Compassionate, Certified Clinical Care At Your Doorstep",
    subheadline: "Empowering patients and families with expert home healthcare nurses, physical therapists, and elderly care assistants.",
    bodyContent: "MySarthee bridges the gap between hospital care and home recovery. Our AI smart-assignment algorithm matches verified healthcare caregivers based on proximity, clinical specializations, and patient recovery needs.",
    lastUpdated: "2026-07-28",
    items: [
      { title: "24/7 Verified Caregivers", description: "All nurses & therapists pass rigorous KYC, license verification, and background checks." },
      { title: "Real-time Telemetry & GPS", description: "Live visit monitoring and vitals tracking via caregiver mobile app." },
      { title: "Transparent Pricing", description: "Clear pricing with no hidden charges, insurance co-pay integration, and flexible shift packages." },
    ],
  },

  "join-as-caregiver": {
    sectionId: "join-as-caregiver",
    sectionTitle: "Join as Caregiver",
    headline: "Build a Rewarding Career as a Certified MySarthee Caregiver",
    subheadline: "Earn competitive compensation, set your own flexible shift hours, and deliver meaningful patient care.",
    bodyContent: "Whether you are a Registered Nurse (RN), Doctor of Physical Therapy (DPT), or Certified Nursing Assistant (CNA), MySarthee provides a direct platform to connect with local home care patients.",
    lastUpdated: "2026-07-25",
    items: [
      { title: "Instant Payout Settlements", description: "Receive direct automated bank transfers with full commission transparency." },
      { title: "Flexible Shift Dispatch", description: "Accept shifts that match your schedule via our caregiver mobile app." },
    ],
  },

  "contact-us": {
    sectionId: "contact-us",
    sectionTitle: "Contact Us",
    headline: "We are Here to Support Your Family 24/7",
    subheadline: "Reach out to our patient care coordinators anytime for immediate assistance.",
    bodyContent: "Phone: +1 (800) 555-SARTHEE\nEmail: support@mysarthee.health\nHeadquarters: 100 Health Sciences Plaza, Suite 400, Austin, TX 78701",
    lastUpdated: "2026-07-20",
  },

  "privacy-policy": {
    sectionId: "privacy-policy",
    sectionTitle: "Privacy Policy",
    headline: "Patient Data Privacy & HIPAA Compliance Statement",
    subheadline: "Your medical telemetry and personal information are secured with bank-grade encryption.",
    bodyContent: "MySarthee adheres strictly to HIPAA privacy regulations and global data safety standards. Personal health information (PHI) is encrypted at rest and in transit. We never sell or share patient records with unauthorized third parties.",
    lastUpdated: "2026-07-15",
  },

  "terms-conditions": {
    sectionId: "terms-conditions",
    sectionTitle: "Terms & Conditions",
    headline: "Platform Usage & Healthcare Service Terms",
    subheadline: "Guidelines governing caregiver assignments, service booking cancellations, and payment terms.",
    bodyContent: "By accessing MySarthee services, patients and caregivers agree to adhere to standard clinical safety protocols. Cancellation of scheduled shifts requires at least 4 hours advance notification for full refund processing.",
    lastUpdated: "2026-07-10",
  },

  "about-us": {
    sectionId: "about-us",
    sectionTitle: "About Us",
    headline: "Transforming Home Healthcare with Technology & Compassion",
    subheadline: "Founded in 2024 to deliver hospital-grade clinical recovery in the comfort of your home.",
    bodyContent: "MySarthee was built by medical professionals and software engineers committed to elevating home nursing care standards. Our platform connects thousands of patients with verified healthcare specialists every day.",
    lastUpdated: "2026-07-01",
  },

  "faqs": {
    sectionId: "faqs",
    sectionTitle: "FAQs",
    headline: "Frequently Asked Questions",
    subheadline: "Common questions regarding home care bookings, caregiver qualifications, and billing.",
    bodyContent: "Find instant answers to popular questions regarding MySarthee healthcare services.",
    lastUpdated: "2026-07-30",
    items: [
      { title: "How are caregivers verified?", description: "Every caregiver undergoes ID proof verification, nursing license validation, and criminal background checks." },
      { title: "Can I choose my caregiver?", description: "Yes! You can view caregiver profiles, match scores, and ratings before confirming your booking." },
      { title: "What if a caregiver is delayed?", description: "Our real-time visit monitoring system automatically alerts dispatch to arrange an instant replacement." },
    ],
  },
};
