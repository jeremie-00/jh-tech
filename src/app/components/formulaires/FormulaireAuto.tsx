import { CustomBtn } from "@/app/components/buttons/customButtons";
import { ImageManager } from "@/app/components/imageManager";

import { Result } from "@/app/types/globalType";
import { capitalize } from "@/app/utils/capitalize";
import Form from "next/form";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UseMutationResult } from "react-query";
import { useDeleteModal } from "../../contexts/modalDeleteContext";
import { CustomSubmit } from "../buttons/CustomSubmit";
import { CustomCard } from "../cards/CustomCard";

interface BaseForm {
  id?: string;
  section?: string;
  date?: string;
  name?: string | null;
  heading?: string;
  text?: string;
  desc?: string | null;
  poste?: string;
  entreprise?: string;
  formation?: string;
  organisme?: string;
  competence?: string;
  url?: string;
  alt?: string;
  order?: number;
}

interface FormProps<T extends BaseForm> {
  titleForm?: string;
  formData: T;
  setIsEditing: (isEditing: boolean) => void;
  mutateAdd: UseMutationResult<Result<T>, unknown, FormData, unknown>;
  mutateRemove: UseMutationResult<Result<T>, unknown, { id: string }, unknown>;
  mutateUpdate: UseMutationResult<Result<T>, unknown, FormData, unknown>;
}

export const FormulaireAuto = <T extends BaseForm>({
  titleForm = "Formulaire",
  formData,
  setIsEditing,
  mutateAdd,
  mutateRemove,
  mutateUpdate,
}: FormProps<T>) => {
  const { openModal } = useDeleteModal();
  const [newForm, setNewForm] = useState(formData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSubmit = (formData: FormData) => {
    /* for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */
    //debug
    if (newForm.id) {
      mutateUpdate.mutate(formData);
    } else {
      mutateAdd.mutate(formData);
    }
    handleClose();
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

  function renderInput(newForm: BaseForm) {
    /* Object.entries(newForm).map(([key, value]) => console.log(key, value)); */
    //debug
    return (
      <div className="flex flex-col gap-4">
        {Object.entries(newForm).map(([key, value]) => {
          //console.log(typeof value);
          if (typeof value === "number" || key === "order") {
            return (
              <input
                key={key}
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-fit custom-input shadow-none order-1"
                aria-label={key}
                placeholder={capitalize(key)}
              />
            );
          }

          if (key === "text") {
            return (
              <textarea
                key={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="h-32 custom-input shadow-none order-4"
                maxLength={500}
                aria-label={key}
                placeholder={capitalize(key)}
                style={{ resize: "none" }}
              />
            );
          }

          if (key === "url") {
            return (
              <div
                key={key}
                className="w-full h-fit flex max-md:flex-col justify-items-center gap-8 order-2"
              >
                <ImageManager
                  imgSize="w-[50px] h-[50px]"
                  url={value}
                  alt={newForm.alt !== undefined ? newForm.alt : ""}
                  isAltInput={titleForm !== "Compétence"}
                  handleChange={handleChange}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            );
          }

          if (key === "alt" || value === null) {
            return null;
          }

          return (
            <input
              key={key}
              type={key === "id" ? "hidden" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              className="custom-input shadow-none order-3"
              aria-label={key}
              placeholder={capitalize(key)}
            />
          );
        })}
      </div>
    );
  }

  if (!formData)
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
            className={`w-full h-full flex flex-col gap-6 px-4 py-6`}
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
              {newForm.name && !newForm.section
                ? titleForm + " " + newForm.name
                : titleForm}
            </span>
            {renderInput(newForm)}

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
                      handleDelete(newForm.id !== undefined ? newForm.id : "")
                  )
                }
                disabled={!newForm.id}
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
