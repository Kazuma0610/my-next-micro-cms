import { BLOG_LIST_LIMIT } from "@/app/_constants";
import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

export default function BlogPagination({
  totalCount,
  current = 1,
  basePath = "/blog",
  q,
}: Props) {
  const pages = Array.from(
    { length: Math.ceil(totalCount / BLOG_LIST_LIMIT) },
    (_, i) => i + 1
  );

  return (
    <nav>
      <ul className={styles.container}>
        {pages.map((p) => {
          let href;

          if (basePath === "/blog/search") {
            // ブログ検索ページの場合
            if (q) {
              // 検索キーワードがある場合
              href =
                p === 1
                  ? `${basePath}?q=${encodeURIComponent(q)}`
                  : `${basePath}?page=${p}&q=${encodeURIComponent(q)}`;
            } else {
              // 検索キーワードがない場合
              href = p === 1 ? basePath : `${basePath}?page=${p}`;
            }
          } else if (
            basePath.includes("/category/") &&
            basePath.endsWith("/p")
          ) {
            // カテゴリーページの場合 (/blog/category/xxx/p)
            href =
              p === 1
                ? basePath.slice(0, -2) // 末尾の "/p" を削除
                : `${basePath}/${p}`;
          } else if (basePath.includes("?")) {
            // その他のクエリパラメータが既に含まれている場合
            href = p === 1 ? basePath : `${basePath}&page=${p}`;
          } else {
            // 通常のブログ一覧の場合 (/blog?page=2)
            href = p === 1 ? basePath : `${basePath}?page=${p}`;
          }

          console.log(`Blog page ${p} href:`, href); // デバッグ用

          return (
            <li className={styles.list} key={p}>
              {current !== p ? (
                <Link href={href} className={styles.item}>
                  {p}
                </Link>
              ) : (
                <span className={`${styles.item} ${styles.current}`}>{p}</span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
