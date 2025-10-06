// app/_components/ServicesList/index.tsx
import Link from "next/link";
import ServiceCard, { Service } from "../../_components/ServiceCard";
import styles from "./index.module.css";

interface ServicesListProps {
  showMoreButton?: boolean;
  maxItems?: number;
}

// サービスデータを直接定義
const servicesData: Service[] = [
  {
    id: "1",
    title: "Webサイト制作",
    description:
      "レスポンシブデザインに対応した高品質なWebサイトを制作いたします。SEO対策も含めた総合的なWeb制作サービスです。",
    image: {
      url: "/web.png",
      width: 400,
      height: 250,
    },
    features: ["レスポンシブデザイン", "SEO対策", "高速表示最適化"],
    category: "Web制作",
    link: "/services/web-design",
  },
  {
    id: "2",
    title: "モバイルアプリ開発",
    description:
      "iOS・Android両対応のネイティブアプリ開発から、React NativeやFlutterを使用したクロスプラットフォーム開発まで対応。",
    image: {
      url: "/app.png",
      width: 400,
      height: 250,
    },
    features: ["iOS・Android対応", "クロスプラットフォーム", "UI/UXデザイン"],
    category: "アプリ開発",
    link: "/services/mobile-app",
  },
  {
    id: "3",
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
    link: "/services/system-development",
  },
  {
    id: "4",
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
    link: "/services/ecommerce",
  },
  {
    id: "5",
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
    link: "/services/consulting",
  },
  {
    id: "6",
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
    link: "/services/maintenance",
  },
];

export default function ServicesList({
  showMoreButton = true,
  maxItems = 6,
}: ServicesListProps) {
  const displayedServices = servicesData.slice(0, maxItems);

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>サービス一覧</h2>
          <p className={styles.subtitle}>
            お客様のニーズに合わせた多様なサービスをご提供しています
          </p>
        </div>

        <div className={styles.grid}>
          {displayedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {showMoreButton && servicesData.length > maxItems && (
          <div className={styles.moreButtonContainer}>
            <Link href="/services" className={styles.moreButton}>
              すべてのサービスを見る
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
