export interface PatientRequirement {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  condition: string;
  careRequirement: string;
  medicalHistory: string[];
  tasksNeeded: string[];
  requestedRole: "Nurse" | "Caregiver" | "Physiotherapist";
  scheduleSlot: string;
  startDate: string;
  endDate?: string;
  location: {
    address: string;
    neighborhood: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  preferences: {
    genderPreference: "Male" | "Female" | "No Preference";
    experienceYearsMin: number;
    requiredSkills: string[];
    languagePreference: string[];
  };
  urgency: "Normal" | "High" | "Urgent";
  status: "Pending Assignment" | "Assigned" | "Cancelled";
  assignedCaregiverId?: string;
  assignedCaregiverName?: string;
}

export interface CaregiverCandidate {
  id: string;
  name: string;
  avatar?: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  gender: "Male" | "Female";
  age: number;
  rating: number;
  experience: string;
  experienceYears: number;
  skills: string[];
  location: string;
  distanceMiles: number;
  availability: "Available" | "On Shift" | "Leave";
  matchScore: number; // 0 - 100%
  matchedReasons: string[];
  languages: string[];
  phoneNumber: string;
}

export const initialPendingAssignments: PatientRequirement[] = [
  {
    id: "REQ-9012",
    patientName: "Robert Vance",
    patientAge: 72,
    patientGender: "Male",
    condition: "Post-Stroke Recovery & Hemiparesis",
    careRequirement: "Intensive Physical Rehab & Gait Support, Daily Vitals, Assistance with Transfer",
    medicalHistory: ["Ischemic Stroke (2025)", "Hypertension", "Type 2 Diabetes"],
    tasksNeeded: ["Gait Training", "Blood Pressure & Glucose Monitoring", "Bed-to-Chair Transfer", "Medication Management"],
    requestedRole: "Physiotherapist",
    scheduleSlot: "Morning Shift (08:00 AM - 12:00 PM)",
    startDate: "2026-08-01",
    endDate: "2026-08-30",
    location: {
      address: "742 Evergreen Terrace",
      neighborhood: "Downtown",
      city: "Springfield",
    },
    preferences: {
      genderPreference: "Male",
      experienceYearsMin: 4,
      requiredSkills: ["Gait Rehabilitation", "Stroke Care", "Vital Monitoring"],
      languagePreference: ["English"],
    },
    urgency: "Urgent",
    status: "Pending Assignment",
  },
  {
    id: "REQ-9013",
    patientName: "Eleanor Vance",
    patientAge: 68,
    patientGender: "Female",
    condition: "Post-Operative Cardiac Bypass (CABG)",
    careRequirement: "Surgical Wound Dressing, IV Therapy, Continuous Oxygen & SpO2 Tracking",
    medicalHistory: ["Triple Vessel CABG Surgery", "Mild Asthma"],
    tasksNeeded: ["Wound Care & Sterile Dressing", "IV Medication Administration", "Oxygen Saturation Monitoring", "Incentive Spirometry"],
    requestedRole: "Nurse",
    scheduleSlot: "Day Shift (09:00 AM - 05:00 PM)",
    startDate: "2026-08-02",
    location: {
      address: "1042 Elm Street, Apt 4B",
      neighborhood: "Westside",
      city: "Springfield",
    },
    preferences: {
      genderPreference: "Female",
      experienceYearsMin: 5,
      requiredSkills: ["Wound Dressing", "IV Therapy", "Post-Op Cardiac Care"],
      languagePreference: ["English", "Spanish"],
    },
    urgency: "High",
    status: "Pending Assignment",
  },
  {
    id: "REQ-9014",
    patientName: "Arthur Pendelton",
    patientAge: 84,
    patientGender: "Male",
    condition: "Alzheimer's Dementia & Fall Risk",
    careRequirement: "Memory Support, Wandering Prevention, Daily Hygeine & Meal Assistance",
    medicalHistory: ["Alzheimer's Disease Stage 2", "Osteoarthritis"],
    tasksNeeded: ["Assisted Bathing & Personal Hygiene", "Meal Preparation & Feeding", "Cognitive Engagement", "Safe Ambulation"],
    requestedRole: "Caregiver",
    scheduleSlot: "Evening Shift (04:00 PM - 09:00 PM)",
    startDate: "2026-08-01",
    location: {
      address: "318 Maple Avenue",
      neighborhood: "North Hills",
      city: "Springfield",
    },
    preferences: {
      genderPreference: "No Preference",
      experienceYearsMin: 3,
      requiredSkills: ["Dementia Care", "Fall Prevention", "Elderly Care"],
      languagePreference: ["English"],
    },
    urgency: "Normal",
    status: "Pending Assignment",
  },
];

export const caregiverCandidatesPool: Record<string, CaregiverCandidate[]> = {
  "REQ-9012": [
    {
      id: "CG-104",
      name: "Marcus Brody, PT",
      role: "Physiotherapist",
      gender: "Male",
      age: 38,
      rating: 4.9,
      experience: "8 Years Clinical Rehab",
      experienceYears: 8,
      skills: ["Gait Rehabilitation", "Stroke Care", "Vital Monitoring", "Neurological PT"],
      location: "Downtown (1.2 miles away)",
      distanceMiles: 1.2,
      availability: "Available",
      matchScore: 98,
      matchedReasons: [
        "100% Skill match (Gait & Stroke Rehab)",
        "Gender preference matched (Male)",
        "Proximity < 2 miles",
        "8 yrs experience exceeds 4 yrs requirement",
      ],
      languages: ["English"],
      phoneNumber: "+1 (555) 341-9982",
    },
    {
      id: "CG-102",
      name: "David Chen, RN",
      role: "Physiotherapist",
      gender: "Male",
      age: 34,
      rating: 4.8,
      experience: "5 Years Rehab Care",
      experienceYears: 5,
      skills: ["Gait Rehabilitation", "Vital Monitoring", "Physiotherapy"],
      location: "Westside (3.4 miles away)",
      distanceMiles: 3.4,
      availability: "Available",
      matchScore: 88,
      matchedReasons: [
        "Primary skills matched",
        "Gender preference matched (Male)",
        "Available for Morning Shift",
      ],
      languages: ["English", "Mandarin"],
      phoneNumber: "+1 (555) 234-8871",
    },
    {
      id: "CG-101",
      name: "Dr. Sarah Jenkins",
      role: "Nurse",
      gender: "Female",
      age: 32,
      rating: 4.9,
      experience: "6 Years Clinical Care",
      experienceYears: 6,
      skills: ["Vital Monitoring", "Stroke Care"],
      location: "North Hills (4.8 miles away)",
      distanceMiles: 4.8,
      availability: "Available",
      matchScore: 72,
      matchedReasons: [
        "Vitals & Stroke care experienced",
        "High rating (4.9)",
      ],
      languages: ["English"],
      phoneNumber: "+1 (555) 892-1123",
    },
  ],
  "REQ-9013": [
    {
      id: "CG-101",
      name: "Dr. Sarah Jenkins",
      role: "Nurse",
      gender: "Female",
      age: 32,
      rating: 4.9,
      experience: "6 Years ICU & Post-Op",
      experienceYears: 6,
      skills: ["Wound Dressing", "IV Therapy", "Post-Op Cardiac Care", "Oxygen Support"],
      location: "Westside (0.8 miles away)",
      distanceMiles: 0.8,
      availability: "Available",
      matchScore: 99,
      matchedReasons: [
        "100% Skill match (Wound & IV Therapy)",
        "Gender preference matched (Female)",
        "Proximity < 1 mile",
        "Spanish language fluent",
      ],
      languages: ["English", "Spanish"],
      phoneNumber: "+1 (555) 892-1123",
    },
    {
      id: "CG-103",
      name: "Elena Rostova",
      role: "Nurse",
      gender: "Female",
      age: 29,
      rating: 4.7,
      experience: "4 Years Surgical Care",
      experienceYears: 4,
      skills: ["Wound Dressing", "Post-Op Cardiac Care"],
      location: "Downtown (2.5 miles away)",
      distanceMiles: 2.5,
      availability: "Available",
      matchScore: 85,
      matchedReasons: [
        "Wound dressing certified",
        "Gender matched (Female)",
      ],
      languages: ["English"],
      phoneNumber: "+1 (555) 901-4432",
    },
  ],
  "REQ-9014": [
    {
      id: "CG-103",
      name: "Elena Rostova",
      role: "Caregiver",
      gender: "Female",
      age: 29,
      rating: 4.7,
      experience: "4 Years Elderly Care",
      experienceYears: 4,
      skills: ["Dementia Care", "Fall Prevention", "Elderly Care", "Hygiene Assistance"],
      location: "North Hills (1.1 miles away)",
      distanceMiles: 1.1,
      availability: "Available",
      matchScore: 95,
      matchedReasons: [
        "Certified Dementia Caregiver",
        "Fall Prevention specialist",
        "Proximity 1.1 miles",
      ],
      languages: ["English"],
      phoneNumber: "+1 (555) 901-4432",
    },
  ],
};
