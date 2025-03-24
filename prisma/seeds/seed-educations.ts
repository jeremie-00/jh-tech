import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const educations = [
  {
    date: "2024 - 2025",
    formation: "Intégrateur Web",
    organisme: "OpenClassRoom",
    text: "Maîtrise du développement d’interfaces web modernes et responsives. Intégration fidèle des designs sur tous supports et navigateurs.",
  },
];

async function main() {
  console.log("Seeding educations database...");

  for (const { date, formation, organisme, text } of Object.values(
    educations
  )) {
    await prisma.education.create({
      data: {
        date,
        formation,
        organisme,
        text,
      },
    });
  }

  console.log("Seeding educations complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
