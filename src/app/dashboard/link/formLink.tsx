"use client";

import { FullLink } from "@/app/types/prismaType";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { useLinks } from "./useLinks";

const initialLinkData: FullLink = {
  id: "",
  title: "",
  page: "",
  href: "",
  inNav: false,
  order: 0,
  projetId: null,
};

export default function FormLink() {
  const { datas } = useLinks();
  const { formState, setFormState } = useFormulaire();

  const data = datas.find((data) => data.id === formState.idSelect);
  const [newForm, setNewForm] = useState(
    formState.isUpdate && data ? data : initialLinkData
  );

  const [inNavToggle, setInNavToggle] = useState<boolean>(newForm.inNav);
  const [lengthNavLinks, setLengthNavLinks] = useState(0);

  useEffect(() => {
    if (newForm.inNav !== inNavToggle) {
      setInNavToggle(newForm.inNav);
    }
    setLengthNavLinks(datas.filter((data) => data.inNav).length + 1);
  }, [datas, newForm.inNav, inNavToggle]);

  useEffect(() => {
    if (formState.isReset) {
      setNewForm(initialLinkData);
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
      <h2 className="h2-form">Lien de navigation</h2>
      <input type="text" name="id" defaultValue={newForm.id} />
      <label
        htmlFor="inNav"
        className="label-form flex-row items-center justify-between gap-2 py-2 px-6 border border-foreground rounded-lg"
      >
        Afficher dans la navigation
        <Switch
          id="inNav"
          name="inNav"
          checked={newForm.inNav}
          onCheckedChange={(checked) => {
            setNewForm((prevForm) => ({
              ...prevForm,
              inNav: checked,
            }));
          }}
        />
      </label>
      <label htmlFor="order" className="label-form">
        Ordre
        <input
          type="number"
          name="order"
          id="order"
          placeholder="Enter order"
          value={
            newForm.order ||
            (inNavToggle
              ? lengthNavLinks
              : datas.length - (lengthNavLinks - 1) + 1)
          }
          onChange={handleChange}
        />
      </label>
      <label htmlFor="page" className="label-form">
        Page
        <input
          type="page"
          name="page"
          id="page"
          placeholder="Enter page"
          value={newForm.page || ""}
          onChange={handleChange}
        />
      </label>
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
      <label htmlFor="href" className="label-form">
        Href
        <input
          type="href"
          name="href"
          id="href"
          placeholder="Enter href"
          value={newForm.href || ""}
          onChange={(e) => handleChange(e)}
        />
      </label>
    </>
  );
}
