import { notFound } from "next/navigation";
import { getBlogCategoryDetail, getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "@/app/_components/BlogPagination";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet";

type Props = {
  params: {
    id: string;
    current: string;
  };
};

export default async function Page({ params }: Props) {
  const current = parseInt(params.current, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const categoryData = await getBlogCategoryDetail(params.id).catch(notFound);

  const { contents: blogs, totalCount } = await getBlogList({
    limit: BLOG_LIST_LIMIT,
    offset: BLOG_LIST_LIMIT * (current - 1),
    filters: `category[equals]${categoryData.id}`,
  });

  if (blogs.length === 0) {
    notFound();
  }

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />
      <BlogList blogs={blogs} />
      <BlogPagination
        totalCount={totalCount}
        current={current}
        basePath={`/blog/category/${categoryData.id}`}
      />
    </Sheet>
  );
}
