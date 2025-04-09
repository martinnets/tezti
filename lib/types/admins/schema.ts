import { passwordComplexity } from "@/lib/utils";
import { z } from "zod";

export const passwordRule = (optional: boolean) =>
  passwordComplexity(
    optional
      ? z
          .string({ required_error: "La contraseña es requerida" })
          .min(8, { message: "El nombre debe ser de al menos 8 caracteres" })
          .optional()
      : z
          .string({ required_error: "La contraseña es requerida" })
          .min(8, { message: "El nombre debe ser de al menos 8 caracteres" })
  );

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const adminsDataSchema = (withPassword: boolean) =>
  z
    .object({
      name: z
        .string({ required_error: "El nombre es requerido" })
        .min(4, { message: "El nombre debe ser de al menos 4 caracteres" }),
      role: z.string({ required_error: "El rol es requerido" }),
      password: passwordRule(withPassword),
      confirmPassword: passwordRule(withPassword),
      email: z.string({ required_error: "El email es requerido" }).email({
        message: "Email no es válido.",
      }),
      organization_id: z.string().optional(),
      is_active: z.boolean({ required_error: "El estado es requerido" }),
    })
    .refine(
      (form) => {
        if (form.password) {
          return form.password === form.confirmPassword;
        } else return true;
      },
      {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      }
    );
