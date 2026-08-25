"use client";

import { ServiceCategory } from "../_data/service-categories";
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

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  categoryName?: string;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  onConfirmDelete,
  categoryName,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold">
            Delete Service Category?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">&quot;{categoryName}&quot;</strong>?
            This action cannot be undone and will remove the category from the platform catalogue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-xs h-9">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="text-xs h-9 bg-rose-600 text-white hover:bg-rose-700 font-semibold"
          >
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
