"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/config/axios.config";
import { Profile } from "@/lib/types/profile";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Nombres debe tener al menos 3 caracteres." }),
  lastname: z
    .string()
    .min(3, { message: "Apellidos debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "El email es inválido." }),
});

const PersonalDetails = () => {
  const [isPending, startTransition] = React.useTransition();

  const [profile, setProfile] = React.useState<Profile | null>(null);

  const onLoad = () => {
    api.get("/user/profile/get").then((res) => {
      const profile = res.data.data as Profile;
      setProfile(profile);
      reset(profile);
    });
  };

  React.useEffect(onLoad, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        await api.put("/user/profile/update", {
          ...profile,
          ...data,
        });
        toast.success("Datos actualizados correctamente");
      } catch (error) {
        toast.error("Error al actualizar los datos");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="rounded-t-none pt-6">
        <CardContent>
          <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
            <div className="col-span-12 md:col-span-6">
              <Label
                htmlFor="name"
                className="mb-2">
                Nombres
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
            <div className="col-span-12 md:col-span-6">
              <Label
                htmlFor="lastname"
                className="mb-2">
                Apellidos
              </Label>
              <Input
                disabled={isPending}
                {...register("lastname")}
                type="text"
                id="name"
                className={cn("", {
                  "border-destructive": errors.lastname,
                })}
              />
              {errors.lastname && (
                <div className=" text-destructive mt-2 mb-4">
                  {errors.lastname.message as string}
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              <Label
                htmlFor="email"
                className="mb-2">
                Email
              </Label>
              <Input
                disabled={true}
                {...register("email")}
                type="text"
                id="name"
                className={cn("", {
                  "border-destructive": errors.email,
                })}
              />
              {errors.email && (
                <div className=" text-destructive mt-2 mb-4">
                  {errors.email.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button disabled={isPending}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PersonalDetails;
