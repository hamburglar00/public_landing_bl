import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), false, {info(){},error(){}});
const origin=process.env.CACHE_CHECK_ORIGIN||'http://localhost:3017';
if (!['localhost','127.0.0.1'].includes(new URL(origin).hostname)) throw Error('This check may invalidate only a local cache');
const slug=process.env.CACHE_CHECK_SLUG||'diana', encoded=encodeURIComponent(slug);
const results=[];
const request=async(path, options)=>{const response=await fetch(origin+path,options);const body=await response.text();results.push({method:options?.method||'GET',status:response.status,cache:response.headers.get('x-nextjs-cache'),bytes:Buffer.byteLength(body)});return {response,body};};
const first=await request(`/${encoded}?fbclid=cache-fixture-a&utm_source=fixture`);
assert.equal(first.response.status,200);
assert.doesNotMatch(first.body,/cache-fixture-a|\/_next\/static\//);
const second=await request(`/${encoded}?fbclid=cache-fixture-b`);
assert.equal(second.response.headers.get('x-nextjs-cache'),'HIT');
assert.equal(createHash('sha256').update(first.body).digest('hex'),createHash('sha256').update(second.body).digest('hex'));
const override=await request(`/override-fixture?landing=${encoded}&fbclid=cache-fixture-c`);
assert.equal(override.body,second.body);
const head=await request(`/${encoded}`,{method:'HEAD'});
assert.equal(head.response.status,200);assert.equal(head.body,'');
const missing=await request('/no-such-landing-cache-fixture-20261109');
assert.equal(missing.response.status,404);
for(const asset of [...first.body.matchAll(/(?:src|href)="(\/public-assets\/template-entry\/[^"?]+)"/g)].map(m=>m[1])) {
  const result=await request(asset);assert.equal(result.response.status,200);assert.match(result.response.headers.get('cache-control')||'',/immutable/);
}
if(!process.env.REVALIDATE_SECRET)throw Error('Local revalidation secret missing');
const invalidation=await request('/api/revalidate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:slug,secret:process.env.REVALIDATE_SECRET})});
assert.equal(invalidation.response.status,200);
const result=JSON.parse(invalidation.body);assert.equal(result.revalidated,true);
// The publisher does this separate GET after receiving the invalidation response.
const publishWarm=await request(`/${encoded}`);assert.equal(publishWarm.response.status,200);
const warm=await request(`/${encoded}`);assert.equal(warm.response.headers.get('x-nextjs-cache'),'HIT');
console.log(JSON.stringify({check:'local-public-cache',passed:true,results},null,2));
