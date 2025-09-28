import { getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "@/app/_components/BlogPagination";
import BlogSearchField from "@/app/_components/BlogSearchField";

type Props = {
  searchParams: {
    page?: string;
  };
};

export default async function BlogPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * BLOG_LIST_LIMIT;

  const { contents: blogs, totalCount } = await getBlogList({
    limit: BLOG_LIST_LIMIT,
    offset,
  });

  return (
    <>
      <Breadcrumbs />
      <BlogSearchField />
      <BlogList blogs={blogs} />
      <BlogPagination totalCount={totalCount} current={page} basePath="/blog" />
    </>
  );
}
