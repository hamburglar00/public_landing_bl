import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import React from 'react';
import PixelInit from '../components/PixelInit';

test('classic React Pixel sends PageView only to its pixel with another pixel initialized', () => {
  (globalThis as typeof globalThis & { React?: typeof React }).React = React;
  const view = PixelInit({ pixelId: '123456', slug: 'fixture' });
  assert.ok(view);
  const script = view.props.children[1].props.children;
  const calls: unknown[][] = [];
  const fbq = (...args: unknown[]) => calls.push(args);
  runInNewContext(script, { window: { fbq, __META: { PIXEL_ID: '999999' } }, document: {}, fbq });
  assert.equal(calls[0][0], 'init');
  assert.equal(calls[0][1], '123456');
  assert.deepEqual(calls[1], ['trackSingle', '123456', 'PageView']);
  assert.equal(calls.length, 2);
});

test('classic React CTA targets its pixel and keeps the CAPI ID, suppressing disabled/missing/deduplicated events', () => {
  const source = readFileSync(new URL('../components/WhatsAppButton.tsx', import.meta.url), 'utf8');
  const start = source.indexOf('      // Pixel Contact con eventID');
  const end = source.indexOf('      // Aviso de teléfono', start);
  assert.ok(start > 0 && end > start);
  const dispatch = source.slice(start, end);
  for (const [pixelId, enabled, duplicate, expected] of [
    ['123456', true, false, 1], ['', true, false, 0], ['invalid', true, false, 0],
    ['123456', false, false, 0], ['123456', true, true, 0],
  ] as const) {
    const calls: unknown[][] = [];
    runInNewContext(dispatch, { config: { tracking: { pixelId } }, sendContactPixel: enabled, shouldSkipContact: duplicate,
      eventId: 'original-capi-id', window: { fbq: (...args: unknown[]) => calls.push(args), __META: { PIXEL_ID: '999999' } } });
    assert.equal(calls.length, expected);
    if (expected) {
      assert.deepEqual(calls[0].slice(0, 3), ['trackSingle', '123456', 'Contact']);
      assert.equal((calls[0][4] as { eventID: string }).eventID, 'original-capi-id');
    }
  }
});
