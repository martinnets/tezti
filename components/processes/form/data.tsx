"use client";

import DatePickerWithRange from "@/components/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/config/axios.config";
import {
  Additional,
  HierarchicalLevel,
  Process,
  Status,
  Type,
} from "@/lib/types/processes";
import { processDataSchema } from "@/lib/types/processes/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as R from "remeda";

type Props = {
  hierarchies: HierarchicalLevel[];
  additionals: Additional[];
  statuses: Status[];
  types: Type[];
  processToEdit?: Process;
  onProcessCreated: (processId: number) => void;
};

const DataForm = ({
  additionals,
  hierarchies,
  types,
  statuses,
  processToEdit,
  onProcessCreated,
}: Props) => {
  const router = useRouter();
  const [selectedAdditionals, setSelectedAdditionals] = useState<
    Record<number, boolean>
  >({});

  const {
    register,
    control,
    reset,
    setValue,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(processDataSchema),
    mode: "all",
  });

  const onSubmit = (formData: any) => {
    startTransition(async () => {
      try {
        const data = {
          ...formData,
          additionals: Object.keys(selectedAdditionals).map((id) =>
            parseInt(id)
          ),
        };

        if (processToEdit?.id) {
          await api.put(`/processes/${processToEdit.id}/update`, data);
          router.push("/processes");
          toast.success("El proceso se actualizó correctamente");
        } else {
          const response = await api.post("/processes/create", data);
          // Notify parent to update tabs
          onProcessCreated(response.data.data.id);

          toast.success("El proceso se creó correctamente");
        }
      } catch (error) {
        toast.error("Error al crear el proceso");
      }
    });
  };

  const onAdditionalChange = (additional: Additional, e: any) => {
    if (e) {
      setSelectedAdditionals((prev) => ({ ...prev, [additional.id]: true }));
    } else {
      setSelectedAdditionals((prev) => ({ ...R.omit(prev, [additional.id]) }));
    }
  };

  const onLoad = () => {
    if (processToEdit) {
      reset({
        name: processToEdit.name,
        hierarchical_level_id: processToEdit.hierarchical_level_id.toString(),
        from: processToEdit.from,
        to: processToEdit.to,
        status: processToEdit.status.toString(),
        type: processToEdit.type.toString(),
      });
      if (processToEdit.additionals) {
        const additionals = processToEdit.additionals.reduce((acc, value) => {
          acc[value] = true;
          return acc;
        }, {} as Record<number, boolean>);
        setSelectedAdditionals(additionals);
      }
    }
  };

  useEffect(onLoad, [processToEdit]);

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
            <div className="col-span-2 lg:col-span-1">
              <Label className="mb-2 font-medium text-default-600">
                Nivel jerárquico
              </Label>
              <Controller
                name="hierarchical_level_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value}
                      defaultValue={processToEdit?.hierarchical_level_id.toString()}
                      onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Nivel jerárquico" />
                      </SelectTrigger>
                      <SelectContent>
                        {hierarchies.map((hierarchy) => (
                          <SelectItem
                            value={hierarchy.id.toString()}
                            key={hierarchy.id}>
                            {hierarchy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hierarchical_level_id && (
                      <div className=" text-destructive mt-2">
                        {errors.hierarchical_level_id.message as string}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Controller
                name="from"
                control={control}
                render={({ field }) => (
                  <>
                    <Label className="mb-2 font-medium text-default-600">
                      Inicio
                    </Label>
                    <DatePickerWithRange
                      value={field.value}
                      onChange={(date) => {
                        setValue(
                          "from",
                          date ? format(date, "yyyy-MM-dd") : null
                        );
                        trigger("from");
                      }}
                    />
                    {errors.from && (
                      <div className=" text-destructive mt-2">
                        {errors.from.message as string}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <>
                    <Label className="mb-2 font-medium text-default-600">
                      Fin
                    </Label>
                    <DatePickerWithRange
                      value={field.value}
                      onChange={(date) => {
                        setValue(
                          "to",
                          date ? format(date, "yyyy-MM-dd") : null
                        );
                        trigger("to");
                      }}
                    />
                    {errors.to && (
                      <div className=" text-destructive mt-2">
                        {errors.to.message as string}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="mb-4 font-lg mt-8">Estado</div>
          <div className="mb-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}>
                    {statuses.map((status) => (
                      <RadioGroupItem
                        color="success"
                        key={status.id.toString()}
                        value={status.id.toString()}
                        id={status.id.toString()}>
                        {status.name}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  {errors.status && (
                    <div className=" text-destructive mt-2">
                      {errors.status.message as string}
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4 font-lg mt-8">Tipos</div>
          <div className="mb-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}>
                    {types.map((type) => (
                      <RadioGroupItem
                        color="success"
                        key={type.id.toString()}
                        value={type.id.toString()}
                        id={type.id.toString()}>
                        {type.name}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  {errors.type && (
                    <div className=" text-destructive mt-2">
                      {errors.type.message as string}
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4 font-lg mt-8">Campos adicionales</div>
          <div className="mb-4">
            {additionals.map((additional) => (
              <div
                className="flex  items-center gap-2.5 mb-2"
                key={additional.id}>
                <Switch
                  color="success"
                  id="terms15"
                  checked={selectedAdditionals[additional.id]}
                  onCheckedChange={(e) => onAdditionalChange(additional, e)}
                />
                <Label
                  htmlFor="terms15"
                  className="text-base text-muted-foreground  font-normal">
                  {additional.name}
                </Label>
              </div>
            ))}
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
