# Meta Pixel/CAPI — publicación del 14/11/2026

Fuente canónica Builder `cbdb937870351d01ccc1c7ee820994d2c96dca92`. Base clásica `5d5420f`, con la publicación de ingreso vigente. Checkpoint previo de ocho proyectos y tres worktrees: `../.checkpoints/meta-capi-hardening-20261114-212335` (76 artefactos verificados, cero omisiones).

PageView y CTA usan trackSingle para el píxel propio de la landing, conservando nombre e ID compartido con CAPI. Incluye el renderer/bundle común y las rutas React heredadas PixelInit/WhatsAppButton. Se copian los cinco activos con nombre por contenido y se conservan los anteriores. No cambia ingreso, SDK oficial 1.3.1, identidad ni captura de campañas.

Verificación: siete pruebas específicas de clásico, 43 de Builder para ambos motores, 18 escenarios Chromium de asignación/deduplicación T1–T6 y 208 escenarios FBC T7/T8 clásico/constructor × Chromium/WebKit con transporte interceptado. TypeScript correcto en ambos. El generador de Builder y la copia clásica coinciden.

Los ajustes servidor de recibo, cookies, URL y action_source se entregan en las funciones compartidas de Builder. [Registro completo](../../landing-builder-meta-hardening/docs/validation/meta-capi-hardening-20261114.md). El núcleo CTA → mensaje → compra/recompra permanece independiente del evento publicitario. Sin cambios de API2, Atrio, gateways/Worker o finanzas.

## Publicación verificada

Publicación autorizada por Leo. El cambio revisado `47b4c502ef05e0511594e185d2fcf53054a085d0` se integró con el historial productivo `origin/main` en `7d24515065fa8906137794a0cfb311f174c42376`: ambas bases de ingreso tenían árboles idénticos y se comprobó que el árbol del merge es exactamente el de `47b4c50`. La resolución del conflicto del bundle generado conservó sus bytes revisados. No se modificó el checkout original.

La rama `fix/meta-capi-hardening-20261114` y `main` fueron subidas, sin force. Antes del push a main se verificó que producción seguía en `dpl_3VuHuc6rQCsD4VbXWihu6GMFXwyW` y que el remoto no contenía avances ajenos. El candidato `dpl_2y4ivESpZYpXJjrxKoKLA3eUDPhZ`, con entorno de producción y sin promover dominios, quedó READY y aprobó ocho lecturas HTTP de landings/activos antes de ese push.

| Dato | Resultado |
| --- | --- |
| Proyecto Vercel | `public-landing-bl` / `prj_3U8gxeIt5zwVa7YPfPhiwtuUw6U2` |
| Git main y fuente desplegada | `7d24515065fa8906137794a0cfb311f174c42376` |
| Deployment productivo automático de Git | `dpl_6k7iEEAas1yh3otK61uGPc5kJdUc` — READY |
| URL del deployment | `public-landing-ha6y3eqis-juanclouds-projects.vercel.app` |
| Dominios verificados | `landing.panelbotadmin.com`, `public-landing-bl.vercel.app` |
| Migraciones del clásico | Ninguna; backend CAPI compartido publicado separadamente por Builder |

Comprobación pública a las 21:53 de Argentina del 14/11 (15/11 00:53 UTC): `/diana`, `/atriopili` y `/asesdelnorte` devolvieron 200 con un PageView `trackSingle` para el mismo píxel inicializado y el nuevo runtime clásico. Los cinco activos devolvieron 200, hashes SHA256 iguales a la fuente y caché `public, max-age=31536000, immutable`; sus CTA utilizan `trackSingle`. El SDK oficial 1.3.1 público conserva SHA256 `9f11e6cfc737d685de93b0a54722e9524c8de86be716b015d763af7794ce7085`. El alias Vercel también sirve el runtime actual. Son diez lecturas HTTP públicas sin ejecutar JavaScript, tocar CTA, crear usuarios ni enviar eventos de negocio. La API de Vercel confirmó por separado el SHA, proyecto y ambos dominios apuntando al deployment READY.

Evidencia filtrada: [publicación clásica](meta-capi-hardening-production-20261114.json). El registro documental se sube sólo a la rama de trabajo para evitar otro build productivo por documentación. No acredita publicación del backend de Builder ni de otros productos.

Incidencia controlada: un primer candidato `dpl_6cRzNKVTHPzyiM6JA2jDAgcqRQ3e` se inició con el conflicto todavía pendiente porque el shell continuó después de `git merge`; terminó ERROR y nunca se promovió. Se añadieron abortos explícitos a los pasos dependientes, se resolvió el bundle y se verificó igualdad exacta antes del candidato válido y de publicar main. Los dominios productivos permanecieron en la versión anterior hasta el deployment final correcto.

Reversión del frontend clásico: deployment anterior `dpl_3VuHuc6rQCsD4VbXWihu6GMFXwyW`, fuente `9b34df6f3175b12f53e2f52472301c0a71371c76`. Conservar activos y recibos; no reenviar conversiones aceptadas. La reversión del backend compartido se coordina por separado con Builder.
