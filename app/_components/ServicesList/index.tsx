// app/_components/ServicesList/index.tsx
"use client";

import Link from "next/link";
import ServiceCard, { Service } from "../../_components/ServiceCard";
import styles from "./index.module.css";
import { useState, useEffect, useRef } from "react";

interface ServicesListProps {
  showMoreButton?: boolean;
  maxItems?: number;
  desktopDisplayCount?: number;
  tabletDisplayCount?: number;
  mobileDisplayCount?: number;
}

// サービスデータを直接定義
const servicesData: Service[] = [
  {
    id: "1",
    slug: "web-design", // slugを追加
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
    slug: "mobile-app", // slugを追加
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
    slug: "system-development", // slugを追加
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
    slug: "ecommerce", // slugを追加
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
    slug: "consulting", // slugを追加
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
    slug: "maintenance", // slugを追加
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
  desktopDisplayCount = 3,
  tabletDisplayCount = 2,
  mobileDisplayCount = 1,
}: ServicesListProps) {
  const [displayCount, setDisplayCount] = useState(desktopDisplayCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isMounted, setIsMounted] = useState(false);

  // セクション要素への参照
  const sectionRef = useRef<HTMLElement>(null);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // レスポンシブブレークポイントの監視
  useEffect(() => {
    if (!isMounted) return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let newBreakpoint: "desktop" | "tablet" | "mobile";

      if (width <= 768) {
        newBreakpoint = "mobile";
      } else if (width <= 1024) {
        newBreakpoint = "tablet";
      } else {
        newBreakpoint = "desktop";
      }

      setCurrentBreakpoint(newBreakpoint);

      // 展開されていない場合のみ表示数を更新
      if (!isExpanded) {
        switch (newBreakpoint) {
          case "mobile":
            setDisplayCount(mobileDisplayCount);
            break;
          case "tablet":
            setDisplayCount(tabletDisplayCount);
            break;
          case "desktop":
          default:
            setDisplayCount(desktopDisplayCount);
            break;
        }
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [
    desktopDisplayCount,
    tabletDisplayCount,
    mobileDisplayCount,
    isExpanded,
    isMounted,
  ]);

  const displayedServices = servicesData.slice(0, displayCount);
  const hasMoreServices = displayCount < servicesData.length;

  // 現在のブレークポイントに応じた初期表示数を取得
  const getCurrentInitialCount = () => {
    switch (currentBreakpoint) {
      case "mobile":
        return mobileDisplayCount;
      case "tablet":
        return tabletDisplayCount;
      case "desktop":
      default:
        return desktopDisplayCount;
    }
  };

  const handleShowMore = () => {
    setDisplayCount(servicesData.length);
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    const initialCount = getCurrentInitialCount();
    setDisplayCount(initialCount);
    setIsExpanded(false);

    // より確実なスクロール処理
    setTimeout(() => {
      if (sectionRef.current) {
        // 複数の方法でスクロールを試行
        try {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } catch (error) {
          // fallback: window.scrollTo を使用
          const rect = sectionRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top;
          window.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }
    }, 100); // 少し遅延させてDOM更新を確実に待つ
  };

  const currentInitialCount = getCurrentInitialCount();

  // SSR時は初期状態で表示
  if (!isMounted) {
    return (
      <section className={styles.servicesSection} ref={sectionRef}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>サービス一覧</h2>
            <p className={styles.subtitle}>
              お客様のニーズに合わせた多様なサービスをご提供しています
            </p>
          </div>
          <div className={styles.grid}>
            {servicesData.slice(0, desktopDisplayCount).map((service) => (
              <div key={service.id} className={styles.serviceItem}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.servicesSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>サービス一覧</h2>
          <p className={styles.subtitle}>
            お客様のニーズに合わせた多様なサービスをご提供しています
          </p>
        </div>

        <div className={styles.grid}>
          {displayedServices.map((service, index) => (
            <div
              key={service.id}
              className={`${styles.serviceItem} ${
                index >= currentInitialCount ? styles.fadeIn : ""
              }`}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {hasMoreServices || isExpanded ? (
          <div className={styles.buttonContainer}>
            {!isExpanded ? (
              <button onClick={handleShowMore} className={styles.moreButton}>
                もっと見る（残り{servicesData.length - displayCount}件）
                <span className={styles.arrow}>↓</span>
              </button>
            ) : (
              <button onClick={handleShowLess} className={styles.lessButton}>
                閉じる
                <span className={styles.arrow}>↑</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
