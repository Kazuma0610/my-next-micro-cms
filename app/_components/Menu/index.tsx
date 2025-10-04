"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  //ハンバーガーの開閉やナビの出し入れ//
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // 初期状態を false に固定
  const pathname = usePathname();

  const toggleHam = () => {
    setOpen(!isOpen);
  };
  //ここまで//

  // カスタムイベントでメニュー表示を制御
  useEffect(() => {
    // TOPページ以外では即座に表示
    if (pathname !== "/") {
      console.log("Non-top page - showing menu immediately");
      setIsMenuVisible(true);
      return;
    }

    // TOPページの場合は必ずイベント制御
    console.log("TOP page detected - waiting for events");
    setIsMenuVisible(false); // 確実に非表示から開始

    const handleHideMenu = () => {
      console.log("Received hide menu event - hiding menu");
      setIsMenuVisible(false);
    };

    const handleShowMenu = () => {
      console.log("Received show menu event - showing menu NOW");
      setIsMenuVisible(true);
    };

    // イベントリスナーを追加
    window.addEventListener("hideMenuButton", handleHideMenu);
    window.addEventListener("showMenuButton", handleShowMenu);

    console.log("Menu event listeners registered for TOP page");

    // フォールバック: 8秒後に強制表示
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
  }, [pathname]);

  // デバッグ用: メニューの可視状態をログ出力
  useEffect(() => {
    console.log(`Menu visibility changed: ${isMenuVisible}`);
  }, [isMenuVisible]);

  return (
    <div>
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

      {/* メニューボタン - 確実にイベント制御 */}
      <button
        className={cx(styles.button, isMenuVisible && styles.visible)}
        onClick={toggleHam}
        style={{
          // CSSとJavaScriptで二重制御
          display: isMenuVisible ? "flex" : "none",
          visibility: isMenuVisible ? "visible" : "hidden",
          opacity: isMenuVisible ? 1 : 0,
        }}
      >
        <div className={cx(styles.openbtn, isOpen && styles.open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  );
}
