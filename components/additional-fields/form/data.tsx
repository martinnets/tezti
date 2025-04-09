"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api } from "@/config/axios.config";
import { AdditionalField } from "@/lib/types/additional-fields";
import { additionalFieldDataSchema } from "@/lib/types/additional-fields/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  additionalFieldToEdit?: AdditionalField;
};

const DataForm = ({ additionalFieldToEdit }: Props) => {
  const router = useRouter();

  const {
    register,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(additionalFieldDataSchema),
    mode: "all",
  });

  const onSubmit = (formData: any) => {
    startTransition(async () => {
      try {
        const data = formData;

        if (additionalFieldToEdit?.id) {
          await api.put(
            `/additional-fields/${additionalFieldToEdit.id}/update`,
            data
          );
          router.push("/additional-fields");
          toast.success("El campo adicional se actualizó correctamente");
        } else {
          await api.post("/additional-fields/create", data);
          router.push("/additional-fields");
          toast.success("El campo adicional se creó correctamente");
        }
      } catch (error) {
        toast.error("Error al crear el campo adicional");
      }
    });
  };

  const onLoad = () => {
    if (additionalFieldToEdit) {
      reset({
        name: additionalFieldToEdit.name,
        is_active: additionalFieldToEdit.is_active,
      });
    }
  };

  useEffect(onLoad, [additionalFieldToEdit]);

  return (
    <Card>
      <form
        className=" h-full"
        onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <Label className="mb-2 font-medium text-default-600">
                Nombre del proceso
              </Label>
              <Input
                type="text"
                placeholder="Nombre del proceso"
                id="name"
                {...register("name")}
              />
              {errors.name && (
                <div className=" text-destructive mt-2">
                  {errors.name.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="mb-4 font-lg mt-8">Activo</div>
          <div className="mb-4">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex  items-center gap-2.5 mb-2">
                    <Switch
                      color="success"
                      defaultChecked={additionalFieldToEdit?.is_active}
                      onCheckedChange={(e) => {
                        console.debug(e);
                        setValue("is_active", e === true ? "1" : "0");
                      }}
                    />
                  </div>
                  {errors.status && (
                    <div className=" text-destructive mt-2">
                      {errors.is_active?.message as string}
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button color="success">Guardar</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DataForm;
