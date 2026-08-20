// Comprehensive Centralized Data Store for MySarthee Admin Operations

export type CareType =
  | "Nursing"
  | "Caregiving"
  | "Personal Care"
  | "Physiotherapy"
  | "Health Monitoring"
  | "Combination";

export type CareFrequency =
  | "Once daily"
  | "Twice daily"
  | "Alternate days"
  | "24/7 Live-in"
  | "Custom";

export type CareDuration =
  | "7 days"
  | "14 days"
  | "30 days"
  | "Ongoing"
  | "Custom";

export type RiskLevel = "Critical" | "High" | "Medium" | "Normal";

export type PatientStatus = "Active" | "Scheduled" | "Pending Assignment" | "On Hold" | "Completed" | "Pending";

export type PaymentStatus = "Paid" | "Pending" | "Partially Paid" | "Overdue";

export type ProfessionalType = "Nurse" | "Caregiver" | "Physiotherapist" | "Coordinator";

export type ProfessionalStatus =
  | "Available"
  | "Assigned"
  | "Accepted"
  | "En route"
  | "Care Started"
  | "Care Completed"
  | "Off Duty";

export type EscalationPriority = "Critical" | "High" | "Medium" | "Resolved";

export type ReferralSource =
  | "Hospital"
  | "Doctor"
  | "Physiotherapist"
  | "Insurance company"
  | "Corporate"
  | "Existing patient"
  | "Digital"
  | "Direct";

export type UserRole =
  | "Super Admin"
  | "Operations Manager"
  | "Care Coordinator"
  | "Clinical/Quality Manager"
  | "Finance"
  | "Customer Support"
  | "Business Development";

// 1. Patient 360 Interfaces
export interface CareTeamMember {
  id: string;
  name: string;
  role: ProfessionalType;
  phone: string;
  rating: number;
  avatar?: string;
  status: ProfessionalStatus;
}

export interface CarePlanMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: "Completed" | "In Progress" | "Pending";
  outcome: string;
}

export interface CarePlanDetails {
  id: string;
  careType: CareType;
  frequency: CareFrequency;
  duration: CareDuration;
  startDate: string;
  endDate: string;
  goals: string;
  specialRequirements: string[];
  activitiesProgress: {
    activity: string;
    target: string;
    completed: number;
    total: number;
    unit: string;
  }[];
  milestones: CarePlanMilestone[];
}

export interface DailyVisitActivity {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  caregiverName: string;
  caregiverRole: ProfessionalType;
  tasksCompleted: string[];
  vitals: {
    bp: string;
    spo2: string;
    pulse: string;
    temp: string;
    sugar?: string;
  };
  notes: string;
  familyFeedback?: string;
  discomfortReported?: boolean;
  coordinatorReviewRequired?: boolean;
  status: "In Progress" | "Completed" | "Missed" | "Delayed";
}

export interface PatientInvoice {
  id: string;
  bookingId: string;
  date: string;
  bookingValue: number;
  discount: number;
  tax: number;
  amountPaid: number;
  balance: number;
  status: PaymentStatus;
  paymentMethod?: string;
}

export interface CommunicationTouchpoint {
  id: string;
  type:
    | "Booking confirmation sent"
    | "Caregiver assigned"
    | "Care started"
    | "Visit completed"
    | "Care plan changed"
    | "Payment reminder sent"
    | "Feedback requested"
    | "Manual Call Log"
    | "WhatsApp Update";
  channel: "WhatsApp" | "SMS" | "Push Notification" | "Phone Call" | "Email";
  timestamp: string;
  sender: string;
  summary: string;
  deliveryStatus: "Delivered" | "Read" | "Sent" | "Failed";
}

export interface Patient360 {
  id: string;
  patientId: string; // formatted e.g. MS-1024
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  locationArea: string; // e.g. Andheri West, Bandra, Powai
  primaryContactName: string;
  primaryContactRelation: string;
  primaryContactPhone: string;
  primaryContactWhatsapp: string;
  emergencyContact: string;
  
  // Medical recovery info
  primaryDiagnosis: string;
  allergies: string[];
  mobilityLevel: "Independent" | "Assisted Walker" | "Bedbound" | "Wheelchair";
  doctorName: string;
  doctorHospital: string;
  doctorNotes: string;
  
  // Care info
  careRequired: CareType;
  careStartDate: string;
  currentStatus: PatientStatus;
  riskIndicator: RiskLevel;
  riskReason?: string;
  
  // Modules
  carePlan: CarePlanDetails;
  assignedTeam: CareTeamMember[];
  dailyVisits: DailyVisitActivity[];
  invoices: PatientInvoice[];
  communicationHistory: CommunicationTouchpoint[];
  adminNotes: { id: string; author: string; role: string; date: string; content: string }[];
  referralSource: ReferralSource;
  referralPartnerName?: string;
}

// 2. Care Professional Interface
export interface CareProfessional {
  id: string;
  name: string;
  type: "Nurse" | "Caregiver" | "Physiotherapist";
  phone: string;
  email: string;
  area: string; // e.g. Andheri, Bandra, Powai, Juhu, South Mumbai
  status: ProfessionalStatus;
  currentAssignment?: {
    patientId: string;
    patientName: string;
    location: string;
    shiftTime: string;
    status: string;
  };
  specializations: string[];
  experienceYears: number;
  rating: number;
  totalVisitsCompleted: number;
  onDutyToday: boolean;
  avatar?: string;
  qualification: string;
  languages: string[];
  policeVerified: boolean;
}

// 3. Escalation Interface
export interface EscalationRecord {
  id: string;
  escalationId: string; // e.g. ESC-802
  patientId: string;
  patientName: string;
  patientLocation: string;
  professionalName: string;
  professionalRole: ProfessionalType;
  issue: string;
  category: "Medical concern / emergency" | "Caregiver issue / no-show" | "Missed visit" | "Patient complaint" | "Delayed care" | "Schedule change" | "Replacement required";
  timeRaised: string;
  priority: EscalationPriority;
  assignedTo: string;
  assignedRole: string;
  actionTaken: string;
  resolutionNotes?: string;
  closureTime?: string;
  status: "Open" | "Investigating" | "Action In Progress" | "Resolved";
  requiresDoctorConsult?: boolean;
}

