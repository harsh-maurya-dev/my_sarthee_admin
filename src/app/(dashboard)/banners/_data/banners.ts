export interface StaticBanner {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  targetLink?: string;
  creationDate: string; // YYYY-MM-DD
  status: "Active" | "Inactive";
}

export const initialStaticBanners: StaticBanner[] = [
  {
    id: "BNR-201",
    title: "Post-Op Cardiac Rehab & Special Home Care Package",
    shortDescription: "Exclusive 30-day intensive nursing & vitals monitoring package for cardiac post-op recovery.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    targetLink: "/services/post-op-care",
    creationDate: "2026-07-25",
    status: "Active",
  },
  {
    id: "BNR-202",
    title: "24/7 Expert Physical Therapy at Home",
    shortDescription: "Certified stroke & gait rehabilitation specialists delivered directly to your doorstep.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800",
    targetLink: "/services/physiotherapy",
    creationDate: "2026-07-20",
    status: "Active",
  },
  {
    id: "BNR-203",
    title: "Senior Care & Memory Support Membership",
    shortDescription: "Dedicated elderly care assistants trained in Alzheimer's & dementia support.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    targetLink: "/services/elderly-care",
    creationDate: "2026-07-10",
    status: "Inactive",
  },
];
