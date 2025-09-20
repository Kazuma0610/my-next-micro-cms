import { NEWS_LIST_LIMIT } from "@/app/_constants";
import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

export default function Pagination({
  totalCount,
  current = 1,
  basePath = "/news",
  q,
}: Props) {
  const pages = Array.from(
    { length: Math.ceil(totalCount / NEWS_LIST_LIMIT) },
    (_, i) => i + 1
  );

  return (
    <nav>
      <ul className={styles.container}>
        {pages.map((p) => {
          let href;
          if (basePath === "/news/search") {
            href = q
              ? `${basePath}?page=${p}&q=${encodeURIComponent(q)}`
              : `${basePath}?page=${p}`;
          } else if (basePath.includes("?")) {
            // カテゴリーやその他のパラメータが既に含まれている場合
            href = p === 1 ? basePath : `${basePath}&page=${p}`;
          } else {
            // 通常のニュース一覧の場合
            href = p === 1 ? basePath : `${basePath}?page=${p}`;
          }
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
