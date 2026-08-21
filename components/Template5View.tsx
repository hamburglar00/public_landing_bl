'use client';

import { useEffect, useMemo, useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

const FEED_ITEMS = [
  ['Camilo A.', 'hace 5 s', '$ 1.150.000'],
  ['Sebastian G.', 'hace 17 s', '$ 260.000'],
  ['Laura P.', 'hace 29 s', '$ 780.000'],
  ['Mica R.', 'hace 34 s', '$ 540.000'],
  ['Tomas D.', 'hace 42 s', '$ 1.320.000'],
  ['Rocio M.', 'hace 51 s', '$ 690.000']
] as const;

export default function Template5View({ slug, config }: Props) {
  const name = config.name || 'asesor';
  const [currentTime, setCurrentTime] = useState('--:--');
  const [viewerCount, setViewerCount] = useState(1278);
  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const formatTime = () =>
      new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());

    setCurrentTime(formatTime());
    const timeTimer = window.setInterval(() => setCurrentTime(formatTime()), 30000);
    const viewerTimer = window.setInterval(() => {
      setViewerCount((current) => {
        const delta = Math.floor(Math.random() * 23) - 9;
        return Math.max(1160, Math.min(1420, current + delta));
      });
    }, 2200);
    const feedTimer = window.setInterval(() => {
      setFeedIndex((current) => (current + 1) % FEED_ITEMS.length);
    }, 3600);

    return () => {
      window.clearInterval(timeTimer);
      window.clearInterval(viewerTimer);
      window.clearInterval(feedTimer);
    };
  }, []);

  const displayTime = currentTime === '--:--' ? '23:11' : currentTime;
  const visibleFeed = useMemo(
    () => FEED_ITEMS.slice(0, 3).map((_, index) => FEED_ITEMS[(feedIndex + index) % FEED_ITEMS.length]),
    [feedIndex]
  );

  return (
    <main className="template5">
      <section className="template5__phone" aria-label="Atencion en vivo">
        <div className="template5__ambient" aria-hidden="true" />
        <div className="template5__curtain">
          <span>EN VIVO</span>
          <strong>Entrando...</strong>
        </div>

        <div className="template5__scroll">
          <div className="template5__topline">
            <div className="template5__live-badge">
              <span className="template5__live-dot" />
              <strong>EN VIVO</strong>
              <time>{displayTime}</time>
            </div>
            <span className="template5__viewers">{viewerCount.toLocaleString('es-AR')} viendo</span>
          </div>

          <section className="template5__hero">
            <h1>
              <span>ESTA PASANDO</span>
              <b>AHORA MISMO.</b>
            </h1>
            <p>Un asesor te abre la cuenta en 2 minutos por WhatsApp y te acompana en todo el proceso...</p>
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
            {visibleFeed.map(([who, when, amount]) => (
              <p className="template5__feed-row--pulse" key={`${who}-${feedIndex}`}>
                <span>
                  <b>{who}</b>
                  <small>{when}</small>
                </span>
                <strong>{amount}</strong>
              </p>
            ))}
          </section>

          <section className="template5__activity" aria-label="Actividad de asesores">
            <article>
              <span>Cuenta creada</span>
              <strong>hace 12 s</strong>
            </article>
            <article>
              <span>Asesor disponible</span>
              <strong>ahora</strong>
            </article>
          </section>
        </div>

        <footer className="template5__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template5" />
          <small>{name} te contesta en persona, ahora mismo</small>
        </footer>
      </section>
    </main>
  );
}
