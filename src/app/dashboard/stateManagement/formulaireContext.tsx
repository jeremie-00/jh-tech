"use client";

import { Option } from "@/components/ui/multiple-selector";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface FormState {
  isOpen: boolean;
  isUpdate: boolean;
  idSelect: string;
  isReset: boolean;
  isProjet: boolean;
}

interface FormulaireContextProps {
  selectedSkills: Option[];
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
  setSelectedSkills: Dispatch<SetStateAction<Option[]>>;
  openFormulaire: (id?: string) => void;
  closeFormulaire: () => void;
}

const FormulaireContext = createContext<FormulaireContextProps | undefined>(
  undefined
);

export function FormulaireProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formState, setFormState] = useState({
    isOpen: false,
    isUpdate: false,
    idSelect: "",
    isReset: false,
    isProjet: false,
  });

  const [selectedSkills, setSelectedSkills] = useState<Option[]>([]);

  const openFormulaire = (id?: string) => {
    setFormState((prev) => ({
      ...prev,
      isOpen: true,
      isUpdate: Boolean(id),
      idSelect: id || "",
    }));
  };

  const closeFormulaire = () => {
    setSelectedSkills([]);
    setFormState({
      isOpen: false,
      isUpdate: false,
      idSelect: "",
      isReset: false,
      isProjet: false,
    });
  };

  return (
    <FormulaireContext.Provider
      value={{
        selectedSkills,
        formState,
        setFormState,
        setSelectedSkills,
        openFormulaire,
        closeFormulaire,
      }}
    >
      {children}
    </FormulaireContext.Provider>
  );
}

export function useFormulaire() {
  const context = useContext(FormulaireContext);
  if (!context) {
    throw new Error("useFormulaire must be used within a FormulaireProvider");
  }
  return context;
}
