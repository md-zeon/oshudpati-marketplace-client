"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PageSection({
  children,
  className = "",
  delay = 0,
}: PageSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
