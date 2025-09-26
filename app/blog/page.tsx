import { getBlogList } from "@/app/_libs/microcms";
import BlogList from "@/app/_components/BlogList";

export default async function BlogPage() {
  const { contents: blogs } = await getBlogList();

  return <BlogList blogs={blogs} />;
}
