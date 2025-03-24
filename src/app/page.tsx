"use client";
import { DeleteModal } from "./components/modalDelete/deleteDialogModal";
import NavBarre from "./components/navigations/NavBarre";
import { ModalProvider } from "./contexts/modalDeleteContext";
import { RotationProvider } from "./contexts/RotationContext";
import { Scene } from "./pages/Scene";

export default function Page() {
  return (
    <RotationProvider>
      <ModalProvider>
        <NavBarre />
        <Scene />
        <DeleteModal />
      </ModalProvider>
    </RotationProvider>
  );
}