// 4. Booking Interface
export interface BookingItem {
  id: string;
  bookingCode: string; // e.g. BK-2045
  patientId: string;
  patientName: string;
  ageGender: string;
  careType: CareType;
  locationArea: string;
  startDate: string;
  duration: CareDuration;
  frequency: CareFrequency;
  status: "New" | "Pending Assignment" | "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  assignedProfessional?: {
    name: string;
    type: ProfessionalType;
    phone: string;
  };
  billing: {
    bookingValue: number;
    discount: number;
    tax: number;
    amountPaid: number;
    balance: number;
    paymentStatus: PaymentStatus;
  };
  matchScoreCandidate?: {
    professionalId: string;
    professionalName: string;
    matchScore: number;
    matchReasons: string[];
  };
}

// 5. Today's Operation Feed Item
export interface OperationFeedItem {
  id: string;
  type:
    | "new_booking"
    | "assignment_pending"
    | "professional_accepted"
    | "care_started"
    | "care_completed"
    | "escalation"
    | "cancellation";
  title: string;
  description: string;
  patientId: string;
  patientName: string;
  professionalName?: string;
  area: string;
  timestamp: string;
  priority?: RiskLevel;
  actionLabel?: string;
}

// 6. Referral Partner Interface
export interface ReferralPartner {
  id: string;
  name: string;
  type: ReferralSource;
  contactPerson: string;
  phone: string;
  email: string;
  cityArea: string;
  totalReferrals: number;
  activePatients: number;
  conversionRate: number; // percentage e.g. 88
  totalRevenueGenerated: number; // in INR
  payoutCommissionRate: number; // percentage e.g. 8%
  status: "Active" | "Pending Review" | "Inactive";
}

// -------------------------------------------------------------
// SEED MOCK DATA
// -------------------------------------------------------------

export const initialCareProfessionals: CareProfessional[] = [
  {
    id: "CP-01",
    name: "Priya Sharma",
    type: "Nurse",
    phone: "+91 98201 23456",
    email: "priya.sharma@mysarthee.care",
    area: "Andheri",
    status: "Available",
    specializations: ["Post-Op Recovery", "Wound Care", "IV Infusion", "Tracheostomy"],
    experienceYears: 6,
    rating: 4.9,
    totalVisitsCompleted: 420,
    onDutyToday: true,
    qualification: "B.Sc Nursing (KEM Hospital)",
    languages: ["English", "Hindi", "Marathi"],
    policeVerified: true,
  },
  {
    id: "CP-02",
    name: "Sunita Deshmukh",
    type: "Caregiver",
    phone: "+91 98334 56789",
    email: "sunita.d@mysarthee.care",
    area: "Bandra",
    status: "Care Started",
    currentAssignment: {
      patientId: "MS-1042",
      patientName: "Kamala Mehta",
      location: "Bandra West (Waterfield Rd)",
      shiftTime: "08:00 AM - 08:00 PM",
      status: "Medication & Mobility assist active",
    },
    specializations: ["Elderly Mobility", "Dementia Care", "Bed-sore prevention", "Vital Monitoring"],
    experienceYears: 5,
    rating: 4.8,
    totalVisitsCompleted: 380,
    onDutyToday: true,
    qualification: "Certified Geriatric Care Specialist (MySarthee Academy)",
    languages: ["Hindi", "Marathi", "Gujarati"],
    policeVerified: true,
  },
  {
    id: "CP-03",
    name: "Rahul Verma",
    type: "Physiotherapist",
    phone: "+91 98212 34567",
    email: "rahul.verma@mysarthee.care",
    area: "Powai",
    status: "Available",
    specializations: ["Neuro-Rehab", "Stroke Recovery", "Knee/Hip Replacement", "Gait Training"],
    experienceYears: 7,
    rating: 5.0,
    totalVisitsCompleted: 510,
    onDutyToday: true,
    qualification: "MPT Neuro-Physiotherapy",
    languages: ["English", "Hindi"],
    policeVerified: true,
  },
  {
    id: "CP-04",
    name: "Anita Jadhav",
    type: "Nurse",
    phone: "+91 98765 43210",
    email: "anita.j@mysarthee.care",
    area: "Juhu",
    status: "En route",
    currentAssignment: {
      patientId: "MS-1024",
      patientName: "Dr. Arvind Kulkarni",
      location: "Juhu Scheme (10th Rd)",
      shiftTime: "09:00 AM - 01:00 PM",
      status: "En route via Scooter (ETA 8 mins)",
    },
    specializations: ["ICU at Home", "Cardiac Monitoring", "Catheter Care"],
    experienceYears: 8,
    rating: 4.95,
    totalVisitsCompleted: 640,
    onDutyToday: true,
    qualification: "GMN & Critical Care Certified",
    languages: ["English", "Hindi", "Marathi"],
    policeVerified: true,
  },
  {
    id: "CP-05",
    name: "Ramesh Pawar",
    type: "Caregiver",
    phone: "+91 97654 32190",
    email: "ramesh.p@mysarthee.care",
    area: "South Mumbai",
    status: "Accepted",
    currentAssignment: {
      patientId: "MS-1055",
      patientName: "Sorabji Godrej",
      location: "Malabar Hill",
      shiftTime: "10:00 AM - 06:00 PM",
      status: "Accepted booking - departure scheduled 09:15 AM",
    },
    specializations: ["Parkinson's Support", "Palliative Care", "Assisted Bathing"],
    experienceYears: 4,
    rating: 4.75,
    totalVisitsCompleted: 290,
    onDutyToday: true,
    qualification: "Home Health Aide Diploma",
    languages: ["Hindi", "Marathi", "English"],
    policeVerified: true,
  },
  {
    id: "CP-06",
    name: "Dr. Neha Kothari",
    type: "Physiotherapist",
    phone: "+91 98199 87654",
    email: "neha.kothari@mysarthee.care",
    area: "Andheri",
    status: "Care Completed",
    currentAssignment: {
      patientId: "MS-1011",
      patientName: "Rajendra Shah",
      location: "Lokhandwala, Andheri",
      shiftTime: "07:30 AM - 08:45 AM",
      status: "Session completed - Vitals & ROM logged",
    },
    specializations: ["Ortho Rehab", "Spine Care", "Chest Physiotherapy"],
    experienceYears: 9,
    rating: 4.9,
    totalVisitsCompleted: 780,
    onDutyToday: true,
    qualification: "BPT, Masters in Musculoskeletal Rehab",
    languages: ["English", "Hindi", "Gujarati"],
    policeVerified: true,
  },
  {
    id: "CP-07",
    name: "Meena Patel",
    type: "Caregiver",
    phone: "+91 99203 11223",
    email: "meena.p@mysarthee.care",
    area: "Chembur",
    status: "Available",
    specializations: ["Post-Hospitalization Discharge Care", "Diabetic Dietician Assist"],
    experienceYears: 3,
    rating: 4.6,
    totalVisitsCompleted: 180,
    onDutyToday: true,
    qualification: "Certified Nursing Assistant",
    languages: ["Hindi", "Gujarati", "English"],
    policeVerified: true,
  },
  {
    id: "CP-08",
    name: "Sanjay Shinde",
    type: "Nurse",
    phone: "+91 98450 99887",
    email: "sanjay.s@mysarthee.care",
    area: "Bandra",
    status: "Off Duty",
    specializations: ["Emergency Response", "Ventilator Management", "Dialysis Assist"],
    experienceYears: 10,
    rating: 4.85,
    totalVisitsCompleted: 890,
    onDutyToday: false,
    qualification: "B.Sc Nursing, BLS/ACLS Certified",
    languages: ["English", "Hindi", "Marathi"],
    policeVerified: true,
  },
];

