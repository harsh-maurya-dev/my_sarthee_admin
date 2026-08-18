export interface MedicalService {
  id: string;
  serviceName: string;
  image: string;
  description: string;
  status: "Enabled" | "Disabled";
  category: string;
  price: string;
  createdDate: string;
}

export const initialServices: MedicalService[] = [
  {
    id: "SVC-101",
    serviceName: "Physiotherapy",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    description: "Certified physical therapists (BPT/MPT) delivering targeted muscle recovery, joint mobility, stroke rehab, post-surgery physical therapy, and pain relief exercises.",
    status: "Enabled",
    category: "Physiotherapy",
    price: "₹800 / session",
    createdDate: "2026-06-05",
  },
  {
    id: "SVC-102",
    serviceName: "Nursing",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80",
    description: "Experienced B.Sc / GNM registered nurses for ICU setup at home, IV infusions, wound dressings, catheter management, medication administration, and vital tracking.",
    status: "Enabled",
    category: "Nursing",
    price: "₹1,800 / 12h shift",
    createdDate: "2026-06-10",
  },
  {
    id: "SVC-103",
    serviceName: "Caregiver",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
    description: "Professional non-clinical and certified caregivers providing compassionate daily living assistance, elder care, feeding, mobility support, and companionship.",
    status: "Enabled",
    category: "Caregiver",
    price: "₹1,200 / shift (₹25,000 / month)",
    createdDate: "2026-06-01",
  },
];
