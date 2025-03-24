import { useSession } from "next-auth/react";
import { useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CustomBtn } from "@/app/components/buttons/customButtons";
import { TxtSectionType } from "@/app/types/prismaType";
import { Buttons } from "../../pages/sections/Home";
import { useTextsSections } from "../../pages/stores/useTxtSection";
import { capitalize } from "../../utils/capitalize";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "./FetchStatus";

const DEFAULT_INIT_DATA = {
  id: "",
  section: "",
  name: "Nom par default",
  heading: "En tete par default",
  desc: "description par default",
  text: "texte descriptif par default",
};

interface SectionProps {
  data: TxtSectionType;
  className?: string;
}

function TextsSectionComponent(props: SectionProps) {
  return (
    <div
      className={twMerge(
        "relative flex flex-col items-start max-md:items-center max-md:px-8 gap-4",
        props.className
      )}
    >
      {props.data.heading && (
        <h2
          className={twMerge(
            props.data.section === "home"
              ? "lg:text-4xl text-2xl text-foreground font-semibold max-md:text-center"
              : "text-4xl font-semibold text-foreground font-title tracking-wide max-md:text-center"
          )}
        >
          {props.data.heading}
        </h2>
      )}

      {props.data.name && (
        <h1 className="lg:text-[3rem] text-4xl font-semibold font-title tracking-wider text-primary max-md:text-center">
          {props.data.name}
        </h1>
      )}
      {props.data.desc && (
        <h3 className="lg:text-3xl text-2xl text-foreground font-semibold max-md:text-center">
          {props.data.desc}
        </h3>
      )}
      {props.data.text && (
        <p
          className={twMerge(
            "w-full lg:text-lg text-md text-foreground font-body max-md:text-center",
            props.data.section === "contact" ? "max-w-sm" : "max-w-md"
          )}
        >
          {props.data.text}
        </p>
      )}
    </div>
  );
}

export default function TextsSection({
  propsKey,
}: {
  propsKey: "home" | "about" | "contact";
}) {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useTextsSections();

  // Utiliser useRef pour stocker les valeurs qui ne changent pas
  const initDataRef = useRef({ ...DEFAULT_INIT_DATA });

  // Mémorisation de la classe CSS basée sur propsKey
  /* const className = useMemo(
    () => (propsKey === "about" ? "py-4 pl-0" : "py-4 pl-0"),
    [propsKey]
  ); */

  const paddingBottom = useMemo(
    () => (propsKey === "home" ? "max-md:pb-24" : "py-10"),
    [propsKey]
  );

  // Optimisation du useMemo avec dépendances clairement définies
  const data = useMemo(() => {
    const foundData = datas.find((item) => item.section === propsKey);
    if (foundData) return foundData;

    // Création de l'objet par défaut optimisée
    return {
      ...initDataRef.current,
      section: propsKey,
      name: propsKey === "home" ? "Nom" : null,
      desc: propsKey !== "contact" ? "description" : null,
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
      <FetchStatus
        isLoading={isLoading}
        isError={fetchQuery.isError}
        errorMessage={`Impossible de charger le texte de la section ${propsKey}`}
      />
    );

  return (
    <div className={`relative ${paddingBottom}`}>
      {isAdmin && isEditing && (
        <FormulaireAuto<TxtSectionType>
          titleForm={`Texte de la section ${capitalize(propsKey)}`}
          formData={data}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}
      {isAdmin && !isEditing && (
        <CustomBtn
          className={"py-4 pl-0 max-md:place-self-center"}
          iconName="edit"
          theme="icon"
          size="lg"
          onClick={() => setIsEditing(true)}
        >
          <div className="sr-only">Edit</div>
        </CustomBtn>
      )}
      <TextsSectionComponent data={data} className={""} />
      {propsKey === "home" && (
        <div className="relative flex max-md:flex-col items-left gap-6 mt-6 ">
          <div className="max-md:order-2 flex max-md:justify-center">
            <Buttons isGrouped={false} />
          </div>

          <div className="max-md:order-1 flex items-center max-md:justify-center gap-6 ">
            <Buttons isGrouped={true} />
          </div>
        </div>
      )}
    </div>
  );
}
