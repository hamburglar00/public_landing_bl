'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

const TEMPLATE4_CHAT_DEFAULTS = {
  profileImageUrl: '',
  backgroundImageUrl: '',
  bubble1Text: 'Hola, soy {{name}}, enviame un mensaje y comenzamos ya mismo.',
  bubble2Intro: 'Te acompaño en todo el proceso',
  bubble2Items: [
    '💸 Cargas y retiros las 24hs',
    '👤 Atencion personalizada',
    '🛡️ Respaldo y mas de 5 anos de experiencia'
  ],
  bubble3Text: 'Arrancamos? Toca abajo y comenzamos'
};

function template4Text(value: string, name: string) {
  return value.replace(/\{\{\s*name\s*\}\}/gi, name);
}

export default function Template4View({ slug, config }: Props) {
  const name = config.name || 'tu asesor';
  const chat = {
    ...TEMPLATE4_CHAT_DEFAULTS,
    ...(config.content?.template4 ?? {})
  };
  const bubble2Items = (chat.bubble2Items ?? TEMPLATE4_CHAT_DEFAULTS.bubble2Items).filter(
    (item) => item.trim().length > 0
  );
  const [liveCount, setLiveCount] = useState(14);
  const [currentTime, setCurrentTime] = useState('--:--');

  useEffect(() => {
    const formatTime = () =>
      new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());

    setCurrentTime(formatTime());
    const timeTimer = window.setInterval(() => setCurrentTime(formatTime()), 30000);
    const countTimer = window.setInterval(() => {
      setLiveCount((current) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(9, Math.min(24, current + delta));
      });
    }, 3200);

    return () => {
      window.clearInterval(timeTimer);
      window.clearInterval(countTimer);
    };
  }, []);

  const messageTime = currentTime === '--:--' ? '19:36' : currentTime;
  const chatBackgroundStyle = chat.backgroundImageUrl
    ? ({
        '--template4-chat-background-image': `url("${chat.backgroundImageUrl}")`,
        '--template4-chat-background-size': 'cover',
        '--template4-chat-background-position': 'center',
        '--template4-chat-background-opacity': '1',
        '--template4-chat-background-overlay':
          'linear-gradient(rgba(7,16,19,.42),rgba(7,16,19,.42))'
      } as CSSProperties)
    : undefined;

  return (
    <main className="template4">
      <section className="template4__phone" aria-label="Chat en vivo" style={chatBackgroundStyle}>
        <div className="template4__intro">
          <div className="template4__spinner">
            {chat.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={chat.profileImageUrl}
                alt=""
                className="template4__photo template4__photo--large"
              />
            ) : (
              <div className="template4__photo template4__photo--large">
                foto
                <br />
                asesora
              </div>
            )}
          </div>
          <div className="template4__intro-copy">
            <span>Abriendo sala</span>
            <strong>Abriendo tu chat con {name}</strong>
            <p>Atencion abierta ahora</p>
          </div>
        </div>

        <header className="template4__header">
          <div className="template4__avatar-wrap">
            {chat.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={chat.profileImageUrl} alt="" className="template4__photo" />
            ) : (
              <div className="template4__photo" aria-hidden="true">
                foto
              </div>
            )}
            <i className="template4__online-dot" />
          </div>
          <div className="template4__who">
            <b>{name} · Asesora</b>
            <span>En linea · responde en ~40 seg</span>
          </div>
          <time className="template4__time">
            {messageTime}
            <br />
            <i>24/7</i>
          </time>
        </header>

        <div className="template4__thread">
          <div className="template4__stack">
            <div className="template4__live-pill">
              <i />
              <span>
                <b>{liveCount}</b> personas en chat ahora mismo
              </span>
            </div>
            <div className="template4__bubble template4__bubble--in template4__bubble--delay-1">
              <p>{template4Text(chat.bubble1Text, name)}</p>
              <span>{messageTime}</span>
            </div>
            <div className="template4__bubble template4__bubble--in template4__bubble--delay-2">
              <p>{template4Text(chat.bubble2Intro, name)}</p>
              <ul>
                {bubble2Items.map((item) => (
                  <li key={item}>{template4Text(item, name)}</li>
                ))}
              </ul>
              <span>{messageTime}</span>
            </div>
            <div className="template4__bubble template4__bubble--in template4__bubble--delay-3">
              <p>{template4Text(chat.bubble3Text, name)}</p>
              <span>{messageTime}</span>
            </div>
          </div>
        </div>

        <footer className="template4__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template4" />
        </footer>
      </section>
    </main>
  );
}