export const initialPatients360: Patient360[] = [
  {
    id: "pat-1",
    patientId: "MS-1024",
    fullName: "Dr. Arvind Kulkarni",
    age: 72,
    gender: "Male",
    dateOfBirth: "1954-04-12",
    bloodGroup: "B+",
    address: "Flat 402, Sea Breeze Apts, 10th Road, Juhu Scheme",
    locationArea: "Juhu",
    primaryContactName: "Tanmay Kulkarni",
    primaryContactRelation: "Son",
    primaryContactPhone: "+91 98200 11223",
    primaryContactWhatsapp: "+91 98200 11223",
    emergencyContact: "Dr. Rohini Kulkarni (Wife) - +91 98200 33445",
    primaryDiagnosis: "Post-Ischemic Stroke Recovery with Left Hemiparesis & Type 2 Diabetes",
    allergies: ["Penicillin", "Sulfa drugs"],
    mobilityLevel: "Assisted Walker",
    doctorName: "Dr. Farokh Udwadia",
    doctorHospital: "Breach Candy Hospital",
    doctorNotes: "Focus on active-assisted range of motion for left upper limb. Maintain BP < 135/85 mmHg. Daily fasting sugar monitoring required.",
    careRequired: "Nursing",
    careStartDate: "2026-08-01",
    currentStatus: "Active",
    riskIndicator: "Critical",
    riskReason: "SpO2 dipped to 91% on exertion during morning shift; elevated BP (152/94). Coordinator review required.",
    carePlan: {
      id: "CP-1024",
      careType: "Nursing",
      frequency: "Twice daily",
      duration: "30 days",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      goals: "Regain independent standing balance, prevent contractures, maintain stable glycemic indices (< 130 mg/dL fasting), and prevent pressure sores.",
      specialRequirements: [
        "Strict low-sodium, diabetic diet",
        "Two-person assist during shower transfer",
        "Passive stretching of left fingers every 4 hours",
        "Daily morning & evening vital telemetry sync",
      ],
      activitiesProgress: [
        { activity: "Physio Mobility Drills", target: "Daily 45 mins", completed: 16, total: 30, unit: "sessions" },
        { activity: "Vital Log Telemetry", target: "2x per day", completed: 32, total: 60, unit: "logs" },
        { activity: "Medication Reminders", target: "3x daily schedule", completed: 48, total: 90, unit: "doses" },
        { activity: "Upper Limb ROM", target: "Daily passive exercise", completed: 15, total: 30, unit: "drills" },
      ],
      milestones: [
        { id: "m1", title: "Bed-to-chair transfer with single-person assist", targetDate: "2026-08-10", status: "Completed", outcome: "Achieved smoothly on Day 9 without dizziness." },
        { id: "m2", title: "Walker gait for 20 meters uninterrupted", targetDate: "2026-08-20", status: "In Progress", outcome: "Currently achieving 12 meters with gait belt." },
        { id: "m3", title: "Independent spoon holding & feeding", targetDate: "2026-08-30", status: "Pending", outcome: "Fine motor retraining undergoing with Physio." },
      ],
    },
    assignedTeam: [
      { id: "CP-04", name: "Anita Jadhav", role: "Nurse", phone: "+91 98765 43210", rating: 4.95, status: "En route" },
      { id: "CP-02", name: "Sunita Deshmukh", role: "Caregiver", phone: "+91 98334 56789", rating: 4.8, status: "Care Started" },
      { id: "CP-03", name: "Rahul Verma", role: "Physiotherapist", phone: "+91 98212 34567", rating: 5.0, status: "Available" },
      { id: "CORD-01", name: "Dr. Vikram Joshi", role: "Coordinator", phone: "+91 98200 99001", rating: 5.0, status: "Available" },
    ],
    dailyVisits: [
      {
        id: "vis-1",
        date: "2026-08-17",
        checkInTime: "09:02 AM",
        caregiverName: "Anita Jadhav",
        caregiverRole: "Nurse",
        tasksCompleted: [
          "Caregiver checked in via GPS at 9:02 AM",
          "Medication reminder completed (Ecosprin, Telmisartan)",
          "Mobility assistance completed (10 min hallway walk)",
          "Vitals recorded & uploaded to telemetry",
        ],
        vitals: { bp: "152/94", spo2: "91%", pulse: "86 bpm", temp: "98.4°F", sugar: "138 mg/dL" },
        notes: "Patient reported increased shortness of breath after 5 mins standing. Resting SpO2 is 94%, drops to 91% on exertion. Alerted Dr. Vikram Joshi.",
        familyFeedback: "Son Tanmay requested Dr. Joshi tele-consult.",
        discomfortReported: true,
        coordinatorReviewRequired: true,
        status: "In Progress",
      },
      {
        id: "vis-2",
        date: "2026-08-16",
        checkInTime: "09:00 AM",
        checkOutTime: "01:00 PM",
        caregiverName: "Anita Jadhav",
        caregiverRole: "Nurse",
        tasksCompleted: [
          "Check-in at 9:00 AM",
          "Morning hygiene and bed bath",
          "BP & Glucose check (132/82, 114 mg/dL)",
          "Range of motion left arm exercises",
          "Family diet chart consultation",
        ],
        vitals: { bp: "132/82", spo2: "97%", pulse: "74 bpm", temp: "98.2°F", sugar: "114 mg/dL" },
        notes: "Stable day. Good appetite. Patient walked 15 meters with walker.",
        status: "Completed",
      },
    ],
    invoices: [
      {
        id: "INV-2026-08-1024",
        bookingId: "BK-2045",
        date: "2026-08-01",
        bookingValue: 48000,
        discount: 3000,
        tax: 8100,
        amountPaid: 35000,
        balance: 18100,
        status: "Pending",
        paymentMethod: "UPI / Net Banking",
      },
    ],
    communicationHistory: [
      {
        id: "comm-1",
        type: "Care started",
        channel: "WhatsApp",
        timestamp: "2026-08-17 09:03 AM",
        sender: "MySarthee Automation",
        summary: "Sent check-in notification & daily care checklist link to son Tanmay (+91 98200 11223).",
        deliveryStatus: "Read",
      },
      {
        id: "comm-2",
        type: "Caregiver assigned",
        channel: "WhatsApp",
        timestamp: "2026-08-16 06:30 PM",
        sender: "Care Coordinator Dr. Joshi",
        summary: "Shared Nurse Anita Jadhav profile, badge, and ETA for Monday morning shift.",
        deliveryStatus: "Read",
      },
      {
        id: "comm-3",
        type: "Payment reminder sent",
        channel: "SMS",
        timestamp: "2026-08-15 11:00 AM",
        sender: "Finance Bot",
        summary: "Invoice #INV-2026-08-1024 balance payment reminder (₹18,100) sent with Razorpay link.",
        deliveryStatus: "Delivered",
      },
      {
        id: "comm-4",
        type: "Booking confirmation sent",
        channel: "WhatsApp",
        timestamp: "2026-08-01 10:15 AM",
        sender: "System",
        summary: "30-Day Stroke Recovery Package confirmation & Welcome Kit sent.",
        deliveryStatus: "Read",
      },
    ],
    adminNotes: [
      {
        id: "an-1",
        author: "Dr. Vikram Joshi",
        role: "Care Coordinator",
        date: "2026-08-17 09:20 AM",
        content: "Reviewed morning telemetry alert. Instructed Anita to keep patient sitting at 45 degrees with oxygen concentrator on standby. Scheduling video consult with Dr. Udwadia's registrar at 11:30 AM.",
      },
    ],
    referralSource: "Hospital",
    referralPartnerName: "Breach Candy Hospital (Neuro Dept)",
  },
  {
    id: "pat-2",
    patientId: "MS-1042",
    fullName: "Kamala Mehta",
    age: 81,
    gender: "Female",
    dateOfBirth: "1945-09-21",
    bloodGroup: "O+",
    address: "701 Horizon Towers, Waterfield Road, Bandra West",
    locationArea: "Bandra",
    primaryContactName: "Rohan Mehta",
    primaryContactRelation: "Son",
    primaryContactPhone: "+91 98211 44556",
    primaryContactWhatsapp: "+91 98211 44556",
    emergencyContact: "Pooja Mehta (Daughter-in-law) - +91 98211 77889",
    primaryDiagnosis: "Mild Alzheimer's Dementia & Osteoarthritis Bilateral Knees",
    allergies: ["None known"],
    mobilityLevel: "Independent",
    doctorName: "Dr. Alok Sharma",
    doctorHospital: "Lilavati Hospital",
    doctorNotes: "Requires constant companionship to prevent disorientation and wandering. Medication compliance critical. Gentle knee exercises.",
    careRequired: "Caregiving",
    careStartDate: "2026-07-15",
    currentStatus: "Active",
    riskIndicator: "Medium",
    riskReason: "Caregiver replacement requested for coming weekend due to personal leave.",
    carePlan: {
      id: "CP-1042",
      careType: "Caregiving",
      frequency: "Once daily",
      duration: "30 days",
      startDate: "2026-07-15",
      endDate: "2026-08-25",
      goals: "Maintain cognitive orientation, prevent falls, assist with daily activities, and ensure medication adherence.",
      specialRequirements: ["Cognitive memory games in evening", "Warm knee compression twice daily", "Hydration monitoring"],
      activitiesProgress: [
        { activity: "Medication Supervision", target: "Daily 3 doses", completed: 78, total: 90, unit: "doses" },
        { activity: "Memory Stimulation Activity", target: "Daily 30 mins", completed: 25, total: 30, unit: "sessions" },
        { activity: "Gentle Knee Exercises", target: "Twice daily", completed: 48, total: 60, unit: "sessions" },
      ],
      milestones: [
        { id: "m1", title: "Zero fall incidents over 30 days", targetDate: "2026-08-15", status: "Completed", outcome: "Zero falls reported. Home safety grab bars installed." },
      ],
    },
    assignedTeam: [
      { id: "CP-02", name: "Sunita Deshmukh", role: "Caregiver", phone: "+91 98334 56789", rating: 4.8, status: "Care Started" },
      { id: "CORD-02", name: "Pooja Hegde", role: "Coordinator", phone: "+91 98200 88992", rating: 4.9, status: "Available" },
    ],
    dailyVisits: [
      {
        id: "vis-1042-1",
        date: "2026-08-17",
        checkInTime: "08:00 AM",
        caregiverName: "Sunita Deshmukh",
        caregiverRole: "Caregiver",
        tasksCompleted: [
          "Caregiver checked in at 8:00 AM",
          "Morning breakfast and Donepezil tablet given",
          "Assisted walk in garden (15 mins)",
          "Blood pressure check (124/78)",
        ],
        vitals: { bp: "124/78", spo2: "98%", pulse: "72 bpm", temp: "98.6°F" },
        notes: "Patient in cheerful mood today. Engaged in photo album conversation.",
        status: "In Progress",
      },
    ],
    invoices: [
      {
        id: "INV-2026-07-1042",
        bookingId: "BK-1980",
        date: "2026-07-15",
        bookingValue: 32000,
        discount: 1500,
        tax: 5490,
        amountPaid: 35990,
        balance: 0,
        status: "Paid",
        paymentMethod: "Credit Card (HDFC)",
      },
    ],
    communicationHistory: [
      {
        id: "comm-1042-1",
        type: "Visit completed",
        channel: "WhatsApp",
        timestamp: "2026-08-16 08:05 PM",
        sender: "Caregiver Sunita",
        summary: "Daily shift summary & photo shared with Rohan Mehta.",
        deliveryStatus: "Read",
      },
    ],
    adminNotes: [],
    referralSource: "Doctor",
    referralPartnerName: "Dr. Alok Sharma (Lilavati Hospital)",
  },
  {
    id: "pat-3",
    patientId: "MS-1055",
    fullName: "Sorabji Godrej",
    age: 79,
    gender: "Male",
    dateOfBirth: "1947-02-18",
    bloodGroup: "A+",
    address: "Palazzo B, Little Gibbs Road, Malabar Hill",
    locationArea: "South Mumbai",
    primaryContactName: "Persis Godrej",
    primaryContactRelation: "Daughter",
    primaryContactPhone: "+91 98200 99881",
    primaryContactWhatsapp: "+91 98200 99881",
    emergencyContact: "Dr. Kavasji (+91 98200 55667)",
    primaryDiagnosis: "Parkinson's Stage 3 with Tremors & Postural Instability",
    allergies: ["Latex"],
    mobilityLevel: "Wheelchair",
    doctorName: "Dr. Pettigrew",
    doctorHospital: "Saifee Hospital",
    doctorNotes: "Requires assistance with meal times and sit-to-stand transitions. Levodopa dosage adherence is mandatory every 6 hours.",
    careRequired: "Caregiving",
    careStartDate: "2026-08-10",
    currentStatus: "Active",
    riskIndicator: "Normal",
    carePlan: {
      id: "CP-1055",
      careType: "Caregiving",
      frequency: "Twice daily",
      duration: "30 days",
      startDate: "2026-08-10",
      endDate: "2026-09-09",
      goals: "Prevent fall injuries, ensure timely medication, support nutritional intake.",
      specialRequirements: ["Pureed soft diet", "Wheelchair transfers with transfer belt"],
      activitiesProgress: [
        { activity: "Levodopa Timing Tracker", target: "4x daily", completed: 28, total: 120, unit: "doses" },
        { activity: "Gait & Posture Exercises", target: "Daily 30 mins", completed: 7, total: 30, unit: "sessions" },
      ],
      milestones: [],
    },
    assignedTeam: [
      { id: "CP-05", name: "Ramesh Pawar", role: "Caregiver", phone: "+91 97654 32190", rating: 4.75, status: "Accepted" },
    ],
    dailyVisits: [],
    invoices: [
      {
        id: "INV-2026-08-1055",
        bookingId: "BK-2089",
        date: "2026-08-10",
        bookingValue: 42000,
        discount: 2000,
        tax: 7200,
        amountPaid: 47200,
        balance: 0,
        status: "Paid",
        paymentMethod: "NEFT / Bank Transfer",
      },
    ],
    communicationHistory: [],
    adminNotes: [],
    referralSource: "Existing patient",
  },
  {
    id: "pat-4",
    patientId: "MS-1088",
    fullName: "Shalini Singhania",
    age: 64,
    gender: "Female",
    dateOfBirth: "1962-11-05",
    bloodGroup: "AB+",
    address: "B-1204, Hiranandani Gardens, Powai",
    locationArea: "Powai",
    primaryContactName: "Sameer Singhania",
    primaryContactRelation: "Husband",
    primaryContactPhone: "+91 98210 11990",
    primaryContactWhatsapp: "+91 98210 11990",
    emergencyContact: "Sameer Singhania (+91 98210 11990)",
    primaryDiagnosis: "Post Total Knee Arthroplasty (TKR Right Knee) Day 8",
    allergies: ["Aspirin"],
    mobilityLevel: "Assisted Walker",
    doctorName: "Dr. Sanjay Agarwala",
    doctorHospital: "Hinduja Healthcare Surgical",
    doctorNotes: "Knee flexion target 90 degrees by Day 14. Cryotherapy and CPM machine assist. Check surgical incision for erythema.",
    careRequired: "Physiotherapy",
    careStartDate: "2026-08-17",
    currentStatus: "Active",
    riskIndicator: "Normal",
    carePlan: {
      id: "CP-1088",
      careType: "Physiotherapy",
      frequency: "Once daily",
      duration: "14 days",
      startDate: "2026-08-17",
      endDate: "2026-08-31",
      goals: "Achieve 110 degree active knee flexion, independent stair climbing with cane, and oedema reduction.",
      specialRequirements: ["Ice pack post session", "Incision dressing inspection"],
      activitiesProgress: [
        { activity: "Knee Flexion Rehab", target: "Daily 45 mins", completed: 1, total: 14, unit: "sessions" },
      ],
      milestones: [
        { id: "m1", title: "Active flexion 90 degrees", targetDate: "2026-08-23", status: "Pending", outcome: "Baseline measured at 65 degrees today." },
      ],
    },
    assignedTeam: [
      { id: "CP-03", name: "Rahul Verma", role: "Physiotherapist", phone: "+91 98212 34567", rating: 5.0, status: "Available" },
    ],
    dailyVisits: [],
    invoices: [
      {
        id: "INV-2026-08-1088",
        bookingId: "BK-2110",
        date: "2026-08-16",
        bookingValue: 18000,
        discount: 1000,
        tax: 3060,
        amountPaid: 20060,
        balance: 0,
        status: "Paid",
        paymentMethod: "Credit Card",
      },
    ],
    communicationHistory: [],
    adminNotes: [],
    referralSource: "Physiotherapist",
    referralPartnerName: "Dr. Rahul Verma (Clinic Partner)",
  },
  {
    id: "pat-5",
    patientId: "MS-1092",
    fullName: "Anand Rathi",
    age: 69,
    gender: "Male",
    dateOfBirth: "1957-08-03",
    bloodGroup: "O-",
    address: "304, Beverly Park, Andheri West",
    locationArea: "Andheri",
    primaryContactName: "Mehul Rathi",
    primaryContactRelation: "Son",
    primaryContactPhone: "+91 98330 22334",
    primaryContactWhatsapp: "+91 98330 22334",
    emergencyContact: "Mehul Rathi (+91 98330 22334)",
    primaryDiagnosis: "Post Cardiac Bypass (CABG x3) - Cardiac Rehab & Wound Care",
    allergies: ["Iodine dye"],
    mobilityLevel: "Independent",
    doctorName: "Dr. Ramakanta Panda",
    doctorHospital: "Asian Heart Institute",
    doctorNotes: "Monitor sternal wound healing. Incentive spirometry 10 breaths every hour. Target walking 500m daily without angina.",
    careRequired: "Nursing",
    careStartDate: "2026-08-18",
    currentStatus: "Scheduled",
    riskIndicator: "Normal",
    carePlan: {
      id: "CP-1092",
      careType: "Nursing",
      frequency: "Once daily",
      duration: "14 days",
      startDate: "2026-08-18",
      endDate: "2026-09-01",
      goals: "Ensure complete sterile sternal wound healing and gradual aerobic endurance recovery.",
      specialRequirements: ["Sternal incision dressing", "Spirometry coaching"],
      activitiesProgress: [],
      milestones: [],
    },
    assignedTeam: [
      { id: "CP-01", name: "Priya Sharma", role: "Nurse", phone: "+91 98201 23456", rating: 4.9, status: "Available" },
    ],
    dailyVisits: [],
    invoices: [
      {
        id: "INV-2026-08-1092",
        bookingId: "BK-2115",
        date: "2026-08-17",
        bookingValue: 21000,
        discount: 1000,
        tax: 3600,
        amountPaid: 10000,
        balance: 13600,
        status: "Pending",
        paymentMethod: "UPI",
      },
    ],
    communicationHistory: [],
    adminNotes: [],
    referralSource: "Hospital",
    referralPartnerName: "Asian Heart Institute (Cardiology Dept)",
  },
  {
    id: "pat-6",
    patientId: "MS-1011",
    fullName: "Rajendra Shah",
    age: 75,
    gender: "Male",
    dateOfBirth: "1951-01-14",
    bloodGroup: "B+",
    address: "Flat 12, Sunrise Tower, Lokhandwala Complex, Andheri",
    locationArea: "Andheri",
    primaryContactName: "Nirav Shah",
    primaryContactRelation: "Son",
    primaryContactPhone: "+91 98209 87654",
    primaryContactWhatsapp: "+91 98209 87654",
    emergencyContact: "Nirav Shah (+91 98209 87654)",
    primaryDiagnosis: "Completed 30-Day Spine Lumbar Decompression Rehab",
    allergies: ["None"],
    mobilityLevel: "Independent",
    doctorName: "Dr. Abhay Nene",
    doctorHospital: "Lilavati Hospital",
    doctorNotes: "Discharged from intensive care plan. Advised maintenance home exercises.",
    careRequired: "Physiotherapy",
    careStartDate: "2026-07-01",
    currentStatus: "Completed",
    riskIndicator: "Normal",
    carePlan: {
      id: "CP-1011",
      careType: "Physiotherapy",
      frequency: "Alternate days",
      duration: "30 days",
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      goals: "Core strengthening and posture correction.",
      specialRequirements: ["Lumbar belt during travel"],
      activitiesProgress: [
        { activity: "Core Rehab", target: "15 sessions", completed: 15, total: 15, unit: "sessions" },
      ],
      milestones: [
        { id: "m1", title: "Full pain-free spine flexion", targetDate: "2026-07-30", status: "Completed", outcome: "VAS pain score reduced from 8/10 to 1/10." },
      ],
    },
    assignedTeam: [
      { id: "CP-06", name: "Dr. Neha Kothari", role: "Physiotherapist", phone: "+91 98199 87654", rating: 4.9, status: "Care Completed" },
    ],
    dailyVisits: [],
    invoices: [
      {
        id: "INV-2026-07-1011",
        bookingId: "BK-1920",
        date: "2026-07-01",
        bookingValue: 24000,
        discount: 0,
        tax: 4320,
        amountPaid: 28320,
        balance: 0,
        status: "Paid",
      },
    ],
    communicationHistory: [],
    adminNotes: [],
    referralSource: "Digital",
  },
  {
    id: "pat-7",
    patientId: "MS-1105",
    fullName: "Vikram Malhotra",
    age: 68,
    gender: "Male",
    dateOfBirth: "1958-05-10",
    bloodGroup: "A+",
    address: "Flat 502, Green Acres, Powai",
    locationArea: "Powai",
    primaryContactName: "Ananya Malhotra",
    primaryContactRelation: "Daughter",
    primaryContactPhone: "+91 98200 44321",
    primaryContactWhatsapp: "+91 98200 44321",
    emergencyContact: "Ananya Malhotra (+91 98200 44321)",
    primaryDiagnosis: "Post-Operative Hip Replacement Care & Vital Monitoring",
    allergies: ["None"],
    mobilityLevel: "Assisted Walker",
    doctorName: "Dr. K. N. Mehta",
    doctorHospital: "Hiranandani Hospital",
    doctorNotes: "Requires daily wound inspection and surgical dressing changes.",
    careRequired: "Nursing",
    careStartDate: "2026-08-22",
    currentStatus: "Pending Assignment",
    riskIndicator: "Normal",
    carePlan: {
      id: "CP-1105",
      careType: "Nursing",
      frequency: "Once daily",
      duration: "14 days",
      startDate: "2026-08-22",
      endDate: "2026-09-05",
      goals: "Sterile incision healing, pain management, and assisted mobility.",
      specialRequirements: ["Wound dressing twice weekly", "Vital telemetry log"],
      activitiesProgress: [],
      milestones: [],
    },
    assignedTeam: [],
    dailyVisits: [],
    invoices: [
      {
        id: "INV-2026-08-1105",
        bookingId: "BK-2122",
        date: "2026-08-20",
        bookingValue: 22000,
        discount: 1000,
        tax: 3780,
        amountPaid: 24780,
        balance: 0,
        status: "Paid",
      },
    ],
    communicationHistory: [],
    adminNotes: [],
    referralSource: "Hospital",
    referralPartnerName: "Hiranandani Hospital",
  },
];

