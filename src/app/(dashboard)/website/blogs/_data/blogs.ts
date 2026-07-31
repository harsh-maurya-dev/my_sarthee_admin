export interface BlogPost {
  id: string; // e.g. "BLOG-101"
  title: string;
  featuredImage: string; // Image URL
  publishDate: string; // YYYY-MM-DD
  status: "Published" | "Draft" | "Unpublished";
  content: string;
  author: string;
  readTimeMinutes?: number;
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: "BLOG-101",
    title: "Essential Post-Operative Cardiac Nursing Care at Home",
    featuredImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    publishDate: "2026-07-28",
    status: "Published",
    content: "Recovering from open-heart surgery requires careful clinical monitoring, IV wound care, and daily vital tracking. Learn how home nursing care reduces hospital readmissions by 45%.",
    author: "Dr. Sarah Jenkins",
    readTimeMinutes: 5,
  },
  {
    id: "BLOG-102",
    title: "Stroke Rehabilitation: Effective Physical Therapy Techniques",
    featuredImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800",
    publishDate: "2026-07-24",
    status: "Published",
    content: "Neuro-rehabilitation exercises tailored for post-ischemic stroke patients. Improve gait stability and muscular control with regular physical therapy sessions.",
    author: "Marcus Brody, DPT",
    readTimeMinutes: 7,
  },
  {
    id: "BLOG-103",
    title: "10 Tips for Managing Alzheimer's & Dementia Routine at Home",
    featuredImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    publishDate: "2026-07-18",
    status: "Draft",
    content: "Creating safe environments, structured schedules, and compassionate cognitive exercises for elderly family members experiencing memory loss.",
    author: "Elena Rostova",
    readTimeMinutes: 6,
  },
];
