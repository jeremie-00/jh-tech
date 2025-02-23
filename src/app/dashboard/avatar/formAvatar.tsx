"use client";
import { ImageManager, imageStateDefault } from "@/app/components/imageManager";
import { FullAvatar } from "@/app/types/prismaType";
import React, { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import RenderPagesName from "../stateManagement/renderPagesName";
import { useAvatar } from "./useAvatar";

export const initialAvatarData: FullAvatar = {
  id: "",
  text: "",
  page: "",
  recto: imageStateDefault,
  verso: imageStateDefault,
  arrowBullPosition: "middleTopLeft",
};

export function FormAvatar() {
  const { datas } = useAvatar();
  const pages = RenderPagesName().filter((page) => page.inNav);
  const { formState, setFormState } = useFormulaire();
  const data = datas.find((data) => data.id === formState.idSelect);
  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialAvatarData
  );

  const [imagePreview, setImagePreview] = React.useState<{
    recto: string | null;
    verso: string | null;
  }>({ recto: null, verso: null });

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialAvatarData);
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

  const optionPosition = [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "middleTopLeft",
    "middleTopRight",
    "middleBottomLeft",
    "middleBottomRight",
  ];

  return (
    <>
      <h2 className="h2-form">Avatar</h2>
      <input type="hidden" name="id" defaultValue={newForm.id} />

      <input
        type="hidden"
        name="idImageRecto"
        defaultValue={imagePreview.recto ? "" : newForm.recto?.id}
      />
      <input
        type="hidden"
        name="urlImageRecto"
        defaultValue={newForm.recto?.url}
      />
      <ImageManager
        name="recto"
        url={newForm?.recto?.url || ""}
        imagePreview={imagePreview.recto}
        setImagePreview={(recto) =>
          setImagePreview((prev) => ({ ...prev, recto }))
        }
      />
      <input
        type="hidden"
        name="idImageVerso"
        defaultValue={imagePreview.verso ? "" : newForm.verso?.id}
      />
      <input
        type="hidden"
        name="urlImageVerso"
        defaultValue={newForm.verso?.url}
      />
      <ImageManager
        name="verso"
        url={newForm?.verso?.url || ""}
        imagePreview={imagePreview.verso}
        setImagePreview={(verso) =>
          setImagePreview((prev) => ({ ...prev, verso }))
        }
      />

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

      <label htmlFor="text" className="label-form">
        Texte
        <textarea
          name="text"
          id="text"
          placeholder="Enter text"
          value={newForm.text ? newForm.text : ""}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="arrowBullPosition" className="label-form">
        Position de la fleche de la bulle
        <select
          name="arrowBullPosition"
          id="arrowBullPosition"
          value={newForm.arrowBullPosition}
          onChange={handleChange}
        >
          {optionPosition.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
