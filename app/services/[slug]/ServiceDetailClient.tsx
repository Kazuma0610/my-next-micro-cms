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

  // サービス別コンテンツデータ
  const serviceContents: Record<string, any> = {
    "web-design": {
      overview: {
        title: "Webサイト制作サービス",
        description:
          "お客様のビジネスニーズに合わせた高品質なWebサイトを制作いたします。レスポンシブデザインはもちろん、SEO対策や高速表示最適化まで、総合的なWeb制作サービスを提供しています。",
        features: [
          {
            title: "レスポンシブデザイン",
            desc: "PC・タブレット・スマホすべてのデバイスに最適化",
          },
          { title: "SEO対策", desc: "検索エンジンで上位表示されるよう最適化" },
          { title: "高速表示最適化", desc: "ページ読み込み速度を最大限に向上" },
          { title: "CMS導入", desc: "お客様自身でコンテンツ更新が可能" },
        ],
        recommendations: [
          "新規でWebサイトを立ち上げたい",
          "古いサイトをリニューアルしたい",
          "スマホ対応のサイトが欲しい",
          "集客力のあるサイトを作りたい",
        ],
      },
      pricing: [
        {
          name: "ベーシックプラン",
          price: "300,000円",
          features: [
            "5ページまで",
            "レスポンシブデザイン",
            "基本的なSEO対策",
            "お問い合わせフォーム",
            "3ヶ月間の保守サポート",
          ],
          duration: "2〜3週間",
        },
        {
          name: "スタンダードプラン",
          price: "500,000円",
          features: [
            "10ページまで",
            "CMS導入",
            "高度なSEO対策",
            "Google Analytics設定",
            "6ヶ月間の保守サポート",
          ],
          duration: "3〜5週間",
        },
        {
          name: "プレミアムプラン",
          price: "800,000円",
          features: [
            "ページ数無制限",
            "カスタム機能開発",
            "多言語対応",
            "高速化最適化",
            "12ヶ月間の保守サポート",
          ],
          duration: "6〜8週間",
        },
      ],
      technology: {
        frontend: [
          {
            name: "HTML5・CSS3",
            desc: "最新のWeb標準に準拠した構造とスタイリング",
          },
          {
            name: "React・Next.js",
            desc: "モダンなJavaScriptフレームワークでの開発",
          },
          {
            name: "Responsive Design",
            desc: "全デバイス対応のレスポンシブレイアウト",
          },
        ],
        backend: [
          {
            name: "PHP・Laravel",
            desc: "安定性と拡張性に優れたバックエンド開発",
          },
          {
            name: "WordPress・Headless CMS",
            desc: "管理しやすいコンテンツ管理システム",
          },
          { name: "セキュリティ対策", desc: "SSL証明書・セキュリティ強化対応" },
        ],
        tools: [
          { name: "Git・GitHub", desc: "バージョン管理" },
          { name: "Figma・Adobe XD", desc: "デザインツール" },
          { name: "Google Analytics", desc: "アクセス解析" },
          { name: "PageSpeed Insights", desc: "パフォーマンス測定" },
        ],
      },
    },

    "mobile-app": {
      overview: {
        title: "モバイルアプリ開発サービス",
        description:
          "iOS・Android両対応のネイティブアプリ開発から、React NativeやFlutterを使用したクロスプラットフォーム開発まで、幅広いモバイルアプリ開発サービスを提供しています。",
        features: [
          {
            title: "クロスプラットフォーム対応",
            desc: "iOS・Android両方で動作するアプリを効率的に開発",
          },
          {
            title: "ネイティブ性能",
            desc: "デバイス固有の機能を活用した高性能なアプリ",
          },
          {
            title: "UI/UXデザイン",
            desc: "使いやすさを重視したモダンなデザイン",
          },
          {
            title: "プッシュ通知",
            desc: "ユーザーエンゲージメントを高める通知機能",
          },
        ],
        recommendations: [
          "ビジネス向けのアプリを開発したい",
          "既存サービスのアプリ版を作りたい",
          "ECアプリで売上を向上させたい",
          "顧客との接点を増やしたい",
        ],
      },
      pricing: [
        {
          name: "スタートアップ",
          price: "800,000円",
          features: [
            "基本機能のみ",
            "iOS・Android対応",
            "基本的なUI/UX",
            "3ヶ月間サポート",
            "アプリストア申請代行",
          ],
          duration: "2〜3ヶ月",
        },
        {
          name: "ビジネス",
          price: "1,500,000円",
          features: [
            "高度な機能実装",
            "カスタムデザイン",
            "API連携",
            "プッシュ通知",
            "6ヶ月間サポート",
          ],
          duration: "3〜5ヶ月",
        },
        {
          name: "エンタープライズ",
          price: "3,000,000円",
          features: [
            "完全カスタム開発",
            "高度なセキュリティ",
            "大規模システム連携",
            "運用・保守込み",
            "12ヶ月間サポート",
          ],
          duration: "5〜8ヶ月",
        },
      ],
      technology: {
        frontend: [
          {
            name: "React Native",
            desc: "JavaScriptでiOS・Android両対応アプリを開発",
          },
          {
            name: "Flutter",
            desc: "Googleが開発したクロスプラットフォームフレームワーク",
          },
          { name: "Swift・Kotlin", desc: "ネイティブ開発での高性能実装" },
        ],
        backend: [
          { name: "Node.js・Express", desc: "高速でスケーラブルなAPI開発" },
          {
            name: "Firebase",
            desc: "Googleが提供するBaaS（Backend as a Service）",
          },
          { name: "AWS・GCP", desc: "クラウドインフラによる安定稼働" },
        ],
        tools: [
          { name: "Xcode・Android Studio", desc: "ネイティブ開発環境" },
          {
            name: "TestFlight・Google Play Console",
            desc: "アプリ配信・テスト環境",
          },
          { name: "Firebase Analytics", desc: "アプリ内分析ツール" },
          { name: "Crashlytics", desc: "クラッシュレポート・エラー監視" },
        ],
      },
    },

    "ec-site": {
      overview: {
        title: "ECサイト構築サービス",
        description:
          "売上向上を目的とした高機能ECサイトを構築いたします。決済システム・在庫管理・顧客管理まで、オンライン販売に必要な機能を全て搭載し、運用しやすいECサイトを提供します。",
        features: [
          {
            title: "多様な決済方法",
            desc: "クレジットカード・コンビニ決済・電子マネー等に対応",
          },
          {
            title: "在庫管理システム",
            desc: "リアルタイムでの在庫管理・自動発注機能",
          },
          { title: "顧客管理機能", desc: "購入履歴・会員ランク・ポイント管理" },
          {
            title: "マーケティング機能",
            desc: "クーポン・セール・メルマガ配信機能",
          },
        ],
        recommendations: [
          "オンラインで商品を販売したい",
          "実店舗の売上をアップさせたい",
          "効率的な受注管理をしたい",
          "顧客データを活用したい",
        ],
      },
      pricing: [
        {
          name: "ライトプラン",
          price: "600,000円",
          features: [
            "50商品まで",
            "基本決済機能",
            "在庫管理",
            "SSL証明書",
            "3ヶ月間サポート",
          ],
          duration: "1〜2ヶ月",
        },
        {
          name: "スタンダード",
          price: "1,200,000円",
          features: [
            "500商品まで",
            "多様な決済方法",
            "顧客管理",
            "クーポン機能",
            "6ヶ月間サポート",
          ],
          duration: "2〜3ヶ月",
        },
        {
          name: "プロフェッショナル",
          price: "2,500,000円",
          features: [
            "商品数無制限",
            "高度なマーケティング",
            "API連携",
            "多店舗管理",
            "12ヶ月間サポート",
          ],
          duration: "3〜5ヶ月",
        },
      ],
      technology: {
        frontend: [
          { name: "Next.js・React", desc: "高速でSEOに強いフロントエンド構築" },
          {
            name: "Shopify・WooCommerce",
            desc: "実績豊富なECプラットフォーム",
          },
          { name: "PWA対応", desc: "モバイルアプリのような使用感を実現" },
        ],
        backend: [
          { name: "Stripe・PayPal", desc: "安全で多様な決済システム連携" },
          { name: "AWS・Heroku", desc: "スケーラブルなクラウドインフラ" },
          { name: "GraphQL・REST API", desc: "効率的なデータ通信システム" },
        ],
        tools: [
          { name: "Google Analytics", desc: "売上・アクセス分析" },
          { name: "Mailchimp", desc: "メールマーケティング" },
          { name: "Zendesk", desc: "カスタマーサポート" },
          { name: "Slack", desc: "受注・在庫通知システム" },
        ],
      },
    },

    "system-development": {
      overview: {
        title: "システム開発サービス",
        description:
          "業務効率化を実現するカスタムシステム開発を行います。既存システムとの連携から、完全新規開発まで、お客様の業務フローに最適化されたシステムを構築いたします。",
        features: [
          { title: "業務自動化", desc: "定型業務の自動化で作業効率を大幅改善" },
          {
            title: "データ連携",
            desc: "既存システムとのシームレスなデータ連携",
          },
          {
            title: "セキュリティ強化",
            desc: "企業レベルの堅牢なセキュリティ対策",
          },
          {
            title: "スケーラビリティ",
            desc: "事業拡大に対応できる拡張性の高い設計",
          },
        ],
        recommendations: [
          "業務を効率化したい",
          "データ管理を改善したい",
          "既存システムを連携させたい",
          "競合他社との差別化を図りたい",
        ],
      },
      pricing: [
        {
          name: "小規模システム",
          price: "1,000,000円",
          features: [
            "基本機能のみ",
            "小規模データベース",
            "Web画面",
            "基本セキュリティ",
            "3ヶ月保守",
          ],
          duration: "2〜3ヶ月",
        },
        {
          name: "中規模システム",
          price: "3,000,000円",
          features: [
            "高度な機能実装",
            "大容量データベース",
            "API連携",
            "高セキュリティ",
            "6ヶ月保守",
          ],
          duration: "4〜6ヶ月",
        },
        {
          name: "大規模システム",
          price: "8,000,000円",
          features: [
            "完全カスタム開発",
            "冗長化構成",
            "高可用性",
            "24時間監視",
            "12ヶ月保守",
          ],
          duration: "8〜12ヶ月",
        },
      ],
      technology: {
        frontend: [
          {
            name: "Vue.js・Angular",
            desc: "エンタープライズレベルのフロントエンド",
          },
          { name: "TypeScript", desc: "型安全性を重視した堅牢な開発" },
          { name: "Material-UI・Ant Design", desc: "統一感のある業務系UI" },
        ],
        backend: [
          {
            name: "Java・Spring Boot",
            desc: "企業システムでの実績豊富なフレームワーク",
          },
          {
            name: "Python・Django",
            desc: "データ処理・AI連携に強いバックエンド",
          },
          { name: "PostgreSQL・MySQL", desc: "高性能・高信頼性データベース" },
        ],
        tools: [
          { name: "Docker・Kubernetes", desc: "コンテナ化による安定運用" },
          { name: "Jenkins・GitHub Actions", desc: "CI/CD自動化" },
          { name: "Prometheus・Grafana", desc: "システム監視・可視化" },
          { name: "Elasticsearch", desc: "高速ログ検索・分析" },
        ],
      },
    },
  };

  // 現在のサービスのコンテンツを取得（デフォルトはweb-design）
  const currentContent =
    serviceContents[service.slug] || serviceContents["web-design"];

  // タブコンテンツの定義
  const getTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.tabContent}>
            <h2>サービス概要</h2>
            <p>{currentContent.overview.description}</p>

            <h3>主な特徴・機能</h3>
            <div className={styles.featureGrid}>
              {currentContent.overview.features.map(
                (feature: any, index: number) => (
                  <div key={index} className={styles.featureCard}>
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                )
              )}
            </div>

            <h3>こんな方におすすめ</h3>
            <ul className={styles.recommendList}>
              {currentContent.overview.recommendations.map(
                (item: string, index: number) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>
        );

      case "pricing":
        return (
          <div className={styles.tabContent}>
            <h2>料金プラン</h2>

            <div className={styles.pricingGrid}>
              {currentContent.pricing.map((plan: any, index: number) => (
                <div key={index} className={styles.pricingCard}>
                  <div className={styles.pricingHeader}>
                    <h3>{plan.name}</h3>
                    <div className={styles.price}>
                      <span className={styles.priceAmount}>{plan.price}</span>
                      <span className={styles.priceUnit}>〜</span>
                    </div>
                  </div>
                  <div className={styles.pricingFeatures}>
                    <ul>
                      {plan.features.map(
                        (feature: string, featureIndex: number) => (
                          <li key={featureIndex}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <h3>制作期間</h3>
            <div className={styles.timelineGrid}>
              {currentContent.pricing.map((plan: any, index: number) => (
                <div key={index} className={styles.timelineItem}>
                  <h4>{plan.name}</h4>
                  <p>{plan.duration}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "technology":
        return (
          <div className={styles.tabContent}>
            <h2>使用技術・開発環境</h2>

            <h3>フロントエンド技術</h3>
            <div className={styles.techGrid}>
              {currentContent.technology.frontend.map(
                (tech: any, index: number) => (
                  <div key={index} className={styles.techItem}>
                    <h4>{tech.name}</h4>
                    <p>{tech.desc}</p>
                  </div>
                )
              )}
            </div>

            <h3>バックエンド・インフラ</h3>
            <div className={styles.techGrid}>
              {currentContent.technology.backend.map(
                (tech: any, index: number) => (
                  <div key={index} className={styles.techItem}>
                    <h4>{tech.name}</h4>
                    <p>{tech.desc}</p>
                  </div>
                )
              )}
            </div>

            <h3>開発・運用ツール</h3>
            <div className={styles.toolsList}>
              {currentContent.technology.tools.map(
                (tool: any, index: number) => (
                  <div key={index} className={styles.toolItem}>
                    <span className={styles.toolName}>{tool.name}</span>
                    <span className={styles.toolDesc}>{tool.desc}</span>
                  </div>
                )
              )}
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
                    システム構成、機能仕様、技術要件を決定し、詳細な設計書を作成します。
                  </p>
                  <div className={styles.stepDuration}>期間: 1〜2週間</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>開発・実装</h3>
                  <p>
                    設計書に基づいて、品質の高いコードでシステムを実装いたします。
                  </p>
                  <div className={styles.stepDuration}>
                    期間: プロジェクトにより変動
                  </div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>テスト・品質保証</h3>
                  <p>
                    単体テスト・結合テスト・システムテストを実施し、品質を保証します。
                  </p>
                  <div className={styles.stepDuration}>期間: 1〜3週間</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <h3>本番リリース</h3>
                  <p>
                    本番環境への配信、動作確認、運用開始サポートを行います。
                  </p>
                  <div className={styles.stepDuration}>期間: 3〜5日</div>
                </div>
              </div>

              <div className={styles.processStep}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepContent}>
                  <h3>運用・保守</h3>
                  <p>
                    システムの安定稼働をサポートし、継続的な改善提案を行います。
                  </p>
                  <div className={styles.stepDuration}>期間: 継続的</div>
                </div>
              </div>
            </div>

            <div className={styles.afterSupport}>
              <h3>リリース後のサポート</h3>
              <div className={styles.supportGrid}>
                <div className={styles.supportItem}>
                  <h4>技術サポート</h4>
                  <p>障害対応・セキュリティアップデート・機能追加</p>
                </div>
                <div className={styles.supportItem}>
                  <h4>運用支援</h4>
                  <p>パフォーマンス監視・ログ分析・改善提案</p>
                </div>
                <div className={styles.supportItem}>
                  <h4>教育・研修</h4>
                  <p>システム操作方法・管理者向けトレーニング</p>
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
