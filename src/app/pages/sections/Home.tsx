import {
  CustomBtn,
  IconName,
  ThemeName,
} from "@/app/components/buttons/customButtons";
import { useRotation } from "@/app/contexts/RotationContext";
import { capitalize } from "@/app/utils/capitalize";
import ToolTip from "../../components/ToolTip";
import BackgroundLayout from "../../components/ui/BackgroundLayout";
import ImageSection from "../../components/ui/ImageSection";
import TextsSection from "../../components/ui/TextsSections";
import { buttonsData } from "../StructureDatas";

export const Buttons = ({ isGrouped }: { isGrouped: boolean }) => {
  const buttons = buttonsData.filter(
    (btn) => !btn.inNav && btn.isGrouped === isGrouped
  );
  const { activeSection, setActiveSection } = useRotation();
  return (
    <>
      {buttons.map(({ href, text, title, download, target, theme }, index) => {
        const iconName = title.toLowerCase() as IconName;
        const textHover = isGrouped && capitalize(title);
        return (
          <span key={index} className={`relative group`}>
            <CustomBtn
              href={href !== "#contact" ? href : ""}
              target={target}
              download={download ? text : undefined}
              theme={theme as ThemeName}
              size="lg"
              iconName={iconName}
              onClick={
                href !== "#contact"
                  ? () => {}
                  : () =>
                      setActiveSection({
                        idx: 4,
                        prevIdx: activeSection.idx,
                        section: "contact",
                      })
              }
            >
              <span className="text-[1rem]">{text}</span>
              <span className="sr-only">{text}</span>
            </CustomBtn>
            {textHover && <ToolTip txt={textHover} />}
          </span>
        );
      })}
    </>
  );
};

export function Home() {
  return (
    <div
      className={`relative w-full h-full flex max-md:flex-col items-center justify-start md:overflow-hidden`} //xl:gap-64 md:gap-24 p-4  gap-12
    >
      <div
        className="relative w-1/2 flex flex-col md:items-end max-md:order-2 z-20 max-md:w-full max-md:justify-items-center md:pl-12" // p-6 w-full h-full items-start justify-center pl-24 z-20
      >
        <TextsSection propsKey="home" />
      </div>
      <BackgroundLayout className="right-0" layoutKey="layout_home" />
      <ImageSection propsKey="home" />
    </div>
  );
}
