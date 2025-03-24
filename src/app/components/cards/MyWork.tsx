import { CustomBtn } from "@/app/components/buttons/customButtons";
import { useWork } from "@/app/pages/stores/useWork";
import { LinkWorkType, SkillType, WorkType } from "@/app/types/prismaType";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/app/components/ui/shadcn/badge";
import { works } from "@/app/pages/StructureDatas";
import { FormulaireWork } from "../formulaires/FormulaireWork";
import ToolTip from "../ToolTip";
import { FetchStatus } from "../ui/FetchStatus";
import { CustomCard } from "./CustomCard";

function MyWorkCards({
  datas,
  isAdmin,
  openForm,
}: {
  datas: WorkType[];
  isAdmin: boolean;
  openForm: (idx: number | null) => void;
}) {
  //console.log(datas);
  return datas.map((work, idx) => (
    <CustomCard
      key={work.id}
      theme="none"
      className="relative w-full min-h-auto inset-0 flex flex-1 group/card"
    >
      <div className="relative z-10 inset-0 rounded-lg w-full h-full flex flex-col items-start justify-center p-8 gap-4 text-popover bg-popover-foreground/80 scale-[1] group-hover/card:scale-[1.01] opacity-0 hover:opacity-100 focus-within:opacity-100 transition-all duration-300">
        {isAdmin && (
          <CustomBtn
            className="pl-0"
            iconName="edit"
            theme="icon"
            size="lg"
            onClick={() => openForm(idx)}
          >
            {work.order}
            <div className="sr-only">Edit</div>
          </CustomBtn>
        )}
        <h3 className="text-2xl font-bold">{work.name}</h3>
        <hr className="w-20 border-primary border-[1.5px]"></hr>
        <p>{work.desc}</p>

        <div className="w-full flex flex-wrap content-start gap-2 mt-4">
          {work.skills?.map((skill: SkillType, idx: number) => (
            <Badge key={idx} variant="default">
              {skill.name}
            </Badge>
          ))}
        </div>
        <div className="w-full flex flex-wrap content-start gap-2 pt-8">
          {work.links.map((link: LinkWorkType, idx: number) => {
            const isGithub = link.name === "Github repository";
            if (link.href === "") return null;
            return (
              <span key={idx} className={`relative group`}>
                <CustomBtn
                  href={link.href}
                  target={true}
                  theme="round"
                  size="lg"
                  className={`border-none bg-secondary ${
                    isGithub ? "" : "hover:rotate-45"
                  }`}
                  iconName={isGithub ? "github" : "arrow"}
                >
                  <span className="sr-only">{link.name}</span>
                </CustomBtn>
                {link.name && <ToolTip txt={link.name} />}
              </span>
            );
          })}
        </div>
      </div>
      <Image
        src={work.url || "/default.svg"}
        alt={work.alt || "Image par default"}
        width={1000}
        height={1000}
        quality={90}
        className="absolute w-full h-full object-cover rounded-lg shadow-md scale-[1] group-hover/card:scale-[1.01] transition-scale duration-300"
        priority
      />
    </CustomCard>
  ));
}

export const MyWork = () => {
  const { data: session, status } = useSession();
  const { datas, fetchQuery } = useWork();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [workId, setWorkId] = useState<string | null>(null);

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
    setWorkId(idx !== null ? datas[idx].id : null);
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading)
    return (
      <FetchStatus
        isLoading={isLoading}
        isError={fetchQuery.isError}
        errorMessage={`Impossible de charger les projets`}
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
          <div className="sr-only">Ajouter une card projet</div>
        </CustomBtn>
      )}
      {isAdmin && isEditing && (
        <FormulaireWork workId={workId} setIsEditing={setIsEditing} />
      )}
      <MyWorkCards
        datas={datas || works}
        isAdmin={isAdmin}
        openForm={handleOpen}
      />
    </div>
  );
};
