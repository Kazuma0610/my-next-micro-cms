// app/services/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet";
import ServiceCard from "@/app/_components/ServiceCard";
import styles from "./page.module.css";

// サービスデータを直接定義（詳細ページと同じデータを使用）
const servicesData = [
  {
    id: "web-design",
    slug: "web-design",
    title: "Webサイト制作",
    description:
      "レスポンシブデザインに対応した高品質なWebサイトを制作いたします。SEO対策も含めた総合的なWeb制作サービスです。",
    image: {
      url: "/web.png",
      width: 400,
      height: 250,
    },
    features: [
      "レスポンシブデザイン",
      "SEO対策",
      "高速表示最適化",
      "CMS導入",
      "お問い合わせフォーム",
      "Google Analytics",
    ],
    category: "Web制作",
    price: "300,000円〜",
    duration: "2〜4週間",
    link: "/services/web-design",
  },
  {
    id: "mobile-app",
    slug: "mobile-app",
    title: "モバイルアプリ開発",
    description:
      "iOS・Android両対応のネイティブアプリ開発から、React NativeやFlutterを使用したクロスプラットフォーム開発まで対応。",
    image: {
      url: "/app.png",
      width: 400,
      height: 250,
    },
    features: [
      "iOS・Android対応",
      "クロスプラットフォーム",
      "UI/UXデザイン",
      "App Store申請サポート",
      "プッシュ通知機能",
    ],
    category: "アプリ開発",
    price: "500,000円〜",
    duration: "3〜6ヶ月",
    link: "/services/mobile-app",
  },
  {
    id: "system-development",
    slug: "system-development",
    title: "システム開発",
    description:
      "業務効率化を実現するカスタムシステムの開発。既存システムとの連携や、クラウド環境での構築も可能です。",
    image: {
      url: "/system.png",
      width: 400,
      height: 250,
    },
    features: ["カスタム開発", "既存システム連携", "クラウド対応"],
    category: "システム開発",
    price: "800,000円〜",
    duration: "4〜8ヶ月",
    link: "/services/system-development",
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "ECサイト構築",
    description:
      "売上向上を目指したECサイトの構築。決済システムの導入から商品管理、顧客管理まで一貫してサポートします。",
    image: {
      url: "/ec.png",
      width: 400,
      height: 250,
    },
    features: ["決済システム導入", "在庫管理機能", "顧客管理システム"],
    category: "EC構築",
    price: "600,000円〜",
    duration: "3〜5ヶ月",
    link: "/services/ecommerce",
  },
  {
    id: "consulting",
    slug: "consulting",
    title: "ITコンサルティング",
    description:
      "企業のDX推進をサポート。現状分析から最適なソリューションの提案、導入支援まで包括的にサポートいたします。",
    image: {
      url: "/it.png",
      width: 400,
      height: 250,
    },
    features: ["DX推進支援", "現状分析", "導入支援"],
    category: "コンサルティング",
    price: "400,000円〜",
    duration: "2〜6ヶ月",
    link: "/services/consulting",
  },
  {
    id: "maintenance",
    slug: "maintenance",
    title: "保守・運用",
    description:
      "Webサイトやシステムの継続的な保守・運用サービス。セキュリティ対策やパフォーマンス監視も含めた安心のサポート。",
    image: {
      url: "/protect.png",
      width: 400,
      height: 250,
    },
    features: ["24時間監視", "セキュリティ対策", "定期メンテナンス"],
    category: "保守・運用",
    price: "100,000円〜/月",
    duration: "継続",
    link: "/services/maintenance",
  },
];

// カテゴリー一覧を取得
const categories = [
  "すべて",
  ...Array.from(new Set(servicesData.map((service) => service.category))),
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [isAnimating, setIsAnimating] = useState(false);
  const servicesRef = useRef<HTMLElement>(null);

  // フィルタリングされたサービス
  const filteredServices =
    selectedCategory === "すべて"
      ? servicesData
      : servicesData.filter((service) => service.category === selectedCategory);

  // カテゴリー変更時の処理
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return;

    setIsAnimating(true);
    setSelectedCategory(category);

    // サービス一覧セクションにスムーズスクロール
    setTimeout(() => {
      if (servicesRef.current) {
        servicesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center", // "start" から "center" に変更
        });
      }
    }, 100);

    // アニメーション終了
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />

      <div className={styles.container}>
        {/* ヘッダーセクション */}
        <header className={styles.header}>
          <h1 className={styles.title}>サービス一覧</h1>
          <p className={styles.subtitle}>
            お客様のニーズに合わせた多様なサービスをご提供しています。
            <br />
            各サービスの詳細については、下記をご覧ください。
          </p>
        </header>

        {/* 統計情報 */}
        <section className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{servicesData.length}</span>
            <span className={styles.statLabel}>サービス</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{categories.length - 1}</span>
            <span className={styles.statLabel}>カテゴリー</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>100+</span>
            <span className={styles.statLabel}>実績数</span>
          </div>
        </section>

        {/* カテゴリーフィルター */}
        <section className={styles.categories}>
          <h2 className={styles.categoryTitle}>カテゴリー</h2>
          <div className={styles.categoryTags}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`${styles.categoryTag} ${
                  category === selectedCategory ? styles.active : ""
                }`}
              >
                {category}
                {category !== "すべて" && (
                  <span className={styles.count}>
                    (
                    {servicesData.filter((s) => s.category === category).length}
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 現在のフィルター表示 */}
        {selectedCategory !== "すべて" && (
          <div className={styles.currentFilter}>
            <span className={styles.filterLabel}>
              現在のカテゴリー: <strong>{selectedCategory}</strong>
            </span>
            <span className={styles.filterCount}>
              {filteredServices.length}件のサービス
            </span>
            <button
              onClick={() => handleCategoryChange("すべて")}
              className={styles.resetFilter}
            >
              すべて表示に戻る
            </button>
          </div>
        )}

        {/* サービス一覧 */}
        <section
          ref={servicesRef}
          className={`${styles.services} ${
            isAnimating ? styles.animating : ""
          }`}
        >
          <div className={styles.grid}>
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`${styles.serviceItem} ${styles.fadeIn}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          {/* フィルタ結果が0件の場合 */}
          {filteredServices.length === 0 && (
            <div className={styles.noResults}>
              <h3>該当するサービスが見つかりませんでした</h3>
              <p>他のカテゴリーをお試しください。</p>
              <button
                onClick={() => handleCategoryChange("すべて")}
                className={styles.showAllButton}
              >
                すべてのサービスを表示
              </button>
            </div>
          )}
        </section>

        {/* CTAセクション */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>お気軽にご相談ください</h2>
            <p>
              ご不明な点やサービスについてのご質問がございましたら、
              <br />
              お気軽にお問い合わせください。
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={styles.primaryButton}>
                お問い合わせ
              </Link>
              <Link href="/" className={styles.secondaryButton}>
                トップページに戻る
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Sheet>
  );
}
