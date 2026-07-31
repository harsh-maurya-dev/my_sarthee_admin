"use client";

import { CaregiverPayout } from "../_data/payouts";
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
import { Receipt, DollarSign, Percent, Building2, CheckCircle2, Download, ArrowRight } from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface PayoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: CaregiverPayout | null;
  onProcessPayout: (id: string) => void;
}

export function PayoutDetailsModal({
  isOpen,
  onClose,
  payout,
  onProcessPayout,
}: PayoutDetailsModalProps) {
  if (!payout) return null;

  const handleProcess = () => {
    onProcessPayout(payout.id);
    swiftAlert.success({
      title: "Payout Transferred",
      description: `Disbursed $${payout.netCaregiverPayout.toLocaleString()} to ${payout.caregiverName}'s ${payout.bankName} account.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-600" />
                Caregiver Payout Breakdown
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Payout ID: <strong className="font-mono text-foreground">{payout.id}</strong> · Booking Ref:{" "}
                <strong className="font-mono text-foreground">{payout.bookingReference}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={payout.status === "Paid" ? "default" : payout.status === "Processing" ? "secondary" : "outline"}
              className="text-xs font-bold"
            >
              {payout.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Net Transfer Card */}
          <div className="rounded-xl border bg-slate-50 dark:bg-slate-900 p-4 text-center space-y-1">
            <span className="text-muted-foreground font-semibold text-[10px] uppercase tracking-wider block">
              Net Amount Transferred to Caregiver
            </span>
            <h2 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              ${payout.netCaregiverPayout.toLocaleString()}
            </h2>
            <p className="text-[11px] text-muted-foreground">
              To {payout.caregiverName} ({payout.caregiverRole})
            </p>
          </div>

          {/* Calculation Breakdown Grid */}
          <div className="rounded-xl border p-4 bg-card space-y-2.5">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-medium">Gross Booking Amount Received:</span>
              <strong className="text-foreground">${payout.grossBookingAmount.toLocaleString()}</strong>
            </div>

            <div className="flex justify-between border-b pb-2 text-amber-700 dark:text-amber-400">
              <span className="font-medium">Platform Commission ({payout.platformCommissionPercent}%):</span>
              <strong className="font-bold">-${payout.platformCommissionAmount.toLocaleString()}</strong>
            </div>

            <div className="flex justify-between border-b pb-2 text-emerald-600 dark:text-emerald-400 font-extrabold">
              <span>Net Caregiver Payout:</span>
              <span>${payout.netCaregiverPayout.toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground font-medium">Destination Bank:</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                {payout.bankName} (•••• {payout.bankAccountLast4})
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-9 text-xs">
            Close
          </Button>

          {payout.status !== "Paid" && (
            <Button
              type="button"
              size="sm"
              onClick={handleProcess}
              className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Transfer Net Payout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
