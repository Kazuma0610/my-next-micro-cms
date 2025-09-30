import Link from "next/link";
import styles from "./index.module.css";

type Props = {
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
  }>; // タグを追加
};

export default function BlogSidebar({
  recentBlogs = [],
  categories = [],
  tags = [],
}: Props) {
  return (
    <aside className={styles.sidebar}>
      {/* 最新ブログ記事 */}
      {recentBlogs.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>最新ブログ記事</h3>
          <ul className={styles.list}>
            {recentBlogs.map((blog) => (
              <li key={blog.id} className={styles.listItem}>
                <Link href={`/blog/${blog.id}`} className={styles.link}>
                  {blog.title}
                </Link>
                <time className={styles.date}>
                  {new Date(blog.publishedAt).toLocaleDateString("ja-JP")}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ブログカテゴリー一覧 */}
      {categories.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>ブログカテゴリー</h3>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <Link
                  href={`/blog/category/${category.id}`}
                  className={styles.categoryLink}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* タグ一覧 */}
      {tags.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>タグ</h3>
          <ul className={styles.tagList}>
            {tags.map((tag) => (
              <li key={tag.id} className={styles.tagItem}>
                <Link href={`/blog?tag=${tag.id}`} className={styles.tagLink}>
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ブログ検索ボックス */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ブログ検索</h3>
        <form className={styles.searchForm} action="/blog/search" method="get">
          <input
            type="text"
            name="q"
            placeholder="ブログ記事を検索"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            検索
          </button>
        </form>
      </div>
    </aside>
  );
}
