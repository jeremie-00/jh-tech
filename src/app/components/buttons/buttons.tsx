import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  theme?: string;
  size?: string;
  target?: string;
  download?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  isActive?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    theme,
    className,
    size,
    target,
    href,
    download,
    onClick,
    ariaLabel,
    isActive,
  } = props;

  const baseClasse =
    "flex items-center justify-center border-2 border-border hover:border-border/40";
  const themeClasses =
    theme === "primary"
      ? "bg-primary hover:bg-primary/80"
      : theme === "outline"
      ? "hover:bg-primary/20 hover:text-primary"
      : theme === "hover"
      ? "border-none bg-primary hover:scale-105 hover:bg-primary/80"
      : theme === "icon"
      ? "p-2 hover:border-primary"
      : theme === "underline"
      ? "lg:text-[1.25rem] text-[1rem] border-none shadow-none w-fit hover:text-primary after:content-[''] after:bg-primary after:transition-scale after:duration-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:origin-center after:scale-0 "
      : theme === "highlight"
      ? `border-none w-fit text-foreground  py-1 px-2 rounded-md ${
          isActive ? "bg-primary/20" : "hover:bg-primary/20"
        }`
      : "";

  const sizeClasses =
    size === "sm"
      ? "text-[1rem] px-2 py-2"
      : size === "md"
      ? "text-[1.25rem] px-4 py-2"
      : size === "lg"
      ? "text-[1.5rem] px-4 py-2"
      : size === "xl"
      ? "text-[1.75rem] px-4 py-2"
      : size === "xxl"
      ? "text-[2rem] px-4 py-2"
      : "";

  const renderButton = () => {
    return (
      <button
        className={`button ${baseClasse} ${themeClasses} ${sizeClasses} ${className}`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  };

  const renderLink = () => {
    return (
      <Link
        className={`button ${baseClasse} ${themeClasses} ${sizeClasses} ${className}`}
        href={href ? href : "#"}
        target={target}
      >
        {children}
      </Link>
    );
  };

  const renderA = () => {
    return (
      <a
        className={`button ${baseClasse} ${themeClasses} ${sizeClasses} ${className}`}
        href={href}
        download={download}
      >
        {children}
      </a>
    );
  };

  return download ? renderA() : href ? renderLink() : renderButton();
};
