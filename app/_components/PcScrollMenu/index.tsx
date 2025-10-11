"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

export default function PCScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // SSR対策
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 400);
  }, []);

  // スムーズスクロール関数
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // メニューアイテムクリック時の処理
  const handleMenuItemClick = useCallback(
    (href: string) => {
      // メニューを閉じる
      handleCloseMenu();

      // 少し遅延してからナビゲーションとスクロール
      setTimeout(() => {
        router.push(href);

        // ナビゲーション後にスクロールを先頭に
        setTimeout(() => {
          scrollToTop();
        }, 100);
      }, 200);
    },
    [handleCloseMenu, router, scrollToTop]
  );

  // PC判定のみ（スクロール処理を削除）
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      // PC判定のみ実行
      const isPC = window.innerWidth > 768;
      if (!isPC && isOpen) {
        // モバイルに変更された場合はメニューを閉じる
        handleCloseMenu();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isMounted, handleCloseMenu]);

  const toggleMenu = () => {
    if (isClosing) return;
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    handleCloseMenu();
  };

  // マウント前では何も表示しない
  if (!isMounted) {
    return null;
  }

  // PC判定（マウント後のみ）
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* ハンバーガーボタン - 常に表示 */}
      <button
        className={cx(styles.hamburgerButton, styles.visible)}
        onClick={toggleMenu}
        aria-label="メニュー"
      >
        <div className={cx(styles.hamburgerIcon, isOpen && styles.open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* スライドアウトメニュー */}
      <nav
        className={cx(
          styles.slideMenu,
          isOpen && styles.open,
          isClosing && styles.fadeOut
        )}
      >
        <div className={styles.menuHeader}>
          <h3>メニュー</h3>
          <button
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="メニューを閉じる"
          >
            ×
          </button>
        </div>

        <ul className={styles.menuItems}>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/")}
            >
              TOP
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/news")}
            >
              ニュース
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/services")}
            >
              サービス一覧
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/blog")}
            >
              ブログ
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/members")}
            >
              会社概要
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/contact")}
            >
              お問合せ
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={() => handleMenuItemClick("/reservation")}
            >
              セミナー予約
            </button>
          </li>
        </ul>
      </nav>

      {/* オーバーレイ */}
      {(isOpen || isClosing) && (
        <div
          className={cx(styles.overlay, isClosing && styles.fadeOut)}
          onClick={closeMenu}
        />
      )}
    </>
  );
}
