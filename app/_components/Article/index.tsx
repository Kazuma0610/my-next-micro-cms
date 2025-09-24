import Link from "next/link";
import Image from "next/image";
import type { News } from "@/app/_libs/microcms";
import Date from "../Date";
import Category from "../Category";
import Sidebar from "../Sidebar";
import { formatDate } from "@/app/_libs/utils";
import styles from "./index.module.css";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

type Props = {
  data: News;
  recentNews?: Array<{
    id: string;
    title: string;
    publishedAt: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
  }>; // タグを追加
  relatedNews?: News[]; // 関連記事を追加
};

export default function Article({
  data,
  recentNews,
  categories,
  tags,
  relatedNews,
}: Props) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Breadcrumbs />
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.description}>{data.description}</p>

        <div className={styles.categorySection}>
          <div className={styles.categoryAndTags}>
            <Link
              href={`/news/category/${data.category.id}`}
              className={styles.categoryLink}
            >
              <Category category={data.category} />
            </Link>

            {data.tags && data.tags.length > 0 && (
              <div className={styles.tagList}>
                {data.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/news?tag=${encodeURIComponent(tag)}`}
                    className={styles.tagLink}
                  >
                    <span className={styles.tag}>
                      <Image
                        src="/tags.svg"
                        alt=""
                        width={14}
                        height={14}
                        loading="eager"
                        className={styles.tagIcon}
                      />
                      {tag}
                    </span>
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
              <Image
                src="/load.svg"
                alt=""
                width={16}
                height={16}
                loading="eager"
                className={styles.updateIcon}
              />
              更新日: {formatDate(data.updatedAt)}
            </span>
            {data.author && (
              <span className={styles.author}>
                <Image
                  src="/writer.svg"
                  alt=""
                  width={14}
                  height={14}
                  loading="eager"
                  className={styles.authorIcon}
                />
                投稿者: {data.author}
              </span>
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

        {/* 関連記事セクションを追加 */}
        {relatedNews && relatedNews.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>関連記事</h2>
            <div className={styles.relatedList}>
              {relatedNews.map((news) => (
                <article key={news.id} className={styles.relatedItem}>
                  <Link
                    href={`/news/${news.id}`}
                    className={styles.relatedLink}
                  >
                    {news.thumbnail && (
                      <div className={styles.relatedImageWrapper}>
                        <Image
                          src={news.thumbnail.url}
                          alt=""
                          className={styles.relatedImage}
                          width={200}
                          height={120}
                        />
                      </div>
                    )}
                    <div className={styles.relatedContent}>
                      <h3 className={styles.relatedNewsTitle}>{news.title}</h3>
                      <p className={styles.relatedDescription}>
                        {news.description}
                      </p>
                      <div className={styles.relatedMeta}>
                        <Category category={news.category} />
                        <Date date={news.publishedAt ?? news.createdAt} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Sidebar recentNews={recentNews} categories={categories} tags={tags} />
    </div>
  );
}
