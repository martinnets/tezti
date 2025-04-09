import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/config/axios.config";
import { Evaluated } from "@/lib/types/processes";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface EvaluatedViewModalProps {
  open: boolean;
  onCancel: () => void;
  evaluated?: Evaluated;
}

const EvaluatedViewModal = ({
  open,
  onCancel,
  evaluated,
}: EvaluatedViewModalProps) => {
  const [loadedEvaluated, setLoadedEvaluated] = useState<Evaluated | null>(
    null
  );

  useEffect(() => {
    if (evaluated) {
      api.get(`/evaluateds/${evaluated.id}/get`).then((res) => {
        setLoadedEvaluated(res.data.data);
      });
    }
  }, [evaluated]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {loadedEvaluated?.name} {loadedEvaluated?.lastname}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center justify-between">
              <div>
                <div>Nombre</div>
                <div>{loadedEvaluated?.name}</div>
              </div>
              <div>
                <div>Email</div>
                <div>{loadedEvaluated?.email}</div>
              </div>
            </div>
            <div className="mt-8">
              <div className="font-bold mb-2">Campos adicionales</div>
              {loadedEvaluated?.additionals?.map((additional) => (
                <div
                  className="mb-2"
                  key={additional.id}>
                  <div>{additional.name}</div>
                  <div>{additional.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div className="font-bold mb-2">Evaluaciones</div>
              {loadedEvaluated?.evaluations?.map((evaluation) => (
                <div
                  className="mb-2"
                  key={evaluation.skill}>
                  <div className="flex items-center">
                    <span className="mr-2">{evaluation.skill} </span>
                    {evaluation.status === 0 ? (
                      <Icon
                        icon="game-icons:sands-of-time"
                        className="h-4 w-4 mr-2"
                      />
                    ) : (
                      <Icon
                        icon="heroicons:check"
                        className="h-4 w-4 mr-2"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EvaluatedViewModal;
