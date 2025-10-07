// app/_components/ServiceCard/index.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./index.module.css";

// 型定義をファイル内に直接定義
interface ServiceImage {
  url: string;
  width?: number;
  height?: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  slug?: string; // slug プロパティを追加
  image?: ServiceImage;
  features?: string[];
  category?: string;
  link?: string;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {service.image?.url ? (
          <Image
            src={service.image.url}
            alt={service.title}
            fill // width/heightの代わりにfillを使用
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" //元画像は400x200で作る 2:1
          />
        ) : (
          <div className={styles.placeholder}>
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>

        {service.features && service.features.length > 0 && (
          <ul className={styles.features}>
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className={styles.feature}>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {service.category && (
          <span className={styles.category}>{service.category}</span>
        )}

        {service.link && (
          <Link
            href={`/services/${service.slug || service.id}`}
            className={styles.link}
          >
            詳細を見る
          </Link>
        )}
      </div>
    </div>
  );
}

// 型をエクスポート（他のコンポーネントで使用するため）
export type { Service };
