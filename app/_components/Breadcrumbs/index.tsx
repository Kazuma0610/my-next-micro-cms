"use client";
import styles from "./index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  // "p"と"category"を除外したパス配列を作成
  const pathParts = pathname.split("/").filter(part => part && part !== "p" && part !== "category");

  const nameMap: { [key: string]: string } = {
    news: "News",
    members: "Members",
    about: "About",
    contact: "Contact",
    // 必要に応じて追加
  };

  return (
    <nav aria-label="breadcrumb">
      <ul className={styles.breadcrumb}>
        <li>
          <Link href="/">Home</Link>
        </li>
        {pathParts.map((part, idx) => {
          const href = "/" + pathParts.slice(0, idx + 1).join("/");
          const isLast = idx === pathParts.length - 1;
          return (
            <li key={href} style={{ marginLeft: 8 }}>
              <span style={{ margin: "0 4px" }}>/</span>
              {isLast ? (
                <span>{nameMap[part] ?? decodeURIComponent(part)}</span>
              ) : (
                <Link href={href}>
                  {nameMap[part] ?? decodeURIComponent(part)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
