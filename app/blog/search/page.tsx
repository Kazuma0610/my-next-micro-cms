import { getBlogList } from "@/app/_libs/microcms";
import { BLOG_LIST_LIMIT } from "@/app/_constants";
import BlogList from "@/app/_components/BlogList";
import BlogPagination from "@/app/_components/BlogPagination";
import BlogSearchField from "@/app/_components/BlogSearchField";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet"; // 追加

type Props = {
  searchParams: {
    q?: string;
    page?: string;
  };
};

export async function generateMetadata({ searchParams }: Props) {
  const { q } = searchParams;

  if (!q) {
    return {
      title: "ブログ検索",
      description: "ブログ記事を検索できます。",
    };
  }

  return {
    title: `「${q}」の検索結果 - ブログ`,
    description: `「${q}」に関するブログ記事の検索結果です。`,
  };
}

export default async function Page({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * BLOG_LIST_LIMIT;

  const { contents: blogs, totalCount } = await getBlogList({
    limit: BLOG_LIST_LIMIT,
    offset, // ← 追加
    q: searchParams.q,
  });

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />
      <BlogSearchField />
      <BlogList blogs={blogs} />
      <BlogPagination
        totalCount={totalCount}
        q={searchParams.q} // ← 検索キーワードを渡す
        current={page}
        basePath="/blog/search"
      />
    </Sheet>
  );
}
