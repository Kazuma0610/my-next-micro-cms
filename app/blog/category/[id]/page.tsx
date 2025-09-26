import { getBlogCategoryDetail, getBlogList } from "@/app/_libs/microcms";
import { notFound } from "next/navigation";
import Bloglist from "@/app/_components/BlogList";
import BlogCategory from "@/app/_components/BlogCategory";
import Breadcrumbs from "@/app/_components/Breadcrumbs";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const categoryData = await getBlogCategoryDetail(params.id).catch(notFound);

  const { contents: blogs } = await getBlogList({
    filters: `category[equals]${categoryData.id}`,
  });
  return (
    <>
      <Breadcrumbs />
      <p>
        <BlogCategory blogcategory={categoryData} />
        の一覧
      </p>
      <Bloglist blogs={blogs} />
    </>
  );
}
