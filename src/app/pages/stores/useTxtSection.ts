import {
  createTxtSection,
  deleteTxtSection,
  updateTxtSection,
} from "@/app/services/textesSections.actions";
import { TxtSectionType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useTextsSections = createResourceCrud<TxtSectionType>(
  "textSection",
  createTxtSection,
  deleteTxtSection,
  updateTxtSection
);
