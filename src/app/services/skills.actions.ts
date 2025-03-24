"use server";

import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { SkillType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";
import { createImage } from "../utils/createdImage";
import { imageDelete } from "./imageStorage.actions";

const DEFAULT = {
  url: "/default.svg",
  alt: "Text alt image par default",
  name: "Nom par default",
  order: 1,
};

const MESSAGES = {
  NOT_FOUND: "Compétence introuvable.",
  ERROR_CREATE: "Erreur lors de la création de la compétence.",
  ERROR_UPDATE: "Erreur lors de la mise à jour de la compétence.",
  ERROR_DELETE: "Erreur lors de la suppression de la compétence.",
  SUCCESS_CREATE: (name: string) =>
    `La card compétence \"${name}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (name: string) =>
    `La card compétence \"${name}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (name: string) =>
    `La card compétence \"${name}\" a été supprimé avec succès ! 🚀`,
};

const skillSchema = {
  create: zfd.formData({
    name: baseSchema.text.default,
    image: baseSchema.file.optional,
    order: baseSchema.text.short,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    name: baseSchema.text.default,
    image: baseSchema.file.optional,
    order: baseSchema.text.short,
  }),
};

export const getSkills = async (): Promise<SkillType[]> => {
  return prisma.skill.findMany({
    orderBy: {
      order: "asc",
    },
  });
};

export const getSkillById = async (id: string): Promise<SkillType | null> => {
  return prisma.skill.findUnique({
    where: { id },
  });
};

export const createSkill = authActionClient
  .schema(skillSchema.create)
  .action(async ({ parsedInput: { ...formData } }) => {
    try {
      const { name, image, order } = formData;

      const url = await createImage("SKILLS", image, name);

      const createdSkill = await prisma.skill.create({
        data: {
          name: !name ? DEFAULT.name : name,
          url: !url ? DEFAULT.url : url,
          alt: !url ? DEFAULT.alt : `Logo de ${name}`,
          order: !order ? DEFAULT.order : Number(order),
        },
      });

      return {
        state: createdSkill,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_CREATE(name),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_CREATE,
      };
    }
  }) as (formData: FormData) => Promise<Result<SkillType>>;

export const updateSkill = authActionClient
  .schema(skillSchema.update)
  .action(async ({ parsedInput: { ...formData } }) => {
    try {
      const { id, name, image, order } = formData;
      const existingSkill = await getSkillById(id);

      if (!existingSkill) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }
      const url = await createImage("SKILLS", image, name);

      if (existingSkill?.url && url)
        await imageDelete({ image: existingSkill });

      const updatedSkill = await prisma.skill.update({
        where: { id },
        data: {
          name,
          url: url || existingSkill.url,
          alt: `Logo de ${name}` || existingSkill.alt,
          order: Number(order),
        },
      });

      return {
        state: updatedSkill,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_UPDATE(name),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_UPDATE,
      };
    }
  }) as (formData: FormData) => Promise<Result<SkillType>>;

export const deleteSkill = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const skill = await getSkillById(id);
      if (!skill) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      if (skill) await imageDelete({ image: skill });
      await prisma.skill.delete({ where: { id: id } });

      return {
        state: skill,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(skill.name),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<SkillType>>;
