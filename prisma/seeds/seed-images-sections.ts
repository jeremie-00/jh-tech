import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const images: Record<string, { section: string; url: string; alt: string }> = {
  home: {
    section: "home",
    url: "/profile/image-3d.png",
    alt: "Jérémie Hérault",
  },
  about: {
    section: "about",
    url: "/profile/image-3d.png",
    alt: "Jérémie Hérault",
  },
  contact: {
    section: "contact",
    url: "/planet/planetTerre.png",
    alt: "planet Terre",
  },

  layout_home: {
    section: "layout_home",
    url: "/background/bg-profile.jpeg",
    alt: "Fond de bureau",
  },
  layout_about: {
    section: "layout_about",
    url: "/background/bg-profile.jpeg",
    alt: "Fond de bureau",
  },
  layout_contact: {
    section: "layout_contact",
    url: "/background/espace.jpeg",
    alt: "Fond de l'espace",
  },
};

async function main() {
  console.log("Seeding images sections database...");

  for (const { section, url, alt } of Object.values(images)) {
    await prisma.imageSection.create({
      data: {
        section: section,
        url: url,
        alt: alt,
      },
    });
  }

  console.log("Seeding images sections complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
