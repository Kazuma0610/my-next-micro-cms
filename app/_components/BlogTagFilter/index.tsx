import styles from "./index.module.css";

type Props = {
  currentTag?: string;
};

export default function BlogTagFilter({ currentTag }: Props) {
  if (!currentTag) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.text}>
          タグ「<strong>{currentTag}</strong>」で絞り込み中
        </span>
        <a href="/blog" className={styles.clearButton}>
          ✕ フィルターを解除
        </a>
      </div>
    </div>
  );
}
