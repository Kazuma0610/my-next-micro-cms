"use client";

import { useState, useEffect, useCallback } from "react";
import type { News } from "@/app/_libs/microcms";

const STORAGE_KEY = "recently-viewed-news";
const MAX_ITEMS = 5;

type RecentlyViewedItem = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  } | null; // null も許可
  viewedAt: number;
};

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(
    []
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // ローカルストレージから読み込み
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error("Failed to load recently viewed items:", error);
      } finally {
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  // 記事を閲覧履歴に追加
  const addToRecentlyViewed = useCallback((news: News) => {
    if (typeof window === "undefined") return;

    const newItem: RecentlyViewedItem = {
      id: news.id,
      title: news.title,
      publishedAt: news.publishedAt,
      thumbnail: news.thumbnail
        ? {
            url: news.thumbnail.url,
            width: news.thumbnail.width ?? 0,
            height: news.thumbnail.height ?? 0,
          }
        : null, // undefinedの場合はnullに変換
      viewedAt: Date.now(),
    };

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== news.id);
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recently viewed items:", error);
      }

      return updated;
    });
  }, []);

  // 閲覧履歴をクリア
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    isLoaded,
  };
}
