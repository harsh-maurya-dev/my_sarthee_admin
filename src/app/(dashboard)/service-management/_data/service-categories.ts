export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string; // URL or base64 data URI
  shift: string;
  status: "Active" | "Inactive";
  servicesCount: number;
  createdDate: string;
}

export const initialServiceCategories: ServiceCategory[] = [
  {
    id: "SCAT-001",
    title: "Physiotherapy",
    description: "Certified physical therapists delivering targeted recovery, joint mobility, stroke rehab, and pain relief programs at home.",
    icon: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&q=80",
    shift: "Per Session",
    status: "Active",
    servicesCount: 12,
    createdDate: "2026-03-15",
  },
  {
    id: "SCAT-002",
    title: "Nursing",
    description: "Experienced registered nurses for ICU setup, IV infusions, wound care, catheter management, and vital monitoring at home.",
    icon: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=100&q=80",
    shift: "12h Shift",
    status: "Active",
    servicesCount: 8,
    createdDate: "2026-03-20",
  },
  {
    id: "SCAT-003",
    title: "Caregiver",
    description: "Professional caregivers providing compassionate daily living assistance, elder care, feeding, mobility support, and companionship.",
    icon: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&q=80",
    shift: "24h Shift",
    status: "Active",
    servicesCount: 6,
    createdDate: "2026-04-01",
  },
];