export const initialBookings: BookingItem[] = [
  {
    id: "bk-1",
    bookingCode: "BK-2120",
    patientId: "MS-1104",
    patientName: "Meera Krishnan",
    ageGender: "71y / Female",
    careType: "Nursing",
    locationArea: "Andheri",
    startDate: "2026-08-18",
    duration: "14 days",
    frequency: "Once daily",
    status: "Pending Assignment",
    billing: {
      bookingValue: 22000,
      discount: 1000,
      tax: 3780,
      amountPaid: 24780,
      balance: 0,
      paymentStatus: "Paid",
    },
    matchScoreCandidate: {
      professionalId: "CP-01",
      professionalName: "Priya Sharma",
      matchScore: 98,
      matchReasons: ["Same Area (Andheri)", "B.Sc Nursing Certified", "Available on Aug 18", "4.9 Rating"],
    },
  },
  {
    id: "bk-2",
    bookingCode: "BK-2121",
    patientId: "MS-1108",
    patientName: "Homi Bhabha Jr.",
    ageGender: "84y / Male",
    careType: "Personal Care",
    locationArea: "Bandra",
    startDate: "2026-08-19",
    duration: "30 days",
    frequency: "24/7 Live-in",
    status: "New",
    billing: {
      bookingValue: 65000,
      discount: 5000,
      tax: 10800,
      amountPaid: 35000,
      balance: 35800,
      paymentStatus: "Pending",
    },
    matchScoreCandidate: {
      professionalId: "CP-02",
      professionalName: "Sunita Deshmukh",
      matchScore: 94,
      matchReasons: ["Bandra Resident", "Geriatric Certified", "Spoken Gujarati/English"],
    },
  },
  {
    id: "bk-3",
    bookingCode: "BK-2045",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    ageGender: "72y / Male",
    careType: "Combination",
    locationArea: "Juhu",
    startDate: "2026-08-01",
    duration: "30 days",
    frequency: "Twice daily",
    status: "Ongoing",
    assignedProfessional: {
      name: "Anita Jadhav",
      type: "Nurse",
      phone: "+91 98765 43210",
    },
    billing: {
      bookingValue: 48000,
      discount: 3000,
      tax: 8100,
      amountPaid: 35000,
      balance: 18100,
      paymentStatus: "Pending",
    },
  },
  {
    id: "bk-4",
    bookingCode: "BK-2110",
    patientId: "MS-1088",
    patientName: "Shalini Singhania",
    ageGender: "64y / Female",
    careType: "Physiotherapy",
    locationArea: "Powai",
    startDate: "2026-08-17",
    duration: "14 days",
    frequency: "Once daily",
    status: "Ongoing",
    assignedProfessional: {
      name: "Rahul Verma",
      type: "Physiotherapist",
      phone: "+91 98212 34567",
    },
    billing: {
      bookingValue: 18000,
      discount: 1000,
      tax: 3060,
      amountPaid: 20060,
      balance: 0,
      paymentStatus: "Paid",
    },
  },
  {
    id: "bk-5",
    bookingCode: "BK-1920",
    patientId: "MS-1011",
    patientName: "Rajendra Shah",
    ageGender: "75y / Male",
    careType: "Physiotherapy",
    locationArea: "Andheri",
    startDate: "2026-07-01",
    duration: "30 days",
    frequency: "Alternate days",
    status: "Completed",
    assignedProfessional: {
      name: "Dr. Neha Kothari",
      type: "Physiotherapist",
      phone: "+91 98199 87654",
    },
    billing: {
      bookingValue: 24000,
      discount: 0,
      tax: 4320,
      amountPaid: 28320,
      balance: 0,
      paymentStatus: "Paid",
    },
  },
  {
    id: "bk-6",
    bookingCode: "BK-2099",
    patientId: "MS-1067",
    patientName: "Kishore Kumar",
    ageGender: "66y / Male",
    careType: "Nursing",
    locationArea: "Chembur",
    startDate: "2026-08-14",
    duration: "7 days",
    frequency: "Once daily",
    status: "Cancelled",
    billing: {
      bookingValue: 12000,
      discount: 0,
      tax: 2160,
      amountPaid: 0,
      balance: 0,
      paymentStatus: "Paid",
    },
  },
];

