"use client";

import { useState, useEffect } from "react";
import { ServiceRequest } from "../_data/service-requests";
import { MedicalService } from "../_data/services";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCheck,
  FileText,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface ReviewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  availableServices: MedicalService[];
  onSaveRequest: (updatedRequest: ServiceRequest) => void;
}

export function ReviewRequestModal({
  isOpen,
  onClose,
  request,
  availableServices,
  onSaveRequest,
}: ReviewRequestModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [addonFee, setAddonFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    if (request) {
      setCurrentStep(1);
      setSelectedServiceId(request.recommendedServiceId || availableServices[0]?.id || "");
      setAdminNotes(request.notes || "");
      setBasePrice(request.pricing.basePrice);
      setAddonFee(request.pricing.addonFee);
      setDiscount(request.pricing.discount);
    }
  }, [request, availableServices]);

  if (!request) return null;

  const selectedService = availableServices.find((s) => s.id === selectedServiceId);
  const calculatedFinalPrice = Math.max(0, basePrice + addonFee - discount);

  const handleSelectService = (serviceId: string | null) => {
    if (!serviceId) return;
    setSelectedServiceId(serviceId);
    const service = availableServices.find((s) => s.id === serviceId);
    if (service) {
      // Parse numerical price if available
      const parsedPrice = parseInt(service.price.replace(/[^0-9]/g, "")) || 100;
      setBasePrice(parsedPrice);
    }
  };

  const handleApproveBooking = () => {
    const updated: ServiceRequest = {
      ...request,
      recommendedServiceId: selectedServiceId,
      recommendedServiceName: selectedService?.serviceName || request.recommendedServiceName || "Standard Healthcare Service",
      notes: adminNotes,
      pricing: {
        basePrice,
        addonFee,
        discount,
        finalPrice: calculatedFinalPrice,
      },
      status: "Approved",
    };

    onSaveRequest(updated);
    swiftAlert.success({
      title: "Booking Request Approved",
      description: `Service request ${request.id} for ${request.patientName} has been approved and assigned.`,
    });
    onClose();
  };

  const handleRejectBooking = () => {
    const updated: ServiceRequest = {
      ...request,
      status: "Rejected",
    };
    onSaveRequest(updated);
    swiftAlert.error({
      title: "Request Rejected",
      description: `Service request ${request.id} marked as rejected.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#01265D] dark:text-blue-400" />
                Service Request Management Flow
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Process Request <strong className="font-mono text-foreground">{request.id}</strong> · Patient:{" "}
                <strong className="text-foreground">{request.patientName}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                request.status === "Approved"
                  ? "default"
                  : request.status === "Pending"
                  ? "outline"
                  : "secondary"
              }
              className="text-xs px-2.5 py-0.5"
            >
              {request.status}
            </Badge>
          </div>

          {/* Stepper Header Bar */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all text-left ${
                currentStep === 1
                  ? "bg-blue-50 dark:bg-blue-950/40 border-[#01265D] text-[#01265D] dark:text-blue-100 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-slate-50 border-slate-200 text-muted-foreground hover:bg-slate-100"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 1 ? "bg-[#01265D] text-white" : "bg-slate-200 text-slate-700"
              }`}>
                1
              </span>
              <span className="truncate">1. Review Request</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all text-left ${
                currentStep === 2
                  ? "bg-blue-50 dark:bg-blue-950/40 border-[#01265D] text-[#01265D] dark:text-blue-100 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-slate-50 border-slate-200 text-muted-foreground hover:bg-slate-100"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 2 ? "bg-[#01265D] text-white" : "bg-slate-200 text-slate-700"
              }`}>
                2
              </span>
              <span className="truncate">2. Recommend & Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold transition-all text-left ${
                currentStep === 3
                  ? "bg-blue-50 dark:bg-blue-950/40 border-[#01265D] text-[#01265D] dark:text-blue-100 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-slate-50 border-slate-200 text-muted-foreground hover:bg-slate-100"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 3 ? "bg-[#01265D] text-white" : "bg-slate-200 text-slate-700"
              }`}>
                3
              </span>
              <span className="truncate">3. Approve Booking</span>
            </button>
          </div>
        </DialogHeader>

        {/* STEP 1: REVIEW PATIENT & CARE REQUIREMENT */}
        {currentStep === 1 && (
          <div className="space-y-4 py-3">
            {/* Patient Header Card */}
            <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#01265D] dark:text-blue-200 font-bold flex items-center justify-center text-sm dark:bg-blue-950 dark:text-blue-300">
                    {request.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{request.patientName}</h3>
                    <p className="text-xs text-muted-foreground">
                      ID: <span className="font-mono">{request.patientId}</span> · {request.age} yrs · {request.gender}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {request.medicalCondition}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <span>{request.patientPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span className="truncate">{request.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pref Date: <strong>{request.preferredDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Pref Time: <strong>{request.preferredTime}</strong></span>
                </div>
              </div>
            </div>

            {/* Care Requirement Section */}
            <div className="rounded-xl border p-4 space-y-2 bg-card">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                Patient Care Requirement Statement
              </h4>
              <p className="text-xs text-foreground leading-relaxed font-medium bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border">
                "{request.careRequirement}"
              </p>
            </div>

            {/* Admin Notes Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Admin Clinical Assessment / Notes</Label>
              <Textarea
                placeholder="Add internal evaluation notes regarding patient's requirements..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="text-xs min-h-[80px]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: RECOMMEND SERVICE & PRICING REVIEW */}
        {currentStep === 2 && (
          <div className="space-y-4 py-3">
            {/* Recommend Healthcare Service */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                  Recommend Healthcare Service
                </h4>
                <span className="text-[11px] text-[#01265D] dark:text-blue-400 font-semibold">Step 2 of 3</span>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Matching Platform Service</Label>
                <Select value={selectedServiceId} onValueChange={handleSelectService}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Choose appropriate service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="text-xs">
                        {service.serviceName} ({service.category}) - {service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <div className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/30 dark:bg-blue-950/30 text-xs space-y-1">
                  <p className="font-semibold text-[#01265D] dark:text-blue-100 dark:text-blue-300">
                    Selected: {selectedService.serviceName}
                  </p>
                  <p className="text-muted-foreground line-clamp-2">{selectedService.description}</p>
                </div>
              )}
            </div>

            {/* Pricing Review Section */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-[#01265D] dark:text-blue-400" />
                Service Pricing Review & Adjustments
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Base Price ($)</Label>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Addon Care Fee ($)</Label>
                  <Input
                    type="number"
                    value={addonFee}
                    onChange={(e) => setAddonFee(Number(e.target.value) || 0)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Discount ($)</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800">
                <span className="text-xs font-semibold">Total Service Price for Booking:</span>
                <span className="text-lg font-bold text-blue-400 font-mono">
                  ${calculatedFinalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: APPROVE BOOKING FINAL REVIEW */}
        {currentStep === 3 && (
          <div className="space-y-4 py-3">
            <div className="rounded-xl border bg-emerald-50/60 dark:bg-emerald-950/30 p-4 border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Ready to Approve Booking Request</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Review the summary below before approving this healthcare booking request for care provider dispatch.
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-3 bg-card text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Patient:</span>
                <strong className="text-foreground">{request.patientName} ({request.patientPhone})</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Recommended Service:</span>
                <strong className="text-[#01265D] dark:text-blue-300 dark:text-blue-400">{selectedService?.serviceName || "Standard Healthcare"}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Scheduled Date & Time:</span>
                <strong className="text-foreground">{request.preferredDate} at {request.preferredTime}</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Address:</span>
                <strong className="text-foreground truncate max-w-xs">{request.address}</strong>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm font-bold">
                <span>Final Confirmed Price:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                  ${calculatedFinalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dialog Footer Actions */}
        <DialogFooter className="border-t pt-4 flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRejectBooking}
              className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Reject Request
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="h-9 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="h-9 text-xs bg-[#01265D] hover:bg-[#0a3375] text-white font-semibold"
              >
                Next Step
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleApproveBooking}
                className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Approve Booking
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
