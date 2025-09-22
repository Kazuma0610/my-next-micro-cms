import Image from "next/image";
import type { Category } from "@/app/_libs/microcms";
import styles from "./index.module.css";

type Props = {
  category: Category;
};

export default function Category({ category }: Props) {
  return (
    <span className={styles.category}>
      <Image
        src="/folder.svg"
        alt=""
        width={14}
        height={14}
        loading="eager"
        className={styles.categoryIcon}
      />
      {category.name}
    </span>
  );
}
