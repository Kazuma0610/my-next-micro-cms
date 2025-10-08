// app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";

// サービスデータ（簡略化）
const servicesData = [
  {
    id: "web-design",
    slug: "web-design",
    title: "Webサイト制作",
    description:
      "レスポンシブデザインに対応した高品質なWebサイトを制作いたします。",
    image: {
      url: "/web.png",
      width: 800,
      height: 400,
    },
    category: "Web制作",
  },
  {
    id: "mobile-app",
    slug: "mobile-app",
    title: "モバイルアプリ開発",
    description: "iOS・Android両対応のネイティブアプリ開発を提供いたします。",
    image: {
      url: "/app.png",
      width: 800,
      height: 400,
    },
    category: "アプリ開発",
  },
  {
    id: "system-development",
    slug: "system-development",
    title: "システム開発",
    description: "業務効率化を実現するシステム開発を行います。",
    image: {
      url: "/system.png",
      width: 800,
      height: 400,
    },
    category: "システム開発",
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "ECサイト構築",
    description: "売上アップを実現するECサイトの構築を行います。",
    image: {
      url: "/ec.png",
      width: 800,
      height: 400,
    },
    category: "EC構築",
  },
  {
    id: "consulting",
    slug: "consulting",
    title: "コンサルティング",
    description:
      "ビジネスの成長を支援するコンサルティングサービスを提供します。",
    image: {
      url: "/it.png",
      width: 800,
      height: 400,
    },
    category: "コンサルティング",
  },
  {
    id: "maintenance",
    slug: "maintenance",
    title: "保守・運用",
    description: "システムの安定稼働を支援する保守・運用サービスを提供します。",
    image: {
      url: "/protect.png",
      width: 800,
      height: 400,
    },
    category: "保守・運用",
  },
  // 他のサービスも追加...
];

type Props = {
  params: {
    slug: string;
  };
};

export default function ServiceDetailPage({ params }: Props) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}

// メタデータの生成（サーバーサイド）
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

// 静的パスの生成（サーバーサイド）
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}
