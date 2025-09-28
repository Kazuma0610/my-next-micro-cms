import { getBlogCategoryDetail, getBlogList } from "@/app/_libs/microcms";
import { notFound } from "next/navigation";
import BlogList from "@/app/_components/BlogList";
import BlogCategory from "@/app/_components/BlogCategory";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogPagination from "@/app/_components/BlogPagination";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const categoryData = await getBlogCategoryDetail(params.id).catch(notFound);

  const { contents: blogs, totalCount } = await getBlogList({
    limit: BLOG_LIST_LIMIT,
    filters: `category[equals]${categoryData.id}`,
    offset: 0,
  });

  return (
    <>
      <Breadcrumbs />
      <p>
        <BlogCategory blogcategory={categoryData} />
        の一覧
      </p>
      <BlogList blogs={blogs} />
      <BlogPagination
        totalCount={totalCount}
        current={1}
        basePath={`/blog/category/${categoryData.id}/p`}
      />
    </>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const categoryData = await getBlogCategoryDetail(params.id);
    return {
      title: `${categoryData.name} - ブログカテゴリー`,
      description: `${categoryData.name}カテゴリーのブログ記事一覧です。`,
    };
  } catch (error) {
    return {
      title: "ブログカテゴリー",
      description: "ブログカテゴリーの記事一覧です。",
    };
  }
}
