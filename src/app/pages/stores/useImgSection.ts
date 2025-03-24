import {
  createImgSection,
  deleteImgSection,
  updateImgSection,
} from "@/app/services/imagesSections.actions";
import { ImgSectionType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useImagesSections = createResourceCrud<ImgSectionType>(
  "imageSection",
  createImgSection,
  deleteImgSection,
  updateImgSection
);
