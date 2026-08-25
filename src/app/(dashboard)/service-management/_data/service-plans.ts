export interface CaregiverPlan {
  id: string;
  planName: string;
  monthly: string;
  weekly: string;
  daily: string;
  description?: string;
  status: "Active" | "Inactive";
}

export interface NursingCoveragePlan {
  id: string;
  coverage: string;
  monthly: string;
  weekly: string;
  daily: string;
  description?: string;
  status: "Active" | "Inactive";
}

export interface PhysioSessionPlan {
  id: string;
  sessions: string;
  price: string;
  duration?: string;
  description?: string;
  status: "Active" | "Inactive";
}

export const initialCaregiverPlans: CaregiverPlan[] = [
  {
    id: "CG-PLAN-01",
    planName: "Essential Care",
    monthly: "₹25,000",
    weekly: "₹7,000",
    daily: "₹1,100",
    description: "Daily living assistance, companionship, mobility & feeding aid",
    status: "Active",
  },
  {
    id: "CG-PLAN-02",
    planName: "Comprehensive Care",
    monthly: "₹35,000",
    weekly: "₹9,500",
    daily: "₹1,500",
    description: "Specialized dementia support, fall prevention & full grooming assistance",
    status: "Active",
  },
  {
    id: "CG-PLAN-03",
    planName: "24/7 Live-in Care",
    monthly: "₹48,000",
    weekly: "₹13,000",
    daily: "₹2,000",
    description: "Round-the-clock dedicated caregiver support for complete peace of mind",
    status: "Active",
  },
];

export const initialNursingPlans: NursingCoveragePlan[] = [
  {
    id: "NUR-COV-01",
    coverage: "2 hours/day",
    monthly: "₹11,250",
    weekly: "₹3,000",
    daily: "₹500",
    description: "Quick clinical visits, injections, vitals & wound dressing",
    status: "Active",
  },
  {
    id: "NUR-COV-02",
    coverage: "5 hours/day",
    monthly: "₹22,500",
    weekly: "₹6,000",
    daily: "₹1,000",
    description: "Post-surgical care, IV infusions, medication administration & catheter care",
    status: "Active",
  },
  {
    id: "NUR-COV-03",
    coverage: "10 hours/day",
    monthly: "₹45,000",
    weekly: "₹12,000",
    daily: "₹1,800",
    description: "Extensive shift nursing, critical monitoring & specialized recovery",
    status: "Active",
  },
  {
    id: "NUR-COV-04",
    coverage: "12 hours/day (Shift)",
    monthly: "₹52,000",
    weekly: "₹14,000",
    daily: "₹2,200",
    description: "Full day / night shift dedicated ICU-trained nursing supervision",
    status: "Active",
  },
];

export const initialPhysioPlans: PhysioSessionPlan[] = [
  {
    id: "PT-SESS-01",
    sessions: "1 session/day",
    price: "₹700/session",
    duration: "45 mins",
    description: "Single targeted physiotherapy or pain relief session",
    status: "Active",
  },
  {
    id: "PT-SESS-02",
    sessions: "7 sessions/week",
    price: "₹4,500/week",
    duration: "45 mins/session",
    description: "Intensive 1-week recovery for acute muscle or joint rehab",
    status: "Active",
  },
  {
    id: "PT-SESS-03",
    sessions: "12 sessions/month",
    price: "₹12,000/month",
    duration: "45 mins/session",
    description: "Alternate day physical therapy for steady post-op / orthopedic recovery",
    status: "Active",
  },
  {
    id: "PT-SESS-04",
    sessions: "30 sessions/month",
    price: "₹18,000/month",
    duration: "45 mins/session",
    description: "Comprehensive daily stroke, neurological or joint replacement rehab",
    status: "Active",
  },
];
