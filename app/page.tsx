//app/page.tsx//
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { getNewsList } from "@/app/_libs/microcms";
import { TOP_NEWS_LIMIT } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import ButtonLink from "@/app/_components/ButtonLink";
import ButtonLinkHome from "@/app/_components/ButtonLinkHome";

export default async function Home() {
  const data = await getNewsList({
    limit: TOP_NEWS_LIMIT,
  });

  return (
    <>
      <section className={styles.top}>
        <div>
          <h1 className={styles.title}>テクノロジーの力で世界を変える</h1>
          <p className={styles.description}>
            私たちは市場をリードしているグローバルテックカンパニーです
          </p>

          <div className={styles.homeLink}>
            {/*<ButtonLinkHome href="/news">HOME</ButtonLinkHome>*/}
          </div>
          {/*こちらのボタンはミュート中 */}
        </div>
        <Image
          className={styles.bgimg}
          src="/img-mv.jpg"
          alt="メインヴィジュアル"
          width={4000}
          height={1200}
        />
      </section>
      <section className={styles.news}>
        <h2 className={styles.newsTitle}>NEWS</h2>
        <NewsList news={data.contents} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </>
  );
}
