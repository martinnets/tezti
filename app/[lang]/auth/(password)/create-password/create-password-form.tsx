"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/config/axios.config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import teztiLogo from "@/public/images/logo/logo-1.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  password: z
    .string()
    .min(4, { message: "La contraseña debe ser de al menos 4 caracteres" }),
  code: z
    .string()
    .min(6, { message: "El código debe ser de 6 caracteres" })
    .max(6, { message: "El código debe ser de 6 caracteres" }),
  confirmPassword: z
    .string()
    .min(4, { message: "La contraseña debe ser de al menos 4 caracteres" }),
});
const CreatePasswordForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [newPasswordType, setNewPasswordType] = React.useState<boolean>(false);
  const [confirmPasswordType, setConfirmPasswordType] =
    React.useState<boolean>(false);
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });
  const email = searchParams.get("email");

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        // Validate code, if everything is good no exception will be thrown
        await api.post("/auth/validatecode", {
          email,
          code: data.code,
        });

        // Change password
        await api.patch("/auth/changepassword", {
          email,
          code: data.code,
          password: data.password,
        });
        toast.success("Contraseña actualizada correctamente");
        reset();
        router.push("/auth/login");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error(
            "No se pudo restablecer la contraseña, por favor inténtelo nuevamente"
          );
        }
      }
    });
  };
  return (
    <div className="w-full">
      <Link
        href="/dashboard"
        className="inline-block">
        <Image
          src={teztiLogo}
          alt="image"
          className=" w-16 h-16 object-cover  "
        />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl lg:text-2xl text-xl font-bold text-default-900">
        Crear nueva contraseña
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Ingresa el código que te hemos enviado y una nueva contraseña!
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="code"
              className="mb-2 font-medium text-default-600">
              Código
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                {...register("code")}
                type={"text"}
                id="code"
                size={!isDesktop2xl ? "xl" : "lg"}
                className={cn("", {
                  "border-destructive": errors.code,
                })}
              />
            </div>
            {errors.code && (
              <div className=" text-destructive mt-2">
                {errors.code.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                {...register("password")}
                type={newPasswordType ? "text" : "password"}
                id="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                className={cn("", {
                  "border-destructive": errors.password,
                })}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setNewPasswordType(!newPasswordType)}>
                {newPasswordType ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.password && (
              <div className=" text-destructive mt-2">
                {errors.password.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-2 font-medium text-default-600">
              Confirmar contraseña
            </Label>
            <div className="relative">
              <Input
                disabled={isPending}
                {...register("confirmPassword")}
                type={confirmPasswordType ? "text" : "password"}
                id="confirmPassword"
                className={cn("", {
                  "border-destructive": errors.confirmPassword,
                })}
                size={!isDesktop2xl ? "xl" : "lg"}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={() => setConfirmPasswordType(!confirmPasswordType)}>
                {confirmPasswordType ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <div className=" text-destructive mt-2">
                {errors.confirmPassword.message as string}
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full mt-8"
          size="lg">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Restableciendo..." : "Restablecer contraseña"}
        </Button>
      </form>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        No ahora? Regresar a{" "}
        <Link
          href="/auth/login"
          className="text-primary">
          {" "}
          iniciar sesión{" "}
        </Link>
      </div>
    </div>
  );
};

export default CreatePasswordForm;
