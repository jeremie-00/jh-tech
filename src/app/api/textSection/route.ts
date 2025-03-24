import { getTxtsSections } from "@/app/services/textesSections.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //throw new Error("Not implemented");
    const datas = await getTxtsSections();
    return NextResponse.json(datas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des textes sections",
        error,
      },
      { status: 500 }
    );
  }
}
