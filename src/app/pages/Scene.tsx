"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useRotation } from "../contexts/RotationContext";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Home } from "./sections/Home";
import { Resume } from "./sections/Resume";
import { Work } from "./sections/Work";

const rotateFaces = [
  "rotateY(0deg) translateZ(0vw) translateX(0vw)",
  "rotateY(90deg) translateZ(50vw) translateX(50vw)",
  "rotateY(-180deg) translateZ(100vw) translateX(0vw)",
  "rotateY(-90deg) translateZ(50vw) translateX(-50vw)",
  "rotateY(-360deg) translateZ(0vw) translateX(0vw)",
];

export function Scene() {
  const { activeSection } = useRotation();
  const [transitionDuration, setTransitionDuration] = useState(3); // 3s au départ

  useEffect(() => {
    setTimeout(() => {
      setTransitionDuration(0.8);
    }, 3000);
  }, []);

  const orderedFaces = [
    { section: "home", Component: Home },
    { section: "about", Component: About },
    { section: "work", Component: Work },
    { section: "resume", Component: Resume },
    { section: "contact", Component: Contact },
  ];

  return (
    <>
      <div
        id="scene"
        className="w-screen h-screen overflow-clip"
        style={{
          perspective: "1500px",
          perspectiveOrigin: "50%",
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50% -50vw",
          }}
          initial={{ scale: 0, rotateY: -360 }}
          animate={{
            scale: 1,
            rotateY: activeSection.idx * -90,
          }}
          transition={{
            duration: transitionDuration,
            ease: "easeInOut",
          }}
        >
          {orderedFaces.map((face, index) => {
            const { Component } = face;
            return (
              <section
                key={face.section}
                id={face.section}
                className="absolute w-full h-full backface-hidden"
                style={{
                  transform: rotateFaces[index],
                  transitionDelay: (() => {
                    if (
                      activeSection.idx === 0 &&
                      activeSection.prevIdx === orderedFaces.length - 1
                    ) {
                      return "0.5s";
                    }
                    return activeSection.idx === 0 ? "0s" : "0.6s";
                  })(),
                  zIndex: activeSection.idx === index ? 10 : 0,
                }}
              >
                <div
                  className={`relative w-full h-full flex bg-background overflow-x-hidden
                  `} //p-6 pb-9 items-center md:justify-center
                >
                  {/* <h2 className="text-2xl text-primary">{face.section}</h2> */}

                  <Component />
                </div>
              </section>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
