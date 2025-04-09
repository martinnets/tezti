import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const additionalFieldDataSchema = z.object({
  name: z
    .string({ required_error: "El nombre del proceso es requerido" })
    .min(4, { message: "El nombre debe ser de al menos 4 caracteres" }),
  is_active: z.string({ required_error: "El estado es requerido" }),
});
