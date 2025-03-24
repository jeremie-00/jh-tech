import { getEducations } from "@/app/services/educations.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const datas = await getEducations();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des cards education",
        error,
      },
      { status: 500 }
    );
  }
}
