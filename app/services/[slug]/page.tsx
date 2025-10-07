// app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet";
import styles from "./page.module.css";

// サービスデータを直接定義（実際のプロジェクトに合わせて調整）
const servicesData = [
  {
    id: "web-design",
    slug: "web-design",
    title: "Webサイト制作",
    description:
      "レスポンシブデザインに対応した高品質なWebサイトを制作いたします。",
    content: `
      <h2>Webサイト制作について</h2>
      <p>弊社では、お客様のビジネスニーズに合わせた高品質なWebサイトを制作いたします。レスポンシブデザインはもちろん、SEO対策や高速表示最適化まで、総合的なWeb制作サービスを提供しています。</p>
      
      <h3>サービス内容</h3>
      <ul>
        <li>レスポンシブWebデザイン</li>
        <li>SEO対策・検索エンジン最適化</li>
        <li>高速表示最適化</li>
        <li>CMS（コンテンツ管理システム）導入</li>
        <li>お問い合わせフォーム設置</li>
        <li>Google Analytics導入</li>
      </ul>

      <h3>制作フロー</h3>
      <ol>
        <li>ヒアリング・要件定義</li>
        <li>デザイン制作・確認</li>
        <li>コーディング・開発</li>
        <li>テスト・確認</li>
        <li>本番環境への公開</li>
        <li>運用サポート</li>
      </ol>
    `,
    image: {
      url: "/web.png",
      width: 800,
      height: 400,
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
    technologies: ["HTML5", "CSS3", "PHP", "JavaScript", "React", "Next.js"],
    publishedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "mobile-app",
    slug: "mobile-app",
    title: "モバイルアプリ開発",
    description: "iOS・Android両対応のネイティブアプリ開発を提供いたします。",
    content: `
      <h2>モバイルアプリ開発について</h2>
      <p>iOS・Android両対応のネイティブアプリ開発から、React NativeやFlutterを使用したクロスプラットフォーム開発まで対応しています。</p>
      
      <h3>対応プラットフォーム</h3>
      <ul>
        <li>iOS（iPhone・iPad）</li>
        <li>Android</li>
        <li>クロスプラットフォーム（React Native・Flutter）</li>
      </ul>

      <h3>開発実績</h3>
      <p>これまでに50以上のモバイルアプリを開発し、App Store・Google Playでの公開をサポートしてきました。</p>
    `,
    image: {
      url: "/app.png",
      width: 800,
      height: 400,
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
    technologies: ["Swift", "Kotlin", "React Native", "Flutter"],
    publishedAt: "2024-01-02T00:00:00.000Z",
  },
  // 他のサービスも同様に追加...
];

type Props = {
  params: {
    slug: string;
  };
};

export default async function ServiceDetailPage({ params }: Props) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <Sheet hasSidebar={false}>
      <Breadcrumbs />

      <article className={styles.article}>
        {/* ヘッダー部分 */}
        <header className={styles.header}>
          <div className={styles.category}>
            <span className={styles.categoryTag}>{service.category}</span>
          </div>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.description}>{service.description}</p>
        </header>

        {/* メイン画像 */}
        {service.image && (
          <div className={styles.imageContainer}>
            <Image
              src={service.image.url}
              alt={service.title}
              width={service.image.width}
              height={service.image.height}
              className={styles.mainImage}
              priority
            />
          </div>
        )}

        {/* サービス概要 */}
        <section className={styles.overview}>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewItem}>
              <h3>料金目安</h3>
              <p>{service.price}</p>
            </div>
            <div className={styles.overviewItem}>
              <h3>制作期間</h3>
              <p>{service.duration}</p>
            </div>
            <div className={styles.overviewItem}>
              <h3>カテゴリー</h3>
              <p>{service.category}</p>
            </div>
          </div>
        </section>

        {/* 特徴・機能一覧 */}
        <section className={styles.features}>
          <h2>主な特徴・機能</h2>
          <ul className={styles.featuresList}>
            {service.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* 使用技術 */}
        <section className={styles.technologies}>
          <h2>使用技術</h2>
          <div className={styles.techTags}>
            {service.technologies.map((tech, index) => (
              <span key={index} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* メインコンテンツ */}
        <section
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: service.content,
          }}
        />

        {/* CTA（お問い合わせ）セクション */}
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>このサービスについてお問い合わせ</h2>
            <p>詳細な要件やお見積りについて、お気軽にご相談ください。</p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className={styles.primaryButton}>
                お問い合わせ
              </Link>
              <Link href="/services" className={styles.secondaryButton}>
                サービス一覧に戻る
              </Link>
            </div>
          </div>
        </section>
      </article>
    </Sheet>
  );
}

// メタデータの生成
export async function generateMetadata({ params }: Props) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "サービスが見つかりません",
    };
  }

  return {
    title: `${service.title} | サービス詳細`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: service.image ? [service.image.url] : [],
    },
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}
