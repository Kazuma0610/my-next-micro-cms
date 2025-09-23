// app/_components/Sidebar/index.tsx
import Link from "next/link";
import styles from "./index.module.css";

type Props = {
  recentNews?: Array<{
    id: string;
    title: string;
    publishedAt: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
};

export default function Sidebar({ recentNews = [], categories = [] }: Props) {
  return (
    <aside className={styles.sidebar}>
      {/* 最新記事 */}
      {recentNews.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>最新記事</h3>
          <ul className={styles.list}>
            {recentNews.map((news) => (
              <li key={news.id} className={styles.listItem}>
                <Link href={`/news/${news.id}`} className={styles.link}>
                  {news.title}
                </Link>
                <time className={styles.date}>
                  {new Date(news.publishedAt).toLocaleDateString("ja-JP")}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* カテゴリー一覧 */}
      {categories.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>カテゴリー</h3>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <Link
                  href={`/news/category/${category.id}`}
                  className={styles.categoryLink}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 検索ボックス */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>記事検索</h3>
        <form className={styles.searchForm} action="/news" method="get">
          <input
            type="text"
            name="q"
            placeholder="キーワードを入力"
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
