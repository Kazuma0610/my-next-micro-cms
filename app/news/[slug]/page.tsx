import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getNewsDetail,
  getNewsList,
  getCategoryList,
} from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

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
  const data = await getNewsDetail(params.slug, {
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
  const data = await getNewsDetail(params.slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);

  // サイドバー用のデータを並行取得
  const [recentNewsResponse, categoriesResponse] = await Promise.all([
    getNewsList({ limit: 5 }), // 最新記事5件
    getCategoryList(), // カテゴリー一覧
  ]);

  return (
    <>
      <Article
        data={data}
        recentNews={recentNewsResponse.contents}
        categories={categoriesResponse.contents}
      />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}
