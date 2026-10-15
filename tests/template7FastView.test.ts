import assert from 'node:assert/strict';
import test from 'node:test';
import { Script } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Template7FastView from '@/components/Template7FastView';
import type { LandingConfig } from '@/lib/landing/types';

for (const provider of ['rey_de_ases', 'ases_del_norte', 'ganamos_net', 'multi_skin'] as const) {
  test(`classic fast form preserves ${provider}, phone, attribution and identity without hydration`, () => {
    (globalThis as typeof globalThis & { React?: typeof React }).React = React;
    const config: LandingConfig = {
      id: 'test', name: 'Test', comment: '', updatedAt: '2026-10-15', schemaVersion: 1,
      layout: { template: 7, ctaPosition: 'bottom' },
      tracking: { pixelId: '123456', postUrl: '/conversions', landingTag: 'TEST', target_provider: provider },
      content: { logoUrl: 'https://audit.supabase.co/storage/v1/object/public/landing-images/owner/logo.avif', title: ['Nombre'], subtitle: [], ctaText: 'Continuar' },
      template7Capture: { whatsapp: true },
    };
    const html = renderToStaticMarkup(React.createElement(Template7FastView, { slug: 'test', config }));
    assert.match(html, /data-template7-fast/);
    assert.match(html, /data-template7-critical/);
    assert.match(html, /data-template7-whatsapp/);
    assert.match(html, new RegExp(`"targetProvider":"${provider}"`));
    assert.match(html, /fetch\("\/api\/template7\/start"/);
    assert.match(html, /internal-chat:device-id/);
    assert.match(html, /form_phone: formPhone/);
    assert.match(html, /promo_code: promoCode/);
    assert.match(html, /event_id: eventId/);
    assert.match(html, /resize=contain/);
    assert.doesNotMatch(html, /addEventListener\("DOMContentLoaded"|client-identity\/bootstrap/);
    assert.equal(html.split("fbq('track', 'PageView')").length - 1, 1);
    for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new Script(match[1]);
  });
}
