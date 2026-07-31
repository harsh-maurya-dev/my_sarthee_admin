"use client";

import { PaymentTransaction } from "../_data/transactions";
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
import {
  CreditCard,
  Download,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  DollarSign,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  onProcessRefund: (id: string) => void;
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  onProcessRefund,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const handleDownloadReceipt = () => {
    swiftAlert.success({
      title: "Receipt Downloaded",
      description: `Tax receipt PDF for ${transaction.id} saved to downloads.`,
    });
  };

  const handleRefund = () => {
    onProcessRefund(transaction.id);
    swiftAlert.success({
      title: "Refund Initiated",
      description: `Refund of $${transaction.amount} processed for transaction ${transaction.id}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-teal-600" />
                Payment Transaction Receipt
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Transaction ID: <strong className="font-mono text-foreground">{transaction.id}</strong>
              </DialogDescription>
            </div>
            <Badge
              variant={
                transaction.status === "Successful"
                  ? "default"
                  : transaction.status === "Pending"
                  ? "outline"
                  : transaction.status === "Refunded"
                  ? "secondary"
                  : "destructive"
              }
              className="text-xs font-bold"
            >
              {transaction.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Amount Box */}
          <div className="rounded-xl border bg-slate-50/80 dark:bg-slate-900/50 p-4 text-center space-y-1">
            <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">Total Paid Amount</span>
            <h2 className="text-3xl font-extrabold text-foreground">${transaction.amount.toLocaleString()}</h2>
            <p className="text-[10px] text-teal-600 font-semibold">{transaction.serviceCategory}</p>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="rounded-xl border p-4 bg-card space-y-2.5">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-medium">Username:</span>
              <strong className="font-mono text-foreground">@{transaction.username}</strong>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-medium">Patient Full Name:</span>
              <strong className="text-foreground">{transaction.patientName}</strong>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-medium">Transaction Date & Time:</span>
              <strong className="font-mono text-foreground">{transaction.date} at {transaction.time}</strong>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground font-medium">Payment Mode:</span>
              <Badge variant="outline" className="font-semibold text-xs">{transaction.paymentMode}</Badge>
            </div>

            {transaction.cardLast4 && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground font-medium">Card Last 4 Digits:</span>
                <span className="font-mono text-foreground">•••• •••• •••• {transaction.cardLast4}</span>
              </div>
            )}

            {transaction.upiId && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground font-medium">UPI VPA Handle:</span>
                <span className="font-mono text-foreground">{transaction.upiId}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Gateway Reference Ref:</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{transaction.gatewayTxnRef}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadReceipt}
            className="h-9 text-xs gap-1.5 border-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF Receipt
          </Button>

          {transaction.status === "Successful" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefund}
              className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Initiate Refund
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
