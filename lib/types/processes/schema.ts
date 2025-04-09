import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const processDataSchema = z.object({
  name: z
    .string({ required_error: "El nombre del proceso es requerido" })
    .min(4, { message: "El nombre debe ser de al menos 4 caracteres" }),
  from: z.string({ required_error: "Fecha de inicio es requerido" }),
  to: z.string({ required_error: "Fecha de fin es requerido" }),
  hierarchical_level_id: z.number({
    required_error: "El campo nivel jerárquico es requerido",
    coerce: true,
    invalid_type_error: "El campo nivel jerárquico es requerido",
  }),
  status: z.string({ required_error: "El estado es requerido" }),
  type: z.string({ required_error: "El tipo es requerido" }),
  additionals: z.array(z.number()).optional(),
});

export const processAddEvaluatedSchema = z.object({
  email: z.string().email({
    message: "El email no es válido.",
  }),
  name: z
    .string()
    .min(3, { message: "Nombres debe tener al menos 3 caracteres." }),
  lastname: z
    .string()
    .min(3, { message: "Apellidos debe tener al menos 3 caracteres." }),
  document_type: z.string({
    required_error: "Tipo de documento es requerido.",
  }),
  document_number: z
    .string({ required_error: "Tipo de documento es requerido." })
    .min(8, {
      message: "El número de documento debe tener 5 caracteres como mínimo.",
    }),
  employee_id: z.string().optional(),
  additionalFields: z.record(z.string()).optional(),
});

export type ProcessAddEvaluatedSchemaData = z.infer<
  typeof processAddEvaluatedSchema
>;
