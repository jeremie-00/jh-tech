import {
  createService,
  deleteService,
  updateService,
} from "@/app/services/service.actions";
import { ServiceType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useService = createResourceCrud<ServiceType>(
  "service",
  createService,
  deleteService,
  updateService
);
