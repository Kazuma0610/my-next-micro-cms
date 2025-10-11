"use client";

import React, { useState, useEffect, useRef } from "react";
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
let isInitialLoadInProgress = false;
let previousPathname = "";
let isSiteNavigation = false;
// 実行中フラグを追加
let isEffectRunning = false;

export default function PageTransition({
  children,
  animationType = "fade",
  duration = 4500,
  onlyFirstLoad = true,
}: Props) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // 初期状態を動的に決定
  const getInitialState = () => {
    // TOPページかつ初回の場合はローディング表示から開始
    if (
      pathname === "/" &&
      !hasShownInitialAnimation &&
      !previousPathname &&
      !isSiteNavigation
    ) {
      return {
        overlayVisible: true,
        overlayPhase: "show" as "show" | "fadeOut",
        screenLoading: false,
        contentVisible: false,
        mainContentReady: false,
        shouldAnimate: true,
      };
    }
    return {
      overlayVisible: false,
      overlayPhase: "fadeOut" as "show" | "fadeOut",
      screenLoading: false,
      contentVisible: true,
      mainContentReady: true,
      shouldAnimate: false,
    };
  };

  const [overlayVisible, setOverlayVisible] = useState(
    () => getInitialState().overlayVisible
  );
  const [overlayPhase, setOverlayPhase] = useState<"show" | "fadeOut">(
    () => getInitialState().overlayPhase
  );
  const [screenLoading, setScreenLoading] = useState(
    () => getInitialState().screenLoading
  );
  const [contentVisible, setContentVisible] = useState(
    () => getInitialState().contentVisible
  );
  const [mainContentReady, setMainContentReady] = useState(
    () => getInitialState().mainContentReady
  );

  useEffect(() => {
    // 重複実行を防ぐ
    if (isEffectRunning) {
      return;
    }

    // 実行中フラグを設定
    isEffectRunning = true;

    // 真の初回訪問判定
    const isRealFirstVisit =
      pathname === "/" &&
      !hasShownInitialAnimation &&
      isFirstRender.current &&
      !isSiteNavigation;

    // 他のページからTOPページに戻る場合を判定
    const isReturningToTop =
      pathname === "/" && previousPathname && previousPathname !== "/";

    // サイト内の通常遷移
    const isNormalSiteNavigation =
      pathname !== "/" ||
      (pathname === "/" && isSiteNavigation) ||
      hasShownInitialAnimation;

    if (isRealFirstVisit) {
      setOverlayVisible(true);
      setOverlayPhase("show");
      setScreenLoading(false);
      setContentVisible(false);
      setMainContentReady(false);
      setShouldAnimate(true);

      isInitialLoadInProgress = true;

      const hideMenuEvent = new CustomEvent("hideMenuButton");
      window.dispatchEvent(hideMenuEvent);

      // アニメーションシーケンス
      const fadeOutTimer = setTimeout(() => {
        setOverlayPhase("fadeOut");
      }, duration * 0.5);

      const overlayEndTimer = setTimeout(() => {
        setOverlayVisible(false);
        setScreenLoading(true);
      }, duration * 0.6);

      const screenLoadingEndTimer = setTimeout(() => {
        setScreenLoading(false);
        setContentVisible(true);
      }, duration * 0.8);

      const mainContentTimer = setTimeout(() => {
        setMainContentReady(true);
      }, duration * 0.85);

      const menuShowTimer = setTimeout(() => {
        const showMenuEvent = new CustomEvent("showMenuButton");
        window.dispatchEvent(showMenuEvent);
      }, duration * 0.88);

      const completeTimer = setTimeout(() => {
        hasShownInitialAnimation = true;
        isInitialLoadInProgress = false;
        isEffectRunning = false; // フラグをリセット
      }, duration * 1.2);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(overlayEndTimer);
        clearTimeout(screenLoadingEndTimer);
        clearTimeout(mainContentTimer);
        clearTimeout(menuShowTimer);
        clearTimeout(completeTimer);
        isEffectRunning = false; // cleanup時もリセット
      };
    } else {
      // メニュー表示（重複チェック付き）
      const showMenuWithDelay = () => {
        setTimeout(() => {
          const showMenuEvent = new CustomEvent("showMenuButton");
          window.dispatchEvent(showMenuEvent);
        }, 100);
      };

      showMenuWithDelay();

      // 即座に表示状態に設定
      setContentVisible(true);
      setMainContentReady(true);
      setShouldAnimate(false);
      setOverlayVisible(false);
      setScreenLoading(false);

      // フラグ更新
      isSiteNavigation = true;
      hasShownInitialAnimation = true;
      isInitialLoadInProgress = false;

      // 実行完了
      setTimeout(() => {
        isEffectRunning = false;
      }, 200);
    }

    // 前回のパスを記録
    previousPathname = pathname;
    isFirstRender.current = false;

    // cleanup
    return () => {
      isEffectRunning = false;
    };
  }, [pathname, duration]);

  // メインコンテンツのクラス名を動的に決定
  const getMainContentClass = () => {
    if (!contentVisible) return styles.mainContentHidden;
    if (!mainContentReady) return styles.mainContentHidden;

    if (shouldAnimate) {
      return styles.mainContentFadeIn;
    } else {
      return styles.mainContentInstant;
    }
  };

  // 初回アニメーション完了後は通常表示
  if (hasShownInitialAnimation && onlyFirstLoad) {
    return <>{children}</>;
  }

  return (
    <div className={styles.pageTransition}>
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

      {screenLoading && (
        <div className={styles.screenLoadingOverlay}>
          <div className={styles.screenLoadingContent}>
            <div className={styles.screenLoadingSpinner}></div>
          </div>
        </div>
      )}

      {contentVisible && (
        <div className={getMainContentClass()}>{children}</div>
      )}
    </div>
  );
}

export { isInitialLoadInProgress };
