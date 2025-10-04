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
// メニュー制御のグローバルフラグを追加
let isInitialLoadInProgress = false;

export default function PageTransition({
  children,
  animationType = "fade",
  duration = 4500,
  onlyFirstLoad = true,
}: Props) {
  const [overlayVisible, setOverlayVisible] = useState(
    !hasShownInitialAnimation
  );
  const [overlayPhase, setOverlayPhase] = useState<"show" | "fadeOut">(
    !hasShownInitialAnimation ? "show" : "fadeOut"
  );

  // 新しい状態を追加
  const [screenLoading, setScreenLoading] = useState(false); // 画面全体ローディング
  const [contentVisible, setContentVisible] = useState(
    hasShownInitialAnimation
  );
  const [mainContentReady, setMainContentReady] = useState(
    hasShownInitialAnimation
  ); // メイン全体表示フラグ

  const pathname = usePathname();

  useEffect(() => {
    // 初回読み込み時のみアニメーション実行
    if (!hasShownInitialAnimation && pathname === "/") {
      // ローディング開始フラグを設定
      isInitialLoadInProgress = true;

      // 即座にメニューボタンを非表示にする
      const hideMenuEvent = new CustomEvent("hideMenuButton");
      window.dispatchEvent(hideMenuEvent);
      console.log("Hide menu event dispatched IMMEDIATELY");

      // フェーズ1: オーバーレイ表示期間 (0 ~ duration*0.5)
      const overlayDisplayTime = duration * 0.5;

      // フェーズ2: オーバーレイフェードアウト開始 (duration*0.5)
      const fadeOutTimer = setTimeout(() => {
        setOverlayPhase("fadeOut");
        console.log("Overlay fade out started");
      }, overlayDisplayTime);

      // フェーズ3: オーバーレイ終了 → 画面全体ローディング開始 (duration*0.6)
      const overlayEndTimer = setTimeout(() => {
        setOverlayVisible(false);
        setScreenLoading(true);
        console.log("Screen loading started");
      }, duration * 0.6);

      // フェーズ4: 画面全体ローディング終了 → メインコンテンツ表示準備 (duration*0.8)
      const screenLoadingEndTimer = setTimeout(() => {
        setScreenLoading(false);
        setContentVisible(true);
        console.log("Screen loading ended, content becoming visible");
      }, duration * 0.8);

      // フェーズ5: メイン全体フェードイン開始 (duration*0.85)
      const mainContentTimer = setTimeout(() => {
        setMainContentReady(true);
        console.log("Main content ready for fade-in");
      }, duration * 0.85);

      // フェーズ5.5: メニューボタン表示（メインコンテンツ表示後） (duration*0.88)
      const menuShowTimer = setTimeout(() => {
        const showMenuEvent = new CustomEvent("showMenuButton");
        window.dispatchEvent(showMenuEvent);
        console.log("Show menu event dispatched - PERFECT TIMING");
      }, duration * 0.88);

      // フェーズ6: 完全終了 (duration*1.2)
      const completeTimer = setTimeout(() => {
        hasShownInitialAnimation = true;
        isInitialLoadInProgress = false; // ローディング終了
        console.log("All animations completed");
      }, duration * 1.2);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(overlayEndTimer);
        clearTimeout(screenLoadingEndTimer);
        clearTimeout(mainContentTimer);
        clearTimeout(menuShowTimer);
        clearTimeout(completeTimer);
      };
    } else if (hasShownInitialAnimation || pathname !== "/") {
      // 初回以降またはTOPページ以外は即座に表示
      const showMenuEvent = new CustomEvent("showMenuButton");
      window.dispatchEvent(showMenuEvent);
      console.log("Show menu event dispatched (non-first load)");

      setContentVisible(true);
      setMainContentReady(true);
      setOverlayVisible(false);
      setScreenLoading(false);
    }
  }, [pathname, duration]);

  // 初回読み込み完了後は通常表示
  if (hasShownInitialAnimation && onlyFirstLoad) {
    return <>{children}</>;
  }

  return (
    <div className={styles.pageTransition}>
      {/* 初回オーバーレイ */}
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
            <Image
              src="/demo_logo.png"
              alt="Loading..."
              className={`${styles.loadingLogo} ${styles.dynamic}`}
              width={300}
              height={300}
            />
          </div>
        </div>
      )}

      {/* 画面全体ローディング（オーバーレイ終了後） */}
      {screenLoading && (
        <div className={styles.screenLoadingOverlay}>
          <div className={styles.screenLoadingContent}>
            <div className={styles.screenLoadingSpinner}></div>
            {/*<p className={styles.screenLoadingText}>コンテンツを準備中...</p>*/}
          </div>
        </div>
      )}

      {/* メインコンテンツ - contentVisible が true の時のみ表示 */}
      {contentVisible && (
        <div
          className={`
            ${styles.mainContent}
            ${
              mainContentReady
                ? styles.mainContentFadeIn
                : styles.mainContentHidden
            }
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// グローバルフラグをエクスポート
export { isInitialLoadInProgress };
