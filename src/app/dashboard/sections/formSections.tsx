"use client";
import { SectionType } from "@/app/types/prismaType";
import React, { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { useSections } from "./useSections";

export const initialSectionData: SectionType = {
  id: "",
  title: "",
  text: "",
  section: "",
};

export default function FormSections() {
  const { datas } = useSections();
  const { formState, setFormState } = useFormulaire();

  const data = datas.find((data) => data.id === formState.idSelect);
  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialSectionData
  );

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialSectionData);
      setFormState((prev) => ({
        ...prev,
        isReset: false,
      }));
    }
  }, [formState.isReset, setFormState]);

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

  return (
    <>
      <h2 className="h2-form">Titre section</h2>
      <input type="hidden" name="id" value={newForm.id} />

      {formState.isUpdate ? (
        <label htmlFor="section" className="label-form">
          Sélectionner la section
          <select
            name="section"
            id="section"
            value={newForm.section}
            onChange={handleChange}
          >
            {datas.map((section) => (
              <option key={section.id} value={section.section}>
                {section.section}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label htmlFor="section" className="label-form">
          Section
          <input
            type="section"
            name="section"
            id="section"
            placeholder="Enter section"
            value={newForm.section || ""}
            onChange={handleChange}
          />
        </label>
      )}

      <label htmlFor="title" className="label-form">
        Titre
        <input
          type="title"
          name="title"
          id="title"
          placeholder="Enter titre"
          value={newForm.title || ""}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="text" className="label-form">
        Texte
        <textarea
          //type="text"
          name="text"
          id="text"
          placeholder="Enter text"
          value={newForm.text || ""}
          onChange={handleChange}
        />
      </label>
    </>
  );
}
