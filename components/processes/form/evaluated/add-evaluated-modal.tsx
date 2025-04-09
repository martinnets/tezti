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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircularProgress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/config/axios.config";
import { AdditionalField } from "@/lib/types/additional-fields";
import { Evaluated, Process } from "@/lib/types/processes";
import {
  processAddEvaluatedSchema,
  ProcessAddEvaluatedSchemaData,
} from "@/lib/types/processes/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { debounce } from "remeda";
import { z } from "zod";

interface AddEvaluatedModalProps {
  isAdding: boolean;
  open: boolean;
  onCancel: () => void;
  evaluatedToEdit?: Evaluated;
  process?: Process;
  onConfirm: (
    data: ProcessAddEvaluatedSchemaData,
    additionals: { id: number; value: string }[]
  ) => void;
  processAdditionals: number[];
}

const AddEvaluatedModal = ({
  isAdding,
  open,
  onCancel,
  onConfirm,
  evaluatedToEdit,
  processAdditionals,
  process,
}: AddEvaluatedModalProps) => {
  const [isPending, startTransition] = React.useTransition();

  const [additionals, setAdditionals] = React.useState<AdditionalField[]>([]);

  const [isSearchingUser, setIsSearchingUser] = React.useState(false);

  const [additionalsData, setAdditionalsData] = React.useState<
    Record<string, string>
  >({});

  const [userIsAddedInProcess, setUserIsAddedInProcess] = React.useState(false);

  const finalSchema = useMemo(() => {
    let schema = z.object({});
    additionals.forEach((curr) => {
      schema = schema.extend({
        ["field" + curr.id.toString()]: z
          .string({
            required_error: 'El campo "' + curr.name + '" es requerido',
          })
          .optional(),
      });
    });

    const mergedSchema = schema.merge(processAddEvaluatedSchema);
    return mergedSchema;
  }, [additionals]);

  const {
    register,
    control,
    reset,
    setValue,
    trigger,
    watch,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(finalSchema),
    mode: "all",
  });

  const email = watch("email");

  const onSubmit = (formData: any) => {
    const additionals = _.transform(
      additionalsData,
      (acc, value, key) => {
        acc.push({ id: parseInt(key), value: value as string });
        return acc;
      },
      [] as { id: number; value: string }[]
    );

    onConfirm(formData, additionals);

    // reset();
  };

  const onErrors = (errors: any) => {
    // console.log("onErrors", errors);
  };

  const loadAdditionals = async () => {
    api.get("/additional-fields/list").then((response) => {
      setAdditionals(
        response.data.data.filter((additional: AdditionalField) =>
          processAdditionals.includes(additional.id)
        )
      );
    });
  };

  const loadUserIfEditing = () => {
    if (evaluatedToEdit) {
      api
        .get(`/processes/users/${evaluatedToEdit?.id}/get`)
        .then((response) => {
          const data = response.data.data;
          _.forOwn(data, (value, key) => {
            setValue(key, data[key] as string);
          });

          const additionals = data.additionals;

          _.forOwn(additionals, (value, key) => {
            setAdditionalsData((prev) => ({
              ...prev,
              [value.id]: value.value,
            }));
          });
        });
    } else {
      reset();
      setAdditionalsData({});
    }
  };

  const checkIfUserIsInProcess = (userId: number, email: string) => {
    return api
      .get(`/processes/${process?.id}/users/${userId}/check`)
      .then((response) => {
        const { is_added } = response.data;
        return is_added;
      });
  };

  const handleSearch = (email: string) => {
    setIsSearchingUser(true);
    api.get("/users/by-email/get", { params: { email } }).then((response) => {
      if (response.data.exists) {
        const formData = response.data.data;
        checkIfUserIsInProcess(formData.id, email).then((isInProcess) => {
          if (isInProcess) {
            toast.error("El usuario ya se encuentra en el proceso");
            setUserIsAddedInProcess(true);
          } else {
            setValue("document_number", formData.document_number);
            setValue("document_type", formData.document_type);
            setValue("name", formData.name);
            setValue("lastname", formData.lastname);
            setUserIsAddedInProcess(false);
          }
          setIsSearchingUser(false);
        });
      } else {
        // reset();
        resetField("document_number");
        resetField("document_type");
        resetField("name");
        resetField("lastname");
        setAdditionalsData({});
        setIsSearchingUser(false);
        setUserIsAddedInProcess(false);
      }
    });
  };

  const searchForUserByEmail = useRef(
    debounce(handleSearch, {
      timing: "trailing",
      waitMs: 500,
    })
  ).current;

  useEffect(() => {
    loadAdditionals();
  }, [processAdditionals]);

  useEffect(() => {
    if (evaluatedToEdit) loadUserIfEditing();
  }, [evaluatedToEdit]);

  useEffect(() => {
    if (open === false) {
      setAdditionals([]);
      setAdditionalsData({});
      setTimeout(() => {
        reset();
      }, 500);
    } else {
      loadAdditionals();
    }
  }, [open]);

  useEffect(() => {
    if (evaluatedToEdit) return;
    setIsSearchingUser(true);
    searchForUserByEmail.call(email);
  }, [email]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {(isAdding ? "Añadir" : "Ver") + " evaluado"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 xl:mt-7">
              <div className="space-y-4">
                <div className="relative">
                  <Label
                    htmlFor="email"
                    className="mb-2 font-medium text-default-600">
                    Email{" "}
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register("email")}
                    type="email"
                    id="email"
                    className={cn("", {
                      "border-destructive": errors.email,
                    })}
                  />
                  {isSearchingUser ? (
                    <div className="absolute top-5 right-0 scale-50">
                      <CircularProgress
                        value={50}
                        color="primary"
                        loading
                        size="xs"
                      />
                    </div>
                  ) : null}
                  {errors.email && (
                    <div className=" text-destructive mt-2 mb-4">
                      {errors.email.message as string}
                    </div>
                  )}
                </div>

                <div className="flex gap-5">
                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="name"
                      className="mb-2 font-medium text-default-600">
                      Nombres{" "}
                    </Label>
                    <Input
                      disabled={isPending}
                      {...register("name")}
                      type="text"
                      id="name"
                      className={cn("", {
                        "border-destructive": errors.name,
                      })}
                    />
                    {errors.name && (
                      <div className=" text-destructive mt-2 mb-4">
                        {errors.name.message as string}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="lastname"
                      className="mb-2 font-medium text-default-600">
                      Apellidos{" "}
                    </Label>
                    <Input
                      disabled={isPending}
                      {...register("lastname")}
                      type="text"
                      id="name"
                      className={cn("", {
                        "border-destructive": errors.name,
                      })}
                    />
                    {errors.lastname && (
                      <div className=" text-destructive mt-2 mb-4">
                        {errors.lastname.message as string}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="Tipo de documento"
                      className="mb-2 font-medium text-default-600">
                      Tipo de documento{" "}
                    </Label>
                    <Controller
                      name="document_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}>
                          <SelectTrigger
                            className={cn("", {
                              "border-destructive": errors.document_type,
                            })}>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {errors.document_type && (
                      <div className=" text-destructive mt-2 mb-4">
                        {errors.document_type.message as string}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="document_number"
                      className="mb-2 font-medium text-default-600">
                      Número de documento{" "}
                    </Label>
                    <Input
                      disabled={isPending}
                      {...register("document_number")}
                      type="document_number"
                      id="document_number"
                      className={cn("", {
                        "border-destructive": errors.document_number,
                      })}
                    />
                    {errors.document_number && (
                      <div className=" text-destructive mt-2 mb-4">
                        {errors.document_number.message as string}
                      </div>
                    )}
                  </div>
                </div>

                {additionals.length ? (
                  <div className="mb-8">Información adicional</div>
                ) : null}
                {additionals.map((additional) => (
                  <div key={additional.id}>
                    <Label className="mb-2 font-medium text-default-600">
                      {additional.name}
                    </Label>
                    <Controller
                      name={"field" + additional.id.toString()}
                      control={control}
                      render={({ field }) => (
                        <Input
                          disabled={isPending}
                          className={cn("", {
                            "border-destructive": errors.phone,
                          })}
                          value={additionalsData[additional.id.toString()]}
                          onChange={(e) => {
                            field.onChange(e);
                            setAdditionalsData((prev) => ({
                              ...prev,
                              [additional.id]: e.target.value,
                            }));
                          }}
                        />
                      )}
                    />
                    {/* {errors.phone && (
                      <div className=" text-destructive mt-2 mb-4">
                        {errors.phone.message as string}
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {evaluatedToEdit ? "Cerrar" : "Cancelar"}
          </AlertDialogCancel>
          {!evaluatedToEdit ? (
            <AlertDialogAction
              disabled={userIsAddedInProcess}
              className={isPending ? "pointer-events-none" : ""}
              onClick={handleSubmit(onSubmit, onErrors)}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Procesando.." : isAdding ? "Añadir" : "Ver"}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddEvaluatedModal;
