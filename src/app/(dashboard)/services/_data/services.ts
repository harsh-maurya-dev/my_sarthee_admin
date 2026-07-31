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
    serviceName: "24/7 Virtual Telehealth Consultation",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    description: "Instant video consultation with board-certified physicians for routine diagnostics, triage, and prescription renewals.",
    status: "Enabled",
    category: "Telehealth",
    price: "$75 / consultation",
    createdDate: "2026-06-01",
  },
  {
    id: "SVC-102",
    serviceName: "In-Home Nursing Care & Vital Monitoring",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80",
    description: "Dedicated registered nurses providing round-the-clock vital signs telemetry, medication management, and daily care.",
    status: "Enabled",
    category: "Home Care",
    price: "$120 / visit",
    createdDate: "2026-06-05",
  },
  {
    id: "SVC-103",
    serviceName: "Post-Stroke & Physical Rehabilitation",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    description: "Tailored motor recovery, joint therapy, and neurological rehabilitation programs guided by senior physiotherapists.",
    status: "Enabled",
    category: "Rehabilitation",
    price: "$150 / session",
    createdDate: "2026-06-12",
  },
  {
    id: "SVC-104",
    serviceName: "Doorstep Blood Diagnostic & Pathology Lab",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80",
    description: "Hassle-free blood sample collection at home with digital EHR lab report delivery within 12 hours.",
    status: "Enabled",
    category: "Diagnostics",
    price: "$60 / test package",
    createdDate: "2026-06-20",
  },
  {
    id: "SVC-105",
    serviceName: "Geriatric Dementia & Cognitive Memory Support",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80",
    description: "Specialized memory care routines, cognitive therapy exercises, and emotional support for senior Alzheimer's patients.",
    status: "Disabled",
    category: "Senior Care",
    price: "$180 / day",
    createdDate: "2026-07-01",
  },
  {
    id: "SVC-106",
    serviceName: "Emergency ICU Ambulance & Triage Transport",
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&q=80",
    description: "Rapid-response ventilator-equipped ambulances with paramedic support for acute critical care transport.",
    status: "Enabled",
    category: "Emergency",
    price: "$250 / dispatch",
    createdDate: "2026-07-10",
  },
];
