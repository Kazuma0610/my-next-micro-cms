"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  //ハンバーガーの開閉やナビの出し入れ//
  const [isOpen, setOpen] = useState<boolean>(false);
  const toggleHam = () => {
    setOpen(!isOpen);
  };
  //ここまで//

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
            <Link onClick={toggleHam} href="/members">
              メンバー
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
      <button className={styles.button} onClick={toggleHam}>
        <div className={cx(styles.openbtn, isOpen && styles.open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  );
}
