import { getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

export default async function BlogPage() {
  const { contents: blogs } = await getBlogList();

  return (
    <>
      <Breadcrumbs />
      <BlogList blogs={blogs} />
    </>
  );
}
