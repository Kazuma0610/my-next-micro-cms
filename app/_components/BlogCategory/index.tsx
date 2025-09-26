import type { BlogCategory } from "@/app/_libs/microcms";
import styles from "./index.module.css";
import Image from "next/image";

type Props = {
  blogcategory: BlogCategory; // blogcategoryという名前でpropsを受け取る
};

export default function BlogCategory({ blogcategory }: Props) {
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
      {blogcategory.name}
    </span>
  );
}
