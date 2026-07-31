"use client";

import { JobPosting } from "../_data/jobs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, Building2 } from "lucide-react";

interface JobViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
}

export function JobViewModal({
  isOpen,
  onClose,
  job,
}: JobViewModalProps) {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-teal-600" />
                Job Profile Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Job ID: <strong className="font-mono text-foreground">{job.id}</strong> · Posted:{" "}
                <strong className="text-foreground">{job.postedDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={job.status === "Active" ? "default" : "secondary"}
              className="text-xs font-bold"
            >
              {job.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-foreground">{job.jobTitle}</h3>
            <div className="flex items-center gap-3 text-muted-foreground font-medium pt-1">
              <span className="flex items-center gap-1 text-teal-600">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
              <span>•</span>
              <Badge variant="outline">{job.department}</Badge>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider block">Description & Requirements</span>
            <p className="text-muted-foreground bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border leading-relaxed">
              {job.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-9 text-xs">
            Close Job View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
