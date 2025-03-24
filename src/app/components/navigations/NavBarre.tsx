import { CustomBtn, IconName } from "@/app/components/buttons/customButtons";
import { useRotation } from "@/app/contexts/RotationContext";
import { motion } from "framer-motion";
import { links } from "../../pages/StructureDatas";
import ToolTip from "../ToolTip";

export default function NavBarre() {
  const { activeSection, setActiveSection } = useRotation();
  const datas = links;
  const linksNav = datas.filter(
    ({ inNav, href }) => inNav && href.startsWith("#")
  );

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-[1rem] left-1/2 z-50 -translate-x-1/2 max-[450px]:w-full max-[450px]:bottom-0 transition-all duration-300 ease-in-out "
    >
      <ul className="flex items-center justify-around gap-8 px-10 py-3 bg-accent custom-shadow-inner rounded-full backdrop-blur-sm max-[450px]:w-full max-[450px]:rounded-none max-[450px]:gap-4">
        {linksNav.map(({ section, title }, idx) => {
          const iconName = section.toLowerCase() as IconName;
          return (
            <li key={title} className="relative group">
              <CustomBtn
                //href={href}
                theme="navbarre"
                size="lg"
                isActive={activeSection.section === section}
                ariaLabel={`Aller à la page ${title}`}
                onClick={() =>
                  setActiveSection({ idx, prevIdx: activeSection.idx, section })
                }
                iconName={iconName}
              >
                <span className="sr-only">{title}</span>
              </CustomBtn>
              <ToolTip txt={title} />
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
