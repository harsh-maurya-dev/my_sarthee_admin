"use client";

import { useState } from "react";
import { Caregiver } from "../_data/caregivers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, HeartPulse } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddCaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCaregiver: (newCaregiver: Caregiver) => void;
}

export function AddCaregiverModal({
  isOpen,
  onClose,
  onAddCaregiver,
}: AddCaregiverModalProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [dateOfBirth, setDateOfBirth] = useState("1995-05-15");
  const [experience, setExperience] = useState("5 Years");
  const [skillsInput, setSkillsInput] = useState("Post-Op Care, Vital Monitoring, CPR");
  const [certificationsInput, setCertificationsInput] = useState("Licensed Practical Nurse (LPN), CPR Certified");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !username || !email) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Full Name, Username, and Email.",
      });
      return;
    }

    const newCaregiver: Caregiver = {
      id: `CG-${Date.now().toString().slice(-6)}`,
      fullName,
      username: username.toLowerCase().replace(/\s+/g, "."),
      email,
      phoneNumber: phoneNumber || "+1 (555) 000-0000",
      age: Number(age) || 30,
      gender,
      dateOfBirth,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      experience,
      certifications: certificationsInput.split(",").map((c) => c.trim()).filter(Boolean),
      status: "Active",
      registrationDate: new Date().toISOString().split("T")[0],
      rating: 5.0,
      completedVisits: 0,
      punctualityRate: "100%",
      kycStatus: "Verified",
      kycDetails: {
        idProof: true,
        nursingLicense: true,
        backgroundCheck: true,
      },
    };

    onAddCaregiver(newCaregiver);
    swiftAlert.success({
      title: "Caregiver Registered",
      description: `${fullName} has been successfully added to active caregivers roster.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
            Register New Caregiver
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Create a new caregiver account with skills, experience, and professional certifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Full Name & Username */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                placeholder="e.g. Dr. Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Username *</Label>
              <Input
                placeholder="e.g. sarah.jenkins"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address *</Label>
              <Input
                type="email"
                placeholder="sarah.j@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Phone Number</Label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Age, Gender & DOB */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Age</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Gender</Label>
              <Select value={gender} onValueChange={(val: any) => setGender(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Date of Birth</Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Experience</Label>
            <Input
              placeholder="e.g. 6 Years in Clinical Care"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Skills (Comma Separated) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Skills (Comma-separated)</Label>
            <Input
              placeholder="Post-Stroke Care, Gait Training, Insulin Admin..."
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Certifications (Comma Separated) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Certifications (Comma-separated)</Label>
            <Input
              placeholder="Registered Nurse (RN), CPR Certified, ACLS..."
              value={certificationsInput}
              onChange={(e) => setCertificationsInput(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold">
              Register Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
