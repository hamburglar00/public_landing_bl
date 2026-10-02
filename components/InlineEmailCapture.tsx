'use client';

import { useState } from 'react';
import { validInlineEmail } from '@/lib/tracking/inlineEmail';

export default function InlineEmailCapture() {
  const [error, setError] = useState('');

  return (
    <div className="inline-email-capture">
      <div className="inline-email-capture__field">
        <svg className="inline-email-capture__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
        <input
          data-inline-email-input
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          aria-label="Email para desbloquear tu bono"
          aria-describedby="inline-email-error"
          placeholder="Tu email para desbloquear el bono"
          onChange={() => setError('')}
          onBlur={(event) => {
            const value = event.currentTarget.value.trim();
            setError(value && !validInlineEmail(value)
              ? 'Email inválido. Podés seguir a WhatsApp.'
              : '');
          }}
        />
      </div>
      <small id="inline-email-error" data-inline-email-error role="status">{error}</small>
    </div>
  );
}
