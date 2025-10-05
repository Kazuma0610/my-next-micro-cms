"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

export default function PCScrollMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
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

      // スクロール位置もチェックして要素を削除するか判定
      if (!isVisible) {
        setTimeout(() => {
          setShouldRender(false);
        }, 100);
      }
    }, 400);
  }, [isVisible]);

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
    if (!isMounted) return;

    const handleScroll = () => {
      // PC判定
      const isPC = window.innerWidth > 768;
      if (!isPC) {
        setIsVisible(false);
        setIsOpen(false);
        setShouldRender(false);
        return;
      }

      const scrollY = window.scrollY;
      const shouldShow = scrollY > 100;

      if (shouldShow && !isVisible) {
        // 表示開始
        console.log("PCScrollMenu: Showing");
        setIsVisible(true);
        setShouldRender(true);
      } else if (!shouldShow && isVisible) {
        // 非表示開始（フェードアウト）
        console.log("PCScrollMenu: Hiding");
        setIsVisible(false);

        if (isOpen) {
          // メニューが開いている場合はクローズアニメーション
          handleCloseMenu();
        } else {
          // ハンバーガーボタンのフェードアウト
          setTimeout(() => {
            setShouldRender(false);
          }, 500); // フェードアウト時間
        }
      }
    };

    const handleResize = () => {
      handleScroll();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isVisible, isMounted, handleCloseMenu]);

  const toggleMenu = () => {
    if (isClosing) return;
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    handleCloseMenu();
  };

  // マウント前またはPC以外では何も表示しない
  if (!isMounted) {
    return null;
  }

  // PC判定（マウント後のみ）
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    return null;
  }

  // 要素をレンダリングしない場合
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {/* ハンバーガーボタン */}
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
    </>
  );
}
