'use client';

import { useEffect, useState, useRef } from 'react';
import { GOOGLE_REVIEWS } from '@/lib/reviews-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function GoogleReviews() {
  const t = useTranslations('testimonials');
  const [reviews, setReviews] = useState<typeof GOOGLE_REVIEWS>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const periodDuration = 15 * 24 * 60 * 60 * 1000;
    const currentEpoch = Date.now();
    const periodIndex = Math.floor(currentEpoch / periodDuration) % 12;
    const startIndex = periodIndex * 8;
    const selectedReviews = GOOGLE_REVIEWS.slice(startIndex, startIndex + 8);
    setReviews(selectedReviews);
  }, []);

  if (reviews.length === 0) {
    return <div className="h-[400px] bg-neutral-950"></div>;
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill={i < rating ? '#FFC107' : '#374151'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  const ReviewCard = ({
    review,
    keyId,
    extraClass = '',
  }: {
    review: (typeof GOOGLE_REVIEWS)[0];
    keyId: string;
    extraClass?: string;
  }) => (
    <div
      key={keyId}
      className={`flex-shrink-0 w-[300px] md:w-[350px] bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between ${extraClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${review.avatarColor}`}
          >
            {review.initial}
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">{review.name}</h4>
            <p className="text-xs text-neutral-500">{review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-neutral-300 font-light leading-relaxed">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-neutral-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Başlık Sol */}
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-white tracking-widest uppercase">{t('badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-white font-serif tracking-tight">{t('title')}</h2>
            <div className="flex items-center gap-2">
              <StarRating rating={5} />
              <span className="text-neutral-400 text-sm">{t('googleReviews')}</span>
            </div>
          </div>
          
          {/* Kaydırma Okları (Sadece masaüstünde başlık yanında göster, mobilde gizle) */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => scrollByAmount('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 hover:scale-105 transition-all z-10"
              aria-label={t('prevReviews')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scrollByAmount('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 hover:scale-105 transition-all z-10"
              aria-label={t('nextReviews')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-Snap Slider */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div 
          ref={scrollContainerRef}
          className="flex flex-row flex-nowrap overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 pb-8 scrollbar-hide"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-[320px] md:w-[380px] shrink-0 flex-none snap-center bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${review.avatarColor}`}>
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{review.name}</h4>
                    <p className="text-xs text-neutral-500">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Mobil Kaydırma Okları (Kartların üzerine binen oklar) */}
        <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
          <button 
            onClick={() => scrollByAmount('left')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900/90 border border-neutral-700 text-white pointer-events-auto shadow-lg backdrop-blur"
            aria-label={t('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollByAmount('right')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900/90 border border-neutral-700 text-white pointer-events-auto shadow-lg backdrop-blur"
            aria-label={t('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
