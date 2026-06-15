import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AddressDeleteDialog({
  deleteModalOpen,
  setDeleteModalOpen,
  handleDelete,
  addressId,
}: {
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  handleDelete: (addressId: string) => void;
  addressId: string;
}) {
  return (
    <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-500">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Address?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this address from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            onClick={() => handleDelete(addressId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
