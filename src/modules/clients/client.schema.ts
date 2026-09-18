import { z } from "zod";
import { PAGINATION } from "@shared/constants/pagination.constant";

const clientPayloadSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, "L'identifiant utilisateur est invalide."),
  phone: z
    .string()
    .trim()
    .min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres.")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres.")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres."),
  address: z.string().trim().min(2, "L'adresse est obligatoire."),
});

const clientUpdateSchema = clientPayloadSchema.omit({ userId: true }).partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "Au moins un champ doit être fourni pour modifier le client.",
);

const clientIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "L'identifiant du client est invalide."),
});

const clientListQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .min(PAGINATION.DEFAULT_PAGE)
    .default(PAGINATION.DEFAULT_PAGE),
  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  search: z.string().trim().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  sortBy: z.enum(["phone", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .default("asc")
    .transform((value) => (value === "asc" ? PAGINATION.DEFAULT_SORT_ORDER : -1)),
});

export {
  clientIdSchema,
  clientListQuerySchema,
  clientPayloadSchema,
  clientUpdateSchema,
};
