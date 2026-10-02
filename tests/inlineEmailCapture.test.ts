import assert from 'node:assert/strict';
import test from 'node:test';
import { validInlineEmail } from '../lib/tracking/inlineEmail';

test('solo el email válido se normaliza para Contact', () => {
  assert.equal(validInlineEmail('  Persona@Ejemplo.com  '), 'persona@ejemplo.com');
  assert.equal(validInlineEmail(''), '');
  assert.equal(validInlineEmail('sin-arroba'), '');
  assert.equal(validInlineEmail('a@b.c'), '');
  assert.equal(validInlineEmail('a@b.com ' + 'x'.repeat(250)), '');
});
