import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const source = readFileSync(
  join(process.cwd(), 'components', 'WhatsAppButton.tsx'),
  'utf8'
);

test('el formulario opcional no dispara Contact hasta continuar u omitir', () => {
  assert.match(source, /setLeadCaptureOpen\(true\);\s*return;/);
  assert.match(source, /continueFromLeadCapture\(capture: LeadCaptureValues \| null\)/);
  assert.match(source, /void handleClick\(capture\)/);
  assert.match(source, /onSubmit=\{\(event\) => \{\s*event\.preventDefault\(\);\s*continueFromLeadCapture\(leadCaptureForm\);/s);
  assert.match(source, /aria-label="Omitir formulario e ir a WhatsApp"/);
  assert.equal((source.match(/window\.fbq\(/g) ?? []).length, 1);
  assert.match(source, /test_event_code: testEventCode \|\| undefined/);
  assert.match(source, /lead_capture_form: hasLeadCaptureForm \|\| undefined/);
  assert.match(source, /form_fn: formFn \|\| undefined/);
  assert.match(source, /form_ln: formLn \|\| undefined/);
  assert.match(source, /form_email: formEmail \|\| undefined/);
  assert.match(source, /form_phone: formPhone \|\| undefined/);
});
