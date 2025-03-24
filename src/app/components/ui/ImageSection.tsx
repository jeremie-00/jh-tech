import { CustomBtn } from "@/app/components/buttons/customButtons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { ImgSectionType } from "@/app/types/prismaType";
import { useIsMobile } from "../../hooks/useMobile";
import { useImagesSections } from "../../pages/stores/useImgSection";
import { capitalize } from "../../utils/capitalize";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import Blob from "./Blob";
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

interface ImageSection {
  sectionProps: { className?: string; blob?: boolean };
  data: ImgSectionType;
}

function ImageSectionClient(props: ImageSection) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div
        className={` ${props.sectionProps.className} w-64 h-84 relative z-50 mb-10`}
      >
        {props.sectionProps.blob && <Blob />}
        <Image
          src={props.data.url || DEFAULT_IMG.url}
          alt={props.data.alt || DEFAULT_IMG.alt}
          width={800}
          height={1000}
          quality={90}
          className="relative object-cover"
          priority
        />
      </div>
    );
  }
  return (
    <Image
      src={props.data.url || DEFAULT_IMG.url}
      alt={props.data.alt || DEFAULT_IMG.alt}
      width={1200}
      height={1500}
      quality={90}
      className={`${props.sectionProps.className} lg:w-1/2 h-full object-contain absolute z-10 drop-shadow-[-8px_40px_34px_rgba(0,0,0,0.6)]`}
      priority
    />
  );
}

export default function ImageSection({
  propsKey,
}: {
  propsKey: "home" | "about" | "contact";
}) {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useImagesSections();

  // Utiliser useRef pour stocker les valeurs qui ne changent pas
  const initDataRef = useRef({ ...DEFAULT_INIT_DATA });

  // Mémorisation des props
  const sectionProps = useMemo(
    () => ({
      home: {
        blob: true,
        className:
          "max-md:order-1 xl:-right-24 lg:-right-12 md:-right-4 md:-bottom-40 md:w-[500px]",
      },
      about: {
        blob: true,
        className:
          "max-md:order-2 scale-x-[-1] xl:-left-24 lg:-left-12 md:-left-4 md:-bottom-40 md:w-[500px]",
      },
      contact: {
        blob: false,
        className:
          "max-md:order-2 xl:-right-32 lg:-right-16 md:-right-8 md:-bottom-54 md:w-[480px]",
      },
    }),
    []
  );

  // Optimisation du useMemo avec dépendances clairement définies
  const data = useMemo(() => {
    const foundData = datas.find((item) => item.section === propsKey);
    if (foundData) return foundData;

    // Création de l'objet par défaut optimisée
    return {
      ...initDataRef.current,
      section: propsKey,
    };
  }, [datas, propsKey]);

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
        className={`${sectionProps[propsKey].className} lg:w-1/2 h-full relative z-50`}
      >
        <FetchStatus
          isLoading={isLoading}
          isError={fetchQuery.isError}
          errorMessage={`Impossible de charger l'image de la section ${propsKey}`}
        />
      </div>
    );

  return (
    <div
      className={`${
        propsKey !== "home" ? "pb-24 order-2" : ""
      } flex flex-col max-md:pt-10 `}
    >
      {isAdmin && isEditing && (
        <FormulaireAuto<ImgSectionType>
          titleForm={`Image de la section ${capitalize(propsKey)}`}
          formData={data}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}

      {isAdmin && !isEditing && (
        <CustomBtn
          className={`md:absolute md:top-[50%] z-50  ${
            propsKey !== "about" ? "md:right-[35%]" : " md:left-[35%]"
          }  max-md:place-self-center`}
          iconName="edit"
          theme="icon"
          size="lg"
          onClick={() => setIsEditing(true)}
        >
          <div className="sr-only">Edit</div>
        </CustomBtn>
      )}
      <ImageSectionClient data={data} sectionProps={sectionProps[propsKey]} />
    </div>
  );
}
