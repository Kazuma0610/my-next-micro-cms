"use client";
import styles from "./index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  // "p"と"category"を除外したパス配列を作成
  let pathParts = pathname
    .split("/")
    .filter((part) => part && part !== "p" && part !== "category");
  // /news/slug のslug部分（2階層目）だけ除外、/news/category/xxx など三階層目は除外しない
  const pathSegments = pathname.split("/").filter(Boolean);
  if (
    pathParts[0] === "news" &&
    pathParts.length === 2 &&
    pathSegments.length === 2 &&
    !["category", "p"].includes(pathParts[1])
  ) {
    pathParts = pathParts.slice(0, 1); // "news"だけ残す
  }

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
          // 記事詳細ページ（/news/スラッグ）だけ特別扱い
          const isNewsDetail = pathParts[0] === "news" && pathParts.length === 1 && pathname.startsWith("/news/") && pathname.split("/").filter(Boolean).length === 2;
          // /news/category/xxx や /news/p/2 などは通常通り最後だけisLast
          const isLast = idx === pathParts.length - 1 && !isNewsDetail;
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
