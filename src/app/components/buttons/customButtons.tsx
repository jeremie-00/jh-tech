import clsx from "clsx";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";
import { BsArrowUp } from "react-icons/bs";
import { CgToolbox } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { IoIosSend, IoMdClose } from "react-icons/io";
import {
  IoAddSharp,
  IoGlobeSharp,
  IoLogoGithub,
  IoTrash,
} from "react-icons/io5";
import {
  MdMailOutline,
  MdOutlineDisabledByDefault,
  MdOutlineTextSnippet,
} from "react-icons/md";
import { RiUser3Line } from "react-icons/ri";
import { RxDownload } from "react-icons/rx";
export type IconName =
  | "github"
  | "download"
  | "home"
  | "about"
  | "work"
  | "resume"
  | "contact"
  | "globe"
  | "arrow"
  | "plane"
  | "edit"
  | "close"
  | "delete"
  | "validate"
  | "add";

export type ThemeName =
  | "default"
  | "primary"
  | "submit"
  | "primary_hover"
  | "icon_primary"
  | "outline"
  | "delete"
  | "close"
  | "navbarre"
  | "icon"
  | "sticky"
  | "round"
  | "navigate"
  | "underline"
  | "tabs"
  | "footer";

type SizeName = "sm" | "md" | "lg" | "xl" | "xxl";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  theme?: ThemeName;
  size?: SizeName;
  target?: boolean;
  download?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  isActive?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  iconName?: IconName;
  afterOrigine?: "left" | "right" | "center";
}

const ICON_MAP = {
  github: IoLogoGithub,
  contact: MdMailOutline,
  download: RxDownload,
  home: BiHomeAlt,
  about: RiUser3Line,
  work: CgToolbox,
  resume: MdOutlineTextSnippet,
  globe: IoGlobeSharp,
  arrow: BsArrowUp,
  plane: IoIosSend,
  edit: FiEdit,
  close: IoMdClose,
  delete: IoTrash,
  validate: FaCheck,
  add: IoAddSharp,
};

const THEME_STYLES = {
  default:
    "bg-background text-foreground border border-border hover:border-border/40 px-4 py-2 rounded-full",
  primary:
    "bg-primary text-foreground scale-100 hover:scale-105 px-4 py-2 rounded-full shadow",
  submit:
    "flex gap-2 items-center justify-center bg-primary text-foreground scale-100 hover:scale-105 px-4 py-2 rounded-lg shadow-md",
  primary_hover:
    "bg-gradient-to-b from-primary/90 to-primary text-foreground scale-100 hover:scale-105 px-4 py-2 rounded-full shadow-lg hover:border-foreground/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20",
  icon_primary:
    "bg-primary text-foreground hover:bg-primary/90 w-fit p-2 rounded-md shadow-md",
  outline:
    "rounded-md shadow-md p-2 bg-background/80 hover:bg-primary/20 hover:text-primary",
  delete:
    "bg-destructive shadow-md text-foreground hover:bg-destructive/90 w-fit p-2 rounded-md shadow-md",
  close: "p-2 hover:text-primary",
  navbarre: (isActive: boolean) =>
    `w-fit hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`,
  icon: "p-2 hover:border-primary border-foreground/40",
  sticky:
    "fixed z-10 bg-background p-2 border border-foreground/40 rounded-full shadow-md hover:border-primary hover:text-primary",
  round:
    "text-primary rounded-full px-2 py-2 shadow border-2 border-border hover:border-transparent hover:text-foreground hover:bg-primary",
  navigate:
    "bg-card border border-border p-2 rounded-lg shadow hover:border-primary ",
  underline: (isActive: boolean) =>
    `w-full hover:text-primary after:content-[''] after:transition-scale after:duration-300 after:absolute after:bottom-[-10] after:left-0 after:w-full after:h-[5px] after:z-[20] after:scale-0
   ${isActive && "after:scale-100 text-primary after:bg-primary after:z-[20]"}`,

  tabs: (isActive: boolean) =>
    `w-full py-1 px-2 rounded-md shadow ${
      isActive
        ? "bg-background text-foreground"
        : "text-muted-foreground shadow-none"
    }`,

  footer:
    "text-sm border-none shadow-none w-fit text-foreground py-1 hover:text-primary after:content-[''] after:bg-primary after:transition-scale after:duration-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:origin-center after:scale-0 hover:after:scale-100",
};

const SIZE_CLASSES = {
  sm: "text-[1rem]",
  md: "text-[1.25rem]",
  lg: "text-[1.5rem]",
  xl: "text-[1.75rem]",
  xxl: "text-[2rem]",
};

export const CustomBtn = (props: ButtonProps) => {
  const {
    children,
    theme = "default",
    className,
    size = "sm",
    target = false,
    href,
    download,
    onClick,
    ariaLabel,
    isActive = false,
    type = "button",
    disabled = false,
    iconName,
  } = props;

  const baseClass = "custom-button";

  const getThemeClasses = () => {
    const themeStyle = THEME_STYLES[theme];
    return typeof themeStyle === "function"
      ? themeStyle(isActive)
      : themeStyle || "";
  };

  const getSizeClasses = () => SIZE_CLASSES[size] || "";

  const IconComponent = iconName
    ? ICON_MAP[iconName] || MdOutlineDisabledByDefault
    : null;

  const commonProps = {
    className: clsx(
      baseClass,
      getThemeClasses(),
      getSizeClasses(),
      className,
      disabled && "opacity-40 cursor-not-allowed hover:border-border"
    ),
    "aria-label": ariaLabel,
  };

  if (download) {
    return (
      <a {...commonProps} href={href} download={download}>
        {IconComponent && <IconComponent />}
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        {...commonProps}
        href={href || "#"}
        target={target ? "_blank" : undefined}
        onClick={onClick}
        rel="noopener noreferrer"
      >
        {IconComponent && <IconComponent />}
        {children}
      </Link>
    );
  }

  return (
    <button {...commonProps} onClick={onClick} type={type} disabled={disabled}>
      {IconComponent && <IconComponent />}
      {children}
    </button>
  );
};
