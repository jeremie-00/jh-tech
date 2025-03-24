"use server";
import { zfd } from "zod-form-data";
import prisma from "../lib/prisma";
import { authActionClient } from "../lib/safe-action";
import { Result } from "../types/globalType";
import { ServiceType } from "../types/prismaType";
import { baseSchema, deleteSchema } from "../types/zodType";
import { createImage } from "../utils/createdImage";
import { imageDelete } from "./imageStorage.actions";

const DEFAULT = {
  url: "/default.svg",
  alt: "Text alt image par default",
  title: "Titre default",
  text: "Lorem ipsum dolor sit, commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
};

const MESSAGES = {
  NOT_FOUND: "Service introuvable.",
  ERROR_CREATE: "Erreur lors de la création de la card service.",
  ERROR_UPDATE: "Erreur lors de la mise à jour de la card service.",
  ERROR_DELETE: "Erreur lors de la suppression de la card service.",
  SUCCESS_CREATE: (name: string) =>
    `La card service \"${name}\" a été créé avec succès ! 🚀`,
  SUCCESS_UPDATE: (name: string) =>
    `La card service \"${name}\" a été mis à jour avec succès ! 🚀`,
  SUCCESS_DELETE: (name: string) =>
    `La card service \"${name}\" a été supprimé avec succès ! 🚀`,
};

const serviceSchema = {
  create: zfd.formData({
    name: baseSchema.text.default,
    text: baseSchema.text.default,
    order: baseSchema.text.optional,
    alt: baseSchema.text.optional,
    image: baseSchema.file.optional,
  }),

  update: zfd.formData({
    id: baseSchema.id.uuid,
    name: baseSchema.text.default,
    text: baseSchema.text.default,
    order: baseSchema.text.optional,
    alt: baseSchema.text.default,
    image: baseSchema.file.optional,
  }),
};

export const getServices = async (): Promise<ServiceType[]> => {
  return prisma.service.findMany({
    orderBy: {
      order: "asc",
    },
  });
};

export const getServiceById = async (id: string) => {
  return prisma.service.findUnique({
    where: {
      id: id,
    },
  });
};

export const createService = authActionClient
  .schema(serviceSchema.create)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { alt, image, name, text, order } = props;

      const url = await createImage("SERVICES", image, name);

      const createdService = await prisma.service.create({
        data: {
          name: name || DEFAULT.title,
          text: text || DEFAULT.text,
          url: url || DEFAULT.url,
          alt: alt || DEFAULT.alt,
          order: Number(order),
        },
      });

      return {
        state: createdService,
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
  }) as unknown as (formData: FormData) => Promise<Result<ServiceType>>;

export const updateService = authActionClient
  .schema(serviceSchema.update)
  .action(async ({ parsedInput: { ...props } }) => {
    try {
      const { id, alt, image, name, text, order } = props;

      const existingService = await getServiceById(id);

      if (!existingService) {
        return {
          success: false,
          status: "warn",
          message: "Service introuvable.",
        };
      }

      const url = await createImage("SERVICES", image, name);

      if (existingService && url) await imageDelete({ image: existingService });

      const updatedImage = await prisma.service.update({
        where: { id },
        data: {
          name,
          text,
          url: url || existingService.url,
          alt: alt || existingService.alt,
          order: Number(order),
        },
      });

      return {
        state: updatedImage,
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
  }) as unknown as (formData: FormData) => Promise<Result<ServiceType>>;

export const deleteService = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const service = await getServiceById(id);
      if (!service) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.NOT_FOUND,
        };
      }

      const isDeleted = service && (await imageDelete({ image: service }));
      if (!isDeleted?.data && service.url !== DEFAULT.url) {
        return {
          success: false,
          status: "warn",
          message: MESSAGES.ERROR_DELETE,
        };
      }

      await prisma.service.delete({
        where: { id: id },
      });

      return {
        state: service,
        success: true,
        status: "success",
        message: MESSAGES.SUCCESS_DELETE(service.name),
      };
    } catch {
      return {
        success: false,
        status: "error",
        message: MESSAGES.ERROR_DELETE,
      };
    }
  }) as ({ id }: { id: string }) => Promise<Result<ServiceType>>;
