"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BlogCategory } from "@/app/_libs/microcms";
import styles from "./index.module.css";

type Props = {
  categories: BlogCategory[];
};

export default function BlogCategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    // カテゴリーが変更された場合はページを1に戻す
    params.delete("page");

    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }

    // ブログ用のURLに変更
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div>
      <label className={styles.label} htmlFor="blog-category">
        ブログカテゴリー検索
      </label>
      <select
        id="blog-category"
        className={styles.select}
        value={currentCategory}
        onChange={handleCategoryChange}
      >
        <option value="">すべてのブログカテゴリー</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
