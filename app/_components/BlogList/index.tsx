import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.css";
import { Blog } from "@/app/_libs/microcms";
import BlogCategory from "../BlogCategory";
import BlogDate from "../BlogDate";

type Props = {
  blogs: Blog[];
};

export default function BlogList({ blogs }: Props) {
  if (blogs.length === 0) {
    return <p>記事がありません。</p>;
  }

  return (
    <ul className={styles.blogList}>
      {blogs.map((article) => (
        <li key={article.id} className={styles.list}>
          <Link href={`/blog/${article.id}`} className={styles.link}>
            {" "}
            {/* divをLinkに変更 */}
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
            <dl className={styles.content}>
              <dt className={styles.title}>{article.title}</dt>
              <dd className={styles.meta}>
                <BlogCategory blogcategory={article.category} />
                <BlogDate blogdate={article.publishedAt ?? article.createdAt} />
              </dd>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
