export interface PushNotificationItem {
  id: string; // e.g. "PUSH-401"
  title: string;
  shortDescription: string;
  imageUrl: string;
  scheduleDateTime: string; // YYYY-MM-DD HH:mm
  creationDate: string; // YYYY-MM-DD
  status: "Enable" | "Disable";
  targetAudience: "All Mobile Users" | "Caregivers Only" | "Patients Only";
}

export const initialPushNotifications: PushNotificationItem[] = [
  {
    id: "PUSH-401",
    title: "New Post-Op Cardiac Rehab Service Available!",
    shortDescription: "Book specialized post-op nursing care with certified RNs at zero hassle.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    scheduleDateTime: "2026-08-02 09:00 AM",
    creationDate: "2026-07-28",
    status: "Enable",
    targetAudience: "Patients Only",
  },
  {
    id: "PUSH-402",
    title: "Caregiver Bonus Shift Rates Active This Weekend",
    shortDescription: "Earn 1.5x bonus payout on all overnight nursing & home care duty shifts.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800",
    scheduleDateTime: "2026-08-01 05:00 PM",
    creationDate: "2026-07-26",
    status: "Enable",
    targetAudience: "Caregivers Only",
  },
  {
    id: "PUSH-403",
    title: "System Maintenance Schedule Notice",
    shortDescription: "MySarthee Mobile App will undergo routine server optimization on Aug 5.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    scheduleDateTime: "2026-08-05 02:00 AM",
    creationDate: "2026-07-20",
    status: "Disable",
    targetAudience: "All Mobile Users",
  },
];
