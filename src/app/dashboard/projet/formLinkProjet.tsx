"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/app/components/buttons/buttons";
import { FullProjet } from "@/app/types/prismaType";
import { IoAddCircle, IoTrash } from "react-icons/io5";
import { useLinks } from "../link/useLinks";
import { useFormulaire } from "../stateManagement/formulaireContext";
import { useDeleteModal } from "../stateManagement/modalContext";

export const ProjetLinkForm = ({ newForm }: { newForm: FullProjet }) => {
  const { openModal } = useDeleteModal();
  const { formState } = useFormulaire();
  const { mutateRemove } = useLinks();
  const [links, setLinks] = useState(
    () =>
      newForm.links?.map((link, index) => ({
        id: link.id,
        href: link.href,
        title: link.title,
        projetId: link.projetId || "",
        order: index,
        inNav: false,
        page: `Page-${link.title}`,
      })) || []
  );

  useEffect(() => {
    if (formState.isReset) {
      setLinks([]); // Supprime tous les liens
    }
  }, [formState.isReset]);

  const isAddButtonDisabled = useMemo(() => links.length >= 2, [links]);

  const addLinkField = () => {
    setLinks([
      ...links,
      {
        id: "",
        href: "",
        title: "",
        projetId: "",
        order: 0,
        inNav: false,
        page: "",
      },
    ]);
  };

  const handleDelete = async (id: string, index: number) => {
    mutateRemove.mutate({ id });
    removeLinkField(index);
  };

  const removeLinkField = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

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

  return (
    <div className="flex flex-col">
      <div className="flex gap-8 items-center justify-center mt-6">
        <Button
          type="button"
          theme="outline"
          size="sm"
          onClick={addLinkField}
          disabled={isAddButtonDisabled}
        >
          <IoAddCircle />
          Ajouter un lien
        </Button>
      </div>

      {links.map((link, index) => (
        <div key={index} className="relative flex flex-col my-4 gap-2">
          <label htmlFor={`url-${index}`}>Lien {index + 1}</label>
          <input type="hidden" name="links.id" value={link.id} />
          <input type="hidden" name="links.inNav" value="false" />
          <div className="flex items-center justify-between gap-4 my-2 ">
            <div className="flex flex-col gap-2 flex-1">
              <input
                type="text"
                name="links.url"
                id={`url-${index}`}
                placeholder="URL du lien"
                value={link.href}
                className="w-full"
                onChange={(e) =>
                  handleLinkChange(index, "href", e.target.value)
                }
              />
              <input
                type="text"
                name="links.title"
                placeholder="Title du lien"
                value={link.title}
                onChange={(e) =>
                  handleLinkChange(index, "title", e.target.value)
                }
              />
            </div>

            {link.id ? (
              <Button
                theme="delete"
                size="sm"
                onClick={() =>
                  openModal(
                    "Supprimer cet élément ?",
                    `Cette action est irréversible.`,
                    () => handleDelete(link.id, index)
                  )
                }
                disabled={!link.id}
                ariaLabel="Supprimer"
              >
                <IoTrash size={24} />
              </Button>
            ) : (
              <Button
                theme="delete"
                size="icon"
                onClick={() => removeLinkField(index)}
              >
                <IoTrash size={24} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
