import { notFound } from "next/navigation";
import { getBlogDetail } from "@/app/_libs/microcms";
import BlogArticle from "@/app/_components/BlogArticle";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const blogData = await getBlogDetail(params.slug).catch(notFound);

  return (
    <>
      <BlogArticle data={blogData} />
      <div className={styles.footer}>
        <ButtonLink href="/blog">ブログ一覧に戻る</ButtonLink>
      </div>
    </>
  );
}
