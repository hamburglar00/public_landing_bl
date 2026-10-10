'use client';

import React, { useEffect, useState } from 'react';
import FrameBackgroundTemplate7 from '@/components/FrameBackgroundTemplate7';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

const EXAMPLE_NAMES = [
  'Martín', 'Lucía', 'Sofía', 'Mateo', 'Valentina', 'Tomás',
  'Camila', 'Nicolás', 'Julieta', 'Benjamín', 'Florencia', 'Agustín',
];

export function pickTemplate7ExampleName(random: () => number = Math.random) {
  return EXAMPLE_NAMES[Math.floor(random() * EXAMPLE_NAMES.length)];
}

export default function Template7View({ slug, config }: Props) {
  const [firstName, setFirstName] = useState('');
  const [namePlaceholder, setNamePlaceholder] = useState('Ej.: Martín');
  useEffect(() => {
    setNamePlaceholder(`Ej.: ${pickTemplate7ExampleName()}`);
  }, []);
  const titleLines = (config.content?.title || []).map((line) => line.trim()).filter(Boolean);
  const subtitleLines = (config.content?.subtitle || []).map((line) => line.trim()).filter(Boolean);

  return (
    <main className="template7">
      <FrameBackgroundTemplate7
        images={config.background?.images || []}
        rotateEveryHours={config.background?.rotateEveryHours}
      />
      <div className="template7__veil" />
      <section className="template7__card">
        {config.content?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.content.logoUrl}
            alt={config.name}
            className="template7__logo"
            decoding="async"
            fetchPriority="high"
          />
        ) : null}
        <h1
          className="template7__title"
          style={{
            color: config.colors?.title ?? '#FFFFFF',
            fontSize: `${config.typography?.title?.sizePx ?? 26}px`,
            fontWeight: config.typography?.title?.weight ?? 700
          }}
        >
          {titleLines.map((line, index) => (
            <React.Fragment key={index}>
              {index > 0 ? <br /> : null}{line}
            </React.Fragment>
          ))}
        </h1>
        {subtitleLines.length > 0 ? (
          <p
            className="template7__subtitle"
            style={{
              color: config.colors?.subtitle ?? '#FFFFFF',
              fontSize: `${config.typography?.subtitle?.sizePx ?? 16}px`,
              fontWeight: config.typography?.subtitle?.weight ?? 400
            }}
          >
            {subtitleLines.map((line, index) => (
              <React.Fragment key={index}>
                {index > 0 ? <br /> : null}{line}
              </React.Fragment>
            ))}
          </p>
        ) : null}
        <form className="template7__form" onSubmit={(event) => {
          event.preventDefault();
          if (firstName.trim()) {
            document.querySelector<HTMLButtonElement>('.template7__cta')?.click();
          }
        }}>
          <label className="template7__label" htmlFor="template7-name">Tu nombre</label>
          <input
            id="template7-name"
            className="template7__input"
            type="text"
            name="firstName"
            autoComplete="given-name"
            maxLength={80}
            required
            placeholder={namePlaceholder}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <WhatsAppButton
            slug={slug}
            config={config}
            templateVariant="template7"
            template7Name={firstName}
          />
        </form>
      </section>
    </main>
  );
}
