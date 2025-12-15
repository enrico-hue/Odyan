// app/components/rd/useTimelineAnimations.ts
import { Variants } from "framer-motion";

export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

export const barVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0.9 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.2 },
  },
  hover: {
    scaleY: 1.05,
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.3), 0 16px 24px rgba(0,0,0,0.35)",
    transition: { duration: 0.15 },
  },
};

export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};
