import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";
import Menu from "../Menu";
import PcScrollMenu from "../PcScrollMenu";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logolink}>
        <Image
          src="/logo.svg"
          alt="SIMPLE"
          className={styles.logo}
          width={348}
          height={133}
          priority
        />
      </Link>

      {/* 既存のメニュー（モバイル・タブレット用） */}
      <Menu />

      {/* PC用スクロール対応ハンバーガーメニュー */}
      <PcScrollMenu />
    </header>
  );
}
