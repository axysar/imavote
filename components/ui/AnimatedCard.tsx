"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  interactive?: boolean;
}

export function AnimatedCard({
  children,
  delay = 0,
  interactive = false,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={interactive ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl p-6",
        interactive && "transition-shadow hover:border-white/10 hover:shadow-lg hover:shadow-indigo-500/5",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
