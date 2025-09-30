"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./index.module.css";

type SlideItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
};

type Props = {
  slides: SlideItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  fadeEffect?: boolean; // フェード効果のオン/オフ
  transitionDuration?: number; // 遷移時間（ミリ秒）
};

export default function Carousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  fadeEffect = true,
  transitionDuration = 600,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // スライド切り替え関数（フェード対応）
  const changeSlide = useCallback(
    (newIndex: number) => {
      if (isTransitioning || newIndex === currentIndex) return;

      setIsTransitioning(true);

      // フェードアウト開始
      setTimeout(
        () => {
          setCurrentIndex(newIndex);
        },
        fadeEffect ? transitionDuration / 2 : 0
      );

      // フェードイン完了後にトランジション状態をリセット
      setTimeout(
        () => {
          setIsTransitioning(false);
        },
        fadeEffect ? transitionDuration : 300
      );
    },
    [currentIndex, isTransitioning, fadeEffect, transitionDuration]
  );

  // 次のスライドに移動
  const goToNext = useCallback(() => {
    const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    changeSlide(nextIndex);
  }, [currentIndex, slides.length, changeSlide]);

  // 前のスライドに移動
  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    changeSlide(prevIndex);
  }, [currentIndex, slides.length, changeSlide]);

  // 特定のスライドに移動
  const goToSlide = (index: number) => {
    changeSlide(index);
  };

  // 自動再生
  useEffect(() => {
    if (!isPlaying || isTransitioning) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, goToNext, isTransitioning]);

  // マウスホバーで一時停止
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(autoPlay);

  if (!slides || slides.length === 0) {
    return <div className={styles.empty}>スライドがありません</div>;
  }

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={styles.slideContainer}
        style={
          {
            "--transition-duration": `${transitionDuration}ms`,
          } as React.CSSProperties
        }
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            } ${fadeEffect ? styles.fadeSlide : ""} ${
              isTransitioning ? styles.transitioning : ""
            }`}
            style={{
              transform: fadeEffect
                ? "translateX(0)"
                : `translateX(${(index - currentIndex) * 100}%)`,
              opacity: fadeEffect ? (index === currentIndex ? 1 : 0) : 1,
              zIndex: index === currentIndex ? 2 : 1,
            }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width={1920}
              height={800}
              className={styles.slideImage}
              priority={index === 0}
            />
            <div
              className={`${styles.slideContent} ${
                index === currentIndex ? styles.activeContent : ""
              }`}
            >
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideDescription}>{slide.description}</p>
              {slide.buttonText && slide.buttonLink && (
                <a href={slide.buttonLink} className={styles.slideButton}>
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ナビゲーション矢印 */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prevArrow}`}
            onClick={goToPrev}
            disabled={isTransitioning}
            aria-label="前のスライド"
          >
            &#8249;
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.nextArrow}`}
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="次のスライド"
          >
            &#8250;
          </button>
        </>
      )}

      {/* ドットインジケーター */}
      {showDots && slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${
                index === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              aria-label={`スライド${index + 1}に移動`}
            />
          ))}
        </div>
      )}

      {/* ローディングインジケーター（オプション） */}
      {isTransitioning && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
}
