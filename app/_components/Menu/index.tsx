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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // マウント状態を追加
  const pathname = usePathname();
  const router = useRouter();

  const toggleHam = () => {
    if (isClosing || isProcessing) return;
    setOpen(!isOpen);
  };

  // メニューを閉じる処理（アニメーション付き）
  const handleCloseMenu = useCallback(() => {
    if (isClosing || isProcessing) return;

    setIsProcessing(true);
    setIsClosing(true);

    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      setIsProcessing(false);
    }, 300);
  }, [isClosing, isProcessing]);

  // スムーズスクロール関数
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // メニューアイテムクリック時の処理
  const handleMenuItemClick = useCallback(
    (href: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (isProcessing || isClosing) return;

      // すぐにメニューを閉じる
      setOpen(false);

      // 少し遅延してナビゲーション
      setTimeout(() => {
        router.push(href);
      }, 100);
    },
    [router, isProcessing, isClosing]
  );

  // オーバーレイクリック処理
  const handleOverlayClick = useCallback(() => {
    if (!isProcessing) {
      setOpen(false);
    }
  }, [isProcessing]);

  // スクロール制御
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // マウント処理 - SSR/CSR問題の解決
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // デバイス判定 - より信頼性の高い判定
  useEffect(() => {
    if (!isMounted) return;

    const checkDevice = () => {
      // UserAgentも併用してモバイル判定を強化
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA =
        /iphone|ipod|ipad|android|blackberry|windows phone|webos/.test(
          userAgent
        );
      const isSmallScreen = window.innerWidth <= 768;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // 複数の条件でモバイル判定
      const mobile = (isSmallScreen && isTouchDevice) || isMobileUA;

      setIsMobile(mobile);

      if (!mobile) {
        setOpen(false);
        setIsMenuVisible(false);
        setIsClosing(false);
        setIsProcessing(false);
      }
    };

    // 初回実行
    checkDevice();

    // リサイズとオリエンテーション変更を監視
    window.addEventListener("resize", checkDevice, { passive: true });
    window.addEventListener("orientationchange", checkDevice, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, [isMounted]);

  // モバイル時のメニュー制御 - より強固なイベント処理
  useEffect(() => {
    if (!isMounted || !isMobile) return;

    if (pathname !== "/") {
      // TOPページ以外では即座に表示
      setIsMenuVisible(true);
      return;
    }

    // TOPページでは初期非表示
    setIsMenuVisible(false);

    const handleHideMenu = () => {
      setIsMenuVisible(false);
    };

    const handleShowMenu = () => {
      setIsMenuVisible(true);
    };

    // イベントリスナー登録
    window.addEventListener("hideMenuButton", handleHideMenu);
    window.addEventListener("showMenuButton", handleShowMenu);

    // フォールバック: 一定時間後に強制表示
    const fallbackTimer = setTimeout(() => {
      setIsMenuVisible(true);
    }, 8000);

    // 追加のフォールバック: DOMContentLoadedでも表示
    const domLoadedTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        setIsMenuVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("hideMenuButton", handleHideMenu);
      window.removeEventListener("showMenuButton", handleShowMenu);
      clearTimeout(fallbackTimer);
      clearTimeout(domLoadedTimer);
    };
  }, [pathname, isMobile, isMounted]);

  // マウント前は何も表示しない（SSR対策）
  if (!isMounted) {
    return null;
  }

  // PC判定時は何も表示しない
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* メニューヘッダー */}
        <div className={styles.menuHeader}>
          <h3>メニュー</h3>
          <button
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="メニューを閉じる"
          >
            ×
          </button>
        </div>

        <ul className={styles.items}>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/", e)}
            >
              TOP
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/news", e)}
            >
              ニュース
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/services", e)}
            >
              サービス一覧
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/blog", e)}
            >
              ブログ
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/members", e)}
            >
              会社概要
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/contact", e)}
            >
              お問合せ
            </button>
          </li>
          <li>
            <button
              className={styles.menuLink}
              onClick={(e) => handleMenuItemClick("/reservation", e)}
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
          onClick={handleOverlayClick}
        />
      )}

      {/* ハンバーガーメニューボタン - 強制表示オプション付き */}
      {isMenuVisible && (
        <button
          className={cx(
            styles.button,
            styles.visible,
            // 強制表示クラスを追加（CSS側で !important 指定）
            styles.forceVisible
          )}
          onClick={toggleHam}
          aria-label="メニューを開く"
          // タッチイベントも追加
          onTouchStart={(e) => e.preventDefault()}
          style={{
            // インラインスタイルでも保険をかける
            display: "block",
            visibility: "visible",
            opacity: 1,
            pointerEvents: "auto",
          }}
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
