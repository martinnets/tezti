"use client";
import { SiteLogo } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/config/axios.config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import apple from "@/public/images/auth/apple.png";
import facebook from "@/public/images/auth/facebook.png";
import googleIcon from "@/public/images/auth/google.png";
import twitter from "@/public/images/auth/twitter.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  phone: z
    // .number({ coerce: true })
    .string()
    .min(9, { message: "El número debe tener 9 caracteres." }),
  document_type: z.string({
    required_error: "Tipo de documento es requerido.",
  }),
  document_number: z
    .string({ required_error: "Tipo de documento es requerido." })
    .min(5, {
      message: "El número de documento debe tener 5 caracteres como mínimo.",
    }),
  password: z.string().min(4),
});

const RegForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = useState<string>("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };
  const router = useRouter();

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
        const response = await api.post("/auth/register", {
          ...data,
          type: "P",
        });
        // reset();
        try {
          let response = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          if (response?.ok) {
            toast.success("Registro correcto");
            window.location.assign("/auth/verify");
            reset();
          } else if (response?.error) {
            toast.error(response?.error);
          }
          // router.push("/auth/verify");
        } catch (error) {
          toast.error("Error al enviar código");
        }
      } catch (error) {
        toast.error("Error al registrar");
      }
    });
  };
  return (
    <div className="w-full">
      <Link
        href="/dashboard"
        className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
        Create account to start using DashTail
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 xl:mt-7">
        <div className="space-y-4">
          <div>
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
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.name && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.name.message as string}
              </div>
            )}
          </div>
          <div>
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
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.lastname && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.lastname.message as string}
              </div>
            )}
          </div>
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
            {errors.email && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.email.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="mb-2 font-medium text-default-600">
              Teléfono{" "}
            </Label>
            <Input
              disabled={isPending}
              {...register("phone")}
              type="phone"
              id="phone"
              className={cn("", {
                "border-destructive": errors.phone,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.phone && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.phone.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="Tipo de documento"
              className="mb-2 font-medium text-default-600">
              Tipo de documento{" "}
            </Label>
            <Controller
              name="document_type"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
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
                </>
              )}
            />

            {errors.document_type && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.document_type.message as string}
              </div>
            )}
          </div>
          <div>
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
              size={!isDesktop2xl ? "xl" : "lg"}
            />
            {errors.document_number && (
              <div className=" text-destructive mt-2 mb-4">
                {errors.document_number.message as string}
              </div>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600">
              Password{" "}
            </Label>
            <div className="relative">
              <Input
                type={passwordType}
                id="password"
                size={!isDesktop2xl ? "xl" : "lg"}
                disabled={isPending}
                {...register("password")}
                className={cn("", {
                  "border-destructive": errors.password,
                })}
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
            {errors.password && (
              <div className=" text-destructive mt-2">
                {errors.password.message as string}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-1.5 mb-8">
          <Checkbox
            size="sm"
            className="border-default-300 mt-[1px]"
            id="terms"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-default-600 cursor-pointer whitespace-nowrap">
            Acepto los términos y condiciones
          </Label>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Registering..." : "Create an Account"}
        </Button>
      </form>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent">
          <Image
            src={googleIcon}
            alt="google icon"
            className="w-6 h-6"
            priority={true}
          />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent">
          <Image
            src={facebook}
            alt="google icon"
            className="w-6 h-6"
          />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent">
          <Image
            src={apple}
            alt="google icon"
            className="w-6 h-6"
          />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full  border-default-300 hover:bg-transparent">
          <Image
            src={twitter}
            alt="google icon"
            className="w-6 h-6"
          />
        </Button>
      </div>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Already Registered?{" "}
        <Link
          href="/auth/login"
          className="text-primary">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegForm;