export const initialEscalations: EscalationRecord[] = [
  {
    id: "esc-1",
    escalationId: "ESC-801",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    patientLocation: "Juhu",
    professionalName: "Anita Jadhav",
    professionalRole: "Nurse",
    issue: "SpO2 drop to 91% and BP spike to 152/94 during morning mobility drill.",
    category: "Medical concern / emergency",
    timeRaised: "Today, 09:12 AM",
    priority: "Critical",
    assignedTo: "Dr. Vikram Joshi",
    assignedRole: "Clinical Care Coordinator",
    actionTaken: "Patient placed in semi-Fowler position; oxygen concentrator standby. Video call scheduled with treating neurologist.",
    status: "Action In Progress",
    requiresDoctorConsult: true,
  },
  {
    id: "esc-2",
    escalationId: "ESC-802",
    patientId: "MS-1042",
    patientName: "Kamala Mehta",
    patientLocation: "Bandra",
    professionalName: "Sunita Deshmukh",
    professionalRole: "Caregiver",
    issue: "Caregiver leave requested for Saturday/Sunday. Family requested replacement caregiver with dementia care experience.",
    category: "Replacement required",
    timeRaised: "Today, 08:30 AM",
    priority: "Medium",
    assignedTo: "Pooja Hegde",
    assignedRole: "Operations Manager",
    actionTaken: "Filtered available certified caregivers in Bandra area. Caregiver Meena Patel mapped for weekend shift.",
    status: "Investigating",
  },
  {
    id: "esc-3",
    escalationId: "ESC-799",
    patientId: "MS-1070",
    patientName: "Ratan Tata",
    patientLocation: "Colaba",
    professionalName: "Sanjay Shinde",
    professionalRole: "Nurse",
    issue: "Delayed care start by 45 mins due to heavy traffic on Western Express Highway.",
    category: "Delayed care",
    timeRaised: "Yesterday, 10:15 AM",
    priority: "High",
    assignedTo: "Dr. Vikram Joshi",
    assignedRole: "Operations Manager",
    actionTaken: "Called family immediately to inform ETA. Shift extended by 1 hour at no extra charge. Client satisfied.",
    resolutionNotes: "Resolved with client verbal sign-off and 1 hour shift makeup extension.",
    closureTime: "Yesterday, 06:30 PM",
    status: "Resolved",
  },
];

