import { ThemeProvider } from "@/app/components/providers/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Phudu, Poppins } from "next/font/google";
import { Suspense } from "react";
import { LoginButton } from "./components/buttons/loginButton";
import { ToggleTheme } from "./components/buttons/toggleTheme";
import { QueryProvider } from "./components/providers/queryProvider";
import SessionWrapper from "./components/providers/sessionWrapper";
import { ToastNotification } from "./components/toast";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingScreen from "./components/ui/LoadingScreen";
import MatrixEffect from "./components/ui/MatrixEffect";
import "./globals.css";

const roboto = Poppins({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-body",
});

const phudu = Phudu({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Portfolio de Jérémie Hérault | Développeur Web Full-Stack",
  description:
    "Explorez le portfolio de Jérémie Hérault, développeur web spécialisé en React, Next.js et TailwindCSS. Découvrez des projets modernes, interactifs et performants.",
  keywords: [
    "jh-tech",
    "portfolio",
    "dev web",
    "dev full-stack",
    "développeur",
    "développeur web",
    "portfolio développeur",
    "React",
    "Next.js",
    "TailwindCSS",
    "Jérémie Hérault",
    "Hérault Jérémie",
    "applications web",
    "développement front-end",
    "développement back-end",
  ],

  authors: [{ name: "Jérémie Hérault" }],
  robots: "index, follow",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },

  manifest: "/site.webmanifest",
  other: {
    "Content-Language": "fr-FR",
    "geo.region": "FR-60",
    "geo.placename": "Neuilly-en-Thelle",
    "geo.position": "49.2273;2.2486",
    ICBM: "49.2273, 2.2486",
  },
  openGraph: {
    title: "Portfolio de Jérémie Hérault | Développeur Web Full-Stack",
    description:
      "Découvrez les réalisations de Jérémie Hérault, développeur web passionné.",
    url: "https://jh-tech.fr/",
    siteName: "Portfolio de Jérémie Hérault",
    images: [
      {
        url: "https:/jh-tech.fr/profilepicPc.jpg",
        width: 1200,
        height: 630,
        alt: "Aperçu du portfolio de Jérémie Hérault",
      },
    ],
    type: "website",
  },
  metadataBase: new URL("https://jh-tech.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${phudu.variable} ${roboto.variable} antialiased bg-[#000]`}
      >
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <main>
                <MatrixEffect />
                <ToggleTheme />
                <LoginButton />
                <ErrorBoundary>
                  <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
                </ErrorBoundary>
                <SpeedInsights />
              </main>
              <ToastNotification />
            </QueryProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
