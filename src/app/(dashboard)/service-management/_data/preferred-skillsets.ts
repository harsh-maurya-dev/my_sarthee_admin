export interface Skillset {
  id: string;
  name: string;
  description: string;
  image: string; // URL or base64 data URI for uploaded image
  status: "Active" | "Inactive";
}

export interface SkillsetDomain {
  domain: string;
  skills: Skillset[];
}

export const MAX_SKILLS_PER_DOMAIN = 8;

export const preferredSkillsets: SkillsetDomain[] = [
  {
    domain: "Nursing",
    skills: [
      {
        id: "NS-001",
        name: "General Nursing",
        description: "Vital checks, IV, fluids monitoring",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-002",
        name: "Wound Care",
        description: "Dressing, incision management",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-003",
        name: "Injection / IV",
        description: "Injections, IV therapy, line care",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-004",
        name: "Medications",
        description: "Administration, reminders review",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-005",
        name: "Post-Surgical Care",
        description: "Post-op pain, drains, sutures",
        image: "https://images.unsplash.com/photo-1551190822-a9ce113d0d15?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-006",
        name: "Chronic Condition Care",
        description: "Diabetes, HTN, COPD & more",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-007",
        name: "Palliative Care",
        description: "End-of-life care & comfort",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&q=80",
        status: "Active",
      },
      {
        id: "NS-008",
        name: "Tracheostomy Care",
        description: "Tracheostomy & suctioning",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=80&q=80",
        status: "Active",
      },
    ],
  },
  {
    domain: "Caregiver",
    skills: [
      {
        id: "CG-001",
        name: "Personal Care",
        description: "Bathing, grooming, dressing",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&q=80",
        status: "Active",
      },
      {
        id: "CG-002",
        name: "Mobility Support",
        description: "Walking, transfers, repositioning",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&q=80",
        status: "Active",
      },
      {
        id: "CG-003",
        name: "Elderly Care",
        description: "Senior care, companionship",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=80&q=80",
        status: "Active",
      },
      {
        id: "CG-004",
        name: "Feeding Support",
        description: "Assistance with feeding",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&q=80",
        status: "Active",
      },
      {
        id: "CG-005",
        name: "Dementia Care",
        description: "Alzheimer's, memory care",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80",
        status: "Active",
      },
      {
        id: "CG-006",
        name: "Post Surgical Assistance",
        description: "Daily help after surgery",
        image: "https://images.unsplash.com/photo-1551190822-a9ce113d0d15?w=80&q=80",
        status: "Active",
      },
    ],
  },
  {
    domain: "Physiotherapist",
    skills: [
      {
        id: "PT-001",
        name: "Orthopedic Rehab",
        description: "Joint, fracture & post-TKR recovery",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&q=80",
        status: "Active",
      },
      {
        id: "PT-002",
        name: "Neuro Physiotherapy",
        description: "Stroke, paralysis, nerve rehab",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80",
        status: "Active",
      },
      {
        id: "PT-003",
        name: "Sports Injury",
        description: "Muscle tear, sprain, ligament care",
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=80&q=80",
        status: "Active",
      },
      {
        id: "PT-004",
        name: "Chest Physiotherapy",
        description: "Respiratory, COPD, post-COVID rehab",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=80&q=80",
        status: "Active",
      },
      {
        id: "PT-005",
        name: "Geriatric Physio",
        description: "Elderly mobility & balance training",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=80&q=80",
        status: "Active",
      },
      {
        id: "PT-006",
        name: "Pain Management",
        description: "Chronic pain, back & neck therapy",
        image: "https://images.unsplash.com/photo-1551190822-a9ce113d0d15?w=80&q=80",
        status: "Active",
      },
    ],
  },
];
