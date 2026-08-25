export type VitalService = "Nurse" | "Caregiver" | "Physiotherapist";

export interface VitalSignItem {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  services: VitalService[];
  description: string;
  status: "Active" | "Inactive";
  lastUpdated: string;
}

export const initialVitalSigns: VitalSignItem[] = [
  {
    id: "VIT-01",
    name: "Blood Pressure",
    unit: "mmHg",
    normalRange: "120/80 mmHg",
    services: ["Nurse", "Caregiver"],
    description: "Systolic and diastolic arterial blood pressure measurement",
    status: "Active",
    lastUpdated: "2026-08-20",
  },
  {
    id: "VIT-02",
    name: "Pulse Rate",
    unit: "bpm",
    normalRange: "60 - 100 bpm",
    services: ["Nurse", "Caregiver", "Physiotherapist"],
    description: "Resting and post-activity heart rate / radial pulse monitoring",
    status: "Active",
    lastUpdated: "2026-08-20",
  },
  {
    id: "VIT-03",
    name: "Temperature",
    unit: "°F / °C",
    normalRange: "97.8°F - 99.1°F",
    services: ["Nurse", "Caregiver"],
    description: "Body core temperature check via digital or infrared thermometer",
    status: "Active",
    lastUpdated: "2026-08-20",
  },
  {
    id: "VIT-04",
    name: "SpO2 (Oxygen)",
    unit: "%",
    normalRange: "95% - 100%",
    services: ["Nurse", "Caregiver", "Physiotherapist"],
    description: "Blood oxygen saturation percentage measured via pulse oximeter",
    status: "Active",
    lastUpdated: "2026-08-20",
  },
  {
    id: "VIT-05",
    name: "Respiratory Rate",
    unit: "breaths/min",
    normalRange: "12 - 20 breaths/min",
    services: ["Nurse", "Caregiver", "Physiotherapist"],
    description: "Breathing rate per minute and chest excursion evaluation",
    status: "Active",
    lastUpdated: "2026-08-20",
  },
];
