"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { api } from "@/config/axios.config";
import { passwordRule } from "@/lib/types/admins/schema";
import { Profile } from "@/lib/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z
  .object({
    password: passwordRule(false),
    confirm_password: passwordRule(false),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Los passwords no coinciden",
    path: ["confirm_password"], // Path to the field that will show the error
  });

const ChangePassword = () => {
  const [isPending, startTransition] = useTransition();

  const [newPasswordType, setNewPasswordType] = useState<string>("password");
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<string>("password");

  const [profile, setProfile] = useState<Profile | null>(null);

  const onLoad = () => {
    api.get("/user/profile/get").then((res) => {
      const profile = res.data.data as Profile;
      setProfile(profile);
      reset(profile);
    });
  };

  useEffect(onLoad, []);

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
        toast.success("Contraseña actualizada correctamente");
      } catch (error) {
        toast.error("Error al actualizar la contraseña");
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="rounded-t-none pt-6">
          <CardContent>
            <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
              <div className="col-span-12 md:col-span-6 relative">
                <Label
                  htmlFor="password"
                  className="mb-2">
                  Contraseña
                </Label>
                <Input
                  {...register("password")}
                  type={newPasswordType}
                  id="name"
                  className={cn("", {
                    "border-destructive": errors.password,
                  })}
                />
                <Eye
                  className={cn(
                    "absolute right-3 top-[35px] text-default-500 w-4 h-4 cursor-pointer",
                    newPasswordType === "text" && "hidden"
                  )}
                  onClick={() => setNewPasswordType("text")}
                />
                <EyeOff
                  className={cn(
                    "absolute right-3 top-[35px] text-default-500 w-4 h-4 cursor-pointer",
                    newPasswordType === "password" && "hidden"
                  )}
                  onClick={() => setNewPasswordType("password")}
                />
                {errors.password && (
                  <div className=" text-destructive mt-2 mb-4">
                    {errors.password.message as string}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-6 relative">
                <Label
                  htmlFor="confirm_password"
                  className="mb-2">
                  Confirmar contraseña
                </Label>
                <Input
                  {...register("confirm_password")}
                  id="name"
                  type={confirmPasswordType}
                  className={cn("", {
                    "border-destructive": errors.confirm_password,
                  })}
                />{" "}
                <Eye
                  className={cn(
                    "absolute right-3 top-[35px] text-default-500 w-4 h-4 cursor-pointer",
                    confirmPasswordType === "text" && "hidden"
                  )}
                  onClick={() => setConfirmPasswordType("text")}
                />
                <EyeOff
                  className={cn(
                    "absolute right-3 top-[35px] text-default-500 w-4 h-4 cursor-pointer",
                    confirmPasswordType === "password" && "hidden"
                  )}
                  onClick={() => setConfirmPasswordType("password")}
                />
                {errors.confirm_password && (
                  <div className=" text-destructive mt-2 mb-4">
                    {errors.confirm_password.message as string}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 text-sm font-medium text-default-800">
              Requisitos de contraseña:
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                "Mínimo 8 caracteres.",
                "Al menos una minúscula.",
                "Al menos un número y símbolo.",
              ].map((item, index) => (
                <div
                  className="flex items-center gap-1.5"
                  key={`requirement-${index}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-default-400"></div>
                  <div className="text-xs text-default-600">{item}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-5 justify-end">
              <Button
                disabled={isPending}
                type="submit">
                <Icon
                  icon="heroicons:lock-closed"
                  className="w-5 h-5 text-primary-foreground me-1"
                />
                Cambiar contraseña
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default ChangePassword;
