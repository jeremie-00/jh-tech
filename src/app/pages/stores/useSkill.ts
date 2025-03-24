import {
  createSkill,
  deleteSkill,
  updateSkill,
} from "@/app/services/skills.actions";
import { SkillType } from "@/app/types/prismaType";
import { createResourceCrud } from "../createResourceCrud";

export const useSkill = createResourceCrud<SkillType>(
  "skill",
  createSkill,
  deleteSkill,
  updateSkill
);
