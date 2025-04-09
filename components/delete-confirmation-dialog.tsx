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
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

const DeleteConfirmationDialog = ({
  title,
  text,
  open,
  autoCloseOnConfirm,
  onClose,
  onConfirm,
  defaultToast = true,
  toastMessage = "Successfully deleted",
}: {
  title?: string;
  text?: string;
  open: boolean;
  autoCloseOnConfirm?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  defaultToast?: boolean;
  toastMessage?: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = async () => {
    await onConfirm();
    if (autoCloseOnConfirm) {
      onClose();
    }
    if (defaultToast) {
      toast.success(toastMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={isPending ? "pointer-events-none" : ""}
            onClick={() => startTransition(handleConfirm)}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Procesando.." : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
