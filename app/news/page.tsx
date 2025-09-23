import { getNewsList, getCategoryList } from "../_libs/microcms";
import NewsList from "../_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import CategoryFilter from "@/app/_components/CategoryFilter";
import TagFilter from "../_components/TagFilter";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
    tag?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  console.log("searchParams:", searchParams);

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // タグフィルターがある場合は全記事を取得、ない場合は通常のクエリ
  const queryParams: any = searchParams.tag
    ? { limit: 100 } // タグフィルター時は全記事取得
    : { limit: NEWS_LIST_LIMIT };

  // microCMSフィルター（タグ以外）
  const filters: string[] = [];

  if (searchParams.category) {
    filters.push(`category[equals]${searchParams.category}`);
    console.log(
      "カテゴリーフィルター追加:",
      `category[equals]${searchParams.category}`
    );
  }

  if (filters.length > 0) {
    queryParams.filters = filters.join("[and]");
    console.log("microCMSフィルター:", queryParams.filters);
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
    queryParams.offset = (parseInt(searchParams.page) - 1) * NEWS_LIST_LIMIT;
  }

  console.log("getNewsListに渡すパラメータ:", queryParams);

  const { contents: allNews, totalCount } = await getNewsList(queryParams);

  console.log("microCMSから取得した記事数:", allNews.length);

  // フロントエンドでタグフィルタリング
  let filteredNews = allNews;

  if (searchParams.tag) {
    console.log("タグフィルタリング開始:", searchParams.tag);
    filteredNews = allNews.filter((item) => {
      const hasTag = item.tags && item.tags.includes(searchParams.tag!);
      console.log(`記事「${item.title}」のタグ:`, item.tags, "マッチ:", hasTag);
      return hasTag;
    });
    console.log("タグフィルタリング後の記事数:", filteredNews.length);
  }

  // ページネーション（フロントエンド）
  let paginatedNews = filteredNews;
  let finalTotalCount = filteredNews.length;

  if (searchParams.tag) {
    // タグフィルター時はフロントエンドでページネーション
    const startIndex = (currentPage - 1) * NEWS_LIST_LIMIT;
    const endIndex = startIndex + NEWS_LIST_LIMIT;
    paginatedNews = filteredNews.slice(startIndex, endIndex);
  } else {
    // タグフィルターなしの場合はmicroCMSのtotalCountを使用
    finalTotalCount = totalCount || 0;
  }

  console.log("最終表示記事数:", paginatedNews.length);
  console.log("最終totalCount:", finalTotalCount);

  const { contents: categories } = await getCategoryList();

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
  const basePath = `/news${
    basePathParams.toString() ? `?${basePathParams.toString()}` : ""
  }`;

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />
      <SearchField />
      <CategoryFilter categories={categories} />
      <TagFilter currentTag={searchParams.tag} />
      <NewsList news={paginatedNews} />
      <Pagination
        totalCount={finalTotalCount}
        current={currentPage}
        basePath={basePath}
      />
    </Sheet>
  );
}
