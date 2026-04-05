'use client';

import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';
import { resolveFontFamily } from '@/lib/landing/resolveFontFamily';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template3View({ slug, config }: Props) {
  const fontFamily = resolveFontFamily(config.typography?.fontFamily);

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: '#000',
        color: '#fff',
        fontFamily,
        textAlign: 'center',
        padding: '24px'
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 'clamp(20px, 5vw, 28px)',
          fontWeight: 700,
          letterSpacing: '0.01em'
        }}
      >
        Redirigiendo a WhatsApp...
      </p>

      <WhatsAppButton
        slug={slug}
        config={config}
        templateVariant="template3"
        autoStart
        hideButton
      />
    </main>
  );
}
