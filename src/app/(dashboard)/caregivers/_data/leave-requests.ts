export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type LeaveType = "Sick Leave" | "Casual Leave" | "Emergency Leave" | "Annual Leave" | "Bereavement";

export interface ReassignedStaffInfo {
  id: string;
  name: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  phone: string;
  avatar: string;
  zone?: string;
}

export interface CaregiverLeaveRequest {
  id: string;
  caregiverId: string;
  caregiverName: string;
  role: "Nurse" | "Caregiver" | "Physiotherapist";
  phoneNumber: string;
  avatar: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  appliedOn: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  reassignedTo?: ReassignedStaffInfo;
  reassignedAt?: string;
  reassignedBy?: string;
  patientCoverageNotes?: string;
}

export const initialLeaveRequests: CaregiverLeaveRequest[] = [
  {
    id: "LV-2041",
    caregiverId: "CG-101",
    caregiverName: "Priya Sharma",
    role: "Nurse",
    phoneNumber: "+91 98201 23456",
    avatar: "https://images.unsplash.com/photo-1594824813581-9b165b4c107e?w=150&q=80",
    leaveType: "Sick Leave",
    startDate: "2026-08-27",
    endDate: "2026-08-29",
    daysCount: 3,
    reason: "Suffering from high fever and acute throat infection. Doctor advised 3 days complete bed rest.",
    appliedOn: "2026-08-25",
    status: "Pending",
  },
  {
    id: "LV-2042",
    caregiverId: "CG-104",
    caregiverName: "Sanjay Verma",
    role: "Caregiver",
    phoneNumber: "+91 98204 56789",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    leaveType: "Emergency Leave",
    startDate: "2026-08-26",
    endDate: "2026-08-27",
    daysCount: 2,
    reason: "Urgent family emergency in hometown (Pune). Need to travel immediately.",
    appliedOn: "2026-08-25",
    status: "Pending",
  },
  {
    id: "LV-2038",
    caregiverId: "CG-103",
    caregiverName: "Anjali Nair",
    role: "Physiotherapist",
    phoneNumber: "+91 98203 45678",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&q=80",
    leaveType: "Casual Leave",
    startDate: "2026-09-01",
    endDate: "2026-09-03",
    daysCount: 3,
    reason: "Attending sister's wedding ceremony in Kerala. All ongoing patient sessions rescheduled in advance.",
    appliedOn: "2026-08-22",
    status: "Approved",
    reviewedBy: "Dr. Vikram Joshi (Ops Manager)",
    reviewedAt: "2026-08-23 10:30 AM",
    reassignedTo: {
      id: "CG-108",
      name: "Meena Iyer",
      role: "Physiotherapist",
      phone: "+91 98208 90123",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
      zone: "South Mumbai",
    },
    reassignedAt: "2026-08-23 10:35 AM",
    reassignedBy: "Dr. Vikram Joshi (Ops Manager)",
    patientCoverageNotes: "Covering 3 home physio rehab sessions in South Mumbai zone.",
  },
  {
    id: "LV-2035",
    caregiverId: "CG-102",
    caregiverName: "Rahul Deshmukh",
    role: "Caregiver",
    phoneNumber: "+91 98202 34567",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    leaveType: "Casual Leave",
    startDate: "2026-08-24",
    endDate: "2026-08-28",
    daysCount: 5,
    reason: "Personal vacation trip planned with family.",
    appliedOn: "2026-08-21",
    status: "Rejected",
    reviewedBy: "Dr. Vikram Joshi (Ops Manager)",
    reviewedAt: "2026-08-21 04:15 PM",
    rejectionReason: "Critical ICU shift assigned for Patient #MS1024 during these dates. Substitute caregiver coverage unavailable on short notice.",
  },
  {
    id: "LV-2030",
    caregiverId: "CG-106",
    caregiverName: "Vikram Rathore",
    role: "Nurse",
    phoneNumber: "+91 98206 78901",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80",
    leaveType: "Annual Leave",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    daysCount: 6,
    reason: "Annual planned vacation leave as per company employment contract.",
    appliedOn: "2026-08-18",
    status: "Approved",
    reviewedBy: "Dr. Vikram Joshi (Ops Manager)",
    reviewedAt: "2026-08-19 11:00 AM",
  },
];
