import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    order: 1,
    url: "/services/web-design.png",
    alt: "web design",
    name: "UX/UI",
    text: "Conception d’interfaces intuitives et esthétiques, centrées sur l’expérience utilisateur. Un design soigné et une navigation fluide permettent d’optimiser l’engagement et la satisfaction des visiteurs.",
  },
  {
    order: 2,
    url: "/services/web-programming.png",
    alt: "web programming",
    name: "Web Developpement",
    text: "Création de sites performants, modernes et adaptés à tous les écrans. Que ce soit une application web dynamique ou un site vitrine, chaque projet est conçu avec des technologies récentes pour garantir rapidité, sécurité et évolutivité.",
  },
  {
    order: 3,
    url: "/services/seo.png",
    alt: "SEO",
    name: "SEO",
    text: "Amélioration du référencement et des performances pour une meilleure visibilité sur les moteurs de recherche. Optimisation du temps de chargement, structuration du contenu et bonnes pratiques SEO assurent un trafic qualifié et durable.",
  },
];

async function main() {
  console.log("Seeding services database...");

  for (const { name, text, url, alt, order } of Object.values(services)) {
    await prisma.service.create({
      data: {
        name,
        text,
        url,
        alt,
        order,
      },
    });
  }

  console.log("Seeding services complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
