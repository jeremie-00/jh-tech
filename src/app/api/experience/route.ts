import { getExperiences } from "@/app/services/experience.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const datas = await getExperiences();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des cards experiences",
        error,
      },
      { status: 500 }
    );
  }
}
