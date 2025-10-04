"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const toggleHam = () => {
    setOpen(!isOpen);
  };

  // デバイス判定
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // PCの場合はメニューを強制的に閉じる
      if (!mobile) {
        setOpen(false);
        setIsMenuVisible(false);
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
      <nav className={cx(styles.nav, isOpen && styles.open)}>
        <ul className={styles.items}>
          <li>
            <Link onClick={toggleHam} href="/">
              TOP
            </Link>
          </li>
          <li>
            <Link onClick={toggleHam} href="/news">
              ニュース
            </Link>
          </li>
          <li>
            <Link onClick={toggleHam} href="/blog">
              ブログ
            </Link>
          </li>
          <li>
            <Link onClick={toggleHam} href="/members">
              会社役員
            </Link>
          </li>
          <li>
            <Link onClick={toggleHam} href="/contact">
              お問合せ
            </Link>
          </li>
          <li>
            <Link onClick={toggleHam} href="/reservation">
              セミナー予約
            </Link>
          </li>
        </ul>
      </nav>

      {/* ハンバーガーメニューボタン - モバイルのみ */}
      {isMenuVisible && (
        <button
          className={cx(styles.button, styles.visible)}
          onClick={toggleHam}
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
