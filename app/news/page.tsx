import { getNewsList } from "../_libs/microcms";
import NewsList from "../_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_constants";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

export default async function Page() {
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
  });

  return (
    <>
      <Breadcrumbs />
      <NewsList news={news} />
      <Pagination totalCount={totalCount} />
    </>
  );
}
