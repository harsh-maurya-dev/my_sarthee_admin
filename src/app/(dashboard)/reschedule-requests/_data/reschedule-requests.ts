export interface RescheduleRequestItem {
  id: string;
  bookingCode: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  locationArea: string;
  patientPhone: string;
  careType: string;
  assignedProfessional: {
    id: string;
    name: string;
    type: "Nurse" | "Caregiver" | "Physiotherapist";
    phone: string;
    isAvailableForNewTime: boolean;
  };
  originalSchedule: {
    date: string;
    timeSlot: string;
    duration: string;
  };
  requestedNewSchedule: {
    date: string;
    timeSlot: string;
    duration: string;
  };
  reasonForRescheduling: string;
  requestedBy: "Patient / Family" | "Care Professional" | "Admin";
  requestedAt: string;
  urgency: "Critical" | "High" | "Normal";
  status: "Pending Approval" | "Approved" | "Declined" | "Modified";
  adminRemarks?: string;
  actionTakenAt?: string;
}

export const initialRescheduleRequests: RescheduleRequestItem[] = [
  {
    id: "RR-1041",
    bookingCode: "BK-2120",
    bookingId: "bk-1",
    patientId: "MS-1104",
    patientName: "Meera Krishnan",
    ageGender: "71y / Female",
    locationArea: "Andheri West",
    patientPhone: "+91 98201 11223",
    careType: "Nursing",
    assignedProfessional: {
      id: "CP-01",
      name: "Priya Sharma",
      type: "Nurse",
      phone: "+91 98201 23456",
      isAvailableForNewTime: true,
    },
    originalSchedule: {
      date: "2026-08-20",
      timeSlot: "09:00 AM - 01:00 PM",
      duration: "4 Hours",
    },
    requestedNewSchedule: {
      date: "2026-08-20",
      timeSlot: "03:00 PM - 07:00 PM",
      duration: "4 Hours",
    },
    reasonForRescheduling: "Doctor hospital check-up delayed to morning. Requested nursing care shift in the afternoon.",
    requestedBy: "Patient / Family",
    requestedAt: "2026-08-19 02:15 PM",
    urgency: "High",
    status: "Pending Approval",
  },
  {
    id: "RR-1042",
    bookingCode: "BK-2045",
    bookingId: "bk-3",
    patientId: "MS-1024",
    patientName: "Dr. Arvind Kulkarni",
    ageGender: "72y / Male",
    locationArea: "Juhu",
    patientPhone: "+91 98765 43210",
    careType: "Combination",
    assignedProfessional: {
      id: "CP-03",
      name: "Anita Jadhav",
      type: "Nurse",
      phone: "+91 98765 43210",
      isAvailableForNewTime: true,
    },
    originalSchedule: {
      date: "2026-08-21",
      timeSlot: "08:00 AM - 12:00 PM",
      duration: "4 Hours",
    },
    requestedNewSchedule: {
      date: "2026-08-22",
      timeSlot: "08:00 AM - 12:00 PM",
      duration: "4 Hours",
    },
    reasonForRescheduling: "Family travelling to Pune for 1 day. Requested pushing session forward by 24 hours.",
    requestedBy: "Patient / Family",
    requestedAt: "2026-08-19 11:30 AM",
    urgency: "Normal",
    status: "Pending Approval",
  },
  {
    id: "RR-1043",
    bookingCode: "BK-2110",
    bookingId: "bk-4",
    patientId: "MS-1088",
    patientName: "Shalini Singhania",
    ageGender: "64y / Female",
    locationArea: "Powai",
    patientPhone: "+91 98212 34567",
    careType: "Physiotherapy",
    assignedProfessional: {
      id: "CP-05",
      name: "Rahul Verma",
      type: "Physiotherapist",
      phone: "+91 98212 34567",
      isAvailableForNewTime: false,
    },
    originalSchedule: {
      date: "2026-08-20",
      timeSlot: "05:00 PM - 06:30 PM",
      duration: "1.5 Hours",
    },
    requestedNewSchedule: {
      date: "2026-08-20",
      timeSlot: "10:00 AM - 11:30 AM",
      duration: "1.5 Hours",
    },
    reasonForRescheduling: "Patient experiences excessive knee stiffness in mornings and requested morning rehab instead of evening.",
    requestedBy: "Patient / Family",
    requestedAt: "2026-08-19 09:45 AM",
    urgency: "High",
    status: "Pending Approval",
  },
  {
    id: "RR-1044",
    bookingCode: "BK-2121",
    bookingId: "bk-2",
    patientId: "MS-1108",
    patientName: "Homi Bhabha Jr.",
    ageGender: "84y / Male",
    locationArea: "Bandra West",
    patientPhone: "+91 98199 87654",
    careType: "Personal Care",
    assignedProfessional: {
      id: "CP-02",
      name: "Sunita Deshmukh",
      type: "Caregiver",
      phone: "+91 98199 87654",
      isAvailableForNewTime: true,
    },
    originalSchedule: {
      date: "2026-08-19",
      timeSlot: "07:00 AM - 07:00 PM",
      duration: "12 Hours",
    },
    requestedNewSchedule: {
      date: "2026-08-19",
      timeSlot: "09:00 AM - 09:00 PM",
      duration: "12 Hours",
    },
    reasonForRescheduling: "Caregiver commuter train delay on Western line; caregiver requested 2-hour shift shift-forward.",
    requestedBy: "Care Professional",
    requestedAt: "2026-08-19 06:30 AM",
    urgency: "Critical",
    status: "Approved",
    adminRemarks: "Approved with patient consent via WhatsApp confirmation.",
    actionTakenAt: "2026-08-19 06:45 AM",
  },
  {
    id: "RR-1045",
    bookingCode: "BK-1920",
    bookingId: "bk-5",
    patientId: "MS-1011",
    patientName: "Rajendra Shah",
    ageGender: "75y / Male",
    locationArea: "Andheri East",
    patientPhone: "+91 98209 87654",
    careType: "Physiotherapy",
    assignedProfessional: {
      id: "CP-06",
      name: "Dr. Neha Kothari",
      type: "Physiotherapist",
      phone: "+91 98199 87654",
      isAvailableForNewTime: false,
    },
    originalSchedule: {
      date: "2026-08-18",
      timeSlot: "11:00 AM - 12:30 PM",
      duration: "1.5 Hours",
    },
    requestedNewSchedule: {
      date: "2026-08-18",
      timeSlot: "08:00 PM - 09:30 PM",
      duration: "1.5 Hours",
    },
    reasonForRescheduling: "Patient requested late night home session outside clinical operating hours.",
    requestedBy: "Patient / Family",
    requestedAt: "2026-08-18 03:00 PM",
    urgency: "Normal",
    status: "Declined",
    adminRemarks: "Declined: Physiotherapy protocol restricts home visits after 07:30 PM for safety. Rescheduled to next morning.",
    actionTakenAt: "2026-08-18 03:30 PM",
  },
];
