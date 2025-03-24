"use client";

import { createContext, useContext, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  openModal: (title: string, message: string, onConfirm: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const openModal = (title: string, message: string, onConfirm: () => void) => {
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setMessage("");
    setOnConfirm(null);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, title, message, onConfirm, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useDeleteModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useDeleteModal must be used within a ModalProvider");
  }
  return context;
}
