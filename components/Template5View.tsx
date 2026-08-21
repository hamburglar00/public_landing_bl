'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
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

const TEMPLATE5_DEFAULTS = {
  titleText: 'ESTA PASANDO\nAHORA MISMO.',
  subtitleText:
    'Un asesor te abre la cuenta en 2 minutos por WhatsApp y te acompana en todo el proceso...',
  profileImageUrl: '',
  backgroundImageUrl: ''
};

function splitLines(value: string | undefined, fallback: string, maxLines: number) {
  const lines = String(value || fallback)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines);

  return lines.length > 0 ? lines : fallback.split(/\r?\n/).slice(0, maxLines);
}

export default function Template5View({ slug, config }: Props) {
  const name = config.name || 'asesor';
  const [currentTime, setCurrentTime] = useState('--:--');
  const [viewerCount, setViewerCount] = useState(1278);
  const [feedIndex, setFeedIndex] = useState(0);
  const [createdCount, setCreatedCount] = useState(1323);
  const [advisorCount, setAdvisorCount] = useState(6);
  const live = {
    ...TEMPLATE5_DEFAULTS,
    ...(config.content?.template5 ?? {})
  };
  const titleLines = splitLines(live.titleText, TEMPLATE5_DEFAULTS.titleText, 3);
  const subtitleLines = splitLines(live.subtitleText, TEMPLATE5_DEFAULTS.subtitleText, 2);

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
    const createdTimer = window.setInterval(() => {
      setCreatedCount((current) => current + 1 + Math.floor(Math.random() * 3));
    }, 4300);
    const advisorTimer = window.setInterval(() => {
      setAdvisorCount(2 + Math.floor(Math.random() * 9));
    }, 2700);

    return () => {
      window.clearInterval(timeTimer);
      window.clearInterval(viewerTimer);
      window.clearInterval(feedTimer);
      window.clearInterval(createdTimer);
      window.clearInterval(advisorTimer);
    };
  }, []);

  const displayTime = currentTime === '--:--' ? '23:11' : currentTime;
  const visibleFeed = useMemo(
    () => FEED_ITEMS.slice(0, 3).map((_, index) => FEED_ITEMS[(feedIndex + index) % FEED_ITEMS.length]),
    [feedIndex]
  );

  return (
    <main className="template5">
      <section
        className="template5__phone"
        aria-label="Atencion en vivo"
        style={
          live.backgroundImageUrl
            ? ({
                '--template5-background-image': `url("${live.backgroundImageUrl}")`,
                '--template5-background-opacity': 0.72
              } as CSSProperties)
            : undefined
        }
      >
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
              {titleLines.map((line, index) =>
                index === 0 ? (
                  <span key={`${line}-${index}`}>{line}</span>
                ) : (
                  <b key={`${line}-${index}`}>{line}</b>
                )
              )}
            </h1>
            <p>
              {subtitleLines.map((line, index) => (
                <span key={`${line}-${index}`}>{line}</span>
              ))}
            </p>
          </section>

          <section className="template5__advisor">
            <div className="template5__avatar-wrap">
              {live.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={live.profileImageUrl}
                  alt=""
                  className="template5__avatar-img"
                />
              ) : (
                <div className="template5__avatar-placeholder" aria-hidden="true">
                  foto
                  <br />
                  asesor
                </div>
              )}
              <i className="template5__advisor-dot" />
            </div>
            <div>
              <strong>{name} · tu asesora</strong>
              <span>En linea · responde en ~40 seg</span>
            </div>
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
              <span>Cuentas creadas</span>
              <strong>{createdCount.toLocaleString('es-AR')}</strong>
            </article>
            <article>
              <span>Asesores disponibles</span>
              <strong>{advisorCount} en vivo</strong>
            </article>
          </section>
        </div>

        <footer className="template5__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template5" />
        </footer>
      </section>
    </main>
  );
}
