import {
  createEducation,
  deleteEducation,
  updateEducation,
} from "@/app/services/educations.actions";
import { EducationType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useEducation = createResourceCrud<EducationType>(
  "education",
  createEducation,
  deleteEducation,
  updateEducation
);
