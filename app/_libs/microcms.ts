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

export type BlogCategory = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  category: BlogCategory;
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

export const getBlogList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Blog>({
    endpoint: "blog",
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

// ブログカテゴリー一覧取得
export const getBlogCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Category>({
    endpoint: "blog-category", // ブログ用
    queries,
  });
  return listData;
};

// NEWSタグ一覧取得
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

// BLOGタグ一覧取得
export const getAllBlogTags = async () => {
  const { contents } = await getBlogList({ limit: 100 }); // 全記事取得
  const tagSet = new Set<string>();

  contents.forEach((blog) => {
    if (blog.tags) {
      blog.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).map((tag) => ({ id: tag, name: tag }));
};

// 関連記事を取得(NEWS)
export const getRelatedNews = async (
  currentNewsId: string,
  categoryId: string,
  tags?: string[],
  limit = 4
) => {
  // 1. 同じカテゴリーの記事を取得
  const categoryRelated = await getNewsList({
    filters: `category[equals]${categoryId}[and]id[not_equals]${currentNewsId}`,
    limit: limit,
  });

  // 2. タグが一致する記事も取得したい場合（オプション）
  let tagRelated = { contents: [] as News[] };
  if (tags && tags.length > 0) {
    // タグでフィルタリング（複雑なクエリになるため、シンプルに1つのタグで検索）
    try {
      tagRelated = await getNewsList({
        q: tags[0], // 最初のタグで検索
        filters: `id[not_equals]${currentNewsId}`,
        limit: 2,
      });
    } catch (error) {
      console.warn("Tag search failed:", error);
    }
  }

  // 重複を除去して結合
  const allRelated = [...categoryRelated.contents];
  tagRelated.contents.forEach((news) => {
    if (!allRelated.some((item) => item.id === news.id)) {
      allRelated.push(news);
    }
  });

  return allRelated.slice(0, limit);
};

// 関連記事を取得(BLOG)
export const getRelatedBlogs = async (
  currentBlogId: string,
  categoryId: string,
  tags?: string[],
  limit = 4
) => {
  // 1. 同じカテゴリーの記事を取得
  const categoryRelated = await getBlogList({
    filters: `category[equals]${categoryId}[and]id[not_equals]${currentBlogId}`,
    limit: limit,
  });

  // 2. タグが一致する記事も取得したい場合（オプション）
  let tagRelated = { contents: [] as Blog[] };
  if (tags && tags.length > 0) {
    // タグでフィルタリング（複雑なクエリになるため、シンプルに1つのタグで検索）
    try {
      tagRelated = await getBlogList({
        q: tags[0], // 最初のタグで検索
        filters: `id[not_equals]${currentBlogId}`,
        limit: 2,
      });
    } catch (error) {
      console.warn("Tag search failed:", error);
    }
  }

  // 重複を除去して結合
  const allRelated = [...categoryRelated.contents];
  tagRelated.contents.forEach((news) => {
    if (!allRelated.some((item) => item.id === news.id)) {
      allRelated.push(news);
    }
  });

  return allRelated.slice(0, limit);
};

//ニュースページの詳細投稿取得と不正なURL直接入力を防ぐ
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

//ブログページの詳細投稿取得と不正なURL直接入力を防ぐ
export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint: "blog",
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

//ブログページのカテゴリーの不正なURL直接入力を防ぐ
export const getBlogCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: "blog-category",
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
