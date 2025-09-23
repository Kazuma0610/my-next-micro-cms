import { getNewsList } from "@/app/_libs/microcms";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import SearchField from "@/app/_components/SearchField";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet"; // 追加

type Props = {
  searchParams: {
    q?: string;
    page?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * NEWS_LIST_LIMIT;

  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset, // ← 追加
    q: searchParams.q,
  });

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />
      <SearchField />
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        q={searchParams.q}
        current={page}
        basePath="/news/search"
      />
    </Sheet>
  );
}
