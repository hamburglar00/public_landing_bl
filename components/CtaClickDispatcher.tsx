'use client';

import { useEffect } from 'react';

type Props = {
  eventName: string;
};

export default function CtaClickDispatcher({ eventName }: Props) {
  useEffect(() => {
    if (!eventName) return;

    const listener = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const trigger = target?.closest<HTMLElement>('[data-cta-trigger-event]');
      if (!trigger) return;
      if (trigger.dataset.ctaTriggerEvent !== eventName) return;

      const cardIndex = Number(trigger.dataset.cardIndex);
      window.dispatchEvent(Number.isInteger(cardIndex) && cardIndex >= 1 && cardIndex <= 6
        ? new CustomEvent(eventName, { detail: { cardIndex } })
        : new Event(eventName));
    };

    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [eventName]);

  return null;
}
