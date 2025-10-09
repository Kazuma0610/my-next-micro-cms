"use client";

import Image from "next/image";
import styles from "./index.module.css";
import ScrollAnimatedSection from "../ScrollAnimatedSection";

const CompanyIntroduction = () => {
  return (
    <section className={styles.companyIntroSection}>
      <div className={styles.introContainer}>
        <ScrollAnimatedSection
          animation="fadeInLeft"
          delay={0}
          duration={800}
          threshold={0.3}
          className={styles.introTextWrapper}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>テクノロジーで未来を創造</h2>
            <p className={styles.sectionSubtitle}>
              お客様のビジネス課題を技術で解決することが私たちの使命です
            </p>
          </div>
        </ScrollAnimatedSection>

        <div className={styles.introContent}>
          <ScrollAnimatedSection
            animation="fadeInLeft"
            delay={0}
            duration={800}
            threshold={0.3}
            className={styles.introTextWrapper}
          >
            <div className={styles.introText}>
              <ScrollAnimatedSection
                animation="slideReveal"
                delay={0}
                duration={800}
                threshold={0.3}
              >
                <h3 className={styles.introTitle}>
                  信頼と実績で選ばれ続ける理由
                </h3>
              </ScrollAnimatedSection>
              <ScrollAnimatedSection
                animation="fadeInUp"
                delay={100}
                duration={800}
                threshold={0.3}
              >
                <p className={styles.introDescription}>
                  私たちは創業以来、お客様のビジネス課題を技術で解決することを使命としています。
                  経験豊富なエンジニアチームと最新の開発手法で、
                  お客様の成功を全力でサポートいたします。
                </p>
              </ScrollAnimatedSection>
              <div className={styles.introFeatures}>
                <ScrollAnimatedSection
                  animation="fadeInUp"
                  delay={200}
                  duration={600}
                  className={styles.feature}
                >
                  <span className={styles.featureIcon}>✓</span>
                  <span className={styles.featureText}>
                    豊富な開発実績（500+ プロジェクト）
                  </span>
                </ScrollAnimatedSection>
                <ScrollAnimatedSection
                  animation="fadeInUp"
                  delay={400}
                  duration={600}
                  className={styles.feature}
                >
                  <span className={styles.featureIcon}>✓</span>
                  <span className={styles.featureText}>最新技術への対応力</span>
                </ScrollAnimatedSection>
                <ScrollAnimatedSection
                  animation="fadeInUp"
                  delay={600}
                  duration={600}
                  className={styles.feature}
                >
                  <span className={styles.featureIcon}>✓</span>
                  <span className={styles.featureText}>
                    充実のアフターサポート
                  </span>
                </ScrollAnimatedSection>
              </div>
            </div>
          </ScrollAnimatedSection>

          <ScrollAnimatedSection
            animation="fadeInRight"
            delay={300}
            duration={800}
            threshold={0.3}
            className={styles.introImageWrapper}
          >
            <div className={styles.introImage}>
              <Image
                src="/company.png"
                alt="会社紹介"
                width={600}
                height={400}
                className={styles.introImg}
              />
              {/* 装飾的な要素 */}
              <div className={styles.imageDecoration1}></div>
              <div className={styles.imageDecoration2}></div>
            </div>
          </ScrollAnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntroduction;
