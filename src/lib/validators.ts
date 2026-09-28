import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .max(160)
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Adresse email invalide",
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(8, "Mot de passe trop court"),
});

export const requestSchema = z.object({
  type: z.enum(["VOYAGE", "DEVIS", "JUNIOR", "CORPORATE", "SPIRITUEL", "CONTACT"]),
  fullName: z.string().trim().min(2, "Indiquez votre nom").max(120),
  email: optionalEmail.optional().default(""),
  phone: z.string().trim().min(8, "Indiquez un numéro joignable").max(30),
  destination: z.string().trim().max(160).optional().default(""),
  travelDate: z.string().trim().max(40).optional().default(""),
  travelers: z.number().int().positive().max(500).nullable().optional(),
  message: z.string().trim().min(3, "Précisez votre demande").max(5000),
  details: z.record(z.string(), z.string().max(300)).optional(),
  website: z.string().optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(160),
  website: z.string().optional().default(""),
});

export const userSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

export const passwordSchema = z.object({
  password: z.string().min(8, "8 caractères minimum"),
});

export const settingsSchema = z.object({
  settings: z.record(z.string().max(40), z.string().max(5000)),
});

export const statusSchema = z.object({
  status: z.enum(["NOUVELLE", "EN_COURS", "CLIENT_CONTACTE", "TRAITEE", "ANNULEE"]),
});
