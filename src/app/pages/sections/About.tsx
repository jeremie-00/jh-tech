import BackgroundLayout from "../../components/ui/BackgroundLayout";
import ImageSection from "../../components/ui/ImageSection";
import TextsSection from "../../components/ui/TextsSections";

export function About() {
  return (
    <div
      className={`relative w-full h-full flex max-md:flex-col items-center md:justify-end md:overflow-hidden`}
    >
      <BackgroundLayout
        className="left-0 scale-x-[-1]"
        layoutKey="layout_about"
      />
      <ImageSection propsKey="about" />

      <div
        className="relative w-1/2 flex flex-col md:items-start max-md:order-1 z-20 max-md:w-full max-md:justify-center md:pr-12" // p-6 w-full h-full items-start justify-center pl-24 z-20
      >
        <TextsSection propsKey="about" />
      </div>
    </div>
  );
}
