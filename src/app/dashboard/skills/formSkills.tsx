"use client";
import { ImageManager, imageStateDefault } from "@/app/components/imageManager";
import { FullSkill } from "@/app/types/prismaType";
import React, { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { useSkills } from "./useSkills";

export const initialSkillData: FullSkill = {
  id: "",
  title: "",
  image: imageStateDefault,
};

export function FormSkills() {
  const { datas } = useSkills();
  const { formState, setFormState } = useFormulaire();

  const data = datas.find((data) => data.id === formState.idSelect);
  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialSkillData
  );

  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialSkillData);
      setImagePreview(null);
      setFormState((prev) => ({
        ...prev,
        isReset: false,
      }));
    }
  }, [formState.isReset, setFormState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setNewForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className="h2-form">Skills</h2>
      <input type="hidden" name="id" defaultValue={newForm.id} />

      <input
        type="hidden"
        name="idImage"
        defaultValue={imagePreview ? "" : newForm.image?.id}
      />
      <input type="hidden" name="urlImage" defaultValue={newForm.image?.url} />
      <ImageManager
        url={newForm?.image?.url || ""}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />

      <label htmlFor="title" className="label-form">
        Titre
        <input
          type="title"
          name="title"
          id="title"
          placeholder="Enter skill title"
          value={newForm.title}
          onChange={handleChange}
        />
      </label>
    </>
  );
}
