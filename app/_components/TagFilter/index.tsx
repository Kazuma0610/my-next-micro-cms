type Props = {
  currentTag?: string;
};

export default function TagFilter({ currentTag }: Props) {
  if (!currentTag) return null;

  return (
    <div
      style={{
        margin: "1rem 0",
        padding: "1rem",
        backgroundColor: "var(--color-bg-sub)",
        borderRadius: "4px",
        borderLeft: "4px solid var(--color-button-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-main)",
          }}
        >
          タグ「<strong>{currentTag}</strong>」で絞り込み中
        </span>
        <a
          href="/news"
          style={{
            color: "var(--color-button-primary)",
            textDecoration: "none",
            fontSize: "var(--font-size-sm)",
            padding: "0.2rem 0.5rem",
            borderRadius: "2px",
          }}
        >
          ✕ フィルターを解除
        </a>
      </div>
    </div>
  );
}
