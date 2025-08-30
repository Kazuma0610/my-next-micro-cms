"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Styles from "./index.module.css";
import { Suspense, useRef, useState } from "react";

function SearchFieldComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("q", inputValue.trim());
    router.push(`/news/search?${params.toString()}`);
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className={Styles.form}>
      <label className={Styles.search}>
        <Image
          src="/search.svg"
          alt="検索"
          width={16}
          height={16}
          loading="eager"
        />
        <input
          type="text"
          name="q"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="キーワードを入力"
          className={Styles.searchInput}
        />
        <button
          type="button"
          onClick={handleClear}
          className={Styles.clearButton}
        >
          <Image
            src="/erase.svg"
            alt="クリア"
            width={16}
            height={16}
            loading="eager"
          />
        </button>
      </label>
      <button type="submit" className={Styles.searchButton}>
        検索
      </button>
    </form>
  );
}

export default function SearchField() {
  return (
    <Suspense>
      <SearchFieldComponent />
    </Suspense>
  );
}
