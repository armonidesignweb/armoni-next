"use client";

import React, { useState, MouseEvent } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: '50% 50%',
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div 
        className="relative w-full aspect-[4/3] md:aspect-square bg-neutral-950 rounded-2xl overflow-hidden group cursor-crosshair border border-white/5"
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[activeIndex]}
          alt="Product Image"
          fill
          className="object-contain p-8 transition-transform duration-200 ease-out group-hover:scale-[1.5]"
          style={zoomStyle}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-950 border transition-all duration-200 ${
                activeIndex === idx 
                  ? 'border-brand-500 opacity-100' 
                  : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-contain p-3"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
