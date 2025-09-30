import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogDetail,
  getBlogList,
  getBlogCategoryList,
  getAllBlogTags, // 追加
  getRelatedBlogs, // 追加
} from "@/app/_libs/microcms";
import BlogArticle from "@/app/_components/BlogArticle";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import Sheet from "@/app/_components/Sheet";

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    dk?: string;
  };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const data = await getBlogDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url ?? ""],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const data = await getBlogDetail(params.slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);

  // サイドバー用のデータと関連記事を並行取得
  const [recentBlogsResponse, categoriesResponse, allTags, relatedBlogs] =
    await Promise.all([
      getBlogList({ limit: 5, fields: "id,title,publishedAt" }),
      getBlogCategoryList(),
      getAllBlogTags(),
      // 関連記事を取得（同じカテゴリーの他の記事）
      data.category
        ? getBlogList({
            limit: 4,
            filters: `category[equals]${data.category.id}[and]id[not_equals]${data.id}`,
            fields:
              "id,title,description,thumbnail,category,publishedAt,createdAt",
          }).then((res) => res.contents)
        : Promise.resolve([]),
    ]);

  return (
    <Sheet hasSidebar={true}>
      <BlogArticle
        data={data}
        recentBlogs={recentBlogsResponse.contents}
        categories={categoriesResponse.contents}
        tags={allTags}
        relatedBlogs={relatedBlogs}
      />
      <div className={styles.footer}>
        <ButtonLink href="/blog">ブログ一覧へ</ButtonLink>
      </div>
    </Sheet>
  );
}
