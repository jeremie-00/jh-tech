"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Tab from "../../components/navigations/Tab";

import { MyEducation } from "@/app/components/cards/MyEducations";
import { MyExperiences } from "@/app/components/cards/MyExperiences";
import { MySkills } from "@/app/components/cards/MySkills";
import { buttonsTabs } from "../StructureDatas";

const articles = [
  {
    key: "experience",
    Component: MyExperiences,
  },
  {
    key: "skills",
    Component: MySkills,
  },
  {
    key: "education",
    Component: MyEducation,
  },
];

export function Resume() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="w-full min-h-full flex flex-col gap-6 p-6 pb-9">
      <Tab
        buttons={buttonsTabs.resume}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <div
        {...handlers}
        className="relative w-full flex-grow bg-secondary custom-shadow-inner rounded-lg overflow-hidden"
      >
        {articles.map((article, index) => {
          const { Component } = article;

          const translatex = (prev: number) => {
            if (index === 0) {
              return "-100%";
            } else if (index === 1) {
              if (prev > 1) return "-100%";
              return "100%";
            }
            return "100%";
          };

          return (
            <motion.article
              key={article.key}
              className={`custom-overlay-container`}
              initial={{ opacity: 0, x: "100%" }}
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                x: activeIndex === index ? 0 : translatex(activeIndex),
              }}
              transition={{ duration: 0.3 }}
            >
              <Component />
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
