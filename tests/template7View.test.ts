import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Template7View, { pickTemplate7ExampleName } from '@/components/Template7View';
import type { LandingConfig } from '@/lib/landing/types';

test('el motor clásico renderiza la plantilla 7 con nombre obligatorio y CTA Atrio', () => {
  const config: LandingConfig = {
    schemaVersion: 1,
    updatedAt: '2026-10-08T00:00:00.000Z',
    id: 'landing-7',
    name: 'Prueba 7',
    comment: '',
    tracking: { pixelId: '', postUrl: '', landingTag: 'TEST', ctaDestination: 'atrio' },
    content: {
      logoUrl: 'https://cdn.example.com/logo.png',
      title: ['Título siete'],
      subtitle: ['Detalle siete'],
      footerBadge: ['Badge siete'],
      ctaText: 'Crear mi cuenta',
    },
    emailCapture: { enabled: true },
    layout: { template: 7, ctaPosition: 'between_title_and_info' },
  };

  (globalThis as typeof globalThis & { React?: typeof React }).React = React;
  const html = renderToStaticMarkup(React.createElement(Template7View, { slug: 'prueba-7', config }));
  assert.match(html, /class="template7"/);
  assert.match(html, /Título siete/);
  assert.match(html, /Detalle siete/);
  assert.match(html, /name="firstName"/);
  assert.match(html, /class="template7__cta"[^>]*disabled/);
  assert.match(html, /Crear mi cuenta/);
  assert.doesNotMatch(html, /Badge siete/);
  assert.doesNotMatch(html, /inline-email-capture/);
  assert.doesNotMatch(html, /social-proof/);
});

test('el motor clásico elige ejemplos de nombres femeninos y masculinos', () => {
  assert.equal(pickTemplate7ExampleName(() => 0), 'Martín');
  assert.equal(pickTemplate7ExampleName(() => 0.35), 'Valentina');
});
