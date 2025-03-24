import { Prisma } from "@prisma/client";

export type LinkWorkType = Prisma.LinkWorkGetPayload<true>;
export type ImgSectionType = Prisma.ImageSectionGetPayload<true>;
export type TxtSectionType = Prisma.TextSectionGetPayload<true>;
export type EducationType = Prisma.EducationGetPayload<true>;
export type ExperienceType = Prisma.ExperienceGetPayload<true>;
export type ServiceType = Prisma.ServiceGetPayload<true>;
export type SkillType = Prisma.SkillGetPayload<true>;
export type WorkType = Prisma.WorkGetPayload<{
  include: {
    skills: true;
    links: true;
  };
}>;
