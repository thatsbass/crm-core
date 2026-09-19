import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().trim().email("L'adresse email est invalide").toLowerCase(),
  phone: z.string().trim().min(9).max(15).regex(/^\d+$/),
  address: z.string().trim().min(2, "L'adresse est obligatoire."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

const loginSchema = z.object({
  email: z.string().trim().email("L'adresse email est invalide").toLowerCase(),
  password: z.string().min(1, "Le mot de passe est obligatoire."),
});

const setupAdminSchema = z.object({
  accessCode: z.string().min(1, "Le code d'accès est obligatoire."),
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().trim().email("L'adresse email est invalide").toLowerCase(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export { loginSchema, registerSchema, setupAdminSchema };
