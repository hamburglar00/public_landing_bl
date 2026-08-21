'use client';

import { useEffect, useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template5View({ slug, config }: Props) {
  const name = config.name || 'asesor';
  const [currentTime, setCurrentTime] = useState('--:--');

  useEffect(() => {
    const formatTime = () =>
      new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());

    setCurrentTime(formatTime());
    const timer = window.setInterval(() => setCurrentTime(formatTime()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const displayTime = currentTime === '--:--' ? '23:11' : currentTime;

  return (
    <main className="template5">
      <section className="template5__phone" aria-label="Atencion en vivo">
        <div className="template5__curtain">
          <span>EN VIVO</span>
          <strong>Entrando...</strong>
        </div>

        <div className="template5__topline">
          <div className="template5__live-badge">
            <span className="template5__live-dot" />
            <strong>EN VIVO</strong>
            <time>{displayTime}</time>
          </div>
          <span className="template5__viewers">1.278 viendo</span>
        </div>

        <section className="template5__hero">
          <h1>
            <span>ESTA PASANDO</span>
            <b>AHORA MISMO.</b>
          </h1>
          <p>Un asesor te abre la cuenta en 2 minutos por WhatsApp y te acompaña en todo el proceso...</p>
        </section>

        <section className="template5__advisor">
          <div className="template5__avatar" aria-hidden="true">
            foto
            <br />
            asesor
          </div>
          <div>
            <strong>{name} · tu asesora</strong>
            <span>En linea · responde en ~40 seg</span>
          </div>
          <i />
        </section>

        <div className="template5__progress" aria-hidden="true">
          <span />
        </div>

        <section className="template5__feed" aria-label="Actividad reciente">
          <div>
            <strong>
              <span className="template5__feed-dot" /> RETIROS PAGADOS · EN VIVO
            </strong>
          </div>
          <p>
            <span>
              <b>Camilo A.</b>
              <small>hace 5 s</small>
            </span>
            <strong>$ 1.150.000</strong>
          </p>
          <p>
            <span>
              <b>Sebastian G.</b>
              <small>hace 17 s</small>
            </span>
            <strong>$ 260.000</strong>
          </p>
          <p>
            <span>
              <b>Laura P.</b>
              <small>hace 29 s</small>
            </span>
            <strong>$ 780.000</strong>
          </p>
        </section>

        <footer className="template5__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template5" />
          <small>{name} te contesta en persona, ahora mismo</small>
        </footer>
      </section>
    </main>
  );
}
