"use client";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { CustomBtn } from "./customButtons";

export function ToggleTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <div
        className="h-12 w-12 rounded-lg border border-primary/20"
        aria-label="Basculer entre le thème clair et sombre"
      />
    );
  }

  return (
    <CustomBtn
      className="top-4 right-0 z-10 pl-3 border-r-0 rounded-tr-none rounded-br-none"
      theme="sticky"
      onClick={toggleTheme}
      ariaLabel="Basculer entre le thème clair et sombre"
    >
      {resolvedTheme === "light" ? (
        <IoMoonOutline className="size-[1.5rem]" />
      ) : (
        <IoSunnyOutline className="size-[1.5rem]" />
      )}
    </CustomBtn>
  );
}
