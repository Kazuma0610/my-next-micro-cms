"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import Sheet from "@/app/_components/Sheet";
import styles from "./page.module.css";

type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  category: string;
};

type Props = {
  service: Service;
};

export default function ServiceDetailClient({ service }: Props) {
  const [activeTab, setActiveTab] = useState("overview");

  // タブの定義
  const tabs = [
    { id: "overview", label: "概要・特徴" },
    { id: "pricing", label: "料金・期間" },
    { id: "technology", label: "技術・開発" },
    { id: "process", label: "制作フロー" },
  ];

  // タブコンテンツの定義（HTML直書き）
  const getTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.tabContent}>
            <h2>サービス概要</h2>
            <p>
              弊社では、お客様のビジネスニーズに合わせた高品質なWebサイトを制作いたします。
              レスポンシブデザインはもちろん、SEO対策や高速表示最適化まで、総合的なWeb制作サービスを提供しています。
            </p>

            <h3>主な特徴・機能</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <h4>レスポンシブデザイン</h4>
                <p>PC・タブレット・スマホすべてのデバイスに最適化</p>
              </div>
              <div className={styles.featureCard}>
                <h4>SEO対策</h4>
                <p>検索エンジンで上位表示されるよう最適化</p>
              </div>
              <div className={styles.featureCard}>
                <h4>高速表示最適化</h4>
                <p>ページ読み込み速度を最大限に向上</p>
              </div>
              <div className={styles.featureCard}>
                <h4>CMS導入</h4>
                <p>お客様自身でコンテンツ更新が可能</p>
              </div>
            </div>

            <h3>こんな方におすすめ</h3>
            <ul className={styles.recommendList}>
              <li>新規でWebサイトを立ち上げたい</li>
              <li>古いサイトをリニューアルしたい</li>
              <li>スマホ対応のサイトが欲しい</li>
              <li>集客力のあるサイトを作りたい</li>
            </ul>
          </div>
        );

      case "pricing":
        return (
          <div className={styles.tabContent}>
            <h2>料金プラン</h2>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <h3>ベーシックプラン</h3>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>300,000円</span>
                    <span className={styles.priceUnit}>〜</span>
                  </div>
                </div>
                <div className={styles.pricingFeatures}>
                  <ul>
                    <li>5ページまで</li>
                    <li>レスポンシブデザイン</li>
                    <li>基本的なSEO対策</li>
                    <li>お問い合わせフォーム</li>
                    <li>3ヶ月間の保守サポート</li>
                  </ul>
                </div>
              </div>

              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <h3>スタンダードプラン</h3>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>500,000円</span>
                    <span className={styles.priceUnit}>〜</span>
                  </div>
                </div>
                <div className={styles.pricingFeatures}>
                  <ul>
                    <li>10ページまで</li>
                    <li>CMS導入</li>
                    <li>高度なSEO対策</li>
                    <li>Google Analytics設定</li>
                    <li>6ヶ月間の保守サポート</li>
                  </ul>
                </div>
              </div>

              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <h3>プレミアムプラン</h3>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>800,000円</span>
                    <span className={styles.priceUnit}>〜</span>
                  </div>
                </div>
                <div className={styles.pricingFeatures}>
                  <ul>
                    <li>ページ数無制限</li>
                    <li>カスタム機能開発</li>
                    <li>多言語対応</li>
                    <li>高速化最適化</li>
                    <li>12ヶ月間の保守サポート</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3>制作期間</h3>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineItem}>
                <h4>ベーシックプラン</h4>
                <p>2〜3週間</p>
              </div>
              <div className={styles.timelineItem}>
                <h4>スタンダードプラン</h4>
                <p>3〜5週間</p>
              </div>
              <div className={styles.timelineItem}>
                <h4>プレミアムプラン</h4>
                <p>6〜8週間</p>
              </div>
            </div>
          </div>
        );

      case "technology":
        return (
          <div className={styles.tabContent}>
            <h2>使用技術・開発環境</h2>

            <h3>フロントエンド技術</h3>
            <div className={styles.techGrid}>
              <div className={styles.techItem}>
                <h4>HTML5・CSS3</h4>
                <p>最新のWeb標準に準拠した構造とスタイリング</p>
              </div>
              <div className={styles.techItem}>
                <h4>React・Next.js</h4>
                <p>モダンなJavaScriptフレームワークでの開発</p>
              </div>
              <div className={styles.techItem}>
                <h4>Responsive Design</h4>
                <p>全デバイス対応のレスポンシブレイアウト</p>
              </div>
            </div>

            <h3>バックエンド・CMS</h3>
            <div className={styles.techGrid}>
              <div className={styles.techItem}>
                <h4>PHP・Laravel</h4>
                <p>安定性と拡張性に優れたバックエンド開発</p>
              </div>
              <div className={styles.techItem}>
                <h4>WordPress・Headless CMS</h4>
                <p>管理しやすいコンテンツ管理システム</p>
              </div>
              <div className={styles.techItem}>
                <h4>セキュリティ対策</h4>
                <p>SSL証明書・セキュリティ強化対応</p>
              </div>
            </div>

            <h3>開発・運用ツール</h3>
            <div className={styles.toolsList}>
              <div className={styles.toolItem}>
                <span className={styles.toolName}>Git・GitHub</span>
                <span className={styles.toolDesc}>バージョン管理</span>
              </div>
              <div className={styles.toolItem}>
                <span className={styles.toolName}>Figma・Adobe XD</span>
                <span className={styles.toolDesc}>デザインツール</span>
              </div>
              <div className={styles.toolItem}>
                <span className={styles.toolName}>Google Analytics</span>
                <span className={styles.toolDesc}>アクセス解析</span>
              </div>
              <div className={styles.toolItem}>
                <span className={styles.toolName}>PageSpeed Insights</span>
                <span className={styles.toolDesc}>パフォーマンス測定</span>
              </div>
            </div>
          </div>
        );

      case "process":
        return (
          <div className={styles.tabContent}>
            <h2>制作フロー</h2>
            <p>
              お客様に安心してご依頼いただけるよう、明確な制作フローを設定しています。
            </p>

            <div className={styles.processSteps}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>ヒアリング・要件定義</h3>
                  <p>
                    お客様のご要望、目的、ターゲットユーザーなどを詳しくお聞きし、最適な提案をいたします。
                  </p>
                  <div className={styles.stepDuration}>期間: 3〜5日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>企画・設計</h3>
                  <p>
                    サイト構成、機能仕様、デザインコンセプトを決定し、ワイヤーフレームを作成します。
                  </p>
                  <div className={styles.stepDuration}>期間: 5〜7日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>デザイン制作</h3>
                  <p>
                    ワイヤーフレームを基に、ブランドイメージに合わせたデザインを制作します。
                  </p>
                  <div className={styles.stepDuration}>期間: 7〜10日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>コーディング・開発</h3>
                  <p>
                    確定したデザインを基に、HTML・CSS・JavaScriptでWebサイトを構築します。
                  </p>
                  <div className={styles.stepDuration}>期間: 10〜14日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <h3>テスト・確認</h3>
                  <p>
                    各種ブラウザ・デバイスでの動作確認、パフォーマンステストを実施します。
                  </p>
                  <div className={styles.stepDuration}>期間: 3〜5日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepContent}>
                  <h3>公開・納品</h3>
                  <p>
                    本番環境への公開、操作説明、保守サポートの開始を行います。
                  </p>
                  <div className={styles.stepDuration}>期間: 2〜3日</div>
                </div>
              </div>
            </div>

            <div className={styles.afterSupport}>
              <h3>公開後のサポート</h3>
              <div className={styles.supportGrid}>
                <div className={styles.supportItem}>
                  <h4>技術サポート</h4>
                  <p>不具合対応・セキュリティアップデート</p>
                </div>
                <div className={styles.supportItem}>
                  <h4>運用支援</h4>
                  <p>アクセス解析・改善提案</p>
                </div>
                <div className={styles.supportItem}>
                  <h4>操作説明</h4>
                  <p>CMS操作方法・更新手順のレクチャー</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>コンテンツが見つかりません</div>;
    }
  };

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

        {/* タブナビゲーション */}
        <div className={styles.tabNavigation}>
          <div className={styles.tabList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className={styles.tabContainer}>{getTabContent()}</div>

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
