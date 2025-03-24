"use server";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { EducationType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";

const DEFAULT = {
  date: "2000 - 2001",
  formation: "Formation",
  organisme: "Organisme",
  text: "Lorem ipsum dolor sit, commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
};

const MESSAGES = {
  NOT_FOUND: "Education introuvable.",
  ERROR_CREATE: "Erreur lors de la création de la card education.",
  ERROR_UPDATE: "Erreur lors de la mise à jour de la card education.",
  ERROR_DELETE: "Erreur lors de la suppression de la card education.",
  SUCCESS_CREATE: (organisme: string, formation: string) =>
    `La card education \"${organisme} : ${formation}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (entreprise: string, poste: string) =>
    `La card education \"${entreprise} : ${poste}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (entreprise: string, poste: string) =>
    `La card education \"${entreprise} : ${poste}\" a été supprimé avec succès ! 🚀`,
};

const educationSchema = {
  create: zfd.formData({
    date: baseSchema.text.default,
    formation: baseSchema.text.default,
    organisme: baseSchema.text.default,
    text: baseSchema.text.default,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    date: baseSchema.text.default,
    formation: baseSchema.text.default,
    organisme: baseSchema.text.default,
    text: baseSchema.text.default,
  }),
};

export const getEducations = async (): Promise<EducationType[]> => {
  return prisma.education.findMany();
};

export const getEducationById = async (id: string) => {
  return prisma.education.findUnique({
    where: {
      id: id,
    },
  });
};

export const createEducation = authActionClient
  .schema(educationSchema.create)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { date, formation, organisme, text } = props;

      const createdEducation = await prisma.education.create({
        data: {
          date: !date ? DEFAULT.date : date,
          formation: formation || DEFAULT.formation,
          organisme: organisme || DEFAULT.organisme,
          text: text || DEFAULT.text,
        },
      });

      return {
        state: createdEducation,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_CREATE(organisme, formation),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_CREATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<EducationType>>;

export const updateEducation = authActionClient
  .schema(educationSchema.update)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { id, date, formation, organisme, text } = props;

      const existingEducation = await getEducationById(id);

      if (!existingEducation) {
        return {
          success: false,
          status: "warn",
          message: "Education introuvable.",
        };
      }

      const updatedEducation = await prisma.education.update({
        where: { id },
        data: {
          date,
          formation,
          organisme,
          text,
        },
      });

      return {
        state: updatedEducation,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_UPDATE(organisme, formation),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_UPDATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<EducationType>>;

export const deleteEducation = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const education = await getEducationById(id);
      if (!education) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      await prisma.education.delete({
        where: { id: id },
      });

      return {
        state: education,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(
          education.organisme,
          education.formation
        ),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<EducationType>>;
