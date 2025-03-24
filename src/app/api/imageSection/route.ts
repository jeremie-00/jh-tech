import { getImgSections } from "@/app/services/imagesSections.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const datas = await getImgSections();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des images sections",
        error,
      },
      { status: 500 }
    );
  }
}
