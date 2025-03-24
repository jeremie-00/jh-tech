import { CustomBtn } from "@/app/components/buttons/customButtons";
import { ServiceType } from "@/app/types/prismaType";
import Image from "next/image";
import { useState } from "react";

import { useService } from "@/app/pages/stores/useService";
import { useSession } from "next-auth/react";
import { FormulaireAuto } from "../formulaires/FormulaireAuto";
import { FetchStatus } from "../ui/FetchStatus";
import { CustomCard } from "./CustomCard";

function MyServiceCards({
  datas,
  isAdmin,
  openForm,
}: {
  datas: ServiceType[];
  isAdmin?: boolean;
  openForm: (idx: number | null) => void;
}) {
  return datas.map((service, idx) => (
    <CustomCard
      key={idx}
      className="flex-col h-full w-fit gap-4 p-6 shadow"
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
          {service.order}
          <div className="sr-only">Edit</div>
        </CustomBtn>
      )}
      <Image
        src={service.url}
        alt={service.alt}
        width={50}
        height={50}
        className=""
        quality={90}
      />
      <h3 className="text-xl text-primary font-semibold">{service.name}</h3>
      <p className="text-muted-foreground">{service.text}</p>
    </CustomCard>
  ));
}

export function MyServices() {
  const { data: session, status } = useSession();
  const { datas, fetchQuery, mutateAdd, mutateRemove, mutateUpdate } =
    useService();
  const initData = {
    id: "",
    url: "",
    alt: "",
    name: "",
    text: "",
    order: datas.length + 1,
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] = useState<ServiceType>(initData);

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
        errorMessage={`Impossible de charger les cards services`}
      />
    );

  return (
    <div className={`custom-grid scrollbar ${isAdmin ? "pt-16" : ""}`}>
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
      {isAdmin && isEditing && (
        <FormulaireAuto<ServiceType>
          titleForm="Service"
          formData={currentFormData}
          setIsEditing={setIsEditing}
          mutateAdd={mutateAdd}
          mutateRemove={mutateRemove}
          mutateUpdate={mutateUpdate}
        />
      )}
      <MyServiceCards datas={datas} isAdmin={isAdmin} openForm={handleOpen} />
    </div>
  );
}
