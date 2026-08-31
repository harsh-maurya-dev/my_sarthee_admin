"use client";

import { Caregiver } from "../_data/caregivers";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HeartPulse,
  Star,
  CheckCircle2,
  XCircle,
  Ban,
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface CaregiverDetailsSheetProps {
  caregiver: Caregiver | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: Caregiver["status"]) => void;
}

export function CaregiverDetailsSheet({
  caregiver,
  isOpen,
  onClose,
  onUpdateStatus,
}: CaregiverDetailsSheetProps) {
  if (!caregiver) return null;

  const renderStatusBadge = (status: Caregiver["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-600 text-white font-semibold text-xs">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium text-xs">Inactive</Badge>;
      case "Blocked":
        return <Badge variant="destructive" className="bg-rose-600 text-white font-semibold text-xs">Blocked</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto no-scrollbar p-6 space-y-6">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-[#01265D] shadow-sm">
              <AvatarImage src={caregiver.avatar} alt={caregiver.fullName} />
              <AvatarFallback className="bg-[#01265D] text-white font-bold text-lg">
                {caregiver.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-bold text-foreground">
                  {caregiver.fullName}
                </SheetTitle>
                {renderStatusBadge(caregiver.status)}
              </div>
              <SheetDescription className="text-xs font-mono text-muted-foreground">
                @{caregiver.username} · ID: {caregiver.id}
              </SheetDescription>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{caregiver.rating.toFixed(1)} Rating</span>
                <span className="text-muted-foreground font-normal ml-1">
                  ({caregiver.completedVisits} visits)
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Quick Contact & Demographics */}
        <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-2.5 text-xs">
          <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
            Personal & Contact Info
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span>Age / Gender: <strong className="text-foreground">{caregiver.age}y · {caregiver.gender}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span>DOB: <strong className="text-foreground">{caregiver.dateOfBirth}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span className="font-mono text-foreground">{caregiver.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground truncate">
              <Mail className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" />
              <span className="truncate text-foreground">{caregiver.email}</span>
            </div>
          </div>
          {caregiver.address && (
            <div className="flex items-center gap-1.5 text-muted-foreground pt-1 border-t">
              <MapPin className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400 shrink-0" />
              <span className="truncate text-foreground">{caregiver.address}</span>
            </div>
          )}
        </div>

        {/* Performance & Ratings Section */}
        <div className="rounded-xl border p-4 bg-card space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            Ratings & Performance Telemetry
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-xs text-muted-foreground block">Rating</span>
              <strong className="text-base text-amber-500 font-extrabold">{caregiver.rating.toFixed(1)} ★</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-xs text-muted-foreground block">Visits</span>
              <strong className="text-base text-[#01265D] dark:text-blue-400 font-extrabold">{caregiver.completedVisits}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-xs text-muted-foreground block">Punctuality</span>
              <strong className="text-base text-emerald-600 font-extrabold">{caregiver.punctualityRate}</strong>
            </div>
          </div>
        </div>

        {/* KYC Verification Status */}
        <div className="rounded-xl border p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              KYC & License Verification
            </h4>
            <Badge
              variant={caregiver.kycStatus === "Verified" ? "default" : "secondary"}
              className="text-[10px]"
            >
              {caregiver.kycStatus}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-muted-foreground">Govt ID Proof:</span>
              <span className="font-semibold flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-muted-foreground">Nursing / Care License:</span>
              {caregiver.kycDetails.nursingLicense ? (
                <span className="font-semibold flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              ) : (
                <span className="font-semibold flex items-center gap-1 text-rose-600">
                  <XCircle className="h-3.5 w-3.5" /> Missing
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border">
              <span className="text-muted-foreground">Background Check:</span>
              {caregiver.kycDetails.backgroundCheck ? (
                <span className="font-semibold flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                </span>
              ) : (
                <span className="font-semibold flex items-center gap-1 text-amber-600">
                  <Clock className="h-3.5 w-3.5" /> Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="rounded-xl border p-4 bg-card space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
            Skills & Clinical Certifications
          </h4>

          <div className="space-y-2">
            <span className="text-[11px] text-muted-foreground font-semibold block">
              Experience: <strong className="text-foreground">{caregiver.experience}</strong>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {caregiver.skills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-[#01265D] dark:text-blue-100 dark:bg-blue-950/60 dark:text-blue-300">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t text-xs">
            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-[#01265D] dark:text-blue-400" /> Certifications:
            </span>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pl-1">
              {caregiver.certifications.map((cert, idx) => (
                <li key={idx} className="text-[11px] text-foreground font-medium">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Account Actions Bar */}
        <div className="space-y-2 pt-2 border-t">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Caregiver Account Actions
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={caregiver.status === "Active"}
              onClick={() => onUpdateStatus(caregiver.id, "Active")}
              className="h-9 text-xs text-emerald-600 border-slate-200 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Enable
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={caregiver.status === "Inactive"}
              onClick={() => onUpdateStatus(caregiver.id, "Inactive")}
              className="h-9 text-xs text-slate-700 border-slate-200 hover:bg-slate-100"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Disable
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={caregiver.status === "Blocked"}
              onClick={() => onUpdateStatus(caregiver.id, "Blocked")}
              className="h-9 text-xs text-rose-600 border-slate-200 hover:bg-rose-50"
            >
              <Ban className="h-3.5 w-3.5 mr-1" />
              Block User
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
