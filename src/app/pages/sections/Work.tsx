"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

import { MyServices } from "@/app/components/cards/MyServices";
import { MyWork } from "@/app/components/cards/MyWork";
import Tab from "../../components/navigations/Tab";
import { buttonsTabs } from "../StructureDatas";

const articles = [
  {
    key: "work",
    Component: MyWork,
  },
  {
    key: "service",
    Component: MyServices,
  },
];

export function Work() {
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
    <div className="w-full min-h-full flex flex-col gap-6  p-6 pb-9">
      <Tab
        buttons={buttonsTabs.work}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <div
        {...handlers}
        className="relative w-full flex-grow bg-secondary custom-shadow-inner rounded-lg overflow-hidden"
      >
        {articles.map((article, index) => {
          const { Component } = article;
          const translatex = () => {
            if (index === 0) {
              return "-100%";
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
                x: activeIndex === index ? 0 : translatex(),
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

/* export const Work = React.memo(function Work() {
  const { data: session } = useSession();

  const articles = session ? articlesAdmin : articlesClient;

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
    <div className="w-full min-h-full flex flex-col gap-6">
      <Tab
        buttons={buttonsTabs.work}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <div
        {...handlers}
        className="relative w-full flex-grow bg-secondary custom-shadow-inner rounded-lg overflow-hidden"
      >
        {articles.map((article, index) => {
          const { Component } = article;
          const translatex = () => {
            if (index === 0) {
              return "-100%";
            }
            return "100%";
          };
          return (
            <motion.article
              key={article.key}
              className={`custom-grid scrollbar`}
              initial={{ opacity: 0, x: "100%" }}
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                x: activeIndex === index ? 0 : translatex(),
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
});
 */
