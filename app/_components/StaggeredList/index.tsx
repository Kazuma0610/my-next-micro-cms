"use client";

import React from "react";
import { useScrollAnimation } from "@/app/_hooks/useScrollAnimation";
import styles from "./index.module.css";

type Props = {
  children: React.ReactNode[];
  staggerDelay?: number; // 各要素の遅延時間
  animation?: "fadeInUp" | "fadeInLeft" | "fadeInRight";
};

export default function StaggeredList({
  children,
  staggerDelay = 100,
  animation = "fadeInUp",
}: Props) {
  // threshold値を0.01に下げて検知しやすくする
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.01, // より検知しやすく
    rootMargin: "50px", // 50px早めに検知
  });

  // childrenを配列として扱う
  const childrenArray = React.Children.toArray(children);

  console.log("StaggeredList isVisible:", isVisible); // デバッグ用
  console.log("Children count:", childrenArray.length); // デバッグ用

  return (
    <div ref={ref} className={styles.staggeredContainer}>
      {childrenArray.map((child, index) => (
        <div
          key={index} // keyを追加
          className={`${styles.staggeredItem} ${styles[animation]} ${
            isVisible ? styles.visible : ""
          }`}
          style={{
            animationDelay: `${index * staggerDelay}ms`,
            animationDuration: "0.8s",
            animationFillMode: "both",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
