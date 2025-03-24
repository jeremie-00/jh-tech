import { useDeleteModal } from "@/app/contexts/modalDeleteContext";
import { useSkill } from "@/app/pages/stores/useSkill";
import { useWork } from "@/app/pages/stores/useWork";
import { WorkType } from "@/app/types/prismaType";
import Form from "next/form";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CustomSubmit } from "../buttons/CustomSubmit";
import { CustomBtn } from "../buttons/customButtons";
import { CustomCard } from "../cards/CustomCard";
import { ImageManager } from "../imageManager";
import MultipleSelector, { Option } from "../ui/shadcn/multi-selector";

interface FormWorkProps {
  workId: string | null;
  setIsEditing: (isEditing: boolean) => void;
}

export const FormulaireWork = ({ workId, setIsEditing }: FormWorkProps) => {
  const { openModal } = useDeleteModal();
  const { datas, mutateRemove, mutateAdd, mutateUpdate } = useWork();
  const initialProjetData: WorkType = {
    id: "",
    name: "",
    desc: "",
    url: "",
    alt: "",
    order: datas.length + 1,
    skills: [],
    links: [
      {
        name: "",
        href: "",
        workId: "",
        id: "",
      },
      {
        name: "",
        href: "",
        workId: "",
        id: "",
      },
    ],
  };
  const [newForm, setNewForm] = useState<WorkType>(
    datas.find((data) => data.id === workId) ?? initialProjetData
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);
  const { datas: skills } = useSkill();
  const OPTIONS: Option[] = useMemo(() => {
    return skills.map((skill) => ({
      label: skill.name,
      value: skill.name,
      id: skill.id,
    }));
  }, [skills]);

  useEffect(() => {
    if (!newForm?.skills) return;
    const initialSelectedSkills = newForm.skills
      .map((skillTitle) => {
        const skill = OPTIONS.find(
          (option) => option.value === skillTitle.name
        );
        return skill ? skill : null;
      })
      .filter(Boolean) as Option[];

    setSelectedSkills(initialSelectedSkills);
  }, [newForm, OPTIONS, setSelectedSkills]);

  const handleClose = () => {
    setIsEditing(false);
  };

  const filteredLinks = (formData: FormData) => {
    const linksLength = formData.getAll("links.href").length;
    const links = Array.from({ length: linksLength }).map((_, index) => ({
      id: String(formData.getAll("links.id")[index] || ""),
      href: String(formData.getAll("links.href")[index] || ""),
      name: index === 0 ? "Github repository" : "Site web",
    }));
    //const linksFiltered = links.filter((link) => link.href !== ""); // Filtrer les liens vides
    return links;
  };

  const handleSubmit = (formData: FormData) => {
    const linksFiltered = filteredLinks(formData);
    formData.set("links", JSON.stringify(linksFiltered));

    selectedSkills.forEach((skill) =>
      formData.append("skills", String(skill.id))
    );

    /* for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */
    //debug
    if (newForm?.id) {
      mutateUpdate.mutate(formData);
    } else {
      mutateAdd.mutate(formData);
    }
    handleClose();
  };

  const handleSkillChange = (options: Option[]) => {
    setSelectedSkills(options);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.currentTarget;

    setNewForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const [links, setLinks] = useState(
    () =>
      newForm.links?.map((link) => ({
        id: link.id,
        href: link.href,
        name: link.name,
      })) || []
  );

  const handleLinkChange = (
    index: number,
    field: keyof (typeof links)[number],
    value: string
  ) => {
    const newLinks = [...links];
    newLinks[index] = {
      ...newLinks[index],
      [field]: value, // Mise à jour dynamique du champ modifié
    };
    setLinks(newLinks);
  };

  const handleDelete = async (id: string) => {
    mutateRemove.mutate({ id });
    handleClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const activeElement = document.activeElement as HTMLElement;

    // Vérifie si l'élément actuellement focus est un champ de formulaire
    if (activeElement && activeElement.matches("input, textarea, select")) {
      return; // Ne ferme pas la modal si un input est actif
    }
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (!newForm)
    return (
      <div className="absolute text-xl text-destructive top-4 left-8">
        Un probleme est survenu avec le formulaire
      </div>
    );
  return createPortal(
    <div
      className="fixed top-0 z-50 inset-0 md:p-14 p-4 pb-24 bg-black/50 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div ref={modalRef} className="relative rounded-lg">
        <CustomCard className="relative gap-4 shadow" theme="secondary">
          <Form
            action={handleSubmit}
            className={`w-full h-full flex flex-col gap-6 p-8`}
          >
            <CustomBtn
              theme="close"
              iconName="close"
              className="absolute top-0 right-0"
              onClick={handleClose}
            >
              <div className="sr-only">Fermer</div>
            </CustomBtn>
            <span className="text-xl text-primary font-semibold place-self-center">
              {newForm.name ? newForm.name : "Création d'un projet"}
            </span>
            <input type="hidden" name="id" defaultValue={newForm.id} />

            <input
              type="number"
              name={"order"}
              value={newForm.order}
              onChange={handleChange}
              className="w-fit custom-input shadow-none"
              aria-label={"Ordre"}
              placeholder={"Ordre"}
            />

            <input
              type="text"
              name="name"
              placeholder="Enter le nom du projet"
              value={newForm.name}
              onChange={handleChange}
              className="custom-input shadow-none"
            />

            <textarea
              name="desc"
              placeholder="Enter une description du projet"
              value={newForm.desc || ""} // || ""
              onChange={handleChange}
              className="custom-input shadow-none"
            />

            <div className="w-full h-fit flex max-md:flex-col justify-items-center gap-8 order-0">
              <ImageManager
                imgSize="w-[80px] h-[80px]"
                url={newForm.url}
                alt={newForm.alt !== undefined ? newForm.alt : ""}
                handleChange={handleChange}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </div>
            <MultipleSelector
              defaultOptions={OPTIONS}
              placeholder="Selection des compétences ..."
              value={selectedSkills}
              onChange={handleSkillChange}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  Aucune compétences trouver.
                </p>
              }
            />
            <div className="flex gap-4">
              {links.map((link, idx) => (
                <div key={idx} className="flex flex-col flex-1 gap-4">
                  <input type="hidden" name="links.id" value={link.id} />
                  <input
                    type="text"
                    name="links.href"
                    placeholder={
                      idx < 1
                        ? "Lien vers le repository github"
                        : "Lien vers le site web "
                    }
                    value={link.href}
                    onChange={(e) =>
                      handleLinkChange(idx, "href", e.target.value)
                    }
                    className="custom-input shadow-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-around">
              <CustomBtn
                theme="delete"
                iconName="delete"
                size="md"
                onClick={() =>
                  openModal(
                    "Supprimer cet élément ?",
                    `Cette action est irréversible.`,
                    () =>
                      handleDelete(newForm?.id !== undefined ? newForm.id : "")
                  )
                }
                disabled={!newForm?.id}
                ariaLabel="Supprimer"
              >
                <div className="sr-only">Supprimer</div>
              </CustomBtn>
              <CustomSubmit />
            </div>
          </Form>
        </CustomCard>
      </div>
    </div>,
    document.body
  );
};
