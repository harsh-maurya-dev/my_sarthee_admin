"use client";

import { MedicalService } from "../_data/services";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Tag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Activity,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ServiceViewSheetProps {
  service: MedicalService | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (service: MedicalService) => void;
  onToggleStatus: (serviceId: string) => void;
  onDelete: (serviceId: string) => void;
}

export function ServiceViewSheet({
  service,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: ServiceViewSheetProps) {
  if (!service) return null;

  const handleToggle = () => {
    onToggleStatus(service.id);
    const nextStatus = service.status === "Enabled" ? "Disabled" : "Enabled";
    swiftAlert.success({
      title: "Service Status Changed",
      description: `"${service.serviceName}" is now ${nextStatus}.`,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[60vw] sm:max-w-[60vw] p-0 flex flex-col overflow-hidden shadow-2xl">
        {/* Service Image Banner Header */}
        <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={service.image}
            alt={service.serviceName}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Badge
              variant={service.status === "Enabled" ? "default" : "secondary"}
              className={
                service.status === "Enabled"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-300"
              }
            >
              {service.status}
            </Badge>
            <Badge variant="outline" className="bg-black/40 text-white border-white/30 backdrop-blur">
              {service.category}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="text-xs font-mono opacity-80">{service.id}</span>
            <h2 className="text-2xl font-bold tracking-tight">{service.serviceName}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-3">
              <div className="rounded-lg p-2.5 bg-blue-100 dark:bg-blue-950/60 dark:bg-blue-950 text-[#01265D] dark:text-blue-300">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Pricing Rate
                </span>
                <span className="text-base font-bold text-foreground">{service.price}</span>
              </div>
            </div>

            <div className="rounded-xl border p-4 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-3">
              <div className="rounded-lg p-2.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Date Created
                </span>
                <span className="text-base font-bold text-foreground">{service.createdDate}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
              Service Overview & Description
            </h3>
            <div className="rounded-xl border p-4 bg-card text-xs leading-relaxed text-foreground space-y-2">
              <p>{service.description}</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="border-t p-4 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(service);
            }}
            className="h-9 text-xs gap-1.5 font-medium border-slate-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Service
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={service.status === "Enabled" ? "outline" : "default"}
              size="sm"
              onClick={handleToggle}
              className={`h-9 text-xs font-semibold ${service.status === "Enabled"
                  ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
            >
              {service.status === "Enabled" ? (
                <>
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Disable Service
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Enable Service
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onClose();
                onDelete(service.id);
              }}
              className="h-9 text-xs gap-1.5 font-semibold border-rose-300 text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Service
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
