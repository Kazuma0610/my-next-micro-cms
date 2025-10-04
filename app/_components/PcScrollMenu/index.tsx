"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import cx from "classnames";
import styles from "./index.module.css";

export default function PCScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 100;

      setIsVisible(shouldShow);

      // スクロール上部に戻ったらメニューを閉じる
      if (!shouldShow && isOpen) {
        setIsOpen(false);
      }
    };

    // 初回チェック
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // PCでない場合は何も表示しない
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      {/* ハンバーガーボタン */}
      {isVisible && (
        <button
          className={cx(styles.hamburgerButton, isVisible && styles.visible)}
          onClick={toggleMenu}
          aria-label="メニュー"
        >
          <div className={cx(styles.hamburgerIcon, isOpen && styles.open)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {/* スライドアウトメニュー */}
      {isVisible && (
        <nav className={cx(styles.slideMenu, isOpen && styles.open)}>
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
              <Link href="/" onClick={closeMenu}>
                TOP
              </Link>
            </li>
            <li>
              <Link href="/news" onClick={closeMenu}>
                ニュース
              </Link>
            </li>
            <li>
              <Link href="/blog" onClick={closeMenu}>
                ブログ
              </Link>
            </li>
            <li>
              <Link href="/members" onClick={closeMenu}>
                会社役員
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMenu}>
                お問合せ
              </Link>
            </li>
            <li>
              <Link href="/reservation" onClick={closeMenu}>
                セミナー予約
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* オーバーレイ */}
      {isVisible && isOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}
    </>
  );
}
