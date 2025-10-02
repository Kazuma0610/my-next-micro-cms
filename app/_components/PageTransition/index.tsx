"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./index.module.css";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
  animationType?: "fade" | "slide" | "curtain";
  duration?: number;
  onlyFirstLoad?: boolean;
};

// グローバルな初回読み込みフラグ
let hasShownInitialAnimation = false;

export default function PageTransition({
  children,
  animationType = "fade",
  duration = 1500,
  onlyFirstLoad = true,
}: Props) {
  const [overlayVisible, setOverlayVisible] = useState(
    !hasShownInitialAnimation
  );
  const [overlayPhase, setOverlayPhase] = useState<"show" | "fadeOut">(
    !hasShownInitialAnimation ? "show" : "fadeOut"
  );
  const [contentVisible, setContentVisible] = useState(
    hasShownInitialAnimation
  );
  const pathname = usePathname();

  useEffect(() => {
    if (!hasShownInitialAnimation && pathname === "/") {
      const overlayDisplayTime = duration * 0.6;

      // フェーズ1: ロゴフェードアウト
      const logoFadeTimer = setTimeout(() => {
        const logoElement = document.querySelector(`.${styles.loadingLogo}`);
        if (logoElement) {
          logoElement.classList.add("fadeOut");
        }
      }, duration * 0.5);

      // フェーズ2: オーバーレイフェードアウト（段階的）
      const overlayFadeTimer = setTimeout(() => {
        setOverlayPhase("fadeOut");

        // 段階1: 0.3まで下げる
        const overlayElement = document.querySelector(
          `.${styles.overlayFadeOut}`
        );
        if (overlayElement) {
          overlayElement.classList.add("fadeStage1");

          // 段階2: 完全フェードアウト
          setTimeout(() => {
            overlayElement.classList.remove("fadeStage1");
            overlayElement.classList.add("fadeStage2");
          }, 560); // 0.56秒後
        }
      }, overlayDisplayTime);

      // フェーズ3: メインコンテンツフェードイン
      const contentFadeInTimer = setTimeout(() => {
        setContentVisible(true);
      }, duration * 0.7);

      // フェーズ4: 完全終了
      const completeTimer = setTimeout(() => {
        setOverlayVisible(false);
        hasShownInitialAnimation = true;
      }, duration);

      return () => {
        clearTimeout(logoFadeTimer);
        clearTimeout(overlayFadeTimer);
        clearTimeout(contentFadeInTimer);
        clearTimeout(completeTimer);
      };
    } else if (hasShownInitialAnimation || pathname !== "/") {
      setContentVisible(true);
      setOverlayVisible(false);
    }
  }, [pathname, duration]);

  // 初回読み込み完了後は通常表示
  if (hasShownInitialAnimation && onlyFirstLoad) {
    return <>{children}</>;
  }

  return (
    <div className={styles.pageTransition}>
      {/* ローディングオーバーレイ */}
      {overlayVisible && (
        <div
          className={`
            ${styles.loadingOverlay} 
            ${styles[animationType]}
            ${
              overlayPhase === "fadeOut"
                ? styles.overlayFadeOut
                : styles.overlayVisible
            }
          `}
        >
          <div className={styles.loadingContent}>
            {/* <div className={styles.spinner}></div> */}
            {/* <p className={styles.loadingText}>読み込み中...</p> */}
            <Image
              src="/demo_logo.png"
              alt="Loading..."
              className={`${styles.loadingLogo} ${styles.dynamic}`}
              width={400}
              height={400}
            />
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div
        className={`
          ${styles.content} 
          ${contentVisible ? styles.contentFadeIn : styles.contentHidden}
        `}
      >
        {children}
      </div>
    </div>
  );
}
