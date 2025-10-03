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
  const [isMenuVisible, setIsMenuVisible] = useState(false); // 初期状態を false に変更
  const pathname = usePathname();

  const toggleHam = () => {
    setOpen(!isOpen);
  };
  //ここまで//

  // ローディング状態を監視してメニューボタンの表示を制御
  useEffect(() => {
    // TOPページ以外では即座に表示
    if (pathname !== "/") {
      setIsMenuVisible(true);
      return;
    }

    // TOPページでの初回アクセス判定
    const hasVisited = sessionStorage.getItem("hasVisitedTop");

    if (hasVisited) {
      // 既に訪問済みの場合は即座に表示
      setIsMenuVisible(true);
      return;
    }

    // 初回アクセス時の処理
    console.log("Menu button hidden for initial loading");

    // bodyクラス監視でローディング状態を検知
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isLoading = document.body.classList.contains(
            "loading-screen-active"
          );

          if (!isLoading && !isMenuVisible) {
            // ローディング終了時にメニューボタンを表示
            console.log("Loading ended - showing menu button");
            setIsMenuVisible(true);
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // フォールバック: 8秒後に強制表示
    const fallbackTimer = setTimeout(() => {
      setIsMenuVisible(true);
      console.log("Menu button shown by fallback timer");
    }, 8000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isMenuVisible, pathname]);

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

      {/* メニューボタン - クラスベースで制御 */}
      <button
        className={cx(
          styles.button,
          isMenuVisible && styles.visible // .visible クラスを条件付きで追加
        )}
        onClick={toggleHam}
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
