"use client";

import React, { useState, useEffect } from "react";
import styles from "./index.module.css";

interface Props {
  showThreshold?: number; // スクロール位置の閾値（デフォルト: 300px）
  className?: string;
  smooth?: boolean; // スムーズスクロールの有無
}

export default function ScrollToTopButton({
  showThreshold = 300,
  className = "",
  smooth = true,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // スクロールイベントリスナー
    const handleScroll = () => {
      toggleVisibility();
    };

    // 初期状態をチェック
    toggleVisibility();

    // イベントリスナー追加
    window.addEventListener("scroll", handleScroll);

    // クリーンアップ
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showThreshold]);

  const scrollToTop = () => {
    setIsScrolling(true);

    if (smooth) {
      // スムーズスクロール
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // スクロール完了を検知
      const checkScroll = () => {
        if (window.scrollY === 0) {
          setIsScrolling(false);
        } else {
          requestAnimationFrame(checkScroll);
        }
      };
      requestAnimationFrame(checkScroll);
    } else {
      // 瞬間移動
      window.scrollTo(0, 0);
      setIsScrolling(false);
    }
  };

  return (
    <button
      className={`
        ${styles.scrollToTop} 
        ${isVisible ? styles.visible : styles.hidden}
        ${isScrolling ? styles.scrolling : ""}
        ${className}
      `}
      onClick={scrollToTop}
      aria-label="ページトップへ戻る"
      type="button"
    >
      {/* 上向き矢印アイコン */}
      <svg
        className={styles.icon}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 4L4 12H8V20H16V12H20L12 4Z" fill="currentColor" />
      </svg>

      {/* またはテキスト表示 */}
      <span className={styles.text}>TOP</span>
    </button>
  );
}
