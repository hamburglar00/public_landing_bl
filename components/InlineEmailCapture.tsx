'use client';

import { useState } from 'react';
import { validInlineEmail } from '@/lib/tracking/inlineEmail';

export default function InlineEmailCapture() {
  const [error, setError] = useState('');

  return (
    <div className="inline-email-capture">
      <input
        data-inline-email-input
        type="email"
        inputMode="email"
        autoComplete="email"
        maxLength={254}
        aria-label="Email para desbloquear tu bono"
        aria-describedby="inline-email-error"
        placeholder="Ingresá tu email para desbloquear tu bono"
        onChange={() => setError('')}
        onBlur={(event) => {
          const value = event.currentTarget.value.trim();
          setError(value && !validInlineEmail(value)
            ? 'Email inválido. Podés seguir a WhatsApp.'
            : '');
        }}
      />
      <small id="inline-email-error" data-inline-email-error role="status">{error}</small>
    </div>
  );
}
