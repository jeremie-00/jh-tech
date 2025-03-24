import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const texts = [
  {
    section: "home",
    name: "Jérémie Hérault",
    heading: "Hey, je suis",
    desc: "Développeur Web",
    text: `Passionné par le développement web, je conçois et développe des applications web modernes, du design au déploiement, avec une attention particulière pour l'expérience utilisateur. Mon expertise inclut React, Next.js et TypeScript.`,
  },
  {
    section: "about",
    heading: "À propos de moi",
    desc: "Développeur Web",
    text: `Ancien électrotechnicien reconverti en développeur web. Je suis passionné par la création d'interfaces modernes et performantes.Rigoureux, organisé et toujours en quête d'apprentissage. Je mets à profit mes compétences techniques pour répondre aux besoins des utilisateurs.`,
  },
  {
    section: "contact",
    heading: "Contactez moi",
    text: `Une idée, un projet, une question ? Curieux et toujours en quête de nouveaux défis, je serais ravi d’échanger avec vous. Parlons-en ! 🚀`,
  },
];

async function main() {
  console.log("Seeding textes sections database...");

  for (const { section, name, heading, desc, text } of Object.values(texts)) {
    await prisma.textSection.create({
      data: {
        section,
        name,
        heading,
        desc,
        text,
      },
    });
  }

  console.log("Seeding imagetextes sections complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
