export interface CaregiverHealthReport {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  caregiverId: string;
  caregiverName: string;
  caregiverRole: "Nurse" | "Caregiver" | "Physiotherapist";
  reportDate: string; // YYYY-MM-DD
  reportTime: string; // e.g. "01:15 PM"
  vitals: {
    bloodPressure: string; // e.g. "122/80 mmHg"
    heartRateBpm: number; // e.g. 74
    spO2Percent: number; // e.g. 98
    temperatureF: number; // e.g. 98.6
    bloodGlucoseMgDl?: number; // e.g. 110
  };
  visitNotes: string;
  uploadedImages?: {
    id: string;
    caption: string;
    url: string;
    uploadedAt: string;
  }[];
  patientProgress: "Improving" | "Stable" | "Needs Monitoring" | "Critical";
  progressScorePercent: number; // 0 - 100%
  physicianFollowUpRequired: boolean;
}

export const initialHealthReports: CaregiverHealthReport[] = [
  {
    id: "HR-101",
    visitId: "VM-501",
    patientId: "P-701",
    patientName: "Eleanor Vance",
    patientAge: 68,
    patientGender: "Female",
    caregiverId: "CG-101",
    caregiverName: "Dr. Sarah Jenkins",
    caregiverRole: "Nurse",
    reportDate: "2026-08-01",
    reportTime: "01:15 PM",
    vitals: {
      bloodPressure: "122/80 mmHg",
      heartRateBpm: 74,
      spO2Percent: 98,
      temperatureF: 98.6,
      bloodGlucoseMgDl: 112,
    },
    visitNotes:
      "Inspected surgical CABG wound dressing. No signs of erythema or purulent drainage. Sterile dressing replaced with chlorhexidine swab. IV antibiotics (Cefazolin 1g) infused over 30 mins with zero adverse reactions. Patient oxygen saturation remains steady at 98% on room air.",
    uploadedImages: [
      {
        id: "IMG-01",
        caption: "Sterile Incision Dressing Inspection",
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500",
        uploadedAt: "01:10 PM",
      },
      {
        id: "IMG-02",
        caption: "Post-Op Cardiac Vitals Monitor Snapshot",
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500",
        uploadedAt: "01:12 PM",
      },
    ],
    patientProgress: "Improving",
    progressScorePercent: 88,
    physicianFollowUpRequired: false,
  },
  {
    id: "HR-102",
    visitId: "VM-502",
    patientId: "P-702",
    patientName: "Robert Vance",
    patientAge: 72,
    patientGender: "Male",
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    caregiverRole: "Physiotherapist",
    reportDate: "2026-08-01",
    reportTime: "12:10 PM",
    vitals: {
      bloodPressure: "130/85 mmHg",
      heartRateBpm: 82,
      spO2Percent: 97,
      temperatureF: 98.4,
    },
    visitNotes:
      "Completed 45 mins gait training focusing on left-sided stroke weakness recovery. Patient walked 120 meters with parallel bar support. Balance stability improved by 15%. Patient reported mild muscle fatigue in quadriceps. Recommended resting elevation.",
    uploadedImages: [
      {
        id: "IMG-03",
        caption: "Parallel Bar Ambulation Rehabilitation",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500",
        uploadedAt: "12:05 PM",
      },
    ],
    patientProgress: "Improving",
    progressScorePercent: 78,
    physicianFollowUpRequired: false,
  },
  {
    id: "HR-103",
    visitId: "VM-504",
    patientId: "P-704",
    patientName: "Clara Oswald",
    patientAge: 79,
    patientGender: "Female",
    caregiverId: "CG-102",
    caregiverName: "David Chen, RN",
    caregiverRole: "Nurse",
    reportDate: "2026-08-01",
    reportTime: "03:45 PM",
    vitals: {
      bloodPressure: "148/92 mmHg",
      heartRateBpm: 91,
      spO2Percent: 94,
      temperatureF: 100.2,
      bloodGlucoseMgDl: 185,
    },
    visitNotes:
      "Patient exhibited elevated temperature (100.2°F) and mild shortness of breath. Blood pressure higher than baseline (148/92). Administered prescribed antipyretic. Recommended attending physician tele-consultation follow-up.",
    patientProgress: "Needs Monitoring",
    progressScorePercent: 55,
    physicianFollowUpRequired: true,
  },
];
