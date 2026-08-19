export type ChecklistRole = "Caregiver" | "Nurse" | "Physiotherapist";
export type PhysioSubCategory = "Exercise" | "Modalities Applied";

export interface ChecklistTemplateItem {
  id: string;
  title: string;
  role: ChecklistRole;
  subCategory?: PhysioSubCategory;
  lastUpdated: string;
}

export const initialChecklistTemplates: ChecklistTemplateItem[] = [
  // -------------------------------------------------------------
  // 1. CAREGIVER CHECKLIST ITEMS (MATCHING IMAGE 1)
  // -------------------------------------------------------------
  { id: "CG-01", title: "Hygiene", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-02", title: "Bathing", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-03", title: "Feeding", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-04", title: "Mobility Assistance", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-05", title: "Medication Reminder", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-06", title: "Emotional Support", role: "Caregiver", lastUpdated: "2026-08-19" },
  { id: "CG-07", title: "Fall Prevention", role: "Caregiver", lastUpdated: "2026-08-19" },

  // -------------------------------------------------------------
  // 2. NURSE CHECKLIST ITEMS (MATCHING IMAGE 2)
  // -------------------------------------------------------------
  { id: "NR-01", title: "IV Administration", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-02", title: "Catheter Care", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-03", title: "Dressing", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-04", title: "Injection", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-05", title: "Wound Care", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-06", title: "Medication Administration", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-07", title: "Clinical Notes", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-08", title: "Doctor Instructions", role: "Nurse", lastUpdated: "2026-08-19" },
  { id: "NR-09", title: "Vitals Monitoring", role: "Nurse", lastUpdated: "2026-08-19" },

  // -------------------------------------------------------------
  // 3. PHYSIOTHERAPIST - EXERCISES
  // -------------------------------------------------------------
  { id: "PT-EX-01", title: "Active-Assisted ROM", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-02", title: "Passive ROM", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-03", title: "Gait Retraining", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-04", title: "Balance Drills", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-05", title: "Isometric Strengthening", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-06", title: "Post-Op Mobility", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-07", title: "Active Stretching", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },
  { id: "PT-EX-08", title: "Posture Correction", role: "Physiotherapist", subCategory: "Exercise", lastUpdated: "2026-08-19" },

  // -------------------------------------------------------------
  // 3. PHYSIOTHERAPIST - MODALITIES APPLIED
  // -------------------------------------------------------------
  { id: "PT-MOD-01", title: "TENS Therapy", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-02", title: "Ultrasound Therapy (UST)", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-03", title: "IFT (Interferential)", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-04", title: "Hot Moist Pack", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-05", title: "Cryotherapy Pack", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-06", title: "Electrical Muscle Stimulation", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
  { id: "PT-MOD-07", title: "Traction Therapy", role: "Physiotherapist", subCategory: "Modalities Applied", lastUpdated: "2026-08-19" },
];
