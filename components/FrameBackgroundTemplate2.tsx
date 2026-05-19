'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

type Props = {
  images: string[];
  rotateEveryHours?: number;
};

export default function FrameBackgroundTemplate2({
  images,
  rotateEveryHours = 24
}: Props) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;

    const everyMs = Math.max(1, rotateEveryHours) * 60 * 60 * 1000;
    const initialIndex = Math.floor(Date.now() / everyMs) % safeImages.length;
    setIndex(initialIndex);

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeImages.length);
    }, everyMs);

    return () => window.clearInterval(interval);
  }, [safeImages.length, rotateEveryHours]);

  const currentImage = safeImages[index];
  if (!currentImage) return null;

  return (
    <Image
      src={currentImage}
      alt=""
      className="frame__bg"
      fill
      priority
      sizes="(max-width: 430px) 100vw, 430px"
      quality={82}
    />
  );
}
