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
      <section className="template4__phone" aria-label="Chat de atencion">
        <div className="template4__intro">
          <span>Abriendo tu chat</span>
          <strong>{name}</strong>
        </div>

        <header className="template4__header">
          <div className="template4__avatar" aria-hidden="true">
            PB
          </div>
          <div>
            <p className="template4__name">{name}</p>
            <p className="template4__status">
              <span />
              En linea ahora
            </p>
          </div>
          <time className="template4__time">Ahora</time>
        </header>

        <div className="template4__thread">
          <div className="template4__date">Hoy</div>
          <div className="template4__bubble template4__bubble--in">
            Hola, soy {name}. Estoy en linea ahora, no es un bot.
            <span>12:04</span>
          </div>
          <div className="template4__bubble template4__bubble--in">
            Te acompano en todo: registro, primer deposito y tu primer retiro.
            <ul>
              <li>Retiros rapidos cuando esta todo correcto</li>
              <li>Asesor personal para cada consulta</li>
              <li>Seguimiento simple por WhatsApp</li>
            </ul>
            <span>12:04</span>
          </div>
          <div className="template4__bubble template4__bubble--out">
            Quiero continuar
            <span>12:05</span>
          </div>
          <div className="template4__typing" aria-label="Escribiendo">
            <i />
            <i />
            <i />
          </div>
        </div>

        <footer className="template4__footer">
          <p>Respuesta inmediata disponible</p>
          <WhatsAppButton slug={slug} config={config} templateVariant="template4" />
          <small>Al continuar se abrira el canal asignado para atenderte.</small>
        </footer>
      </section>
    </main>
  );
}
