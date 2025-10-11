import { getMembersList } from "@/app/_libs/microcms";
import { MEMBERS_LIST_LIMIT } from "@/app/_constants";
import MembersClient from "./MembersClient";
import style from "./page.module.css";
import Breadcrumbs from "../_components/Breadcrumbs";

export const metadata = {
  title: "メンバー",
  description: "私たちのチームをご紹介します。",
};

export default async function Page() {
  const data = await getMembersList({ limit: MEMBERS_LIST_LIMIT });

  return (
    <>
      <Breadcrumbs />
      {/* 会社概要セクション */}
      <section className={style.companyOverview}>
        <div className={style.container}>
          <div className={style.overviewHeader}>
            <h2 className={style.overviewTitle}>Company Overview</h2>
            <p className={style.overviewSubtitle}>私たちについて</p>
          </div>

          <div className={style.overviewContent}>
            <div className={style.overviewGrid}>
              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>会社名</h3>
                <p className={style.itemContent}>
                  株式会社テックイノベーション
                </p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>設立年</h3>
                <p className={style.itemContent}>2020年4月</p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>代表者</h3>
                <p className={style.itemContent}>
                  代表取締役　デイビット・チェン
                </p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>所在地</h3>
                <p className={style.itemContent}>
                  〒100-0001
                  <br />
                  東京都千代田区千代田1-1-1
                  <br />
                  テックビル10F
                </p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>資本金</h3>
                <p className={style.itemContent}>5,000万円</p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>従業員数</h3>
                <p className={style.itemContent}>50名（2024年10月現在）</p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>事業内容</h3>
                <p className={style.itemContent}>
                  ・Webアプリケーション開発
                  <br />
                  ・システム開発・コンサルティング
                  <br />
                  ・デジタルマーケティング支援
                  <br />
                  ・AI・機械学習ソリューション
                </p>
              </div>

              <div className={style.overviewItem}>
                <h3 className={style.itemTitle}>主要取引先</h3>
                <p className={style.itemContent}>
                  ・大手製造業A社
                  <br />
                  ・金融機関B社
                  <br />
                  ・小売チェーンC社
                  <br />
                  ・スタートアップ企業多数
                </p>
              </div>
            </div>
          </div>

          {/* ミッション・ビジョン */}
          <div className={style.missionVision}>
            <div className={style.missionItem}>
              <h3 className={style.missionTitle}>Mission</h3>
              <p className={style.missionText}>
                テクノロジーの力で、お客様のビジネス課題を解決し、
                社会により良い価値を提供し続ける
              </p>
            </div>

            <div className={style.missionItem}>
              <h3 className={style.missionTitle}>Vision</h3>
              <p className={style.missionText}>
                革新的な技術と創造的なアイデアで、
                未来のデジタル社会を牽引する企業となる
              </p>
            </div>

            <div className={style.missionItem}>
              <h3 className={style.missionTitle}>Values</h3>
              <p className={style.missionText}>
                ・挑戦：常に新しい技術と可能性に挑戦する
                <br />
                ・協働：チーム一丸となって目標を達成する
                <br />
                ・革新：既存の枠を超えた価値を創造する
                <br />
                ・信頼：お客様との長期的な信頼関係を築く
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* チーム紹介セクション */}
      <section className={style.intro}>
        <div className={style.container}>
          <h2 className={style.title}>Our Team</h2>
          <p className={style.description}>
            私たちのチームは、多様なバックグラウンドと専門知識を持つメンバーで構成されています。各メンバーがそれぞれの分野で卓越したスキルを発揮し、共通の目標に向かって協力しています。私たちの強みは、個々の才能を最大限に活かし、チーム全体としてのシナジーを生み出すことです。ここでは、私たちのチームメンバーをご紹介します。
          </p>
        </div>
      </section>
      <MembersClient members={data.contents} />
    </>
  );
}
