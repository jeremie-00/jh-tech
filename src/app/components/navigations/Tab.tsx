import { CustomBtn } from "@/app/components/buttons/customButtons";
import { useIsMobile } from "@/app/hooks/useMobile";
import { TabButtons } from "../../pages/StructureDatas";

export default function Tab({
  buttons,
  activeIndex,
  setActiveIndex,
}: {
  buttons: TabButtons[];
  activeIndex: number;
  setActiveIndex: (number: number) => void;
}) {
  const isMobile = useIsMobile();

  const getButtonClass = (index: number, length: number) => {
    if (length >= 4) return "justify-center";
    if (index === 0) return "justify-start";
    if (index === length - 1) return "justify-end";
    return "justify-center";
  };

  return (
    <nav className="relative bg-secondary custom-shadow-inner rounded-md p-2">
      <ul className="flex max-md:flex-col">
        {buttons
          .sort((a, b) => a.order - b.order)
          .map((btn, index) => (
            <li
              key={btn.text}
              className="relative w-full font-semibold font-title tracking-widest"
            >
              <CustomBtn
                theme={"tabs"}
                className={
                  isMobile
                    ? "justify-start"
                    : getButtonClass(index, buttons.length)
                }
                size={isMobile ? "md" : "lg"}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <span className={isMobile ? "" : "px-6"}>{btn.text}</span>
                <span className="sr-only">{btn.text}</span>
              </CustomBtn>
            </li>
          ))}
      </ul>
    </nav>
  );
}
