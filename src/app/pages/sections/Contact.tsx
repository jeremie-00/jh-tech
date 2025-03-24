import { FormulaireContact } from "@/app/components/formulaires/FormulaireContact";
import TextsSection from "@/app/components/ui/TextsSections";
import BackgroundLayout from "../../components/ui/BackgroundLayout";
import ImageSection from "../../components/ui/ImageSection";

export function Contact() {
  return (
    <div
      className={`relative w-full h-full flex max-md:flex-col items-center justify-start max-md:pb-24 xl:gap-72 md:gap-24 gap-12 p-4 md:overflow-hidden`}
    >
      <div className="relative w-1/2 flex flex-col md:items-end max-md:order-2 z-20 max-md:w-full max-md:items-center md:pl-12">
        <div>
          <div className="flex flex-col md:items-start z-20 max-md:w-full max-md:items-center">
            <TextsSection propsKey="contact" />
          </div>

          <FormulaireContact />
        </div>
      </div>

      <BackgroundLayout className="right-0" layoutKey="layout_contact" />
      <ImageSection propsKey="contact" />
    </div>
  );
}
