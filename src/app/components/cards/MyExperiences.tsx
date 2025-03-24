import { CustomBtn } from "@/app/components/buttons/customButtons";
import { ExperienceType } from "@/app/types/prismaType";
import { useState } from "react";

import { useExperience } from "@/app/pages/stores/useExperience";
import { useSession } from "next-auth/react";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "../ui/FetchStatus";
import { CustomCard } from "./CustomCard";

function MyExperienceCards({
  datas,
  isAdmin,
  openForm,
}: {
  datas: ExperienceType[];
  isAdmin: boolean;
  openForm: (idx: number | null) => void;
}) {
  return datas.map((exp, idx) => (
    <CustomCard
      key={idx}
      className="flex-col h-auto w-full gap-4 p-6 shadow"
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
          <div className="sr-only">Edit</div>
        </CustomBtn>
      )}
      <h3 className="text-xl text-primary font-semibold">{exp.date}</h3>
      <h3 className="text-xl font-bold">{exp.poste}</h3>
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary" />
        <h3 className="font-semibold">{exp.entreprise}</h3>
      </span>

      <p className="">{exp.text}</p>
    </CustomCard>
  ));
}

export const MyExperiences = () => {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useExperience();
  const initData = {
    id: "",
    date: "",
    poste: "",
    entreprise: "",
    text: "",
  };
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] =
    useState<ExperienceType>(initData);

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
        errorMessage={`Impossible de charger les cards experiences`}
      />
    );

  return (
    <div
      className={`${datas.length > 1 && "custom-grid scrollbar"} p-8 ${
        isAdmin ? "pt-16" : ""
      }`}
    >
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
        <FormulaireAuto<ExperienceType>
          titleForm="Expérience"
          formData={currentFormData}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}
      <MyExperienceCards
        datas={datas}
        isAdmin={isAdmin}
        openForm={handleOpen}
      />
    </div>
  );
};
