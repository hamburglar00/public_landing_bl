import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Template6View from '@/components/Template6View';
import type { LandingConfig } from '@/lib/landing/types';

const baseConfig: LandingConfig = {
  schemaVersion: 1,
  updatedAt: '2026-10-06T00:00:00.000Z',
  id: 'cover',
  name: 'Portada',
  comment: '',
  tracking: { pixelId: '', postUrl: '', landingTag: 'COVER', ctaDestination: 'whatsapp' },
  content: { logoUrl: '', title: [], subtitle: [], ctaText: 'Abrir WhatsApp' },
  layout: { template: 6, ctaPosition: 'bottom' },
};

for (const [grid, count] of [['2x1', 2], ['2x2', 4], ['2x3', 6]] as const) {
  test(`motor clásico presenta ${count} CTA de la portada ${grid}`, () => {
    const config: LandingConfig = {
      ...baseConfig,
      content: {
        ...baseConfig.content!,
        template6: {
          grid,
          backgroundImageUrl: 'https://cdn.example.com/cover.avif',
          headerText: 'Título\nSubtítulo',
          footerText: 'Pie\nFinal',
          cards: Array.from({ length: 6 }, (_, index) => ({
            imageUrl: `https://cdn.example.com/card-${index + 1}.avif`,
            text: `Opción ${index + 1}`,
            ctaText: index === 0 ? 'Elegir' : '',
          })),
        },
      },
    };
    const html = renderToStaticMarkup(createElement(Template6View, { slug: 'cover', config }));
    assert.equal(html.split('class="template6__card"').length - 1, count);
    assert.equal(html.split('data-cta-trigger-event="lp:template6:cta:cover"').length - 1, count);
    for (let index = 1; index <= count; index++) {
      assert.match(html, new RegExp(`data-card-index="${index}"`));
    }
    assert.doesNotMatch(html, new RegExp(`data-card-index="${count + 1}"`));
    assert.match(html, /Título/);
    assert.match(html, /Elegir/);
    assert.equal(html.split('class="template6__cta-icon"').length - 1, count);
    assert.match(html, /class="template6__background"/);
    assert.match(html, /cover\.avif/);
    if (count < 6) assert.doesNotMatch(html, /card-6\.avif/);
  });
}

test('motor clásico conserva la portada sin fondo cuando no se configuró uno', () => {
  const html = renderToStaticMarkup(createElement(Template6View, { slug: 'cover', config: baseConfig }));
  assert.doesNotMatch(html, /class="template6__background"/);
});

test('motor clásico oculta el SVG de todos los CTA cuando se desactiva', () => {
  const config: LandingConfig = {
    ...baseConfig,
    content: {
      ...baseConfig.content!,
      template6: {
        grid: '2x2',
        showWhatsAppLogo: false,
        cards: [{ ctaText: 'Elegir' }, {}, {}, {}],
      },
    },
  };
  const html = renderToStaticMarkup(createElement(Template6View, { slug: 'cover', config }));
  assert.equal(html.split('class="template6__cta"').length - 1, 4);
  assert.doesNotMatch(html, /class="template6__cta-icon"/);
  assert.match(html, /Elegir/);
  assert.match(html, /Abrir WhatsApp/);
});
