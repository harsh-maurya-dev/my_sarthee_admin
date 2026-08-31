"use client";

import { useState } from "react";
import { Patient } from "../_data/patients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { swiftAlert } from "@/lib/swift-alert";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: Patient) => void;
}

export function AddPatientModal({ isOpen, onClose, onAddPatient }: AddPatientModalProps) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [dateOfBirth, setDateOfBirth] = useState("1975-06-12");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phoneNumber || !medicalCondition) {
      swiftAlert.error({
        title: "Missing Required Fields",
        description: "Please fill in Full Name, Phone Number, and Medical Condition.",
      });
      return;
    }

    const newPatient: Patient = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName,
      age: parseInt(age) || 45,
      gender,
      dateOfBirth,
      address: address || "City Central District",
      phoneNumber,
      medicalCondition,
      status: "Active",
      registrationDate: new Date().toISOString().split("T")[0],
      bloodGroup: "O+",
      vitals: {
        heartRate: "74 bpm",
        bloodPressure: "120/80 mmHg",
        oxygenLevel: "98%",
      },
    };

    onAddPatient(newPatient);
    swiftAlert.success({
      title: "Patient Registered Successfully",
      description: `${fullName} has been added to the system.`,
    });
    onClose();

    // Reset form
    setFullName("");
    setAge("");
    setPhoneNumber("");
    setAddress("");
    setMedicalCondition("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Register New Patient</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter the patient's medical details and contact information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold">
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Sarah Connor"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-xs font-semibold">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dob" className="text-xs font-semibold">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Phone Number *
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-semibold">
              Address / Location
            </Label>
            <Input
              id="address"
              placeholder="Full residence address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="condition" className="text-xs font-semibold">
              Medical Condition *
            </Label>
            <Input
              id="condition"
              placeholder="Primary diagnosis or health condition"
              value={medicalCondition}
              onChange={(e) => setMedicalCondition(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-[#01265D] text-white hover:bg-[#0a3375] font-semibold">
              Register Patient
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
