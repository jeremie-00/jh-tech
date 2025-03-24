"use server";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { ExperienceType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";

const DEFAULT = {
  date: "2000 - 2001",
  poste: "Poste occupé",
  entreprise: "Entreprise",
  text: "Lorem ipsum dolor sit, commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
};

const MESSAGES = {
  NOT_FOUND: "Experience introuvable.",
  ERROR_CREATE: "Erreur lors de la création de la card experience.",
  ERROR_UPDATE: "Erreur lors de la mise à jour de la card experience.",
  ERROR_DELETE: "Erreur lors de la suppression de la card experience.",
  SUCCESS_CREATE: (entreprise: string) =>
    `La card experience \"${entreprise}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (entreprise: string, poste: string) =>
    `La card experience \"${entreprise} : ${poste}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (entreprise: string, poste: string) =>
    `La card experience \"${entreprise} : ${poste}\" a été supprimé avec succès ! 🚀`,
};

const experienceSchema = {
  create: zfd.formData({
    date: baseSchema.text.default,
    poste: baseSchema.text.default,
    entreprise: baseSchema.text.default,
    text: baseSchema.text.default,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    date: baseSchema.text.default,
    poste: baseSchema.text.default,
    entreprise: baseSchema.text.default,
    text: baseSchema.text.default,
  }),
};

export const getExperiences = async (): Promise<ExperienceType[]> => {
  return prisma.experience.findMany();
};

export const getExperienceById = async (id: string) => {
  return prisma.experience.findUnique({
    where: {
      id: id,
    },
  });
};

export const createExperience = authActionClient
  .schema(experienceSchema.create)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { date, poste, entreprise, text } = props;

      const createdExperience = await prisma.experience.create({
        data: {
          date: date || DEFAULT.date,
          poste: poste || DEFAULT.poste,
          entreprise: entreprise || DEFAULT.entreprise,
          text: text || DEFAULT.text,
        },
      });

      return {
        state: createdExperience,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_CREATE(entreprise),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_CREATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<ExperienceType>>;

export const updateExperience = authActionClient
  .schema(experienceSchema.update)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { id, date, poste, entreprise, text } = props;

      const existingExperience = await getExperienceById(id);

      if (!existingExperience) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const updatedExperience = await prisma.experience.update({
        where: { id },
        data: {
          date,
          poste,
          entreprise,
          text,
        },
      });

      return {
        state: updatedExperience,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_UPDATE(entreprise, poste),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_UPDATE,
      };
    }
  }) as unknown as (formData: FormData) => Promise<Result<ExperienceType>>;

export const deleteExperience = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const Experience = await getExperienceById(id);
      if (!Experience) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      await prisma.experience.delete({
        where: { id: id },
      });

      return {
        state: Experience,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(
          Experience.entreprise,
          Experience.poste
        ),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<ExperienceType>>;
