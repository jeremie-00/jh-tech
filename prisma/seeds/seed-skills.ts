import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  {
    order: 1,
    name: "Css3",

    url: "/skills/css-3.svg",
    alt: "Logo de Css3",
  },

  {
    order: 2,
    name: "React",

    url: "/skills/react.svg",
    alt: "Logo de React",
  },
  {
    order: 3,
    name: "JavaScript",

    url: "/skills/javascript.svg",
    alt: "Logo de JavaScript",
  },
  {
    order: 4,
    name: "Next.js",

    url: "/skills/nextjs.svg",
    alt: "Logo de Next.js",
  },
  {
    order: 5,
    name: "HTML",

    url: "/skills/html-5.svg",
    alt: "Logo de HTML",
  },
  {
    order: 6,
    name: "Git",

    url: "/skills/git.svg",
    alt: "Logo de Git",
  },
  {
    order: 7,
    name: "Sass",

    url: "/skills/sass.svg",
    alt: "Logo de Sass",
  },
  {
    order: 8,
    name: "Sqlite",

    url: "/skills/sqlite.svg",
    alt: "Logo de Sqlite",
  },
  {
    order: 9,
    name: "Figma",

    url: "/skills/figma.svg",
    alt: "Logo de Figma",
  },
  {
    order: 10,
    name: "Vite",

    url: "/skills/vite.svg",
    alt: "Logo de Vite",
  },
  {
    order: 11,
    name: "Vercel",

    url: "/skills/vercel.svg",
    alt: "Logo de Vercel",
  },
  {
    order: 12,
    name: "Typescript",

    url: "/skills/typescript.svg",
    alt: "Logo de Typescript",
  },
  {
    order: 13,
    name: "Tailwind",

    url: "/skills/tailwind.svg",
    alt: "Logo de Tailwind",
  },
  {
    order: 14,
    name: "Python",

    url: "/skills/python.svg",
    alt: "Logo de Python",
  },
  {
    order: 15,
    name: "Prisma",

    url: "/skills/prisma.svg",
    alt: "Logo de Prisma",
  },
  {
    order: 16,
    name: "Postgresql",

    url: "/skills/postgresql.svg",
    alt: "Logo de Postgresql",
  },
  {
    order: 17,
    name: "MongoDb",

    url: "/skills/mongodb.svg",
    alt: "Logo de MongoDb",
  },
  {
    order: 18,
    name: "Github",

    url: "/skills/github.svg",
    alt: "Logo de Github",
  },
  {
    order: 19,
    name: "Node.js",

    url: "/skills/nodejs.svg",
    alt: "Logo de Node.js",
  },
];

async function main() {
  console.log("Seeding skills database...");

  for (const skill of skills) {
    const { name, url, alt, order } = skill;

    await prisma.skill.create({
      data: {
        name,
        order,
        url,
        alt,
      },
    });
  }

  console.log("Seeding skills complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