export const initialOperationFeed: OperationFeedItem[] = [
  {
    id: "op-1",
    type: "escalation",
    title: "Critical Vitals Alert",
    description: "Dr. Arvind Kulkarni (MS-1024) – SpO2 91% recorded by Nurse Anita Jadhav.",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    professionalName: "Anita Jadhav",
    area: "Juhu",
    timestamp: "9:12 AM",
    priority: "Critical",
    actionLabel: "Review Telemetry",
  },
  {
    id: "op-2",
    type: "care_started",
    title: "Care Check-in Successful",
    description: "Caregiver Sunita Deshmukh checked in at Kamala Mehta's residence.",
    patientId: "MS-1042",
    patientName: "Kamala Mehta",
    professionalName: "Sunita Deshmukh",
    area: "Bandra",
    timestamp: "8:00 AM",
    actionLabel: "View Checklist",
  },
  {
    id: "op-3",
    type: "new_booking",
    title: "New Booking Created",
    description: "14-day Home Nursing booked for Meera Krishnan (MS-1104) in Andheri West.",
    patientId: "MS-1104",
    patientName: "Meera Krishnan",
    area: "Andheri",
    timestamp: "7:45 AM",
    actionLabel: "Assign Professional",
  },
  {
    id: "op-4",
    type: "care_completed",
    title: "Morning Physio Session Completed",
    description: "Dr. Neha Kothari logged completion of knee mobilization for Rajendra Shah.",
    patientId: "MS-1011",
    patientName: "Rajendra Shah",
    professionalName: "Dr. Neha Kothari",
    area: "Andheri",
    timestamp: "8:45 AM",
    actionLabel: "View Progress",
  },
  {
    id: "op-5",
    type: "assignment_pending",
    title: "Booking Awaiting Allocation",
    description: "BK-2121 (Homi Bhabha Jr. - Bandra) requires 24/7 Live-in caregiver.",
    patientId: "MS-1108",
    patientName: "Homi Bhabha Jr.",
    area: "Bandra",
    timestamp: "Yesterday",
    priority: "High",
    actionLabel: "Smart Match",
  },
];

