import React, { type CSSProperties } from 'react';
import CtaClickDispatcher from '@/components/CtaClickDispatcher';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = { slug: string; config: LandingConfig };

const CARD_COUNTS = { '2x1': 2, '2x2': 4, '2x3': 6 } as const;
const WHATSAPP_GREEN_PATH = 'M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Z';
const WHATSAPP_WHITE_PATH = 'M16.04 3A12.82 12.82 0 0 0 5.08 22.47L3 30l7.72-2.02A12.88 12.88 0 1 0 16.04 3Zm0 23.58a10.66 10.66 0 0 1-5.43-1.49l-.39-.23-4.58 1.2 1.22-4.46-.25-.4a10.68 10.68 0 1 1 9.43 5.38Zm5.85-7.99c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.63 9.63 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.06-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67s1.15 3.1 1.31 3.31c.16.21 2.26 3.45 5.47 4.84.77.33 1.36.53 1.83.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.14-.29-.22-.61-.38Z';

function lines(value: string | undefined): string[] {
  return (value || '').split(/\r?\n/).slice(0, 2).map((line) => line.trim()).filter(Boolean);
}

export default function Template6View({ slug, config }: Props) {
  const cover = config.content?.template6;
  const backgroundImageUrl = cover?.backgroundImageUrl?.trim() || '';
  const grid = cover?.grid && cover.grid in CARD_COUNTS ? cover.grid : '2x2';
  const cardCount = CARD_COUNTS[grid];
  const cards = Array.from({ length: cardCount }, (_, index) => cover?.cards?.[index]);
  const triggerEvent = `lp:template6:cta:${slug}`;
  const style = {
    '--template6-title': config.colors?.title || '#FFFFFF',
    '--template6-caption': config.colors?.subtitle || '#FFFFFF',
    '--template6-footer': config.colors?.badge || '#FFD700',
    '--template6-cta-text': config.colors?.ctaText || '#000000',
    '--template6-cta-background': config.colors?.ctaBackground || '#FFD700',
    '--template6-cta-glow': config.colors?.ctaGlow || '#FFD700',
    '--template6-cta-size': `${Math.min(22, Math.max(11, config.typography?.cta?.sizePx || 14))}px`,
    '--template6-cta-weight': config.typography?.cta?.weight || 700,
  } as CSSProperties;

  return (
    <main className={`template6${backgroundImageUrl ? ' has-background' : ''}`} style={style}>
      <CtaClickDispatcher eventName={triggerEvent} />
      <WhatsAppButton slug={slug} config={config} hideButton externalTriggerEvent={triggerEvent} />
      {backgroundImageUrl ? (
        <div className="template6__background" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={backgroundImageUrl} alt="" loading="eager" decoding="async" fetchPriority="high" />
        </div>
      ) : null}
      <div className="template6__shell">
        <header className="template6__header">
          <h1>{lines(cover?.headerText).map((line, index) => <span key={index}>{line}</span>)}</h1>
        </header>
        <section className="template6__grid" aria-label="Opciones disponibles">
          {cards.map((card, index) => {
            const label = card?.ctaText?.trim() || config.content?.ctaText || 'Abrir WhatsApp';
            return (
              <article className="template6__card" key={index}>
                <div className="template6__image">
                  {card?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.imageUrl} alt={card.text?.trim() || `Opción ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                  ) : null}
                </div>
                <p className="template6__caption">{card?.text?.trim() || `Opción ${index + 1}`}</p>
                <button type="button" className="template6__cta" data-cta-trigger-event={triggerEvent} aria-label={label}>
                  <span>{label}</span>
                  {cover?.showWhatsAppLogo !== false ? (
                    <svg className="template6__cta-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                      <path fill="#25D366" d={WHATSAPP_GREEN_PATH} />
                      <path fill="#FFFFFF" d={WHATSAPP_WHITE_PATH} />
                    </svg>
                  ) : null}
                </button>
              </article>
            );
          })}
        </section>
        <footer className="template6__footer">
          {lines(cover?.footerText).map((line, index) => <span key={index}>{line}</span>)}
        </footer>
      </div>
    </main>
  );
}
