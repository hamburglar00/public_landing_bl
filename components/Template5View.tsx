'use client';

import { useEffect, useRef, useState } from 'react';
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
  ['Rocio M.', 'hace 51 s', '$ 690.000'],
  ['Daniela T.', 'hace 8 s', '$ 980.000'],
  ['Lucas F.', 'hace 14 s', '$ 420.000'],
  ['Valen S.', 'hace 23 s', '$ 1.760.000'],
  ['Nico P.', 'hace 31 s', '$ 315.000'],
  ['Flor V.', 'hace 38 s', '$ 890.000'],
  ['Agus M.', 'hace 46 s', '$ 2.100.000'],
  ['Sofi L.', 'hace 57 s', '$ 610.000'],
  ['Juan C.', 'hace 12 s', '$ 1.480.000'],
  ['Pablo R.', 'hace 19 s', '$ 730.000'],
  ['Lau G.', 'hace 27 s', '$ 560.000'],
  ['Dario B.', 'hace 36 s', '$ 1.250.000'],
  ['Cami N.', 'hace 44 s', '$ 340.000'],
  ['Fede H.', 'hace 52 s', '$ 1.690.000'],
  ['Maru D.', 'hace 9 s', '$ 770.000'],
  ['Eze Q.', 'hace 16 s', '$ 450.000'],
  ['Juli A.', 'hace 24 s', '$ 1.030.000'],
  ['Bruno K.', 'hace 33 s', '$ 640.000'],
  ['Meli F.', 'hace 41 s', '$ 1.870.000'],
  ['Lean T.', 'hace 49 s', '$ 520.000'],
  ['Ari B.', 'hace 55 s', '$ 930.000'],
  ['Belen C.', 'hace 11 s', '$ 1.410.000'],
  ['Rama J.', 'hace 21 s', '$ 680.000'],
  ['Luli P.', 'hace 30 s', '$ 2.350.000'],
  ['Gonza V.', 'hace 39 s', '$ 810.000']
] as const;

const TEMPLATE5_DEFAULTS = {
  titleText: 'ESTA PASANDO\nAHORA MISMO.',
  subtitleText:
    'Un asesor te abre la cuenta en 2 minutos por WhatsApp y te acompaña en todo el proceso...',
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
  const nextFeedIndex = useRef(3);
  const [visibleFeed, setVisibleFeed] = useState(() => FEED_ITEMS.slice(0, 3));
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
      setVisibleFeed((currentRows) => {
        const nextItem = FEED_ITEMS[nextFeedIndex.current % FEED_ITEMS.length];
        nextFeedIndex.current = (nextFeedIndex.current + 1) % FEED_ITEMS.length;
        return [nextItem, ...currentRows].slice(0, 3);
      });
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
              <p className="template5__feed-row--pulse" key={`${who}-${when}`}>
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
