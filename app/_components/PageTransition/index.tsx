"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./index.module.css";

type Props = {
  children: React.ReactNode;
  animationType?: "fade" | "slide" | "curtain";
  duration?: number;
  onlyFirstLoad?: boolean; // 初回読み込み時のみアニメーション
};

export default function PageTransition({
  children,
  animationType = "fade",
  duration = 500,
  onlyFirstLoad = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(true); // 初回は true
  const [displayChildren, setDisplayChildren] = useState(children);
  const [hasLoaded, setHasLoaded] = useState(false); // 初回読み込み完了フラグ
  const pathname = usePathname();

  useEffect(() => {
    // 初回読み込み時のアニメーション
    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsLoading(false);
        setHasLoaded(true); // 初回読み込み完了をマーク
      }, duration);

      return () => clearTimeout(timer);
    } else if (onlyFirstLoad) {
      // 初回読み込み後はアニメーションなしで即座に更新
      setDisplayChildren(children);
      return;
    } else {
      // 通常のページ遷移アニメーション
      setIsLoading(true);

      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsLoading(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [pathname, children, duration, hasLoaded, onlyFirstLoad]);

  // 初回読み込み後でonlyFirstLoadが有効な場合、アニメーションなしで表示
  if (hasLoaded && onlyFirstLoad) {
    return <div className={styles.content}>{children}</div>;
  }

  return (
    <div className={styles.pageTransition}>
      {/* ローディングオーバーレイ */}
      <div
        className={`${styles.loadingOverlay} ${styles[animationType]} ${
          isLoading ? styles.active : ""
        }`}
      >
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div
        className={`${styles.content} ${
          isLoading ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {displayChildren}
      </div>
    </div>
  );
}
