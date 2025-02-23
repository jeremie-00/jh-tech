"use client";
import { ImageManager, imageStateDefault } from "@/app/components/imageManager";
import { FullAbout } from "@/app/types/prismaType";
import { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { useAbout } from "./useAbouts";

export const initialAboutData: FullAbout = {
  id: "",
  text: "",
  order: 0,
  image: imageStateDefault,
};

export function FormAbout() {
  const { datas } = useAbout();
  const { formState, setFormState } = useFormulaire();

  const data = datas.find((data) => data.id === formState.idSelect);

  const [newForm, setNewForm] = useState(() =>
    formState.isUpdate && data ? data : initialAboutData
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!formState.isReset) return;
    setNewForm(initialAboutData);
    setImagePreview(null);
    setFormState((prev) => ({
      ...prev,
      isReset: false,
    }));
  }, [formState, setFormState]);

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
      <h2 className="h2-form">A propos</h2>
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
    </>
  );
}
