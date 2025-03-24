import { useSkill } from "@/app/pages/stores/useSkill";
import { SkillType } from "@/app/types/prismaType";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { CustomBtn } from "../buttons/customButtons";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "../ui/FetchStatus";
import { CustomCard } from "./CustomCard";

function MySkillCards({
  datas,
  isAdmin,
  openForm,
}: {
  datas: SkillType[];
  isAdmin?: boolean;
  openForm: (idx: number | null) => void;
}) {
  //console.log(datas[0]);
  return datas.map((skill, idx) => (
    <CustomCard
      key={idx}
      className="flex-col h-fit w-fit gap-4 p-6 shadow"
      theme="default"
    >
      {isAdmin && (
        <CustomBtn
          className={`place-self-start pl-0`}
          iconName="edit"
          theme="icon"
          size="lg"
          onClick={() => openForm(idx)}
        >
          {skill.order}
          <div className="sr-only">Edit</div>
        </CustomBtn>
      )}
      <Image
        src={skill.url || "/default.svg"}
        alt={skill.alt}
        width={200}
        height={200}
        className="w-32 h-32"
        quality={90}
      />
      <h3 className="text-xl text-muted-foreground text-center">
        {skill.name}
      </h3>
    </CustomCard>
  ));
}

export const MySkills = () => {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useSkill();
  const initData = {
    id: "",
    name: "",
    url: "",
    alt: "",
    order: datas.length + 1,
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] = useState<SkillType>(initData);

  const isAdmin = session?.user?.role === "admin";
  const isLoadingSession = status === "loading";
  const isLoading =
    isLoadingSession ||
    fetchQuery.isLoading ||
    fetchQuery.isRefetching ||
    fetchQuery.isError;

  const handleOpen = (idx: number | null) => {
    if (!isAdmin) return;
    setIsEditing(true);
    setCurrentFormData(idx !== null ? datas[idx] : initData);
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading)
    return (
      <FetchStatus
        isLoading={isLoading}
        isError={fetchQuery.isError}
        errorMessage={`Impossible de charger les cards compétences`}
      />
    );

  return (
    <div className={`custom-flex-wrap ${isAdmin ? "pt-16" : ""}`}>
      {isAdmin && !isEditing && (
        <CustomBtn
          theme="icon_primary"
          iconName="add"
          className="absolute top-4 left-1/2 -translate-x-1/2"
          onClick={() => handleOpen(null)}
        >
          <div className="sr-only">Ajouter une card experience</div>
        </CustomBtn>
      )}
      {isAdmin && isEditing && (
        <FormulaireAuto<SkillType>
          titleForm="Compétence"
          formData={currentFormData}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}
      <MySkillCards datas={datas} isAdmin={isAdmin} openForm={handleOpen} />
    </div>
  );
};
