//app/page.tsx//
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { getNewsList, getBlogList } from "@/app/_libs/microcms";
import { TOP_NEWS_LIMIT, TOP_BLOG_LIMIT } from "@/app/_constants";
import NewsList from "@/app/_components/NewsList";
import BlogList from "@/app/_components/BlogList";
import ButtonLink from "@/app/_components/ButtonLink";
import Carousel from "./_components/Carousel";
import ScrollAnimatedSection from "@/app/_components/ScrollAnimatedSection";
import StaggeredList from "./_components/StaggeredList";

export const revalidate = 60;

export default async function Home() {
  const data = await getNewsList({
    limit: TOP_NEWS_LIMIT,
  });
  const data_blog = await getBlogList({
    limit: TOP_BLOG_LIMIT,
  });

  // カルーセル用のスライドデータ
  const slides = [
    {
      id: "1",
      title: "テクノロジーの力で世界を変える",
      description: "私たちは市場をリードしているテックカンパニーです",
      image: "/mv_4.png", //1枚目の画像
      buttonText: "詳しく見る",
      buttonLink: "/about",
    },
    {
      id: "2",
      title: "革新的なソリューション",
      description: "最先端の技術で企業の課題を解決します",
      image: "/mv_2.png", // 2枚目の画像
      buttonText: "サービス一覧",
      buttonLink: "/services",
    },
    {
      id: "3",
      title: "お客様との信頼関係",
      description: "長期的なパートナーシップを大切にしています",
      image: "/mv_3.png", // 3枚目の画像
      buttonText: "お客様の声",
      buttonLink: "/testimonials",
    },
  ];

  return (
    <>
      {/* カルーセルセクション */}
      <section className={styles.hero}>
        <Carousel
          slides={slides}
          autoPlay={true}
          autoPlayInterval={5000}
          showDots={true}
          showArrows={true}
          fadeEffect={true} // フェード効果を有効
          transitionDuration={800} // 遷移時間を800msに設定
        />
      </section>
      <section className={styles.news}>
        <h2 className={styles.newsTitle}>NEWS</h2>
        <NewsList news={data.contents} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
      {/* BLOGセクション - 左からフェードイン */}
      <ScrollAnimatedSection
        animation="fadeInLeft"
        delay={200}
        duration={800}
        threshold={0.2}
        className={styles.blog}
      >
        <h2 className={styles.blogTitle}>BLOG</h2>
        <BlogList blogs={data_blog.contents} />
        <div className={styles.blogLink}>
          <ButtonLink href="/blog">もっとみる</ButtonLink>
        </div>
      </ScrollAnimatedSection>
      {/* シンプルなStaggeredList使用例 */}
      <section className={styles.simpleSection}>
        <h2>お知らせ</h2>
        <StaggeredList animation="fadeInLeft" staggerDelay={100}>
          <div className={styles.announcement}>重要なお知らせ1</div>
          <div className={styles.announcement}>重要なお知らせ2</div>
          <div className={styles.announcement}>重要なお知らせ3</div>
          <div className={styles.announcement}>重要なお知らせ4</div>
        </StaggeredList>
      </section>
    </>
  );
}
