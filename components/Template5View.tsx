import WhatsAppButton from '@/components/WhatsAppButton';
import type { LandingConfig } from '@/lib/landing/types';

type Props = {
  slug: string;
  config: LandingConfig;
};

export default function Template5View({ slug, config }: Props) {
  const name = config.name || 'asesor';

  return (
    <main className="template5">
      <section className="template5__phone" aria-label="Atencion en vivo">
        <div className="template5__curtain">
          <span>EN VIVO</span>
          <strong>Entrando...</strong>
        </div>

        <div className="template5__topbar">
          <span className="template5__live-dot" />
          <span>EN VIVO</span>
          <time>Ahora</time>
        </div>

        <section className="template5__hero">
          <p className="template5__kicker">Atencion personalizada</p>
          <h1>Esta pasando ahora mismo.</h1>
          <p>Un asesor esta disponible para ayudarte por el canal asignado.</p>
        </section>

        <section className="template5__advisor">
          <div className="template5__avatar" aria-hidden="true">
            PB
          </div>
          <div>
            <strong>{name}</strong>
            <span>Disponible para responder</span>
          </div>
        </section>

        <div className="template5__progress" aria-hidden="true">
          <span />
        </div>

        <section className="template5__feed" aria-label="Actividad reciente">
          <div>
            <strong>RETIROS PAGADOS</strong>
            <span>EN VIVO</span>
          </div>
          <p>
            <b>12:02</b> Solicitud recibida y atendida
          </p>
          <p>
            <b>12:04</b> Asesor asignado correctamente
          </p>
          <p>
            <b>12:06</b> Seguimiento activo por WhatsApp
          </p>
        </section>

        <footer className="template5__footer">
          <WhatsAppButton slug={slug} config={config} templateVariant="template5" />
          <small>Continuas con un asesor asignado segun disponibilidad.</small>
        </footer>
      </section>
    </main>
  );
}
