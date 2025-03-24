import { del, put } from "@vercel/blob";
import { extname } from "path";
import { z } from "zod";
import { authActionClient } from "../lib/safe-action";
import { baseSchema } from "../types/zodType";

const FOLDERS = {
  SERVICES: "services-images",
  WORKS: "works-images",
  SKILLS: "skills-images",
  SECTIONS: "sections-images",
} as const;

type FolderType = keyof typeof FOLDERS;

// Messages d'erreur centralisés
const MESSAGES = {
  ERROR_UPLOAD: "Erreur lors de l'upload de l'image.",
  ERROR_DELETE: "Erreur lors de la suppression de l'image.",
  ERROR_VERCEL: "Erreur de connexion avec Vercel Blob.",
  INVALID_FILE: "Format de fichier non autorisé.",
  FILE_TOO_LARGE: "L'image est trop volumineuse (max 5MB).",
};

// Validation des fichiers
const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (file.size > maxSize) {
    throw new Error(MESSAGES.FILE_TOO_LARGE);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(MESSAGES.INVALID_FILE);
  }
};

const generateUniqueFileName = (originalName: string, title: string) => {
  const fileExtension = extname(originalName);
  // Nettoyage du titre
  const safeTitle = title
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Enlève les caractères spéciaux
    .replace(/-+/g, "-") // Évite les tirets multiples
    .trim();
  // Obtenir la date actuelle
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Les mois commencent à 0
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return `${safeTitle}-${formattedDate}-${Date.now()}-${Math.round(
    Math.random() * 1e4
  )}${fileExtension}`;
};

// Schéma de validation
const uploadSchema = z.object({
  title: baseSchema.text.short,
  file: baseSchema.file.image,
  folder: baseSchema.folder,
});

export const imageUpload = authActionClient
  .schema(uploadSchema)
  .action(async ({ parsedInput: { title, file, folder } }) => {
    try {
      // Validation du fichier
      validateFile(file);

      const filename = generateUniqueFileName(file.name, title);
      const folderPath = FOLDERS[folder as FolderType];
      const safePath = `Portfolio-jh-tech/${folderPath}/${filename}`;

      const blob = await put(safePath, file, {
        access: "public",
        addRandomSuffix: false, // On gère déjà l'unicité
        cacheControlMaxAge: 31536000, // 1 an
      });

      if (!blob?.url) {
        throw new Error(MESSAGES.ERROR_VERCEL);
      }

      return blob.url;
    } catch (error) {
      console.error("[ImageUpload]", { error, title, folder });
      throw new Error(
        error instanceof Error ? error.message : MESSAGES.ERROR_UPLOAD
      );
    }
  });

// Schéma de validation pour la suppression
const deleteSchema = z.object({
  image: z.object({
    id: baseSchema.id.uuid,
    url: baseSchema.url.optional,
  }),
});

export const imageDelete = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { image } }) => {
    try {
      if (!image?.url || !image?.id) {
        return;
      }
      await del(image.url);
      return true;
    } catch (error) {
      console.error("[ImageDelete]", { error, imageId: image.id });
      throw new Error(MESSAGES.ERROR_DELETE);
    }
  });
