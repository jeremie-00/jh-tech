"use server";
import { z } from "zod";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { WorkType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";
import { createImage } from "../utils/createdImage";
import { imageDelete } from "./imageStorage.actions";

const DEFAULT = {
  url: "/default.svg",
  alt: "Text alt image par default",
  name: "Nom par default",
  desc: "Description par default",
  order: 1,
  links: [
    {
      href: "",
      name: "",
      id: "",
      workId: "",
    },
    {
      href: "",
      name: "",
      id: "",
      workId: "",
    },
  ],
  skills: [
    {
      id: "",
      name: "",
      url: "",
      alt: "",
      order: 1,
    },
  ],
};

const MESSAGES = {
  NOT_FOUND: "Projet introuvable.",
  ERROR_CREATE: "Erreur lors de la création du projet.",
  ERROR_UPDATE: "Erreur lors de la mise à jour du projet.",
  ERROR_DELETE: "Erreur lors de la suppression  du projet.",
  SUCCESS_CREATE: (name: string) =>
    `Le projet \"${name}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (name: string) =>
    `Le projet \"${name}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (name: string) =>
    `Le projet \"${name}\" a été supprimé avec succès ! 🚀`,
};

const workSchema = {
  create: zfd.formData({
    name: baseSchema.text.default,
    desc: baseSchema.text.default,
    order: baseSchema.text.optional,
    alt: baseSchema.text.optional,
    image: baseSchema.file.optional,
    skills: z
      .any()
      .transform((val) => (Array.isArray(val) ? val : val ? [val] : []))
      .pipe(z.array(z.string()).optional()),
    links: zfd
      .text()
      .transform((val) => {
        if (!val) return []; // Si pas de valeur, retourne un tableau vide
        try {
          const parsed = JSON.parse(val);
          // Vérifie si c'est bien un tableau d'objets
          if (Array.isArray(parsed)) {
            return parsed;
          } else {
            return []; // Si ce n'est pas un tableau, retourne un tableau vide
          }
        } catch {
          return []; // Retourne un tableau vide en cas d'erreur de parsing
        }
      })
      .pipe(
        z
          .array(
            z.object({
              id: z.string().optional(),
              href: z.string(), //.min(1, "L'URL est requise")
              name: z.string(), //.min(1, "Le titre est requis")
            })
          )
          .optional()
      ),
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    name: baseSchema.text.default,
    desc: baseSchema.text.default,
    order: baseSchema.text.optional,
    alt: baseSchema.text.optional,
    image: baseSchema.file.optional,
    skills: z
      .any()
      .transform((val) => (Array.isArray(val) ? val : val ? [val] : []))
      .pipe(z.array(z.string()).optional()),
    links: zfd
      .text()
      .transform((val) => {
        if (!val) return []; // Si pas de valeur, retourne un tableau vide
        try {
          const parsed = JSON.parse(val);
          // Vérifie si c'est bien un tableau d'objets
          if (Array.isArray(parsed)) {
            return parsed;
          } else {
            return []; // Si ce n'est pas un tableau, retourne un tableau vide
          }
        } catch {
          return []; // Retourne un tableau vide en cas d'erreur de parsing
        }
      })
      .pipe(
        z
          .array(
            z.object({
              id: z.string().optional(),
              href: z.string(), //.min(1, "L'URL est requise")
              name: z.string(), //.min(1, "Le titre est requis")
            })
          )
          .optional()
      ),
  }),
};

export const getWorks = async (): Promise<WorkType[]> => {
  return prisma.work.findMany({
    orderBy: {
      order: "asc",
    },
    include: { skills: true, links: true },
  });
};

export const getWorkById = async (id: string) => {
  return prisma.work.findUnique({
    where: {
      id: id,
    },
    include: { skills: true },
  });
};

export const createWork = authActionClient
  .schema(workSchema.create)
  .action(async ({ parsedInput: { ...work } }) => {
    try {
      const { name, desc, order, image, alt, skills, links } = work;

      const url = await createImage("WORKS", image, name);

      const createdWork = await prisma.work.create({
        data: {
          name: name || DEFAULT.name,
          desc: desc || DEFAULT.desc,
          skills: {
            connect:
              !skills || skills?.length === 0
                ? undefined
                : skills.map((id) => ({ id: id })),
          },
          links: {
            create: links?.map((link, idx) => ({
              href: link.href || DEFAULT.links[idx].href,
              name: link.name || DEFAULT.links[idx].name,
            })),
          },
          url: url || DEFAULT.url,
          alt: alt || DEFAULT.alt,
          order: order ? Number(order) : DEFAULT.order,
        },
        include: { skills: true, links: true },
      });

      return {
        state: createdWork,
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
  }) as unknown as (formData: FormData) => Promise<Result<WorkType>>;

export const updateWork = authActionClient
  .schema(workSchema.update)
  .action(async ({ parsedInput: { ...work } }) => {
    try {
      const { id, name, desc, order, image, alt, skills, links } = work;

      const existingWork = await getWorkById(id);

      if (!existingWork) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const url = await createImage("WORKS", image, name);

      if (existingWork?.url && url) await imageDelete({ image: existingWork });

      const existingSkills = existingWork?.skills.map((skill) => skill.id);
      const skillDisconnect = existingSkills?.filter(
        (skillId) => !skills?.includes(skillId)
      );

      const updatedWork = await prisma.work.update({
        where: { id },
        data: {
          name,
          desc,
          order: Number(order),
          skills: {
            connect: skills && skills.map((id) => ({ id })),
            disconnect: skillDisconnect?.map((id) => ({ id })),
          },
          links: {
            upsert: links?.map((link) => ({
              where: { id: link.id },
              update: {
                href: link.href,
                name: link.name,
              },
              create: {
                href: !link.href ? DEFAULT.links[0].href : link.href,
                name: !link.name ? DEFAULT.links[0].name : link.name,
              },
            })),
          },
          url: url && url.length > 0 ? url : existingWork.url,
          alt: alt ? alt : existingWork.alt,
        },

        include: { skills: true, links: true },
      });

      return {
        state: updatedWork,
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
  }) as unknown as (formData: FormData) => Promise<Result<WorkType>>;

export const deleteWork = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const work = await getWorkById(id);
      if (!work) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      if (work.url) await imageDelete({ image: work });

      await prisma.work.delete({
        where: { id: id },
        //include: { links: true },
      });

      return {
        state: work,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(work.name),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<WorkType>>;
