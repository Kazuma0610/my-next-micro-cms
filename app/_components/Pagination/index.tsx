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
          } else if (
            basePath.includes("/category/") &&
            basePath.endsWith("/p")
          ) {
            console.log("Using category logic for page", p);
            // 末尾の /p を正確に削除
            href =
              p === 1
                ? basePath.slice(0, -2) // 末尾の "/p" を削除
                : `${basePath}/${p}`;
          } else if (basePath.includes("?")) {
            href = p === 1 ? basePath : `${basePath}&page=${p}`;
          } else {
            console.log("Using default logic");
            href = p === 1 ? basePath : `${basePath}?page=${p}`;
          }

          console.log(`Page ${p} href:`, href);

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
