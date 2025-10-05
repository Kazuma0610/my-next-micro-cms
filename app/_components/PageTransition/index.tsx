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
// 前回のパスを記録（戻り遷移の判定用）
let previousPathname = "";
// サイト内ナビゲーションフラグ
let isSiteNavigation = false;

export default function PageTransition({
  children,
  animationType = "fade",
  duration = 4500,
  onlyFirstLoad = true,
}: Props) {
  const pathname = usePathname();

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
      };
    }
    // それ以外は通常表示
    return {
      overlayVisible: false,
      overlayPhase: "fadeOut" as "show" | "fadeOut",
      screenLoading: false,
      contentVisible: true,
      mainContentReady: true,
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
    console.log("🔄 PageTransition effect:", {
      pathname,
      previousPathname,
      hasShownInitialAnimation,
      isInitialLoadInProgress,
      isSiteNavigation,
    });

    // 真の初回訪問判定（ブラウザで直接TOPページにアクセス）
    const isRealFirstVisit =
      !hasShownInitialAnimation &&
      pathname === "/" &&
      !previousPathname &&
      !isSiteNavigation;

    // 他のページからTOPページに戻る場合を判定
    const isReturningToTop =
      pathname === "/" && previousPathname && previousPathname !== "/";

    // サイト内の通常遷移（TOPページ以外への移動）
    const isNormalSiteNavigation =
      pathname !== "/" || (pathname === "/" && isSiteNavigation);

    if (isRealFirstVisit) {
      console.log("🆕 Real first visit to TOP - showing full animation");

      // 初期状態を確実に設定（既に初期状態で設定済みだが念のため）
      setOverlayVisible(true);
      setOverlayPhase("show");
      setScreenLoading(false);
      setContentVisible(false);
      setMainContentReady(false);

      // ローディング開始フラグを設定
      isInitialLoadInProgress = true;

      // 即座にメニューボタンを非表示にする
      const hideMenuEvent = new CustomEvent("hideMenuButton");
      window.dispatchEvent(hideMenuEvent);
      console.log("Hide menu event dispatched IMMEDIATELY");

      // アニメーションシーケンス
      const fadeOutTimer = setTimeout(() => {
        setOverlayPhase("fadeOut");
        console.log("Overlay fade out started");
      }, duration * 0.5);

      const overlayEndTimer = setTimeout(() => {
        setOverlayVisible(false);
        setScreenLoading(true);
        console.log("Screen loading started");
      }, duration * 0.6);

      const screenLoadingEndTimer = setTimeout(() => {
        setScreenLoading(false);
        setContentVisible(true);
        console.log("Screen loading ended, content becoming visible");
      }, duration * 0.8);

      const mainContentTimer = setTimeout(() => {
        setMainContentReady(true);
        console.log("Main content ready for fade-in");
      }, duration * 0.85);

      const menuShowTimer = setTimeout(() => {
        const showMenuEvent = new CustomEvent("showMenuButton");
        window.dispatchEvent(showMenuEvent);
        console.log("Show menu event dispatched - PERFECT TIMING");
      }, duration * 0.88);

      const completeTimer = setTimeout(() => {
        hasShownInitialAnimation = true;
        isInitialLoadInProgress = false;
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
    } else if (isReturningToTop) {
      console.log("🔙 Returning to TOP from another page - instant display");

      // 他のページからTOPに戻る場合は即座に表示
      const showMenuEvent = new CustomEvent("showMenuButton");
      window.dispatchEvent(showMenuEvent);
      console.log("Show menu event dispatched (returning to top)");

      // 即座に表示状態に設定
      setContentVisible(true);
      setMainContentReady(true);
      setOverlayVisible(false);
      setScreenLoading(false);

      hasShownInitialAnimation = true;
      isInitialLoadInProgress = false;
    } else if (isNormalSiteNavigation || hasShownInitialAnimation) {
      console.log("🔄 Normal site navigation - instant display");

      // 通常のサイト内遷移は即座に表示
      const showMenuEvent = new CustomEvent("showMenuButton");
      window.dispatchEvent(showMenuEvent);
      console.log("Show menu event dispatched (normal navigation)");

      // 即座に表示状態に設定
      setContentVisible(true);
      setMainContentReady(true);
      setOverlayVisible(false);
      setScreenLoading(false);

      // 一度でもサイト内を遷移したらフラグを立てる
      isSiteNavigation = true;
      hasShownInitialAnimation = true;
      isInitialLoadInProgress = false;
    }

    // 前回のパスを記録
    previousPathname = pathname;
  }, [pathname, duration]);

  // 初回アニメーション完了後かつonlyFirstLoadがtrueの場合は通常表示
  if (hasShownInitialAnimation && onlyFirstLoad) {
    return <>{children}</>;
  }

  return (
    <div className={styles.pageTransition}>
      {/* 初回オーバーレイ（真の初回訪問時のみ表示） */}
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

      {/* 画面全体ローディング（初回のみ） */}
      {screenLoading && (
        <div className={styles.screenLoadingOverlay}>
          <div className={styles.screenLoadingContent}>
            <div className={styles.screenLoadingSpinner}></div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
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
