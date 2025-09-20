"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/app/_libs/microcms";

type Props = {
  categories: Category[];
};

export default function CategoryFilter({ categories }: Props) {
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

    router.push(`/news?${params.toString()}`);
  };

  return (
    <div>
      <label htmlFor="category">カテゴリー</label>
      <select
        id="category"
        value={currentCategory}
        onChange={handleCategoryChange}
      >
        <option value="">すべてのカテゴリー</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
