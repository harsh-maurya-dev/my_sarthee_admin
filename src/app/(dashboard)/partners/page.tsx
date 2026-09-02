"use client";

import { useState, useMemo } from "react";
import { ReferralSource } from "@/lib/admin-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Stethoscope,
  ShieldCheck,
  Briefcase,
  Users,
  Search,
  Phone,
  Activity,
  Globe,
  PhoneCall,
  HeartHandshake,
  RefreshCw,
} from "lucide-react";

export interface ReferredUserItem {
  id: string;
  patientId: string;
  userName: string;
  ageGender: string;
  phone: string;
  cityArea: string;
  referralSource: ReferralSource;
  referralPlatformName: string;
  referralContactLead?: string;
  serviceRequired: string;
  referralDate: string;
  status: "Active Care" | "Assessment Scheduled" | "Completed" | "Pending Intake";
}

const initialReferredUsers: ReferredUserItem[] = [
  // 1. Hospital
  {
    id: "REF-01",
    patientId: "MS-1104",
    userName: "Meera Krishnan",
    ageGender: "74, F",
    phone: "+91 98201 12233",
    cityArea: "Worli Seaface, Mumbai",
    referralSource: "Hospital",
    referralPlatformName: "Breach Candy Hospital (Neuro Dept)",
    referralContactLead: "Dr. Farokh Udwadia",
    serviceRequired: "Stroke Recovery & 24/7 ICU Nursing",
    referralDate: "2026-08-01",
    status: "Active Care",
  },
  {
    id: "REF-02",
    patientId: "MS-1108",
    userName: "Rajeshwari Iyer",
    ageGender: "71, F",
    phone: "+91 98205 99881",
    cityArea: "Hiranandani Gardens, Powai",
    referralSource: "Hospital",
    referralPlatformName: "Hiranandani Hospital",
    referralContactLead: "Dr. Anita Sen (Discharge Desk)",
    serviceRequired: "Post-Surgical Wound Care & Dressing",
    referralDate: "2026-08-14",
    status: "Active Care",
  },
  {
    id: "REF-03",
    patientId: "MS-1089",
    userName: "Arvind Kulkarni",
    ageGender: "68, M",
    phone: "+91 98203 44556",
    cityArea: "Pali Hill, Bandra West",
    referralSource: "Hospital",
    referralPlatformName: "Asian Heart Institute (Cardiology)",
    referralContactLead: "Dr. P. K. Shah",
    serviceRequired: "Post-CABG Cardiac Telemetry Monitoring",
    referralDate: "2026-08-05",
    status: "Completed",
  },
  {
    id: "REF-04",
    patientId: "MS-1115",
    userName: "Sudhir Joshi",
    ageGender: "65, M",
    phone: "+91 98209 88123",
    cityArea: "Dadar West, Mumbai",
    referralSource: "Hospital",
    referralPlatformName: "Lilavati Hospital (Orthopedics)",
    referralContactLead: "Dr. Sanjay Agarwala",
    serviceRequired: "Total Knee Replacement Post-Op Nursing",
    referralDate: "2026-08-16",
    status: "Assessment Scheduled",
  },

  // 2. Doctor
  {
    id: "REF-05",
    patientId: "MS-1042",
    userName: "Kamala Mehta",
    ageGender: "81, F",
    phone: "+91 98211 44556",
    cityArea: "Waterfield Road, Bandra West",
    referralSource: "Doctor",
    referralPlatformName: "Dr. Alok Sharma Clinic",
    referralContactLead: "Dr. Alok Sharma (Neurologist)",
    serviceRequired: "Dementia Companionship & Memory Care",
    referralDate: "2026-07-15",
    status: "Active Care",
  },
  {
    id: "REF-06",
    patientId: "MS-1065",
    userName: "Vikram Malhotra",
    ageGender: "58, M",
    phone: "+91 98214 77120",
    cityArea: "Gulmohar Road, Juhu",
    referralSource: "Doctor",
    referralPlatformName: "Dr. Rajiv Singhal Chest Clinic",
    referralContactLead: "Dr. Rajiv Singhal (Pulmonologist)",
    serviceRequired: "COPD BiPAP Management & Oxygen Support",
    referralDate: "2026-08-10",
    status: "Active Care",
  },
  {
    id: "REF-07",
    patientId: "MS-1122",
    userName: "Sangeeta Shah",
    ageGender: "62, F",
    phone: "+91 98218 55432",
    cityArea: "Santacruz West, Mumbai",
    referralSource: "Doctor",
    referralPlatformName: "Dr. Narendra Vaidya Spine Center",
    referralContactLead: "Dr. Narendra Vaidya",
    serviceRequired: "Lumbar Spine Post-Op Mobilization",
    referralDate: "2026-08-18",
    status: "Pending Intake",
  },

  // 3. Physiotherapist
  {
    id: "REF-08",
    patientId: "MS-1011",
    userName: "Rameshwar Sharma",
    ageGender: "78, M",
    phone: "+91 98201 44512",
    cityArea: "Lokhandwala, Andheri West",
    referralSource: "Physiotherapist",
    referralPlatformName: "Dr. Rahul Verma Physio Clinic",
    referralContactLead: "Dr. Rahul Verma (PT)",
    serviceRequired: "Neuro-Rehab Physiotherapy & Gait Retraining",
    referralDate: "2026-08-02",
    status: "Active Care",
  },
  {
    id: "REF-09",
    patientId: "MS-1077",
    userName: "Dilip Parekh",
    ageGender: "72, M",
    phone: "+91 98204 33211",
    cityArea: "Dixit Road, Vile Parle East",
    referralSource: "Physiotherapist",
    referralPlatformName: "Dr. Alisha Merchant Rehab Center",
    referralContactLead: "Dr. Alisha Merchant (PT)",
    serviceRequired: "Post-Stroke Balance & Mobility Therapy",
    referralDate: "2026-08-11",
    status: "Active Care",
  },

  // 4. Insurance company
  {
    id: "REF-10",
    patientId: "MS-1090",
    userName: "Homi Bhabha",
    ageGender: "79, M",
    phone: "+91 98210 11982",
    cityArea: "Cuffe Parade, Colaba",
    referralSource: "Insurance company",
    referralPlatformName: "HDFC ERGO Cashless TPA Desk",
    referralContactLead: "Rohit Saxena (TPA Manager)",
    serviceRequired: "24/7 Critical Home Nursing Package",
    referralDate: "2026-08-08",
    status: "Active Care",
  },
  {
    id: "REF-11",
    patientId: "MS-1102",
    userName: "Sunita Kapoor",
    ageGender: "66, F",
    phone: "+91 98215 33441",
    cityArea: "Unnat Nagar, Goregaon West",
    referralSource: "Insurance company",
    referralPlatformName: "Star Health & Allied Insurance TPA",
    referralContactLead: "Pooja Hegde (Pre-Auth Liaison)",
    serviceRequired: "Chemotherapy Post-Infusion Support",
    referralDate: "2026-08-15",
    status: "Active Care",
  },

  // 5. Corporate
  {
    id: "REF-12",
    patientId: "MS-1082",
    userName: "Pradeep Nambiar",
    ageGender: "63, M",
    phone: "+91 98206 77654",
    cityArea: "Chandivali, Powai",
    referralSource: "Corporate",
    referralPlatformName: "Tata Consultancy Services (TCS)",
    referralContactLead: "Corporate Eldercare HR Desk",
    serviceRequired: "Dementia Companionship & Routine Vitals",
    referralDate: "2026-08-04",
    status: "Active Care",
  },
  {
    id: "REF-13",
    patientId: "MS-1130",
    userName: "Ananya Sengupta",
    ageGender: "70, F",
    phone: "+91 98208 44321",
    cityArea: "Ghodbunder Road, Thane",
    referralSource: "Corporate",
    referralPlatformName: "Larsen & Toubro (L&T Benefits)",
    referralContactLead: "Corporate Wellness Officer",
    serviceRequired: "Palliative Comfort Nursing Care",
    referralDate: "2026-08-17",
    status: "Assessment Scheduled",
  },

  // 6. Existing patient
  {
    id: "REF-14",
    patientId: "MS-1055",
    userName: "Devendra Fadnavis",
    ageGender: "76, M",
    phone: "+91 98202 66778",
    cityArea: "Girgaon Chowpatty, Mumbai",
    referralSource: "Existing patient",
    referralPlatformName: "Word of Mouth (by Kamala Mehta)",
    referralContactLead: "Anil Mehta (Family Relative)",
    serviceRequired: "Alzheimer's Companionship & Daily Care",
    referralDate: "2026-07-28",
    status: "Active Care",
  },
  {
    id: "REF-15",
    patientId: "MS-1099",
    userName: "Maya Chitnis",
    ageGender: "83, F",
    phone: "+91 98212 99001",
    cityArea: "Diamond Garden, Chembur",
    referralSource: "Existing patient",
    referralPlatformName: "Word of Mouth (by Meera Krishnan)",
    referralContactLead: "Rohini Chitnis (Daughter)",
    serviceRequired: "Elderly Fall Prevention & Mobility Care",
    referralDate: "2026-08-12",
    status: "Active Care",
  },

  // 7. Digital
  {
    id: "REF-16",
    patientId: "MS-1110",
    userName: "Anand Patwardhan",
    ageGender: "69, M",
    phone: "+91 98217 88990",
    cityArea: "Nepean Sea Road, Malabar Hill",
    referralSource: "Digital",
    referralPlatformName: "Google Search / MySarthee Web Portal",
    referralContactLead: "Digital Web Lead Intake",
    serviceRequired: "Post-Stroke Home Physiotherapy",
    referralDate: "2026-08-13",
    status: "Active Care",
  },
  {
    id: "REF-17",
    patientId: "MS-1125",
    userName: "Shalini Rane",
    ageGender: "75, F",
    phone: "+91 98219 22334",
    cityArea: "LBS Marg, Mulund West",
    referralSource: "Digital",
    referralPlatformName: "MySarthee Mobile App Intake",
    referralContactLead: "App Direct Onboarding",
    serviceRequired: "Routine Vitals Monitoring & Wound Care",
    referralDate: "2026-08-17",
    status: "Pending Intake",
  },

  // 8. Direct
  {
    id: "REF-18",
    patientId: "MS-1100",
    userName: "Tarun Grover",
    ageGender: "80, M",
    phone: "+91 98207 11223",
    cityArea: "14th Road, Khar West",
    referralSource: "Direct",
    referralPlatformName: "Direct Helpline Inbound Call",
    referralContactLead: "Care Coordinator On-Duty",
    serviceRequired: "12h Nursing Care & Medication Support",
    referralDate: "2026-08-09",
    status: "Active Care",
  },
  {
    id: "REF-19",
    patientId: "MS-1118",
    userName: "Zarine Godrej",
    ageGender: "77, F",
    phone: "+91 98213 66554",
    cityArea: "Breach Candy, South Mumbai",
    referralSource: "Direct",
    referralPlatformName: "Direct Emergency Walk-in / Hotline",
    referralContactLead: "Senior Intake Manager",
    serviceRequired: "Emergency Oxygen Nursing Supervision",
    referralDate: "2026-08-16",
    status: "Active Care",
  },
];

