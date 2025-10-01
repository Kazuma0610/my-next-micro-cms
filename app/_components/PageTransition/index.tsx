"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./index.module.css";

type AnimationType = "fade" | "slide" | "curtain" | "circle";

type Props = {
  children: React.ReactNode;
  animationType?: AnimationType;
  duration?: number;
};

export default function AdvancedPageTransition({
  children,
  animationType = "fade",
  duration = 600,
}: Props) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setDisplayChildren(children);
    }, duration / 2);

    const completeTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [pathname, children, duration]);

  return (
    <div className={styles.pageContainer}>
      {/* アニメーション用オーバーレイ */}
      <div
        className={`${styles.overlay} ${styles[animationType]} ${
          isTransitioning ? styles.active : ""
        }`}
        style={{ animationDuration: `${duration}ms` }}
      >
        {animationType === "circle" && <div className={styles.circle} />}
        {animationType === "curtain" && (
          <>
            <div className={styles.curtainLeft} />
            <div className={styles.curtainRight} />
          </>
        )}
        <div className={styles.transitionContent}>
          <div className={styles.logo}>Loading...</div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        className={`${styles.content} ${
          isTransitioning ? styles.contentHidden : styles.contentVisible
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
}
