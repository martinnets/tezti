"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import teztiLogo from "@/public/images/logo/logo-4.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { useMediaQuery } from "@/hooks/use-media-query";
import FooterLayout from "../partials/footer/footer-layout";
const schema = z.object({
  email: z.string().email({ message: "El formato de correo no es válido" }),
  password: z
    .string()
    .min(4, "La contraseña debe ser de al menos 4 caracteres"),
});

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    startTransition(async () => {
      let response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response?.ok) {
        toast.success("Inicio de sesión exitoso");
        window.location.assign("/processes");
        reset();
      } else if (response?.error) {
        toast.error("Credenciales incorrectas");
      }
    });
  };
  return (
    <div className="w-full py-10">
      <div className="flex justify-center">
        <Link
          href="/dashboard"
          className="inline-block">
          <Image
            src={teztiLogo}
            alt="image"
            className="w-64 object-cover  "
          />
        </Link>
      </div>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hola
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Ingresa tu correo y contraseña.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 2xl:mt-7">
        <div>
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
            size={!isDesktop2xl ? "xl" : "lg"}
          />
        </div>
        {errors.email && (
          <div className=" text-destructive mt-2">{errors.email.message}</div>
        )}

        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600">
            Contraseña{" "}
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}>
              {passwordType === "password" ? (
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
        </div>
        {errors.password && (
          <div className=" text-destructive mt-2">
            {errors.password.message}
          </div>
        )}

        <div className="mt-5  mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex  items-center gap-1.5 ">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap">
              Recordarme
            </Label>
          </div>
          <Link
            href="/auth/forgot"
            className="flex-none text-sm text-primary">
            Olvide mi contraseña
          </Link>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Procesando..." : "Iniciar sesión"}
        </Button>
      </form>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        
      <a className="text-xs" >  Tezti - v1.0.0
       </a></div>
    </div>
  
  );
};

export default LogInForm;
