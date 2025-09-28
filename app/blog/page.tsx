import { getBlogList, getBlogCategoryList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "@/app/_components/BlogPagination";
import BlogSearchField from "@/app/_components/BlogSearchField";
import BlogCategoryFilter from "@/app/_components/BlogCategoryFilter";

type Props = {
  searchParams: {
    page?: string;
    category?: string;
  };
};

export default async function BlogPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * BLOG_LIST_LIMIT;
  const categoryId = searchParams.category;

  console.log("Blog page debug:", {
    categoryId,
    page,
    searchParams,
  });

  // getBlogListの呼び出しパラメータを構築
  const queryParams: any = {
    limit: BLOG_LIST_LIMIT,
    offset,
  };

  // カテゴリーフィルターがある場合のみfiltersを追加
  if (categoryId) {
    queryParams.filters = `category[equals]${categoryId}`;
    console.log("カテゴリーフィルター適用:", queryParams.filters);
  } else {
    console.log("カテゴリーフィルターなし（全記事取得）");
  }

  // ブログ記事を取得
  const { contents: blogs, totalCount } = await getBlogList(queryParams);

  console.log("取得結果:", {
    blogsCount: blogs.length,
    totalCount,
    hasFilter: !!categoryId,
  });

  // ブログカテゴリー一覧を取得
  const { contents: categories } = await getBlogCategoryList();

  // ページネーション用のbasePathにカテゴリー情報を含める
  const basePath = categoryId ? `/blog?category=${categoryId}` : "/blog";

  return (
    <>
      <Breadcrumbs />
      <BlogSearchField />
      <BlogCategoryFilter categories={categories} />

      {/* カテゴリー選択状態の表示 */}
      {categoryId && (
        <div
          style={{
            background: "#e3f2fd",
            padding: "15px",
            margin: "15px 0",
            borderRadius: "5px",
          }}
        >
          <p>
            選択中のカテゴリー:{" "}
            <strong>
              {categories.find((cat) => cat.id === categoryId)?.name ||
                categoryId}
            </strong>
          </p>
          <p>該当記事数: {totalCount}件</p>
        </div>
      )}

      <BlogList blogs={blogs} />
      <BlogPagination
        totalCount={totalCount || 0}
        current={page}
        basePath={basePath}
      />
    </>
  );
}

export async function generateMetadata({ searchParams }: Props) {
  const { category } = searchParams;

  if (category) {
    try {
      const { getBlogCategoryDetail } = await import("@/app/_libs/microcms");
      const categoryDetail = await getBlogCategoryDetail(category);
      return {
        title: `${categoryDetail.name}のブログ記事一覧`,
        description: `${categoryDetail.name}カテゴリーのブログ記事一覧です。`,
      };
    } catch (error) {
      console.error("Blog category detail fetch error:", error);
    }
  }

  return {
    title: "ブログ",
    description: "ブログ記事の一覧ページです。",
  };
}
