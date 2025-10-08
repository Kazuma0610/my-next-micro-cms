import { getBlogList, getBlogCategoryList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "@/app/_components/BlogPagination";
import BlogSearchField from "@/app/_components/BlogSearchField";
import BlogCategoryFilter from "@/app/_components/BlogCategoryFilter";
import Sheet from "@/app/_components/Sheet";
import BlogTagFilter from "../_components/BlogTagFilter";

type Props = {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    q?: string;
  };
};

export default async function BlogPage({ searchParams }: Props) {
  console.log("Blog page searchParams:", searchParams);

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const categoryId = searchParams.category;

  // タグフィルターがある場合は全記事を取得、ない場合は通常のクエリ
  const queryParams: any = searchParams.tag
    ? { limit: 100 } // タグフィルター時は全記事取得
    : { limit: BLOG_LIST_LIMIT };

  // microCMSフィルター（タグ以外）
  const filters: string[] = [];

  if (categoryId) {
    filters.push(`category[equals]${categoryId}`);
    console.log(
      "ブログカテゴリーフィルター追加:",
      `category[equals]${categoryId}`
    );
  }

  if (filters.length > 0) {
    queryParams.filters = filters.join("[and]");
    console.log("ブログmicroCMSフィルター:", queryParams.filters);
  }

  if (searchParams.q) {
    queryParams.q = searchParams.q;
  }

  // タグフィルターがない場合のみページネーション
  if (
    !searchParams.tag &&
    searchParams.page &&
    parseInt(searchParams.page) > 1
  ) {
    queryParams.offset = (parseInt(searchParams.page) - 1) * BLOG_LIST_LIMIT;
  }

  console.log("getBlogListに渡すパラメータ:", queryParams);

  const { contents: allBlogs, totalCount } = await getBlogList(queryParams);

  console.log("microCMSから取得したブログ記事数:", allBlogs.length);

  // フロントエンドでタグフィルタリング
  let filteredBlogs = allBlogs;

  if (searchParams.tag) {
    console.log("ブログタグフィルタリング開始:", searchParams.tag);
    filteredBlogs = allBlogs.filter((item) => {
      const hasTag = item.tags && item.tags.includes(searchParams.tag!);
      console.log(
        `ブログ記事「${item.title}」のタグ:`,
        item.tags,
        "マッチ:",
        hasTag
      );
      return hasTag;
    });
    console.log("ブログタグフィルタリング後の記事数:", filteredBlogs.length);
  }

  // ページネーション（フロントエンド）
  let paginatedBlogs = filteredBlogs;
  let finalTotalCount = filteredBlogs.length;

  if (searchParams.tag) {
    // タグフィルター時はフロントエンドでページネーション
    const startIndex = (currentPage - 1) * BLOG_LIST_LIMIT;
    const endIndex = startIndex + BLOG_LIST_LIMIT;
    paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
  } else {
    // タグフィルターなしの場合はmicroCMSのtotalCountを使用
    finalTotalCount = totalCount || 0;
  }

  console.log("最終表示ブログ記事数:", paginatedBlogs.length);
  console.log("最終ブログtotalCount:", finalTotalCount);

  // ブログカテゴリー一覧を取得
  const { contents: categories } = await getBlogCategoryList();

  // basePathの構築
  const basePathParams = new URLSearchParams();
  if (searchParams.category) {
    basePathParams.set("category", searchParams.category);
  }
  if (searchParams.tag) {
    basePathParams.set("tag", searchParams.tag);
  }
  if (searchParams.q) {
    basePathParams.set("q", searchParams.q);
  }
  const basePath = `/blog${
    basePathParams.toString() ? `?${basePathParams.toString()}` : ""
  }`;

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />
      <BlogSearchField />
      <BlogCategoryFilter categories={categories} />
      <BlogTagFilter currentTag={searchParams.tag} />

      {/* フィルター状態の表示 */}
      {(categoryId || searchParams.tag) && (
        <div
          style={{
            background: "#e3f2fd",
            padding: "15px",
            margin: "15px 0",
            borderRadius: "5px",
          }}
        >
          {categoryId && (
            <p>
              選択中のカテゴリー:{" "}
              <strong>
                {categories.find((cat) => cat.id === categoryId)?.name ||
                  categoryId}
              </strong>
            </p>
          )}
          {searchParams.tag && (
            <p>
              選択中のタグ: <strong>#{searchParams.tag}</strong>
            </p>
          )}
          <p>該当記事数: {finalTotalCount}件</p>
        </div>
      )}

      <BlogList blogs={paginatedBlogs} layout="list" />
      <BlogPagination
        totalCount={finalTotalCount}
        current={currentPage}
        basePath={basePath}
      />
    </Sheet>
  );
}

export async function generateMetadata({ searchParams }: Props) {
  const { category, tag } = searchParams;

  if (tag) {
    return {
      title: `#${tag}のブログ記事一覧`,
      description: `${tag}タグのブログ記事一覧です。`,
    };
  }

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
