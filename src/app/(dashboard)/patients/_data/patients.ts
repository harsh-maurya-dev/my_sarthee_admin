export interface CareRequirement {
  healthCondition: string;
  mobilityNeeds: string;
  dietaryRequirements: string;
  medicationAssistance: string;
  specialInstructions: string;
}

export interface CarePlanTask {
  id: string;
  taskName: string;
  frequency: string;
  timeSlot: string;
  completed: boolean;
}

export interface CarePlan {
  id: string;
  planTitle: string;
  goals: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  tasks: CarePlanTask[];
}

export interface ServiceHistoryItem {
  id: string;
  serviceName: string;
  date: string;
  caregiverName: string;
  duration: string;
  cost: string;
  status: "Completed" | "Cancelled" | "Scheduled";
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  medicalCondition: string;
  status: "Active" | "Inactive" | "Blocked";
  registrationDate: string;
  bloodGroup?: string;
  emergencyContact?: string;
  assignedCaregiver?: string;
  vitals?: {
    heartRate: string;
    bloodPressure: string;
    oxygenLevel: string;
  };
  careRequirements?: CareRequirement;
  carePlan?: CarePlan;
  serviceHistory?: ServiceHistoryItem[];
}

export const initialPatients: Patient[] = [
  {
    id: "PAT-1001",
    fullName: "Eleanor Vance",
    age: 68,
    gender: "Female",
    dateOfBirth: "1958-03-14",
    address: "742 Evergreen Terrace, Sector 4",
    phoneNumber: "+1 (555) 234-5678",
    medicalCondition: "Hypertension & Diabetes Type 2",
    status: "Active",
    registrationDate: "2026-06-15",
    bloodGroup: "O+",
    emergencyContact: "David Vance (+1 555-987-6543)",
    assignedCaregiver: "Dr. Sarah Jenkins",
    careRequirements: {
      healthCondition: "Hypertension with Type 2 Diabetes requiring daily blood sugar checks.",
      mobilityNeeds: "Requires walking cane for outdoors, independent indoors.",
      dietaryRequirements: "Low-sodium, diabetic-friendly meal plan.",
      medicationAssistance: "Assistance required for morning Metformin and Lisinopril administration.",
      specialInstructions: "Check blood pressure twice daily before meals.",
    },
    carePlan: {
      id: "CP-801",
      planTitle: "Geriatric Wellness & Diabetes Management Plan",
      goals: "Maintain glycemic control (HbA1c < 7%) and blood pressure below 130/80.",
      startDate: "2026-07-01",
      endDate: "2026-12-31",
      status: "Active",
      tasks: [
        { id: "t1", taskName: "Morning Blood Pressure Check", frequency: "Daily", timeSlot: "08:00 AM", completed: true },
        { id: "t2", taskName: "Fasting Blood Glucose Test", frequency: "Daily", timeSlot: "08:30 AM", completed: true },
        { id: "t3", taskName: "Physiotherapy Walking Routine", frequency: "3x / Week", timeSlot: "04:00 PM", completed: false },
        { id: "t4", taskName: "Evening Insulin Administration", frequency: "Daily", timeSlot: "08:00 PM", completed: false },
      ],
    },
    serviceHistory: [
      { id: "SH-201", serviceName: "Home Nursing & Vital Scan", date: "2026-07-28", caregiverName: "Dr. Sarah Jenkins", duration: "2 hrs", cost: "$120", status: "Completed" },
      { id: "SH-202", serviceName: "Physiotherapy & Mobility Assistance", date: "2026-07-20", caregiverName: "Nurse Hally Gray", duration: "1.5 hrs", cost: "$95", status: "Completed" },
      { id: "SH-203", serviceName: "Laboratory Blood Sample Collection", date: "2026-07-10", caregiverName: "Lab Tech Mark", duration: "45 mins", cost: "$60", status: "Completed" },
    ],
  },
  {
    id: "PAT-1002",
    fullName: "Robert Chen",
    age: 74,
    gender: "Male",
    dateOfBirth: "1952-11-08",
    address: "120 Bay Street, Suite 4B",
    phoneNumber: "+1 (555) 345-6789",
    medicalCondition: "Post-Stroke Rehabilitation",
    status: "Active",
    registrationDate: "2026-07-02",
    bloodGroup: "A+",
    emergencyContact: "Mei Chen (+1 555-876-5432)",
    assignedCaregiver: "Nurse Hally Gray",
    careRequirements: {
      healthCondition: "Post-ischemic stroke hemiparesis affecting right side.",
      mobilityNeeds: "Requires wheelchair assistance for transfers.",
      dietaryRequirements: "Soft food diet with thickened liquids.",
      medicationAssistance: "Full assistance required for oral medications.",
      specialInstructions: "Perform speech therapy exercises twice daily.",
    },
    carePlan: {
      id: "CP-802",
      planTitle: "Post-Stroke Neurological Rehabilitation",
      goals: "Improve right-side arm mobility and speech clarity within 3 months.",
      startDate: "2026-07-05",
      endDate: "2026-10-30",
      status: "Active",
      tasks: [
        { id: "t10", taskName: "Right-Arm Range of Motion Exercises", frequency: "Daily", timeSlot: "09:30 AM", completed: true },
        { id: "t11", taskName: "Speech Therapy Practice Session", frequency: "Daily", timeSlot: "02:00 PM", completed: false },
      ],
    },
    serviceHistory: [
      { id: "SH-204", serviceName: "Stroke Physical Rehabilitation", date: "2026-07-26", caregiverName: "Nurse Hally Gray", duration: "2 hrs", cost: "$150", status: "Completed" },
    ],
  },
  {
    id: "PAT-1003",
    fullName: "Maria Garcia",
    age: 62,
    gender: "Female",
    dateOfBirth: "1964-05-22",
    address: "450 Pine Road, Apt 12",
    phoneNumber: "+1 (555) 456-7890",
    medicalCondition: "Rheumatoid Arthritis",
    status: "Active",
    registrationDate: "2026-07-10",
    bloodGroup: "B+",
    emergencyContact: "Carlos Garcia (+1 555-765-4321)",
    assignedCaregiver: "Caregiver John Doe",
    careRequirements: {
      healthCondition: "Chronic joint stiffness and mobility impairment.",
      mobilityNeeds: "Assistance needed for stair climbing.",
      dietaryRequirements: "Anti-inflammatory diet rich in Omega-3.",
      medicationAssistance: "Reminders for morning immunosuppressants.",
      specialInstructions: "Apply warm joint therapy compresses in morning.",
    },
    carePlan: {
      id: "CP-803",
      planTitle: "Arthritis Pain Relief & Mobility Maintenance",
      goals: "Reduce morning stiffness duration to under 30 minutes.",
      startDate: "2026-07-12",
      endDate: "2026-12-12",
      status: "Active",
      tasks: [
        { id: "t20", taskName: "Morning Warm Compress Therapy", frequency: "Daily", timeSlot: "07:30 AM", completed: true },
      ],
    },
    serviceHistory: [
      { id: "SH-205", serviceName: "Joint Therapy & Massage Session", date: "2026-07-24", caregiverName: "Caregiver John Doe", duration: "1 hr", cost: "$80", status: "Completed" },
    ],
  },
  {
    id: "PAT-1004",
    fullName: "James Wilson",
    age: 81,
    gender: "Male",
    dateOfBirth: "1945-09-30",
    address: "88 Oakwood Drive",
    phoneNumber: "+1 (555) 567-8901",
    medicalCondition: "Congestive Heart Failure",
    status: "Inactive",
    registrationDate: "2026-05-20",
    bloodGroup: "AB+",
    emergencyContact: "Sarah Wilson (+1 555-654-3210)",
    assignedCaregiver: "Dr. Marcus Vance",
    careRequirements: {
      healthCondition: "Stage C Heart Failure with fluid retention monitoring.",
      mobilityNeeds: "Requires wheelchair for long distances.",
      dietaryRequirements: "Strict low-sodium (< 1500mg/day) diet.",
      medicationAssistance: "Assistance with daily diuretics.",
      specialInstructions: "Weigh daily every morning before breakfast.",
    },
  },
  {
    id: "PAT-1005",
    fullName: "Sophia Martinez",
    age: 55,
    gender: "Female",
    dateOfBirth: "1971-01-19",
    address: "312 Maple Lane",
    phoneNumber: "+1 (555) 678-9012",
    medicalCondition: "Chronic Kidney Disease Stage 3",
    status: "Blocked",
    registrationDate: "2026-07-18",
    bloodGroup: "O-",
    emergencyContact: "Luis Martinez (+1 555-543-2109)",
    assignedCaregiver: "Dr. Sarah Jenkins",
    careRequirements: {
      healthCondition: "CKD Stage 3 with protein restriction guidelines.",
      mobilityNeeds: "Independent mobility.",
      dietaryRequirements: "Low potassium and phosphorus meal plan.",
      medicationAssistance: "Independent medication management.",
      specialInstructions: "Monthly lab blood work monitoring.",
    },
  },
];
