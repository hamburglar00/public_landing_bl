import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

for (const method of ['GET', 'HEAD']) test(`${method}: public delivery rewrites without losing campaign or override`, () => {
  const url = 'https://landing.example/gast?landing=diana&fbclid=click&utm_source=facebook&extra=one&extra=two';
  const response = middleware(new NextRequest(url, { method }));
  const destination = new URL(response.headers.get('x-middleware-rewrite')!);
  assert.equal(destination.pathname, '/api/landing-html/diana');
  assert.equal(destination.search, new URL(url).search);
  assert.equal(response.status, 200);
});

test('root keeps fallback selection; reserved URLs and non-GET requests are not rewritten', () => {
  for (const path of ['/', '/api', '/favicon.ico', '/robots.txt', '/_next']) {
    assert.equal(middleware(new NextRequest('https://landing.example'+path)).headers.get('x-middleware-rewrite'), null);
  }
  assert.equal(middleware(new NextRequest('https://landing.example/a', {method:'POST'})).headers.get('x-middleware-rewrite'), null);
});

test('ambiguous or unsafe override fails closed without selecting another landing', () => {
  for (const query of ['landing=a&landing=b', 'landing=../a', 'landing=api', 'landing=%00', 'landing=a%2Fb']) {
    assert.equal(middleware(new NextRequest('https://landing.example/a?'+query)).status, 404);
  }
});

test('ordinary and RSC-marked reads resolve the same immutable public document', () => {
  const regular = middleware(new NextRequest('https://landing.example/diana'));
  const marked = middleware(new NextRequest('https://landing.example/diana', {headers:{rsc:'1'}}));
  assert.equal(marked.headers.get('x-middleware-rewrite'), regular.headers.get('x-middleware-rewrite'));
});
