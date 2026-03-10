import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home-minimal">
      <div className="home-card">
        <h1>Landing runtime listo</h1>
        <p>Probá una landing entrando a una ruta como:</p>
        <Link href="/kobe">/kobe</Link>
      </div>
    </main>
  );
}
