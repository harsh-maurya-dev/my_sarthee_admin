"use client";

import { useState, useEffect } from "react";
import { JobPosting } from "../_data/jobs";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Plus, MapPin } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface AddEditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: JobPosting | null;
  onSaveJob: (job: JobPosting) => void;
}

export function AddEditJobModal({
  isOpen,
  onClose,
  jobToEdit,
  onSaveJob,
}: AddEditJobModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("Clinical Nursing");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    if (jobToEdit) {
      setJobTitle(jobToEdit.jobTitle);
      setLocation(jobToEdit.location);
      setDescription(jobToEdit.description);
      setDepartment(jobToEdit.department);
      setStatus(jobToEdit.status);
    } else {
      setJobTitle("");
      setLocation("");
      setDescription("");
      setDepartment("Clinical Nursing");
      setStatus("Active");
    }
  }, [jobToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle || !location || !description) {
      swiftAlert.error({
        title: "Validation Error",
        description: "Please fill in Job Title, Location, and Description.",
      });
      return;
    }

    const job: JobPosting = {
      id: jobToEdit ? jobToEdit.id : `JOB-${Math.floor(500 + Math.random() * 300)}`,
      jobTitle,
      location,
      description,
      department,
      postedDate: jobToEdit ? jobToEdit.postedDate : new Date().toISOString().split("T")[0],
      status,
    };

    onSaveJob(job);
    swiftAlert.success({
      title: jobToEdit ? "Job Updated" : "Job Posted",
      description: `Job profile "${jobTitle}" has been saved.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal-600" />
            {jobToEdit ? "Edit Clinical Job Profile" : "Post New Clinical Job"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure job title, location, shift description & status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Job Title */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Job Title *</Label>
            <Input
              placeholder="e.g. Senior ICU Home Care Nurse Practitioner"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="h-9 text-xs w-full"
              required
            />
          </div>

          {/* Location & Department */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Location *</Label>
              <Input
                placeholder="e.g. Austin, TX (Home Visits)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-9 text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5 w-full">
              <Label className="text-xs font-semibold">Department *</Label>
              <Select value={department} onValueChange={(val: any) => setDepartment(val || "")}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clinical Nursing">Clinical Nursing</SelectItem>
                  <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                  <SelectItem value="Senior Care">Senior Care</SelectItem>
                  <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Job Description & Requirements *</Label>
            <Textarea
              placeholder="Detailed responsibilities, required licenses (RN, DPT), and shift details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-28 text-xs w-full resize-none"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold">Job Status *</Label>
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
              <SelectTrigger className="h-9 text-xs w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 text-xs bg-teal-600 text-white hover:bg-teal-700 font-semibold">
              {jobToEdit ? "Update Job Profile" : "Publish Job Posting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
