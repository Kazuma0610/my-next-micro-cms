"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Blog } from "@/app/_libs/microcms";
import Date from "../Date";
import BlogCategory from "../BlogCategory";
import { formatDate } from "@/app/_libs/utils";
import styles from "./index.module.css";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import BlogSidebar from "../BlogSidebar";

type Props = {
  data: Blog;
  recentBlogs?: Array<{
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
  }>;
  relatedBlogs?: Blog[];
};

type RecentlyViewedItem = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  } | null;
  viewedAt: number;
};

export default function BlogArticle({
  data,
  recentBlogs,
  categories,
  tags,
  relatedBlogs,
}: Props) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(
    []
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // ローカルストレージから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("recently-viewed-blogs");
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error("Failed to load recently viewed blog items:", error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // ブログ記事を閲覧履歴に追加
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const newItem: RecentlyViewedItem = {
      id: data.id,
      title: data.title,
      publishedAt: data.publishedAt,
      thumbnail:
        data.thumbnail &&
        typeof data.thumbnail.width === "number" &&
        typeof data.thumbnail.height === "number"
          ? {
              url: data.thumbnail.url,
              width: data.thumbnail.width,
              height: data.thumbnail.height,
            }
          : null,
      viewedAt: window.Date.now(),
    };

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== data.id);
      const updated = [newItem, ...filtered].slice(0, 5);

      try {
        localStorage.setItem("recently-viewed-blogs", JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recently viewed blog items:", error);
      }

      return updated;
    });
  }, [data.id, data.publishedAt, data.title, data.thumbnail, isLoaded]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Breadcrumbs />
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.description}>{data.description}</p>

        <div className={styles.categorySection}>
          <div className={styles.categoryAndTags}>
            {data.category && (
              <Link
                href={`/blog/category/${data.category.id}`}
                className={styles.categoryLink}
              >
                <BlogCategory blogcategory={data.category} />
              </Link>
            )}

            {data.tags && data.tags.length > 0 && (
              <div className={styles.tagList}>
                {data.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
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

        {/* 関連ブログ記事セクション */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>関連ブログ記事</h2>
            <div className={styles.relatedList}>
              {relatedBlogs.map((blog) => (
                <article key={blog.id} className={styles.relatedItem}>
                  <Link
                    href={`/blog/${blog.id}`}
                    className={styles.relatedLink}
                  >
                    {blog.thumbnail && (
                      <div className={styles.relatedImageWrapper}>
                        <Image
                          src={blog.thumbnail.url}
                          alt=""
                          className={styles.relatedImage}
                          width={360} // より高い解像度に変更
                          height={200} // アスペクト比を維持
                          quality={80} // 品質を向上
                          priority={false}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          sizes="(max-width: 768px) 100vw, 280px"
                        />
                      </div>
                    )}
                    <div className={styles.relatedContent}>
                      <h3 className={styles.relatedBlogTitle}>{blog.title}</h3>
                      <p className={styles.relatedDescription}>
                        {blog.description}
                      </p>
                      <div className={styles.relatedMeta}>
                        {blog.category && (
                          <BlogCategory blogcategory={blog.category} />
                        )}
                        <Date date={blog.publishedAt ?? blog.createdAt} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 最近閲覧したブログ記事セクション */}
        {isLoaded && recentlyViewed.length > 1 && (
          <section className={styles.recentlyViewedSection}>
            <h2 className={styles.recentlyViewedTitle}>
              最近閲覧したブログ記事
            </h2>
            <div className={styles.recentlyViewedList}>
              {recentlyViewed
                .filter((item) => item.id !== data.id)
                .slice(0, 4)
                .map((item) => (
                  <article key={item.id} className={styles.recentlyViewedItem}>
                    <Link
                      href={`/blog/${item.id}`}
                      className={styles.recentlyViewedLink}
                    >
                      {item.thumbnail && (
                        <div className={styles.recentlyViewedImageWrapper}>
                          <Image
                            src={item.thumbnail.url}
                            alt=""
                            className={styles.recentlyViewedImage}
                            width={360} // より高い解像度に変更
                            height={200} // アスペクト比を維持
                            quality={80} // 品質を向上
                            priority={false}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            sizes="(max-width: 768px) 100vw, 280px"
                          />
                        </div>
                      )}
                      <div className={styles.recentlyViewedContent}>
                        <h3 className={styles.recentlyViewedBlogTitle}>
                          {item.title}
                        </h3>
                        <div className={styles.recentlyViewedMeta}>
                          {item.publishedAt && <Date date={item.publishedAt} />}
                          <span className={styles.viewedTime}>
                            {(() => {
                              const viewedDate = new window.Date(item.viewedAt);
                              return viewedDate.toLocaleDateString("ja-JP");
                            })()}{" "}
                            閲覧
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* サイドバー */}
      <BlogSidebar
        recentBlogs={recentBlogs || []}
        categories={categories || []}
        tags={tags || []}
      />
    </div>
  );
}
