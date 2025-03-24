"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type RotationState = {
  idx: number;
  prevIdx: number;
  section: string;
};

type RotationContextType = {
  activeSection: RotationState;
  setActiveSection: Dispatch<SetStateAction<RotationState>>;
};

const RotationContext = createContext<RotationContextType | undefined>(
  undefined
);

export function RotationProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState({
    idx: 0,
    prevIdx: 0,
    section: "home",
  });

  return (
    <RotationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </RotationContext.Provider>
  );
}

export function useRotation() {
  const context = useContext(RotationContext);
  if (!context) {
    throw new Error("useRotation doit être utilisé dans un RotationProvider");
  }
  return context;
}
