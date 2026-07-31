export interface WebsiteService {
  id: string;
  serviceName: string;
  description: string;
  imageUrl: string;
  status: "Active" | "Inactive";
  creationDate: string; // YYYY-MM-DD
}

export const initialWebsiteServices: WebsiteService[] = [
  {
    id: "WS-301",
    serviceName: "Post-Op Cardiac & Wound Nursing Care",
    description: "Specialized 24/7 post-operative clinical nursing, IV antibiotic therapy, and wound care delivered in patient homes.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    status: "Active",
    creationDate: "2026-07-20",
  },
  {
    id: "WS-302",
    serviceName: "Stroke & Gait Physical Therapy",
    description: "Personalized neuromuscular physical rehabilitation for stroke recovery and mobility restoration.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800",
    status: "Active",
    creationDate: "2026-07-15",
  },
  {
    id: "WS-303",
    serviceName: "Dementia & Elderly Care Assistant",
    description: "Compassionate daily living support, cognitive stimulation, and safety supervision for senior citizens.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    status: "Active",
    creationDate: "2026-07-10",
  },
  {
    id: "WS-304",
    serviceName: "24/7 ICU at Home & Oxygen Telemetry",
    description: "Complete intensive care setup with digital vitals monitoring, ventilator assistance, and dedicated nursing staff.",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
    status: "Inactive",
    creationDate: "2026-07-05",
  },
];
