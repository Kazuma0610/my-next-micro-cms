import styles from "./index.module.css";

type Props = {
  children: React.ReactNode;
  hasSidebar?: boolean;
};

export default function Sheet({ children, hasSidebar = false }: Props) {
  const sheetWidth = hasSidebar ? "1250px" : "840px";

  return (
    <div
      className={styles.container}
      style={
        {
          "--sheet-width": sheetWidth,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