export const initialReferralPartners: ReferralPartner[] = [
  {
    id: "ref-1",
    name: "Breach Candy Hospital",
    type: "Hospital",
    contactPerson: "Dr. Farokh Udwadia / Sister Mercy (Discharge Lead)",
    phone: "+91 22 2366 7788",
    email: "discharge@breachcandyhospital.org",
    cityArea: "South Mumbai",
    totalReferrals: 142,
    activePatients: 28,
    conversionRate: 86,
    totalRevenueGenerated: 3450000,
    payoutCommissionRate: 10,
    status: "Active",
  },
  {
    id: "ref-2",
    name: "Lilavati Hospital & Research Centre",
    type: "Hospital",
    contactPerson: "Dr. Alok Sharma (Neurology Dept)",
    phone: "+91 22 2675 1000",
    email: "neuro.rehab@lilavatihospital.com",
    cityArea: "Bandra",
    totalReferrals: 188,
    activePatients: 42,
    conversionRate: 91,
    totalRevenueGenerated: 5120000,
    payoutCommissionRate: 10,
    status: "Active",
  },
  {
    id: "ref-3",
    name: "Dr. Sanjay Agarwala Ortho Clinic",
    type: "Doctor",
    contactPerson: "Dr. Sanjay Agarwala",
    phone: "+91 98200 44332",
    email: "dr.agarwala@hindujahospital.com",
    cityArea: "Mahim / Hinduja",
    totalReferrals: 64,
    activePatients: 15,
    conversionRate: 94,
    totalRevenueGenerated: 1680000,
    payoutCommissionRate: 8,
    status: "Active",
  },
  {
    id: "ref-4",
    name: "HDFC ERGO Health Insurance TPA",
    type: "Insurance company",
    contactPerson: "Rajeev Menon (Claims & Home Care Ops)",
    phone: "+91 22 6234 5678",
    email: "homecare.partners@hdfcergo.com",
    cityArea: "BKC",
    totalReferrals: 95,
    activePatients: 22,
    conversionRate: 78,
    totalRevenueGenerated: 2840000,
    payoutCommissionRate: 5,
    status: "Active",
  },
  {
    id: "ref-5",
    name: "Tata Consultancy Services (Corporate Wellness)",
    type: "Corporate",
    contactPerson: "Ananya Roy (HR Benefits Lead)",
    phone: "+91 22 6778 9000",
    email: "eldercare.benefits@tcs.com",
    cityArea: "Andheri / Powai",
    totalReferrals: 52,
    activePatients: 11,
    conversionRate: 82,
    totalRevenueGenerated: 1290000,
    payoutCommissionRate: 0,
    status: "Active",
  },
];

