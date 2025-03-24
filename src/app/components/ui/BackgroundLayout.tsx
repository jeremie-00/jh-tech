import { useImagesSections } from "@/app/pages/stores/useImgSection";
import { ImgSectionType } from "@/app/types/prismaType";
import { capitalize } from "@/app/utils/capitalize";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { CustomBtn } from "../buttons/customButtons";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "./FetchStatus";

const DEFAULT_IMG = {
  url: "/default.svg",
  alt: "Image par default",
};

const DEFAULT_INIT_DATA = {
  id: "",
  section: "",
  url: DEFAULT_IMG.url,
  alt: DEFAULT_IMG.alt,
};

interface BackgroundLayout {
  sectionProps: { className?: string };
  data: ImgSectionType;
}

export default function BackgroundLayout({
  className,
  layoutKey,
}: {
  className?: string;
  layoutKey: "layout_home" | "layout_about" | "layout_contact";
}) {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useImagesSections();

  // Utiliser useRef pour stocker les valeurs qui ne changent pas
  const initDataRef = useRef({ ...DEFAULT_INIT_DATA });

  // Optimisation du useMemo avec dépendances clairement définies
  const data = useMemo(() => {
    const foundData = datas.find((item) => item.section === layoutKey);
    if (foundData) return foundData;

    // Création de l'objet par défaut optimisée
    return {
      ...initDataRef.current,
      section: layoutKey,
    };
  }, [datas, layoutKey]);

  // État d'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isAdmin = session?.user?.role === "admin";
  const isLoadingSession = status === "loading";
  const isLoading =
    isLoadingSession ||
    fetchQuery.isLoading ||
    fetchQuery.isRefetching ||
    fetchQuery.isError;

  // Gestion des états de chargement et d'erreur
  if (isLoading)
    return (
      <div
        className={`${className} w-1/2 h-full absolute top-0 place-content-start max-md:hidden`}
      >
        <FetchStatus
          isLoading={isLoading}
          isError={fetchQuery.isError}
          errorMessage={`Impossible de charger l'image de la section ${layoutKey}`}
        />
      </div>
    );

  return (
    <>
      <div
        className={`${className} w-1/2 h-full absolute top-0 clip-custom max-md:hidden`} //bg-secondary
      >
        {isAdmin && isEditing && (
          <FormulaireAuto<ImgSectionType>
            titleForm={`Image de la section ${capitalize(layoutKey)}`}
            formData={data}
            setIsEditing={setIsEditing}
            mutateAdd={mutateAdd}
            mutateRemove={mutateRemove}
            mutateUpdate={mutateUpdate}
          />
        )}

        {isAdmin && !isEditing && (
          <CustomBtn
            className={`md:absolute md:top-0 z-50  ${
              layoutKey === "layout_about" && "scale-x-[-1]"
            } md:left-[35%]`}
            iconName="edit"
            theme="icon"
            size="lg"
            onClick={() => setIsEditing(true)}
          >
            <div className="sr-only">Edit</div>
          </CustomBtn>
        )}
        <Image
          src={data.url || DEFAULT_IMG.url}
          alt={data.alt || DEFAULT_IMG.alt}
          width={1920}
          height={1080}
          quality={90}
          className={`w-full h-full object-cover absolute z-10`}
          priority
        />
      </div>
      <div
        className={`${className} bg-primary w-1/2 h-full absolute top-0 clip-custom1 max-md:hidden`}
      ></div>
    </>
  );
}
