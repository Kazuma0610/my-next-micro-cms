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
          } else {
            href = `${basePath}/p/${p}`;
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
