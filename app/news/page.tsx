import { getNewsList, getCategoryList } from "../_libs/microcms";
import NewsList from "../_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import CategoryFilter from "@/app/_components/CategoryFilter";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  console.log("searchParams:", searchParams);

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  // filtersがundefinedの場合は、queryParamsから除外
  const queryParams: any = {
    limit: NEWS_LIST_LIMIT,
  };

  if (searchParams.category) {
    queryParams.filters = `category[equals]${searchParams.category}`;
  }

  if (searchParams.q) {
    queryParams.q = searchParams.q;
  }

  if (searchParams.page && parseInt(searchParams.page) > 1) {
    queryParams.offset = (parseInt(searchParams.page) - 1) * NEWS_LIST_LIMIT;
  }

  console.log("getNewsListに渡すパラメータ:", queryParams);

  const { contents: news, totalCount } = await getNewsList(queryParams);

  console.log("取得した記事数:", news.length);
  console.log("totalCount:", totalCount);

  const { contents: categories } = await getCategoryList();

  // 現在のフィルター条件を含むbasePathを構築
  const basePathParams = new URLSearchParams();
  if (searchParams.category) {
    basePathParams.set("category", searchParams.category);
  }
  if (searchParams.q) {
    basePathParams.set("q", searchParams.q);
  }
  const basePath = `/news${
    basePathParams.toString() ? `?${basePathParams.toString()}` : ""
  }`;

  return (
    <>
      <Breadcrumbs />
      <SearchField />
      <CategoryFilter categories={categories} />
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount || 0}
        current={currentPage}
        basePath={basePath}
      />
    </>
  );
}
