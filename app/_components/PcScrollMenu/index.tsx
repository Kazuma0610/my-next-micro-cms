"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

// カスタムフック：PC判定とマウント状態
const useClientSide = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkDevice = () => {
      setIsPC(window.innerWidth > 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { isMounted, isPC };
};

export default function PCScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const { isMounted, isPC } = useClientSide();
  const router = useRouter();

  const handleCloseMenu = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);

      // 非表示状態の場合は要素も削除
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 100) {
        setTimeout(() => {
          setShouldRender(false);
        }, 100);
      }
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

  useEffect(() => {
    if (!isMounted || !isPC) {
      // PC以外または未マウントの場合は状態リセット
      setIsVisible(false);
      setIsOpen(false);
      setShouldRender(false);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 100;

      if (shouldShow && !isVisible) {
        setIsVisible(true);
        setShouldRender(true);
      } else if (!shouldShow && isVisible) {
        setIsVisible(false);

        if (isOpen) {
          handleCloseMenu();
        } else {
          setTimeout(() => {
            setShouldRender(false);
          }, 500);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, isVisible, isMounted, isPC, handleCloseMenu]);

  const toggleMenu = () => {
    if (isClosing) return;
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    handleCloseMenu();
  };

  // 表示条件をチェック
  if (!isMounted || !isPC || !shouldRender) {
    return null;
  }

  return (
    <>
      <button
        className={cx(
          styles.hamburgerButton,
          isVisible && styles.visible,
          !isVisible && styles.fadeOut
        )}
        onClick={toggleMenu}
        aria-label="メニュー"
      >
        <div className={cx(styles.hamburgerIcon, isOpen && styles.open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

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

      {(isOpen || isClosing) && (
        <div
          className={cx(styles.overlay, isClosing && styles.fadeOut)}
          onClick={closeMenu}
        />
      )}
    </>
  );
}
