"use client";

import { WebsiteService } from "../_data/website-services";
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
import { Globe, Calendar, CheckCircle2, XCircle } from "lucide-react";

interface WebsiteServiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: WebsiteService | null;
}

export function WebsiteServiceViewModal({
  isOpen,
  onClose,
  service,
}: WebsiteServiceViewModalProps) {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Corporate Website Service View
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Service ID: <strong className="font-mono text-foreground">{service.id}</strong> · Created:{" "}
                <strong className="text-foreground">{service.creationDate}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={service.status === "Active" ? "default" : "secondary"}
              className="text-xs font-bold"
            >
              {service.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Banner Image */}
          <div className="rounded-xl border overflow-hidden bg-slate-900 shadow-md">
            <img
              src={service.imageUrl}
              alt={service.serviceName}
              className="h-56 w-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-foreground">{service.serviceName}</h3>
            <p className="text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full bg-[#01265D] hover:bg-[#0a3375] text-white font-bold h-9 text-xs">
            Close Service Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
