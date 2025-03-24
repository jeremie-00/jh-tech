import { z } from "zod";

// Schémas de base réutilisables
export const baseSchema = {
  // Chaînes de caractères
  text: {
    default: z
      .string({
        required_error: "Ce champ est requis",
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .trim()
      .max(255, "Le texte ne doit pas dépasser 255 caractères"),

    short: z
      .string({
        required_error: "Ce champ est requis",
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .trim()
      .min(1, "Ce champ ne peut pas être vide")
      .max(100, "Le texte ne doit pas dépasser 100 caractères"),

    medium: z
      .string({
        required_error: "Ce champ est requis",
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .trim()
      .min(1, "Ce champ ne peut pas être vide")
      .max(255, "Le texte ne doit pas dépasser 255 caractères"),

    long: z
      .string({
        required_error: "Ce champ est requis",
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .trim()
      .min(1, "Ce champ ne peut pas être vide")
      .max(2000, "Le texte ne doit pas dépasser 2000 caractères"),

    optional: z
      .string({
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .trim()
      .max(255, "Le texte ne doit pas dépasser 255 caractères")
      .optional()
      .describe("Ce champ est optionnel"),
  },

  // Nombres
  number: {
    order: z.number().int().min(0).max(999),
    positiveInt: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
  },

  // URLs
  url: {
    web: z.string().url().max(2048),
    image: z
      .string()
      .url()
      .max(2048)
      .regex(/\.(jpg|jpeg|png|gif|webp|svg)$/i, {
        message: "Format d'image non valide",
      }),
    optional: z.string().url().max(2048).optional(),
  },

  // Identifiants
  id: {
    uuid: z
      .string({
        required_error: "Ce champ est requis",
        invalid_type_error: "Le texte doit être une chaîne de caractères",
      })
      .uuid("L'identifiant doit être un UUID valide"),
    optional: z.string().uuid().optional(),
  },

  // Dates
  date: {
    past: z.date().max(new Date(), "La date doit être dans le passé"),
    future: z.date().min(new Date(), "La date doit être dans le futur"),
    any: z.date(),
  },

  // Fichiers
  file: {
    image: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB
        "Le fichier doit faire moins de 5MB"
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.type
          ),
        "Format de fichier non supporté"
      ),
    optional: z.instanceof(File).optional(),
  },

  //Dossiers noms
  folder: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9-_]+$/),
};

export const deleteSchema = z.object({
  id: baseSchema.id.uuid,
});
