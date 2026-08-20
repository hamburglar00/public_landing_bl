import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template4View({ slug, config }: Props) {
  const name = config.name || 'tu asesor';

  return (
    <main className="template4">
      <section className="template4__phone" aria-label="Chat en vivo">
        <div className="template4__intro">
          <div className="template4__spinner">
            <div className="template4__photo template4__photo--large">
              foto
              <br />
              asesora
            </div>
          </div>
          <div className="template4__intro-copy">
            <span>Abriendo sala</span>
            <strong>Abriendo tu chat con {name}</strong>
            <p>Atencion abierta ahora</p>
          </div>
        </div>

        <header className="template4__header">
          <div className="template4__avatar-wrap">
            <div className="template4__photo" aria-hidden="true">
              foto
            </div>
            <i className="template4__online-dot" />
          </div>
          <div className="template4__who">
            <b>{name} · Asesora</b>
            <span>En linea · responde en ~40 seg</span>
          </div>
          <time className="template4__time">
            Ahora
            <br />
            <i>24/7</i>
          </time>
        </header>

        <div className="template4__thread">
          <div className="template4__stack">
            <div className="template4__live-pill">
              <i />
              <span>
                <b>14</b> personas en chat ahora mismo
              </span>
            </div>
            <div className="template4__bubble template4__bubble--in">
              <p>Hola, soy {name}. Estoy en linea ahora, no es un bot.</p>
              <span>12:04</span>
            </div>
            <div className="template4__bubble template4__bubble--in">
              <p>Te acompano en todo: registro, primer deposito y tu primer retiro.</p>
              <ul>
                <li>Retiros rapidos, verificados por mi</li>
                <li>Asesor personal 24/7</li>
                <li>Te aviso cuando el pago sale</li>
              </ul>
              <span>12:05</span>
            </div>
            <div className="template4__bubble template4__bubble--in">
              <p>Arrancamos? Toca abajo y te contesto de una.</p>
              <span>12:06</span>
            </div>
            <div className="template4__typing" aria-label="Escribiendo">
              <i />
              <i />
              <i />
            </div>
            <div className="template4__draft">
              <p>Hola, vengo del anuncio y quiero empezar ahora.</p>
              <span>
                sin enviar
                <i />
              </span>
            </div>
          </div>
        </div>

        <footer className="template4__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template4" />
          <div className="template4__cta-sub">
            <i />
            Te responde una persona real, ahora mismo
          </div>
          <small>+18 · Juego responsable · Licencia [nro.] · Jugar puede causar adiccion</small>
        </footer>
      </section>
    </main>
  );
}
