import {
  createWork,
  deleteWork,
  updateWork,
} from "@/app/services/works.actions";
import { WorkType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useWork = createResourceCrud<WorkType>(
  "work",
  createWork,
  deleteWork,
  updateWork
);
