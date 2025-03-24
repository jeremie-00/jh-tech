import { getWorks } from "@/app/services/works.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const datas = await getWorks();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des projets",
        error,
      },
      { status: 500 }
    );
  }
}