const REFERRAL_TABS: (string | ReferralSource)[] = [
  "All",
  "Hospital",
  "Doctor",
  "Physiotherapist",
  "Insurance company",
  "Corporate",
  "Existing patient",
  "Digital",
  "Direct",
];

export default function PartnersAndReferralsPage() {
  const [referredUsers] = useState<ReferredUserItem[]>(initialReferredUsers);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return referredUsers.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.userName.toLowerCase().includes(q) ||
        u.patientId.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.referralPlatformName.toLowerCase().includes(q) ||
        u.cityArea.toLowerCase().includes(q) ||
        u.serviceRequired.toLowerCase().includes(q);

      const matchesTab = activeTab === "All" || u.referralSource === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [referredUsers, searchQuery, activeTab]);

  const getSourceIcon = (source: ReferralSource) => {
    switch (source) {
      case "Hospital":
        return <Building2 className="h-3.5 w-3.5 text-blue-600" />;
      case "Doctor":
        return <Stethoscope className="h-3.5 w-3.5 text-sky-600" />;
      case "Physiotherapist":
        return <Activity className="h-3.5 w-3.5 text-emerald-600" />;
      case "Insurance company":
        return <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />;
      case "Corporate":
        return <Briefcase className="h-3.5 w-3.5 text-purple-600" />;
      case "Existing patient":
        return <HeartHandshake className="h-3.5 w-3.5 text-rose-600" />;
      case "Digital":
        return <Globe className="h-3.5 w-3.5 text-amber-600" />;
      case "Direct":
        return <PhoneCall className="h-3.5 w-3.5 text-teal-600" />;
      default:
        return <Users className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Referred Patients & Platform Intake Directory
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Directory of patients acquired across referral channels: Hospitals, Doctors, Physiotherapists, Insurance TPAs, Corporates, Existing Patients, Digital & Direct.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 border-b pb-3">
        {/* Referral Source Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {REFERRAL_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-[#01265D] text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 dark:bg-slate-800 hover:text-foreground"
              }`}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by user name, patient ID, phone, partner platform, service..."
              className="pl-9 h-9 text-xs rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Referred Users Directory Table */}
      <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                User / Patient Name
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact & Location
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Referral Channel
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Referral Platform / Doctor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                  No referred patients found matching your search and category filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                  {/* User Name & Patient ID */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-xs text-[#01265D] dark:text-blue-300 shrink-0">
                        {u.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-foreground block">{u.userName}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className="font-mono font-semibold">{u.patientId}</span>
                          <span>·</span>
                          <span>{u.ageGender}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact & Location */}
                  <TableCell className="text-xs py-3.5">
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{u.phone}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate max-w-[160px]">
                      {u.cityArea}
                    </span>
                  </TableCell>

                  {/* Referral Channel / Type */}
                  <TableCell className="py-3.5">
                    <Badge variant="outline" className="text-[10px] font-bold gap-1 py-0.5">
                      {getSourceIcon(u.referralSource)}
                      <span>{u.referralSource}</span>
                    </Badge>
                  </TableCell>

                  {/* Referral Platform / Partner Name */}
                  <TableCell className="py-3.5 text-xs">
                    <span className="font-semibold text-foreground block">{u.referralPlatformName}</span>
                    {u.referralContactLead && (
                      <span className="text-[10px] text-muted-foreground">
                        Lead: {u.referralContactLead}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
