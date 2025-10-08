"use client";
import styles from "./index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // パス解析
  const pathSegments = pathname.split("/").filter(Boolean);

  // カテゴリーページかどうかを判定
  const isCategoryPage =
    pathSegments.length >= 3 &&
    pathSegments[1] === "category" &&
    (pathSegments[0] === "news" || pathSegments[0] === "blog");

  // 記事詳細ページかどうかを判定
  const isArticleDetail =
    pathSegments.length === 2 &&
    (pathSegments[0] === "news" || pathSegments[0] === "blog") &&
    !["category", "p"].includes(pathSegments[1]);

  let pathParts: string[] = [];

  if (isCategoryPage) {
    // カテゴリーページの場合: ["news", "press-release"]
    pathParts = [pathSegments[0], pathSegments[2]];
  } else if (isArticleDetail) {
    // 記事詳細ページの場合: ["news"]のみ
    pathParts = [pathSegments[0]];
  } else {
    // その他の場合: "p"のみ除外
    pathParts = pathSegments.filter((part) => part !== "p");
  }

  const nameMap: { [key: string]: string } = {
    news: "ニュース",
    members: "会社役員",
    about: "About",
    contact: "お問合せ",
    reservation: "セミナー予約",
    blog: "ブログ",
    // カテゴリー名のマッピング
    "press-release": "プレスリリース",
    notice: "お知らせ",
    important: "重要",
    marketing: "マーケティング",
    new_products: "新製品",
    regional_exchange: "地域交流",
    reskilling_study: "リスキリング勉強会",
    seminar_information: "セミナーのご案内",
    services: "サービス一覧",
    "mobile-app": "モバイルアプリ開発",
    "web-design": "Webサイト制作",
    "system-development": "システム開発",
    ecommerce: "ECサイト構築",
    consulting: "コンサルティング",
    maintenance: "保守・運用",
    // 必要に応じて追加
  };

  return (
    <nav aria-label="breadcrumb">
      <ul className={styles.breadcrumb}>
        <li>
          <Link href="/">Home</Link>
        </li>
        {pathParts.map((part, idx) => {
          let href: string;

          if (isCategoryPage && idx === 1) {
            // カテゴリーページの2番目（カテゴリー名）の場合
            href = `/${pathParts[0]}/category/${part}`;
          } else {
            // 通常の場合
            href = "/" + pathParts.slice(0, idx + 1).join("/");
          }

          const isLast = idx === pathParts.length - 1;
          const displayName = nameMap[part] ?? decodeURIComponent(part);

          return (
            <li key={idx} style={{ marginLeft: 0 }}>
              <span style={{ margin: "0 10px" }}>/</span>
              {isLast ? (
                <span>{displayName}</span>
              ) : (
                <Link href={href}>{displayName}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
