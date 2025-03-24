export type TabButtons = {
  text: string;
  order: number;
};
export const buttonsTabs = {
  work: [
    {
      text: "Projets",
      order: 1,
    },
    {
      text: "Services",
      order: 2,
    },
  ],
  resume: [
    {
      text: "Expérience",
      order: 1,
    },
    {
      text: "Compétences",
      order: 2,
    },
    {
      text: "Éducation",
      order: 3,
    },
  ],
};

export const links = [
  { href: "#home", inNav: true, order: 1, title: "Accueil", section: "home" },
  {
    href: "#about",
    inNav: true,
    order: 2,
    title: "À propos",
    section: "about",
  },
  {
    href: "#work",
    inNav: true,
    order: 3,
    title: "Réalisations",
    section: "work",
  },
  {
    href: "#resume",
    inNav: true,
    order: 4,
    title: "Parcours",
    section: "resume",
  },
  {
    href: "#contact",
    inNav: true,
    order: 5,
    title: "Contact",
    section: "contact",
  },
];

export const buttonsData = [
  {
    inNav: false,
    isGrouped: false,
    href: "../CV-Jérémie-Hérault.pdf",
    text: "Télécharger mon CV",
    title: "download",
    download: true,
    theme: "primary_hover",
  },
  {
    inNav: false,
    isGrouped: true,
    href: "#contact",
    title: "contact",
    download: false,
    theme: "round",
  },
  {
    inNav: false,
    isGrouped: true,
    href: "https://github.com/jeremie-00",
    title: "github",
    download: false,
    target: true,
    theme: "round",
  },
];

export const works = [
  {
    id: "1",
    name: "Kasa",
    desc: "Créer le front-end d'une application de location immobilière avec Vite, React, et React Router, en respectant les maquettes fournies et en exploitant des données simulées.",
    order: 1,
    skills: [
      { name: "React", url: "", alt: "", order: 1, id: "" },
      { name: "Sass", url: "", alt: "", order: 1, id: "" },
      { name: "Vite", url: "", alt: "", order: 1, id: "" },
      { name: "Figma", url: "", alt: "", order: 1, id: "" },
      { name: "Node.js", url: "", alt: "", order: 1, id: "" },
      { name: "JavaScript", url: "", alt: "", order: 1, id: "" },
      { name: "Github", url: "", alt: "", order: 1, id: "" },
    ],
    links: [
      {
        id: "1",
        name: "Site web",
        href: "https://jeremie-00.github.io/kasa/",
        workId: null,
      },
      {
        id: "2",
        name: "Github repository",
        href: "https://github.com/jeremie-00/kasa.git",
        workId: null,
      },
    ],

    url: "/kasa/kasa.webp",
    alt: "Image de couverture du projet",
  },
  {
    id: "2",
    name: "OhMyFood",
    desc: "Développer une interface mobile-first pour une start-up, en utilisant Sass, des animations CSS et Git/GitHub pour la gestion de version. L'intégration se fera à partir des maquettes et du prototype Figma pour créer un site réactif.",
    order: 2,
    skills: [
      { name: "HTML", url: "", alt: "", order: 1, id: "" },
      { name: "Sass", url: "", alt: "", order: 1, id: "" },
      { name: "CSS", url: "", alt: "", order: 1, id: "" },
      { name: "Figma", url: "", alt: "", order: 1, id: "" },
      { name: "Github", url: "", alt: "", order: 1, id: "" },
    ],
    links: [
      {
        id: "1",
        name: "Site web",
        href: "https://jeremie-00.github.io/OC-OhMyFood_P4/",
        workId: null,
      },
      {
        id: "2",
        name: "Github repository",
        href: "https://github.com/jeremie-00/OC-OhMyFood_P4.git",
        workId: null,
      },
    ],

    url: "/ohmyfood/ohmyfood.webp",
    alt: "Image de couverture du projet",
  },
  {
    id: "3",
    name: "Booki",
    desc: "Créez une page d'accueil responsive pour une agence de voyage en HTML et CSS. L'intégration se fera à partir des maquettes Figma (mobile, tablette, desktop), intégrez et stylisez les composants pour respecter le design.",
    order: 3,
    skills: [
      { name: "HTML", url: "", alt: "", order: 1, id: "" },
      { name: "CSS", url: "", alt: "", order: 1, id: "" },
      { name: "Figma", url: "", alt: "", order: 1, id: "" },
    ],
    links: [
      {
        id: "1",
        name: "Site web",
        href: "https://jeremie-00.github.io/booki/",
        workId: null,
      },
      {
        id: "2",
        name: "Github repository",
        href: "https://github.com/jeremie-00/booki.git",
        workId: null,
      },
    ],

    url: "/booki/booki-medias-1.png",
    alt: "Image de couverture du projet",
  },
];
