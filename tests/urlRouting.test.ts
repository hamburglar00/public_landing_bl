import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import { fallbackDestination, landingOverride } from '../lib/landing/urlRouting';

test('Diana overrides Gast with future Meta fields and preserves the same origin and attribution',()=>{
  const input=new NextRequest('https://landing.test/gast?landing=diana&new_meta_field=x&new_meta_field=y&fbclid=original&utm_source=facebook&return_to=https://evil.test');
  const rewritten=new URL(middleware(input).headers.get('x-middleware-rewrite')!);
  assert.equal(rewritten.origin,input.nextUrl.origin);assert.equal(rewritten.pathname,'/diana');
  assert.equal(rewritten.search,input.nextUrl.search);
});

test('query overrides the path and preserves attribution without a browser redirect', () => {
  for (const path of ['/', '/old', '/old/']) {
    const url = new URL(`${path}?landing=bianca2&campana=Octubre&conjunto=A%2BB&anuncio=7&utm_campaign=legacy&fbclid=click`, 'https://landing.test');
    const response = middleware(new NextRequest(url));
    const target = new URL(response.headers.get('x-middleware-rewrite')!);
    assert.equal(target.pathname.replace(/\/$/, ''), '/bianca2');
    assert.equal(target.search, url.search);
    assert.equal(response.headers.get('location'), null);
  }
});

test('missing or blank landing leaves direct links intact', () => {
  for (const path of ['/', '/bianca2', '/bianca2?landing=', '/bianca2?landing=%20']) {
    assert.equal(landingOverride(new URL(path, 'https://landing.test')), null);
  }
});

test('invalid, duplicated and internal targets cannot be routed', () => {
  for (const query of ['landing=a&landing=b', 'landing=https://evil.test', 'landing=../x', 'landing=%2fapi', 'landing=api', 'landing=..', 'landing=%252fapi']) {
    assert.equal(middleware(new NextRequest(`https://landing.test/?${query}`)).status, 404);
  }
  for (const path of ['/api/track', '/_next/static/a.js', '/favicon.ico']) {
    assert.equal(landingOverride(new URL(`${path}?landing=bianca2`, 'https://landing.test')), null);
  }
});

test('organic selection retains query data and records a stable selected path', () => {
  const url = new URL(fallbackDestination('bianca2', { landing: '', __landing_auto: 'forged', campana: 'A & B', conjunto: 'Ñ', anuncio: '42', utm_campaign: 'legacy', fbclid: 'click', repeated: ['1', '2'] }), 'https://landing.test');
  assert.equal(url.pathname, '/bianca2');
  assert.equal(url.searchParams.get('landing'), null);
  assert.deepEqual(url.searchParams.getAll('__landing_auto'), ['bianca2']);
  assert.equal(url.searchParams.get('campana'), 'A & B');
  assert.equal(url.searchParams.get('conjunto'), 'Ñ');
  assert.equal(url.searchParams.get('utm_campaign'), 'legacy');
  assert.equal(url.searchParams.get('fbclid'), 'click');
  assert.deepEqual(url.searchParams.getAll('repeated'), ['1', '2']);
});
