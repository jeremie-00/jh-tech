import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: "var(--font-title)",
        body: "var(--font-body)",
      },
      aspectRatio: {
        slider: "2.12",
        imgCardProjet: "1.25",
      },
      rotate: { "negative-3": "-3deg" },
      backgroundImage: {
        "linear-custom":
          "linear-gradient(to top, transparent, hsl(var(--section-bg)) 15%, hsl(var(--section-bg)) 70%, transparent)",
        "image-svg": "url('/Hexagon.svg')",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        ring: "hsl(var(--ring))",

        transition: "hsl(var(--transition-bg))",
        section: "hsl(var(--section-bg))",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        /* OLD PORTFOLIO */
        ".form": {
          "@apply relative w-full h-full flex flex-col bg-background gap-12 p-6 shadow-custom rounded-xl":
            {},
        },
        ".label-form": {
          "@apply flex flex-col gap-2": {},
        },
        ".section": {
          "@apply relative w-full h-full flex py-14 px-6 md:px-20": {},
        },
        ".container": {
          "@apply w-full h-full flex flex-col items-center justify-center max-w-[1440px] w-full h-full md:gap-24 gap-12":
            {},
        },
        ".content": {
          "@apply flex flex-col items-center justify-center md:px-6 md:gap-20 gap-8":
            {},
        },
        ".h1": {
          "@apply w-full gradiant-title text-center size-title lg:text-[5rem]":
            {},
        },
        ".h2": {
          "@apply w-full gradiant-title text-center size-title": {},
        },
        ".h2-form": {
          "@apply text-xl text-primary font-semibold mb-2 text-center": {},
        },
        ".h2-legal": {
          "@apply text-xl text-primary font-semibold mb-2": {},
        },
        ".p": {
          "@apply md:px-10 px-0 leading-loose text-center font-medium lg:text-[2rem] md:text-[1.75rem] sm:text-[1.5rem] text-[1.25rem]":
            {},
        },
        /*  input: {
          "@apply w-full h-full p-2 bg-white/80 text-black shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out":
            {},
        }, */
        /* textarea: {
          "@apply w-full h-full p-2 bg-white/80 text-black shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out":
            {},
        }, */
        select: {
          "@apply w-full h-full p-2 bg-white/80 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out":
            {},
        },
        ".button": {
          "@apply flex items-center justify-center gap-2 rounded-lg shadow-md transition-all duration-300 ease-in-out":
            {},
        },
        ".badge": {
          "@apply flex items-center justify-center text-[0.75rem] gap-2 px-2 py-1 rounded-md shadow-md transition-all duration-300 ease-in-out":
            {},
        },
        ".card": {
          "@apply w-full flex flex-col items-center justify-center p-6 gap-6 rounded-lg transition-all duration-300 ease-in-out":
            {},
        },
        ".gradiant-title": {
          "@apply bg-gradient-to-l from-primary from-20% to-foreground bg-clip-text text-transparent font-extrabold":
            {},
        },
        ".size-title": {
          "@apply md:text-[4rem] sm:text-[3rem] text-[2.5rem]": {},
        },
        ".banner": {
          "@apply bg-card py-6 w-full shadow-custom overflow-hidden": {},
        },
        ".shadow-custom": {
          "@apply shadow-lg dark:shadow-md dark:shadow-primary/40": {},
        },
        ".error": { "@apply text-red-500 text-sm p-8": {} },
        ".dialog-overlay": {
          "@apply fixed top-0 left-0 right-0 bottom-0 m-auto w-fit h-fit bg-background rounded-xl shadow-custom p-12 z-50":
            {},
        },
        ".dialog": {
          "@apply w-full h-full flex flex-col items-center justify-center gap-4":
            {},
        },
        ".modal": {
          "@apply absolute top-0 left-0 w-full h-full flex items-center justify-center gap-4 backdrop-blur-sm rounded-lg z-50":
            {},
        },

        /* New port folio  */
        ".custom-button": {
          "@apply flex items-center justify-center transition-all duration-300 ease-in-out":
            {},
        },
        ".custom-card": {
          "@apply flex rounded-lg transition-all duration-300 ease-in-out": {},
        },
        ".custom-overlay-container": {
          "@apply absolute z-40 inset-0 w-full scrollbar transition-opacity duration-500 overflow-x-hidden":
            {},
        },
        ".custom-grid": {
          "@apply grid lg:grid-cols-2 grid-cols-1 gap-8 pt-8 pb-24 px-8": {},
        },
        ".custom-flex-wrap": {
          "@apply flex flex-wrap items-center justify-center gap-4 pt-8 pb-24 px-8":
            {},
        },
        ".custom-shadow-inner": {
          "@apply shadow-inner shadow-gray-300 dark:shadow-gray-900": {},
        },
        ".custom-blob": {
          "@apply blob absolute bottom-0 left-[-2rem] w-[120%] h-[60%] bg-primary border-2 border-foreground shadow-inner shadow-gray-900":
            {},
        },
        ".custom-form": {
          "@apply relative w-full h-full flex flex-col gap-6": {},
        },
        ".custom-input": {
          "@apply w-full h-full p-2 bg-input text-black shadow-md rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 ease-in-out":
            {},
        },
      });

      addUtilities({
        /* New port folio  */
        ".clip-custom": {
          clipPath:
            "polygon(100% 0, 100% 49%, 100% 100%, 25% 100%, 50% 50%, 25% 0)",
        },
        ".clip-custom1": {
          clipPath:
            "polygon(24.5% 0, 49.5% 50%, 24.5% 100%, 25% 100%, 50% 50%, 25% 0)",
        },
        ".blob": {
          borderRadius: "50% 40% 60% 30% / 40% 50% 30% 60%",
        },
        /* OLD PORTFOLIO */
        ".clip-triangle": {
          clipPath: "polygon(20% 0%, 0% 0%, 0% 50%)",
        },
      });
    }),
  ],
} satisfies Config;
