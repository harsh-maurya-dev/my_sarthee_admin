"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { swiftAlert } from "@/lib/swift-alert";

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  serviceName?: string;
}

export function DeleteServiceDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  serviceName,
}: DeleteServiceDialogProps) {
  const handleConfirm = () => {
    onConfirmDelete();
    swiftAlert.success({
      title: "Service Deleted",
      description: `"${serviceName || "Service"}" has been deleted.`,
    });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold">
            Delete Healthcare Service?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">"{serviceName}"</strong>? This will remove the service from the active platform roster.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="h-9 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 font-semibold"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