export const systemRoles = [
  {
    role: "Super Admin" as UserRole,
    description: "Complete control across all operational units, financial ledgers, settings, and team access.",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    permissions: ["Full Patients Read/Write", "Financial & Revenue Ledgers", "Role Delegation", "Escalation Triage", "Catalogue & Pricing"],
  },
  {
    role: "Operations Manager" as UserRole,
    description: "Manages daily shift schedules, caregiver logistics, and regional coverage.",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    permissions: ["Assignment Engine", "Shift Monitoring", "Care Professional Availability", "Escalation Dispatch"],
  },
  {
    role: "Care Coordinator" as UserRole,
    description: "Direct liaison for patient recovery, family communications, and care plan updates.",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    permissions: ["Patient 360", "Care Plan Customization", "WhatsApp & Call Center", "Daily Telemetry"],
  },
  {
    role: "Clinical/Quality Manager" as UserRole,
    description: "Oversees medical protocol compliance, patient vitals escalation, and audit safety.",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    permissions: ["Critical Escalation Centre", "Clinical Telemetry Audits", "Doctor Tele-consult Links", "Quality Incidents"],
  },
  {
    role: "Finance" as UserRole,
    description: "Handles invoicing, partner commission payouts, payment gateway reconciliations.",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    permissions: ["Payments & Billing", "Invoicing", "Payout Batches", "Revenue Analytics"],
  },
  {
    role: "Customer Support" as UserRole,
    description: "First line support for customer inquiries, booking confirmations, and feedback.",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    permissions: ["Enquiries", "Communication Logs", "Feedback Collection"],
  },
  {
    role: "Business Development" as UserRole,
    description: "Tracks hospital partnerships, doctor networks, and corporate contracts.",
    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    permissions: ["Partners & Referrals", "Corporate Contracts", "Lead Conversion Funnel"],
  },
];
