"use client";
import { NotationType } from "@/app/types/prismaType";
import React, { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import RenderPagesName from "../stateManagement/renderPagesName";
import { useNotation } from "./useNotation";

const initialNotationData: NotationType = {
  id: "",
  page: "",
  order: 0,
  textNotation: "",
  text: "",
  type: "",
};

export default function FormNotations() {
  const pages = RenderPagesName();
  const { datas } = useNotation();
  const { formState, setFormState } = useFormulaire();

  const data = datas.find((data) => data.id === formState.idSelect);
  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialNotationData
  );

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialNotationData);
      setFormState((prev) => ({
        ...prev,
        isReset: false,
      }));
    }
  }, [formState.isReset, setFormState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setNewForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      <h2 className="h2-form">Texte avec Notation</h2>
      <input type="hidden" name="id" value={newForm.id} />
      <label htmlFor="page" className="label-form">
        Sélectioner la page
        <select
          name="page"
          id="page"
          value={newForm.page}
          onChange={handleChange}
        >
          {pages.map((page) => (
            <option key={page.id} value={page.page}>
              {page.title}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="type" className="label-form">
        Sélection du type de notation
        <select
          name="type"
          id="type"
          value={newForm.type || ""}
          onChange={handleChange}
        >
          <option value="underline">Underline</option>
          <option value="highlight">Highlight</option>
          <option value="box">Box</option>
          <option value="circle">Circle</option>
        </select>
      </label>

      <label htmlFor="order" className="label-form">
        Ordre
        <input
          type="number"
          name="order"
          id="order"
          placeholder="Enter order"
          value={newForm.order ? newForm.order : datas.length + 1}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="textNotation" className="label-form">
        Texte Notation
        <input
          type="textNotation"
          name="textNotation"
          id="textNotation"
          placeholder="Enter text notation"
          value={newForm.textNotation || ""}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="text" className="label-form">
        Texte
        <input
          type="text"
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
