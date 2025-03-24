import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérifier si toutes les données nécessaires sont chargées
    const [
      heroSection,
      aboutSection,
      skillsSection,
      servicesSection,
      worksSection,
      contactSection,
      texts,
    ] = await Promise.all([
      prisma.education.findFirst(),
      prisma.experience.findFirst(),
      prisma.skill.findFirst(),
      prisma.service.findFirst(),
      prisma.work.findFirst(),
      prisma.imageSection.findFirst(),
      prisma.textSection.findMany(),
    ]);

    // Vérifier si toutes les sections principales sont présentes
    const isLoaded = !!(
      heroSection &&
      aboutSection &&
      skillsSection &&
      servicesSection &&
      worksSection &&
      contactSection &&
      texts.length > 0
    );

    return NextResponse.json({ isLoaded });
  } catch (error) {
    console.error("Erreur lors de la vérification des données:", error);
    return NextResponse.json({ isLoaded: false }, { status: 500 });
  }
}
