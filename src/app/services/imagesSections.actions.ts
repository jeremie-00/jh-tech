"use server";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { ImgSectionType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";
import { createImage } from "../utils/createdImage";
import { imageDelete } from "./imageStorage.actions";

/* const DEFAULT_IMG = {
  url: "/default.svg",
  alt: "Image par default",
};

const DEFAULT = {
  id: "",
  section: "",
  url: DEFAULT_IMG.url,
  alt: DEFAULT_IMG.alt,
}; */

const MESSAGES = {
  NOT_FOUND: "Image introuvable.",
  ERROR_CREATE: "Erreur lors de la création de l'image.",
  ERROR_UPDATE: "Erreur lors de la mise à jour de l'image.",
  ERROR_DELETE: "Erreur lors de la suppression de l'image.",
  SUCCESS_CREATE: (section: string) =>
    `L'image de la section \"${section}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (section: string) =>
    `L'image de la section \"${section}\"a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (section: string) =>
    `L'image de la section \"${section}\" a été supprimé avec succès ! 🚀`,
};

const imgSectionSchema = {
  create: zfd.formData({
    section: baseSchema.text.short,
    alt: baseSchema.text.short,
    image: baseSchema.file.optional,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    section: baseSchema.text.short,
    alt: baseSchema.text.short,
    image: baseSchema.file.optional,
  }),
};

export const getImgSections = async (): Promise<ImgSectionType[]> => {
  return prisma.imageSection.findMany();
};

export const getImgSectionById = async (id: string) => {
  return prisma.imageSection.findUnique({
    where: {
      id: id,
    },
  });
};

export const getImgSectionBySection = async (section: string) => {
  return prisma.imageSection.findUnique({
    where: {
      section: section,
    },
  });
};

export const createImgSection = authActionClient
  .schema(imgSectionSchema.create)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { alt, image, section } = props;

      const url = await createImage("SECTIONS", image, section);

      const createdImgSection = await prisma.imageSection.create({
        data: {
          url: url,
          alt: alt,
          section: section,
        },
      });

      return {
        state: createdImgSection,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_CREATE(section),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_CREATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<ImgSectionType>>;

export const updateImgSection = authActionClient
  .schema(imgSectionSchema.update)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { id, alt, section, image } = props;

      const existingImage = await getImgSectionById(id);

      if (!existingImage) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const url = await createImage("SECTIONS", image, section);

      if (existingImage && url) await imageDelete({ image: existingImage });

      const updatedImage = await prisma.imageSection.update({
        where: { id },
        data: {
          url: url || existingImage.url,
          alt: alt || existingImage.alt,
          section: section,
        },
      });

      return {
        state: updatedImage,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_UPDATE(section),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_UPDATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<ImgSectionType>>;

export const deleteImgSection = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const image = await getImgSectionById(id);
      if (!image) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const isDeleted = image && (await imageDelete({ image: image }));
      if (!isDeleted?.data && image.url) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.ERROR_DELETE,
        };
      }

      await prisma.imageSection.delete({
        where: { id: id },
      });

      return {
        state: image,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(image.section),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<ImgSectionType>>;
