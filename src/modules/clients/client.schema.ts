import { z } from "zod";

const sortFields = ["name", "email", "phone", "createdAt", "updatedAt"] as const;

const clientPayloadSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().trim().email("L'adresse email est invalide."),
  phone: z
    .string()
    .trim()
    .min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres.")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres.")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres."),
  address: z.string().trim().min(2, "L'adresse est obligatoire."),
});

const clientUpdateSchema = clientPayloadSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "Au moins un champ doit être fourni pour modifier le client.",
);

const clientIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "L'identifiant du client est invalide."),
});

const clientListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  sortBy: z.enum(sortFields).default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("asc")
    .transform((value) => (value === "asc" ? 1 : -1)),
});

export {
  clientIdSchema,
  clientListQuerySchema,
  clientPayloadSchema,
  clientUpdateSchema,
};
