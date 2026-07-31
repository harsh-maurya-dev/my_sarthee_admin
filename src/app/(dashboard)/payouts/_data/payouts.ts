export interface CaregiverPayout {
  id: string; // Payout ID, e.g. "PAY-701"
  caregiverId: string;
  caregiverName: string;
  caregiverRole: "Nurse" | "Caregiver" | "Physiotherapist";
  grossBookingAmount: number; // e.g. 1000
  platformCommissionPercent: number; // e.g. 15%
  platformCommissionAmount: number; // e.g. 150
  netCaregiverPayout: number; // e.g. 850
  payoutDate: string; // YYYY-MM-DD
  status: "Paid" | "Pending" | "Processing" | "Failed";
  bankName: string;
  bankAccountLast4: string;
  bookingReference: string; // e.g. "REQ-9012"
}

export const initialCaregiverPayouts: CaregiverPayout[] = [
  {
    id: "PAY-701",
    caregiverId: "CG-101",
    caregiverName: "Dr. Sarah Jenkins",
    caregiverRole: "Nurse",
    grossBookingAmount: 1200,
    platformCommissionPercent: 15,
    platformCommissionAmount: 180,
    netCaregiverPayout: 1020,
    payoutDate: "2026-08-01",
    status: "Paid",
    bankName: "Chase Bank",
    bankAccountLast4: "4920",
    bookingReference: "REQ-9013",
  },
  {
    id: "PAY-702",
    caregiverId: "CG-104",
    caregiverName: "Marcus Brody, PT",
    caregiverRole: "Physiotherapist",
    grossBookingAmount: 850,
    platformCommissionPercent: 15,
    platformCommissionAmount: 127.5,
    netCaregiverPayout: 722.5,
    payoutDate: "2026-08-01",
    status: "Processing",
    bankName: "Wells Fargo",
    bankAccountLast4: "8812",
    bookingReference: "REQ-9012",
  },
  {
    id: "PAY-703",
    caregiverId: "CG-103",
    caregiverName: "Elena Rostova",
    caregiverRole: "Caregiver",
    grossBookingAmount: 450,
    platformCommissionPercent: 15,
    platformCommissionAmount: 67.5,
    netCaregiverPayout: 382.5,
    payoutDate: "2026-07-31",
    status: "Pending",
    bankName: "Bank of America",
    bankAccountLast4: "3319",
    bookingReference: "REQ-9014",
  },
  {
    id: "PAY-704",
    caregiverId: "CG-102",
    caregiverName: "David Chen, RN",
    caregiverRole: "Nurse",
    grossBookingAmount: 950,
    platformCommissionPercent: 15,
    platformCommissionAmount: 142.5,
    netCaregiverPayout: 807.5,
    payoutDate: "2026-07-30",
    status: "Paid",
    bankName: "Citibank",
    bankAccountLast4: "1094",
    bookingReference: "REQ-9010",
  },
];
