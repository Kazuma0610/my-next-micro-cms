"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import { Member } from "@/app/_libs/microcms";

type Props = {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
};

const MemberModal = ({ member, isOpen, onClose }: Props) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // スクロールを無効化
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset"; // スクロールを有効化
    };
  }, [isOpen, onClose]);

  // メンバーごとのスキルと経験を直書きで定義
  const getMemberSkills = (memberName: string) => {
    switch (memberName) {
      case "デイビッド・チェン":
        return ["React", "Next.js", "TypeScript", "Node.js", "AWS"];
      case "エミリー・サンダース":
        return ["Vue.js", "Python", "Django", "PostgreSQL", "Docker"];
      case "ジョン・ウィルソン":
        return ["Angular", "Java", "Spring Boot", "MySQL", "GCP"];
      default:
        return ["JavaScript", "HTML", "CSS"];
    }
  };

  const getMemberExperience = (memberName: string) => {
    switch (memberName) {
      case "デイビッド・チェン":
        return `
          • Webアプリケーション開発歴10年
          • 大手ECサイトの構築プロジェクトリーダー経験
          • フロントエンド開発チームマネジメント経験5年
          • React.js導入による既存システムモダナイゼーション実績多数
          • AWS上でのサーバーレスアーキテクチャ設計・構築経験
        `;
      case "エミリー・サンダース":
        return `
          • フルスタック開発歴8年
          •金融システム開発での豊富な経験
          • Python/Djangoでの大規模システム構築実績
          • データベース設計・最適化のスペシャリスト
          • DevOps環境構築とCI/CD導入実績
        `;
      case "ジョン・ウィルソン":
        return `
          • エンタープライズアプリケーション開発歴12年
          • Java/Spring Bootでの業務システム構築多数
          • アーキテクチャ設計からインフラ構築まで幅広く対応
          • Google Cloud Platform認定資格保有
          • 新人エンジニア教育・メンタリング経験豊富
        `;
      default:
        return "豊富な開発経験を持つエンジニアです。";
    }
  };

  if (!isOpen || !member) return null;

  const skills = getMemberSkills(member.name);
  const experience = getMemberExperience(member.name);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.modalHeader}>
          <Image
            src={member.image.url}
            alt={member.name}
            width={200}
            height={200}
            className={styles.modalImage}
          />
          <div className={styles.modalInfo}>
            <h2 className={styles.modalName}>{member.name}</h2>
            <p className={styles.modalPosition}>{member.position}</p>
          </div>
        </div>

        <div className={styles.modalBody}>
          <h3 className={styles.sectionTitle}>プロフィール</h3>
          <p className={styles.modalProfile}>{member.profile}</p>

          {/* スキル（直書き） */}
          <h3 className={styles.sectionTitle}>スキル</h3>
          <div className={styles.skills}>
            {skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>

          {/* 経験・実績（直書き） */}
          <h3 className={styles.sectionTitle}>経験・実績</h3>
          <div className={styles.modalExperience}>
            {experience.split("\n").map((line, index) => (
              <p key={index} className={styles.experienceLine}>
                {line.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
