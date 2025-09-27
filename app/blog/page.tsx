import { getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "../_components/BlogPagination";

export default async function BlogPage() {
  const { contents: blogs, totalCount } = await getBlogList({
    limit: BLOG_LIST_LIMIT,
  });

  return (
    <>
      <Breadcrumbs />
      <BlogList blogs={blogs} />
      <BlogPagination totalCount={totalCount} />
    </>
  );
}
