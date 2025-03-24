import { CustomBtn } from "@/app/components/buttons/customButtons";
import { EducationType } from "@/app/types/prismaType";
import { useState } from "react";

import { useEducation } from "@/app/pages/stores/useEducation";
import { useSession } from "next-auth/react";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "../ui/FetchStatus";
import { CustomCard } from "./CustomCard";

const MyEducationCards = ({
  datas,
  isAdmin,
  openForm,
}: {
  datas: EducationType[];
  isAdmin: boolean;
  openForm: (idx: number | null) => void;
}) => {
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
      <h3 className="text-xl font-bold">{exp.formation}</h3>
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary" />
        <h3 className="font-semibold">{exp.organisme}</h3>
      </span>
      <p className="">{exp.text}</p>
    </CustomCard>
  ));
};

export const MyEducation = () => {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useEducation();
  const initData = {
    id: "",
    date: "",
    formation: "",
    organisme: "",
    text: "",
  };
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] =
    useState<EducationType>(initData);

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
        errorMessage={`Impossible de charger les cards educations`}
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
          <div className="sr-only">Ajouter une card service</div>
        </CustomBtn>
      )}
      {isEditing && (
        <FormulaireAuto<EducationType>
          titleForm="Education"
          formData={currentFormData}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}
      <MyEducationCards datas={datas} isAdmin={isAdmin} openForm={handleOpen} />
    </div>
  );
};
