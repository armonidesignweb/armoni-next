"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductCardImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  unoptimized?: boolean;
  pClass?: string;
}

export default function ProductCardImage({
  src,
  alt,
  fill = true,
  className = '',
  unoptimized = false,
  pClass = 'p-6'
}: ProductCardImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || '/images/placeholder.jpg');

  useEffect(() => {
    setImgSrc(src || '/images/placeholder.jpg');
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={`${className} ${pClass}`}
      unoptimized={unoptimized}
      onError={() => {
        setImgSrc('/images/placeholder.jpg');
      }}
    />
  );
}
