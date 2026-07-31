export interface PaymentTransaction {
  id: string; // Transaction ID, e.g. "TXN-884901"
  username: string; // e.g. "robert.vance"
  patientName: string; // e.g. "Robert Vance"
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:35 AM"
  amount: number; // e.g. 450
  paymentMode: "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "Apple Pay" | "Wallet";
  status: "Successful" | "Pending" | "Refunded" | "Failed";
  serviceCategory: string;
  gatewayTxnRef: string;
  cardLast4?: string;
  upiId?: string;
}

export const initialTransactions: PaymentTransaction[] = [
  {
    id: "TXN-884901",
    username: "robert.vance",
    patientName: "Robert Vance",
    date: "2026-08-01",
    time: "10:35 AM",
    amount: 650,
    paymentMode: "Credit Card",
    status: "Successful",
    serviceCategory: "Post-Stroke Rehabilitation",
    gatewayTxnRef: "ch_3N8x4920kLp19482",
    cardLast4: "4242",
  },
  {
    id: "TXN-884902",
    username: "eleanor.vance",
    patientName: "Eleanor Vance",
    date: "2026-08-01",
    time: "11:20 AM",
    amount: 1200,
    paymentMode: "UPI",
    status: "Successful",
    serviceCategory: "Post-Op Cardiac Care",
    gatewayTxnRef: "upi_ref_992014881023",
    upiId: "eleanor@okaxis",
  },
  {
    id: "TXN-884903",
    username: "arthur.pendelton",
    patientName: "Arthur Pendelton",
    date: "2026-07-31",
    time: "03:15 PM",
    amount: 450,
    paymentMode: "Apple Pay",
    status: "Successful",
    serviceCategory: "Dementia & Elderly Care",
    gatewayTxnRef: "ap_token_88391024412",
  },
  {
    id: "TXN-884904",
    username: "clara.oswald",
    patientName: "Clara Oswald",
    date: "2026-07-30",
    time: "02:00 PM",
    amount: 850,
    paymentMode: "Net Banking",
    status: "Pending",
    serviceCategory: "Clinical Vitals Monitoring",
    gatewayTxnRef: "nb_hdfc_774910234",
  },
  {
    id: "TXN-884905",
    username: "samuel.jackson",
    patientName: "Samuel Jackson",
    date: "2026-07-28",
    time: "09:45 AM",
    amount: 300,
    paymentMode: "Debit Card",
    status: "Refunded",
    serviceCategory: "General Caregiver Visit",
    gatewayTxnRef: "re_3N8x4920kLp19488",
    cardLast4: "8819",
  },
];
