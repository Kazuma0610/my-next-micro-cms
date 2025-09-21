import Link from "next/link";
import Image from "next/image";
import type { News } from "@/app/_libs/microcms";
import Date from "../Date";
import Category from "../Category";
import styles from "./index.module.css";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

type Props = {
  data: News;
};

export default function Article({ data }: Props) {
  return (
    <main>
      <Breadcrumbs />
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>

      <div className={styles.categorySection}>
        {/* カテゴリーとタグを横並びに配置 */}
        <div className={styles.categoryAndTags}>
          <Link
            href={`/news/category/${data.category.id}`}
            className={styles.categoryLink}
          >
            <Category category={data.category} />
          </Link>

          {/* タグ表示 */}
          {data.tags && data.tags.length > 0 && (
            <div className={styles.tagList}>
              {data.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/news?tag=${encodeURIComponent(tag)}`}
                  className={styles.tagLink}
                >
                  <span className={styles.tag}>#{tag}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.dateSection}>
        <div className={styles.dates}>
          <span className={styles.publishDate}>
            投稿日: <Date date={data.publishedAt ?? data.createdAt} />
          </span>
          <span className={styles.updateDate}>
            更新日: <Date date={data.updatedAt} />
          </span>
          {/* 投稿者も同じ行に配置 */}
          {data.author && (
            <span className={styles.author}>投稿者: {data.author}</span>
          )}
        </div>
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
