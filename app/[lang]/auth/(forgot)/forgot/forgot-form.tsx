"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/config/axios.config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import teztiLogo from "@/public/images/logo/logo-1.png";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
const schema = z.object({
  email: z.string().email({ message: "El formato de correo no es válido" }),
});
const ForgotForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        await api.post("/auth/forgotpassword", data);
        reset();
        router.push(`/auth/create-password?email=${data.email}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error(
            "No se pudo verificar el código, por favor inténtelo nuevamente"
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
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Olvidaste tu contraseña?
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Ingresa tu correo y te enviaremos un código!
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 xl:mt-7">
        <div>
          <Label
            htmlFor="email"
            className="mb-2 font-medium text-default-600">
            Correo{" "}
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
          {errors.email && (
            <div className=" text-destructive mt-2">
              {errors.email.message as string}
            </div>
          )}
        </div>

        <Button
          className="w-full mt-6"
          size={!isDesktop2xl ? "lg" : "md"}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Enviando..." : "Enviar código"}
        </Button>
      </form>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Olvídalo. Llévame de vuelta al{" "}
        <Link
          href="/auth/login"
          className="text-primary">
          inicio de sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotForm;
