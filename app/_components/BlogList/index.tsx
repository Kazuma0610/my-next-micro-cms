import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.css";
import { Blog } from "@/app/_libs/microcms";
import BlogCategory from "../BlogCategory";
import BlogDate from "../BlogDate";

type Props = {
  blogs: Blog[];
  layout?: "grid" | "list";
};

export default function BlogList({ blogs, layout = "list" }: Props) {
  if (blogs.length === 0) {
    return <p>記事がありません。</p>;
  }

  // レイアウトに応じてクラス名を決定
  const containerClass =
    layout === "grid" ? styles.gridContainer : styles.listContainer;

  return (
    <ul className={containerClass}>
      {blogs.map((article) => (
        <li key={article.id} className={styles.list}>
          <Link href={`/blog/${article.id}`} className={styles.link}>
            {article.thumbnail ? (
              <Image
                src={article.thumbnail.url}
                alt=""
                className={styles.image}
                width={1200}
                height={630}
              />
            ) : (
              <Image
                className={styles.image}
                src="/no-image.png"
                alt="No Image"
                width={1200}
                height={630}
              />
            )}
            <div className={styles.content}>
              <h3 className={styles.contentTitle}>{article.title}</h3>
              <div className={styles.meta}>
                <BlogCategory blogcategory={article.category} />
                <BlogDate blogdate={article.publishedAt ?? article.createdAt} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
