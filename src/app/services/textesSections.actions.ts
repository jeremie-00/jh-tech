"use server";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { TxtSectionType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";

const MESSAGES = {
  NOT_FOUND: "Texte introuvable.",
  ERROR_CREATE: "Erreur lors de la création du texte.",
  ERROR_UPDATE: "Erreur lors de la mise à jour du texte.",
  ERROR_DELETE: "Erreur lors de la suppression du texte.",
  SUCCESS_CREATE: (section: string) =>
    `Le texte de la section \"${section}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (section: string) =>
    `Le texte de la section \"${section}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (section: string) =>
    `Le texte de la section \"${section}\" a été supprimé avec succès ! 🚀`,
};

const txtSectionSchema = {
  create: zfd.formData({
    section: baseSchema.text.short,
    name: baseSchema.text.optional,
    heading: baseSchema.text.short,
    desc: baseSchema.text.optional,
    text: baseSchema.text.long,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    section: baseSchema.text.short,
    name: baseSchema.text.optional,
    heading: baseSchema.text.short,
    desc: baseSchema.text.optional,
    text: baseSchema.text.long,
  }),
};

export const getTxtsSections = async (): Promise<TxtSectionType[]> => {
  return prisma.textSection.findMany();
};

export const getTxtSectionById = async (id: string) => {
  return prisma.textSection.findUnique({
    where: {
      id: id,
    },
  });
};

export const getTxtSectionBySection = async (section: string) => {
  return prisma.textSection.findUnique({
    where: {
      section: section,
    },
  });
};

export const createTxtSection = authActionClient
  .schema(txtSectionSchema.create)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { section, name, heading, desc, text } = props;

      const existing = await getTxtSectionBySection(section);
      if (existing) {
        return {
          success: false,
          status: "warn",
          message: `Une section "${section}" existe déjà.`,
        };
      }

      const createdTxtSection = await prisma.textSection.create({
        data: {
          section,
          name,
          heading,
          desc,
          text,
        },
      });

      return {
        state: createdTxtSection,
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
  }) as unknown as (formData: FormData) => Promise<Result<TxtSectionType>>;

export const updateTxtSection = authActionClient
  .schema(txtSectionSchema.update)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { id, section, name, heading, desc, text } = props;

      const existingText = await getTxtSectionById(id);

      if (!existingText) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const updatedText = await prisma.textSection.update({
        where: { id },
        data: {
          section,
          name,
          heading,
          desc,
          text,
        },
      });

      return {
        state: updatedText,
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
  }) as unknown as (formData: FormData) => Promise<Result<TxtSectionType>>;

export const deleteTxtSection = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const txt = await getTxtSectionById(id);
      if (!txt) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      await prisma.textSection.delete({
        where: { id: id },
      });

      return {
        state: txt,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(txt.section),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<TxtSectionType>>;
