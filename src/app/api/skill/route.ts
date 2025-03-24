import { getSkills } from "@/app/services/skills.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const datas = await getSkills();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des compétences",
        error,
      },
      { status: 500 }
    );
  }
}
