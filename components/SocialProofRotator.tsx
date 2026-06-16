'use client';

import { useEffect, useState } from 'react';

type SocialProofItem = {
  quote: string;
  name: string;
};

type Props = {
  items: SocialProofItem[];
  intervalMs: number;
  triggerEvent: string;
};

export default function SocialProofRotator({ items, intervalMs, triggerEvent }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [items.length, intervalMs]);

  if (items.length === 0) return null;

  const activeItem = items[index] || items[0];

  return (
    <section
      className="social-proof"
      aria-label="Prueba social"
      data-cta-trigger-event={triggerEvent}
      style={{ cursor: 'pointer' }}
    >
      <p key={`quote-${index}`} className="social-proof__quote">
        &quot;{activeItem.quote}&quot;
      </p>
      <p className="social-proof__meta">
        {activeItem.name} <span aria-hidden="true">-</span>{' '}
        <span className="social-proof__stars">{'\u2605'.repeat(5)}</span>
      </p>
      <div key={`progress-${index}`} className="social-proof__progress" aria-hidden="true" />
    </section>
  );
}
