import { ExperienceType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "@/app/services/experience.actions";

export const useExperience = createResourceCrud<ExperienceType>(
  "experience",
  createExperience,
  deleteExperience,
  updateExperience
);
