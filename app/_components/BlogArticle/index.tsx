import Image from "next/image";
import type { Blog } from "@/app/_libs/microcms";
import BlogDate from "../BlogDate";
import BlogCategory from "../BlogCategory";
import styles from "./index.module.css";

type Props = {
  data: Blog;
};

export default function Article({ data }: Props) {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.meta}>
        <BlogCategory blogcategory={data.category} />
        <BlogDate blogdate={data.publishedAt ?? data.createdAt} />
      </div>
      {data.thumbnail && (
        <Image
          src={data.thumbnail.url}
          alt=""
          className={styles.thumbnail}
          width={data.thumbnail.width}
          height={data.thumbnail.height}
        />
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
    </main>
  );
}
