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
    // 初回読み込み時のみアニメーション実行
    if (!hasShownInitialAnimation && pathname === "/") {
      // フェーズ1: オーバーレイ表示期間 (0 ~ duration*0.6)
      const overlayDisplayTime = duration * 0.6;

      // フェーズ2: オーバーレイフェードアウト開始 (duration*0.6)
      const fadeOutTimer = setTimeout(() => {
        setOverlayPhase("fadeOut");
      }, overlayDisplayTime);

      // フェーズ3: メインコンテンツフェードイン開始 (duration*0.7)
      const contentFadeInTimer = setTimeout(() => {
        setContentVisible(true);
      }, duration * 0.7);

      // フェーズ4: オーバーレイ完全削除 (duration*1.0)
      const completeTimer = setTimeout(() => {
        setOverlayVisible(false);
        hasShownInitialAnimation = true;
      }, duration);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(contentFadeInTimer);
        clearTimeout(completeTimer);
      };
    } else if (hasShownInitialAnimation || pathname !== "/") {
      // 初回以降またはTOPページ以外は即座に表示
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
