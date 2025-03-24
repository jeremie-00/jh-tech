import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const experiences = [
  {
    date: "2024 - 2025",
    poste: "Junior Developpeur",
    entreprise: "Entreprise",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio ipsum saepe atque placeat aliquid autem commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
  },
  {
    date: "2024 - 2025",
    poste: "Frontend Developpeur",
    entreprise: "Entreprise",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio ipsum saepe atque placeat aliquid autem commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
  },
  {
    date: "2024 - 2025",
    poste: "Backend Developpeur",
    entreprise: "Entreprise",
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio ipsum saepe atque placeat aliquid autem commodi perferendis qui, itaque velit earum debitis error eveniet, rerum sunt repudiandae laudantium! Possimus, temporibus.",
  },
];

async function main() {
  console.log("Seeding experiences database...");

  for (const { date, poste, entreprise, text } of Object.values(experiences)) {
    await prisma.experience.create({
      data: {
        date,
        poste,
        entreprise,
        text,
      },
    });
  }

  console.log("Seeding experiences complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
