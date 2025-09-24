import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSListContent,
} from "microcms-js-sdk";

export type Member = {
  name: string;
  position: string;
  profile: string;
  image: MicroCMSImage;
} & MicroCMSListContent;

export type Category = {
  name: string;
} & MicroCMSListContent;

export type News = {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  category: Category;
  author?: string;
  tags?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
} & MicroCMSListContent;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export const getMembersList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Member>({
    endpoint: "members",
    queries,
  });
  return listData;
};

export const getNewsList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<News>({
    endpoint: "news",
    queries,
  });
  return listData;
};

// カテゴリー一覧取得
export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Category>({
    endpoint: "categories",
    queries,
  });
  return listData;
};

// タグ一覧取得
export const getAllTags = async () => {
  const { contents } = await getNewsList({ limit: 100 }); // 全記事取得
  const tagSet = new Set<string>();

  contents.forEach((news) => {
    if (news.tags) {
      news.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).map((tag) => ({ id: tag, name: tag }));
};

//ニュースページの不正なURL直接入力を防ぐ
export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<News>({
    endpoint: "news",
    contentId,
    queries,
    customRequestInit: {
      next: {
        revalidate: queries?.draftKey === undefined ? 60 : 0,
      },
    },
  });
  return detailData;
};

//ニュースページのカテゴリーの不正なURL直接入力を防ぐ
export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: "categories",
    contentId,
    queries,
  });
  return detailData;
};

//サイトマップ用にnewsの全件取得
export const getAllNewsList = async () => {
  const listData = await client.getAllContents<News>({
    endpoint: "news",
  });

  return listData;
};

//サイトマップ用にnewsカテゴリー全件取得
export const getAllCategoryList = async () => {
  const listData = await client.getAllContents<Category>({
    endpoint: "categories",
  });

  return listData;
};
