"use client";
import {
  ImageManager,
  ImagesManager,
  imageStateDefault,
} from "@/app/components/imageManager";
import { FullProjet } from "@/app/types/prismaType";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import React, { useEffect, useMemo, useState } from "react";
import { useSkills } from "../skills/useSkills";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { ProjetLinkForm } from "./formLinkProjet";
import { useProjets } from "./useProjets";

const initialProjetData: FullProjet = {
  id: "",
  title: "",
  shortDesc: "",
  longDesc: "",
  skills: [],
  links: [],
  cover: imageStateDefault,
  medias: [imageStateDefault],
};

export function FormProjet() {
  const { datas } = useProjets();
  const { datas: skills } = useSkills();

  const { formState, setFormState, selectedSkills, setSelectedSkills } =
    useFormulaire();

  const [imagePreview, setImagePreview] = useState({
    cover: null as string | null,
    medias: [] as string[],
  });

  const OPTIONS: Option[] = useMemo(() => {
    return skills.map((skill) => ({
      label: skill.title,
      value: skill.title,
      id: skill.id,
    }));
  }, [skills]);

  const data = datas.find((data) => data.id === formState.idSelect);

  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialProjetData
  );

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      isProjet: true,
    }));
  }, [setFormState]);

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialProjetData);
      setSelectedSkills([]);
      setFormState((prev) => ({
        ...prev,
        isReset: false,
      }));
      setImagePreview({
        cover: null,
        medias: [],
      });
    }
  }, [formState.isReset, setFormState, setSelectedSkills]);

  useEffect(() => {
    if (formState.isUpdate && newForm.skills) {
      const initialSelectedSkills = newForm.skills
        .map((skillTitle) => {
          const skill = OPTIONS.find(
            (option) => option.value === skillTitle.title
          );
          return skill ? skill : null;
        })
        .filter(Boolean) as Option[];

      setSelectedSkills(initialSelectedSkills);
    }
  }, [formState.isUpdate, newForm.skills, OPTIONS, setSelectedSkills]);

  const handleSkillChange = (options: Option[]) => {
    setSelectedSkills(options);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.currentTarget;

    setNewForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className="h2-form">Projet</h2>
      <input type="hidden" name="id" defaultValue={newForm.id} />
      <label htmlFor="title" className="label-form">
        Titre
        <input
          type="title"
          name="title"
          id="title"
          placeholder="Enter title"
          value={newForm.title || ""}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="shortDesc" className="label-form">
        Description courte
        <textarea
          name="shortDesc"
          id="shortDesc"
          placeholder="Enter shortDesc"
          value={newForm.shortDesc || ""}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="longDesc" className="label-form">
        Description longue
        <textarea
          name="longDesc"
          id="longDesc"
          placeholder="Enter longDesc"
          value={newForm.longDesc || ""}
          onChange={handleChange}
        />
      </label>
      <input
        type="hidden"
        name="idImageCover"
        defaultValue={imagePreview.cover ? "" : newForm.cover?.id}
      />
      <input
        type="hidden"
        name="urlImageCover"
        defaultValue={newForm.cover?.url}
      />
      <label htmlFor="cover" className="label-form">
        Image de couverture
        <ImageManager
          name="cover"
          url={(newForm && newForm.cover && newForm.cover.url) || null}
          imagePreview={imagePreview.cover}
          setImagePreview={(cover) =>
            setImagePreview((prev) => ({ ...prev, cover }))
          }
        />
      </label>

      <label htmlFor="medias" className="label-form">
        Médias
        <ImagesManager
          updated={formState.isUpdate}
          name="medias"
          url={newForm?.medias?.map((media) => media.url) || []}
          imagePreview={imagePreview.medias}
          setImagePreview={(medias) =>
            setImagePreview((prev) => ({ ...prev, medias }))
          }
        />
      </label>
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

      <div className="relative flex flex-col gap-4">
        <ProjetLinkForm newForm={newForm} />
      </div>
    </>
  );
}
