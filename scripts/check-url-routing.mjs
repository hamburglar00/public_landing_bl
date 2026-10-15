import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../', import.meta.url));
let available = true;
let fallbackCalls = 0;
const apiCalls = [];
const api = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  apiCalls.push(url.pathname + url.search);
  res.setHeader('Content-Type', 'application/json');
  if (url.pathname === '/rest/v1/rpc/get_random_active_landing') {
    let body = ''; for await (const chunk of req) body += chunk;
    assert.equal(JSON.parse(body).p_client_name, 'goldencajeros');
    fallbackCalls++;
    return res.end(JSON.stringify(available ? 'url-test-a' : null));
  }
  if (url.pathname === '/functions/v1/builder-config') {
    const name = url.searchParams.get('name');
    if (!['url-test-a', 'url-test-b'].includes(name)) { res.statusCode = 404; return res.end('{}'); }
    return res.end(JSON.stringify({
      id: '91000000-0000-4000-8000-000000000011', name, comment: '', schemaVersion: 1, updatedAt: '',
      layout: { template: 1, ctaPosition: 'bottom' },
      content: { logoUrl: '', title: [`Fixture ${name}`], subtitle: [], ctaText: 'Continuar' },
      tracking: { pixelId: '', postUrl: '', landingTag: 'TEST' },
    }));
  }
  res.statusCode = 404; res.end('{}');
});
api.listen(0, '127.0.0.1'); await once(api, 'listening');
const portProbe = createServer(); portProbe.listen(0, '127.0.0.1'); await once(portProbe, 'listening');
const port = portProbe.address().port; await new Promise(resolve => portProbe.close(resolve));
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', 'localhost', '--port', String(port)], {
  cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${api.address().port}`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-test', SUPABASE_SERVICE_ROLE_KEY: 'local-test', LANDING_FALLBACK_CLIENT: 'goldencajeros' },
});
let ready = false;
let errors = '';
let output = '';
child.stdout.on('data', data => { output = (output + data).slice(-2000); if (String(data).includes('Ready in')) ready = true; });
child.stderr.on('data', data => { errors = (errors + data).slice(-4000); });
const origin = `http://localhost:${port}`;
const get = path => fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(60000) });
try {
  for (let i = 0; i < 120 && !ready; i++) {
    if (child.exitCode !== null) throw new Error('Local Next server exited before readiness');
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, 'local server ready');
  for (const [path, expected] of [
    ['/url-test-a', 'url-test-a'],
    ['/?landing=url-test-a', 'url-test-a'],
    ['/url-test-a?landing=url-test-b&campana=October&utm_campaign=legacy&fbclid=test', 'url-test-b'],
    ['/?landing=url-test-a', 'url-test-a'],
    ['/url-test-b', 'url-test-b'],
  ]) {
    const response = await get(path);
    assert.equal(response.status, 200, `${path}: ${errors}`);
    assert.ok((await response.text()).includes(`Fixture ${expected}`), path);
    console.log(`PASS: ${path}`);
  }
  assert.equal((await get('/?landing=missing')).status, 404);
  assert.equal((await get('/?landing=../api')).status, 404);
  const organic = await get('/?campana=October&conjunto=A&anuncio=B&utm_campaign=legacy&fbclid=test');
  assert.equal(organic.status, 307);
  const target = new URL(organic.headers.get('location'), origin);
  assert.equal(target.pathname, '/url-test-a');
  for (const [key, value] of [['campana','October'],['conjunto','A'],['anuncio','B'],['utm_campaign','legacy'],['fbclid','test']]) assert.equal(target.searchParams.get(key), value);
  available = false;
  const empty = await get('/');
  assert.equal(empty.status, 200);
  assert.ok((await empty.text()).includes('No hay atención disponible'));
  assert.equal(fallbackCalls, 2);
  console.log('PASS: HTTP query/path priority, missing landing, scoped organic redirect, tracking preservation and empty pool');
} catch (error) {
  console.error(JSON.stringify({ localServer: output, errors, apiCalls }));
  throw error;
} finally {
  if (child.exitCode === null) child.kill();
  api.closeAllConnections();
  await new Promise(resolve => api.close(resolve));
}
