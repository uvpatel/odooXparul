"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? current;
      const direction = current - previous;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto z-[5000] items-center justify-center",
          className
        )}
      >
        <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/80 px-1.5 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md sm:gap-2 dark:border-white/10 dark:bg-black/50">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {navItems.map((navItem, idx: number) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:px-3.5 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden whitespace-nowrap sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          <div className="mx-0.5 h-5 w-px bg-neutral-200 dark:bg-white/10" />

          <button className="relative rounded-full bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 sm:px-4 dark:bg-white dark:text-black dark:hover:bg-neutral-100 dark:hover:shadow-white/20">
            <span>Login</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
