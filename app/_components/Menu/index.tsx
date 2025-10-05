"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleHam = () => {
    if (isClosing) return; // アニメーション中は操作無効
    setOpen(!isOpen);
  };

  // メニューを閉じる処理（アニメーション付き）
  const handleCloseMenu = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300); // アニメーション時間
  }, []);

  const closeMenu = () => {
    handleCloseMenu();
  };

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

  // スクロール制御
  useEffect(() => {
    if (isOpen) {
      // メニューが開いている時はボディのスクロールを無効化
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // メニューが閉じている時はスクロールを復活
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // スクロール位置を復元
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // クリーンアップ
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // デバイス判定
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // PCの場合はメニューを強制的に閉じる
      if (!mobile) {
        setOpen(false);
        setIsMenuVisible(false);
        setIsClosing(false);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // モバイル時のメニュー制御（既存ロジック）
  useEffect(() => {
    // PCの場合は何もしない
    if (!isMobile) return;

    if (pathname !== "/") {
      console.log("Non-top page (mobile) - showing menu immediately");
      setIsMenuVisible(true);
      return;
    }

    console.log("TOP page detected (mobile) - waiting for events");
    setIsMenuVisible(false);

    const handleHideMenu = () => {
      console.log("Received hide menu event - hiding menu");
      setIsMenuVisible(false);
    };

    const handleShowMenu = () => {
      console.log("Received show menu event - showing menu NOW");
      setIsMenuVisible(true);
    };

    window.addEventListener("hideMenuButton", handleHideMenu);
    window.addEventListener("showMenuButton", handleShowMenu);

    console.log("Menu event listeners registered for TOP page");

    const fallbackTimer = setTimeout(() => {
      console.log("FALLBACK: Menu button shown by fallback timer");
      setIsMenuVisible(true);
    }, 8000);

    return () => {
      console.log("Cleaning up menu event listeners");
      window.removeEventListener("hideMenuButton", handleHideMenu);
      window.removeEventListener("showMenuButton", handleShowMenu);
      clearTimeout(fallbackTimer);
    };
  }, [pathname, isMobile]);

  // モバイル以外では何も表示しない
  if (!isMobile) {
    return null;
  }

  return (
    <div>
      {/* 通常ナビゲーション */}
      <nav
        className={cx(
          styles.nav,
          isOpen && styles.open,
          isClosing && styles.fadeOut
        )}
      >
        {/* メニューヘッダー */}
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

        <ul className={styles.items}>
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
              会社役員
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

      {/* ハンバーガーメニューボタン - モバイルのみ */}
      {isMenuVisible && (
        <button
          className={cx(styles.button, styles.visible)}
          onClick={toggleHam}
          aria-label="メニュー"
        >
          <div className={cx(styles.openbtn, isOpen && styles.open)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}
    </div>
  );
}
