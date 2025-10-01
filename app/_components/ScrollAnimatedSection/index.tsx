"use client";

import React from "react";
import { useScrollAnimation } from "@/app/_hooks/useScrollAnimation";
import styles from "./index.module.css";

type AnimationType =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleUp";

type Props = {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // アニメーション遅延（ミリ秒）
  duration?: number; // アニメーション時間（ミリ秒）
  threshold?: number;
  className?: string;
};

export default function ScrollAnimatedSection({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
}: Props) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`${styles.animatedSection} ${styles[animation]} ${
        isVisible ? styles.visible : ""
      } ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </section>
  );
}
