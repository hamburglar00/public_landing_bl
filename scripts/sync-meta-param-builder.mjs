import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const version = '1.3.1';
const source = path.join(root, 'node_modules/meta-capi-param-builder-clientjs');
const manifest = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
if (manifest.version !== version) throw new Error('Meta Parameter Builder version mismatch');
const destination = path.join(root, 'public/vendor/meta-capi-param-builder', version);
await mkdir(destination, { recursive: true });
await copyFile(path.join(source, 'dist/clientParamBuilder.bundle.js'), path.join(destination, 'clientParamBuilder.bundle.js'));
await copyFile(path.join(source, 'LICENSE'), path.join(destination, 'LICENSE'));
console.log('Meta Parameter Builder 1.3.1 public asset ready.');
