"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "./index.module.css";
import { Member } from "@/app/_libs/microcms";

type Props = {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
};

type SocialLink = {
  name: string;
  url: string;
  logo: string;
  alt: string;
  width?: number;
  height?: number;
};

const MemberModal = ({ member, isOpen, onClose }: Props) => {
  const [isBodyLocked, setIsBodyLocked] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const scrollPositionRef = useRef<number>(0);
  const hasProcessedRef = useRef<boolean>(false);

  // モーダル用のルート要素作成
  useEffect(() => {
    if (typeof window !== "undefined") {
      let root = document.getElementById("modal-root");
      if (!root) {
        root = document.createElement("div");
        root.id = "modal-root";
        root.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none;
          z-index: 99999;
        `;
        document.body.appendChild(root);
      }
      setModalRoot(root);
    }

    return () => {
      // クリーンアップ時にはmodal-rootは残しておく（他のモーダルが使う可能性）
    };
  }, []);

  // onCloseのハンドリングを強化（useCallbackでメモ化）
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // オーバーレイ自体がクリックされた場合のみ閉じる
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    []
  );

  const handleCloseButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen && !hasProcessedRef.current) {
      hasProcessedRef.current = true;

      // 現在のスクロール位置を保存
      scrollPositionRef.current = window.scrollY;

      // 即座にbodyを固定
      const lockBody = () => {
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.transform = "none";
        document.body.style.transition = "none";

        setIsBodyLocked(true);
      };

      lockBody();
    }

    if (!isOpen && hasProcessedRef.current) {
      // bodyのスタイルを復元
      const unlockBody = () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.transform = "";
        document.body.style.transition = "";

        // スクロール位置を復元
        window.scrollTo(0, scrollPositionRef.current);

        setIsBodyLocked(false);
        hasProcessedRef.current = false;
      };

      unlockBody();
    }
    // isBodyLockedとhasProcessedRef.currentは意図的に依存配列から除外
    // これらの値の変更でuseEffectを再実行すると無限ループになる可能性があるため
  }, [isOpen, member?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, handleClose]);

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

  const getMemberSocialLinks = (memberName: string): SocialLink[] => {
    switch (memberName) {
      case "デイビッド・チェン":
        return [
          {
            name: "X",
            url: "#",
            logo: "/x.png",
            alt: "X logo",
            width: 28,
            height: 28,
          },
          {
            name: "Instagram",
            url: "#",
            logo: "/insta.png",
            alt: "Instagram logo",
            width: 32,
            height: 32,
          },
          {
            name: "Youtube",
            url: "#",
            logo: "/youtube.png",
            alt: "Youtube logo",
            width: 120,
            height: 36,
          },
        ];
      case "エミリー・サンダース":
        return [
          {
            name: "X",
            url: "#",
            logo: "/x.png",
            alt: "X logo",
            width: 28,
            height: 28,
          },
          {
            name: "TikTok",
            url: "#",
            logo: "/tiktok.png",
            alt: "TikTok logo",
            width: 32,
            height: 32,
          },
          {
            name: "LINE",
            url: "#",
            logo: "/line.png",
            alt: "LINE logo",
            width: 32,
            height: 32,
          },
        ];
      case "ジョン・ウィルソン":
        return [
          {
            name: "Facebook",
            url: "#",
            logo: "/fb.png",
            alt: "Facebook logo",
            width: 32,
            height: 32,
          },
          {
            name: "Instagram",
            url: "#",
            logo: "/insta.png",
            alt: "Instagram logo",
            width: 32,
            height: 32,
          },
          {
            name: "Note",
            url: "#",
            logo: "/note.png",
            alt: "Note logo",
            width: 40,
            height: 40,
          },
        ];
      default:
        return [];
    }
  };

  if (!isOpen || !member || !modalRoot) {
    return null;
  }

  const skills = getMemberSkills(member.name);
  const experience = getMemberExperience(member.name);
  const socialLinks = getMemberSocialLinks(member.name);

  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={handleCloseButtonClick}>
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

          <h3 className={styles.sectionTitle}>スキル</h3>
          <div className={styles.skills}>
            {skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>経験・実績</h3>
          <div className={styles.modalExperience}>
            {experience.split("\n").map((line, index) => (
              <p key={index} className={styles.experienceLine}>
                {line.trim()}
              </p>
            ))}
          </div>

          {socialLinks.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>SNS</h3>
              <div className={styles.socialLinksCompact}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialLinkCompact} ${
                      social.name.toLowerCase() === "youtube"
                        ? styles.socialLinkYoutube
                        : ""
                    }`}
                    title={social.name}
                  >
                    <Image
                      src={social.logo}
                      alt={social.alt}
                      width={social.width}
                      height={social.height}
                      className={styles.socialLogoCompact}
                    />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // createPortalでmodal-rootにレンダリング
  return createPortal(modalContent, modalRoot);
};

export default MemberModal;
