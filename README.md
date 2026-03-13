# Landing PBAdmin

Landing pública dinámica por slug. Next.js obtiene la configuración desde una Edge Function de Supabase, renderiza la vista (plantilla 1 o 2), y al hacer clic en el CTA redirige a WhatsApp tras disparar Pixel Contact, tracking a Sheet y (opcional) aviso de teléfono usado.

---

## 1. Obtención del JSON de configuración y cacheo

### Flujo

1. El usuario entra a `https://<dominio>/<name>` (ej: `/kobe`).
2. Next ejecuta `app/[slug]/page.tsx` y llama a `getLandingConfig(slug)` en el servidor.
3. `getLandingConfig` hace un **GET** a la Edge Function de Supabase:
   - **URL**: `{NEXT_PUBLIC_SUPABASE_URL}/functions/v1/builder-config?name=<slug>`
   - **Headers**: `apikey`, `Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>`
   - Sin `cache: 'no-store'`, por lo que el fetch usa el comportamiento por defecto de Next (cacheable).
4. Si la respuesta es 404 o no trae `name`, se devuelve `null` y la página hace `notFound()`.
5. El JSON se tipa como `LandingConfig` y se pasa a `<Landing slug={slug} config={config} />`.

### Cacheo (ISR)

- En `app/[slug]/page.tsx` está definido **`export const revalidate = 60`** y **`export const dynamic = 'force-static'`**, indicando que la ruta es estática con revalidación.
- La ruta se genera en el servidor y Next puede **cachear el HTML** de esa página hasta 60 segundos.
- Pasado ese tiempo, la siguiente petición a `/<name>` puede regenerar la página (vuelve a llamar a la configuración a través del proxy `/api/config` y a renderizar).

### Invalidación bajo demanda

- **POST `/api/revalidate`** invalida la caché de una ruta concreta.
- **Body**: `{ "secret": "<REVALIDATE_SECRET>", "name": "<slug>" }`
- Si `secret` coincide con `process.env.REVALIDATE_SECRET` y `name` no está vacío, se llama a `revalidatePath('/' + name)`.
- El constructor puede llamar a este endpoint cuando guarda cambios en una landing para que la próxima visita vea la config actualizada.

---

## 2. Obtención del número de teléfono y flujo tras el clic en el CTA

### Prewarm (al cargar la página)

- Al montar el componente del botón (`WhatsAppButton`), en un `useEffect` se dispara **una única** llamada a `getLandingPhone(slug)`.
- El resultado se guarda en una **promesa compartida** (`useRef`): no se vuelve a llamar a la API por el mismo slug; si el usuario hace clic más tarde, se reutiliza esa misma promesa (ya resuelta o en curso).
- Objetivo: que en la mayoría de los casos, al hacer clic el número ya esté disponible y el redirect a WhatsApp sea inmediato.

### Llamada a la API del teléfono

- **Función**: `getLandingPhone(name)` (cliente).
- **URL**: `{NEXT_PUBLIC_SUPABASE_URL}/functions/v1/landing-phone?name=<slug>`
- **Método**: GET  
- **Headers**: `apikey`, `Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>`  
- **Cache**: `no-store` (siempre datos frescos).
- La respuesta se tipa como `LandingPhoneResponse` (`phone`, `landingName`, `phoneId?`, etc.). El número se normaliza (solo dígitos; si son 10, se antepone `54`).

### Secuencia en el clic del CTA

1. Se genera `eventId` (UUID) y `promoCode` (`landingTag` + random).
2. **Pixel**: se dispara `fbq('track', 'Contact', ...)` con `eventID: eventId` (sin esperar respuesta).
3. **Teléfono**: se hace `await ensurePhonePromise()` (usa el prewarm o la misma promesa; no se lanza una segunda petición nueva).
4. Si no hay `phone` válido, el botón se deshabilita y termina.
5. **Aviso al constructor (phone-click)**  
   Solo si `config.phoneSelection?.mode === 'random'`:  
   - POST a `{NEXT_PUBLIC_SUPABASE_URL}/functions/v1/phone-click`  
   - Body: `{ "landingName", "phoneId", "phone" }`  
   - Con `sendBeacon` o `fetch` sin `await` (no bloquea).
6. **Tracking a Sheet**: se envía el payload a `/api/track` con `sendBeacon` o `fetch` sin `await` (no bloquea).
7. **Redirect**: `window.location.assign('https://wa.me/' + phone + '?text=' + encodeURIComponent(mensaje))`.

Nada de lo anterior (pixel, phone-click, tracking) hace `await` antes del redirect; solo se espera al número.

---

## 3. Meta Pixel: inicialización, eventos y parámetros

### Carga del SDK

- En `Landing` se inyecta un `<Script>` (Next) que carga el SDK de Meta:
  - `https://connect.facebook.net/en_US/fbevents.js`
- Solo se define el stub `window.fbq`; **no** se llama a `init` ni `track` dentro de ese script.

### Inicialización (advanced matching)

- El componente **`PixelInit`** (cliente) hace el `init` y el primer evento.
- Cuando `window.fbq` está disponible (o en un intervalo hasta que lo esté), ejecuta:
  - `fbq('init', pixelId, { external_id, em, ph, country: 'AR' })`
  - `fbq('track', 'PageView')`
- **Parámetros del init**:
  - **`external_id`**: `getOrCreateExternalId()` (UUID en `localStorage`, clave `external_id`).
  - **`em`**: query param `email` de la URL (normalizado a minúsculas), o `undefined` si no viene.
  - **`ph`**: query param `phone` de la URL normalizado (solo dígitos; 10 dígitos → prefijo `54`), o `undefined` si no viene.
  - **`country`**: `'AR'` fijo.
- **pixelId** sale de `config.tracking.pixelId`. Si no hay `pixelId`, no se renderiza el script ni `PixelInit`.

### Evento Contact (en el clic del CTA)

- Se llama a:
  - `fbq('track', 'Contact', customData, options)`
- **customData**:
  - `content_name`: `'Botón WhatsApp'`
  - `content_category`: `'LeadGen'`
  - `event_source`: `'LandingPage'`
  - `source`: `'main_button'`
- **options**:
  - `eventID`: mismo `eventId` (UUID) que se envía al Sheet, para deduplicación vía CAPI.
- Se ejecuta en el mismo flujo del clic, antes de pedir el teléfono y redirigir; no se hace `await` a nada de Meta.

### Resumen de datos enviados a Meta

- **Init**: `external_id`, `em`, `ph`, `country`.
- **PageView**: sin parámetros extra en la llamada (Meta usa los del init).
- **Contact**: customData anterior + `eventID` (mismo que en el payload a Sheet).

---

## 4. Envío a Sheet (tracking)

### Origen del payload

- El **cliente** (WhatsAppButton) arma un objeto con todos los campos y lo envía por **POST** a **`/api/track`** (no directamente a la URL del Sheet).
- Se usa `navigator.sendBeacon` si está disponible; si no, `fetch` con `keepalive: true`, **sin await**, para no retrasar el redirect.

### Payload que envía el cliente a `/api/track`

- `postUrl`: `config.tracking.postUrl` (URL del Sheet / webhook que el backend use).
- `event_name`: `'Contact'`
- `event_id`: UUID del evento (mismo que `eventID` del Pixel).
- `external_id`: `getOrCreateExternalId()` (mismo que en el init del Pixel).
- `event_source_url`: `window.location.href`
- `email`: query param `email`
- `phone`: query param `phone` (crudo)
- `utm_campaign`: query param `utm_campaign`
- `fbp`: valor de cookie/localStorage `_fbp` (o generado y guardado).
- `fbc`: valor de cookie/localStorage `_fbc` (o construido desde `fbclid` en la URL).
- `telefono_asignado`: número usado para el redirect (normalizado).
- `promo_code`: generado con `tracking.landingTag` + random.
- `source`: `'main_button'`
- `brand`: `config.name`
- `landing_id`: `config.id`
- `landing_name`: `config.name`
- `device_type`: `'mobile' | 'tablet' | 'desktop'` (por user agent).
- `mode`: `config.background.mode`
- `api_meta`: `null`

### Qué hace `/api/track`

1. Recibe el body y valida que `postUrl` exista y sea una URL HTTP(S).
2. Añade al payload:
   - `clientIP`: primer valor de `x-forwarded-for` o IP del request.
   - `agentuser`: `user-agent`.
   - `timestamp`: `body.timestamp` o `new Date().toISOString()`.
   - `event_time`: `body.event_time` o segundos actuales (Unix).
3. Hace **POST** del payload completo a `postUrl` (ej: Google Apps Script que escribe en Sheet).
4. Devuelve 200 con la respuesta del upstream o 502/500 si algo falla.

Todo lo que el cliente manda (incluido `telefono_asignado`, `event_id`, `external_id`, `fbp`, `fbc`, etc.) llega al Sheet vía ese `postUrl`; la deduplicación con CAPI se hace con el mismo `event_id` / `external_id` / `fbp` / `fbc` que usa el Pixel.

---

## 5. Otras piezas relevantes

### Plantillas

- **Plantilla 1** (layout configurable): `layout.template` distinto de `2` o ausente. Posición del CTA según `layout.ctaPosition` (`top`, `between_title_and_info`, `between_info_and_badge`, `bottom`). Fondo a pantalla completa, sin overlay.
- **Plantilla 2** (marco tipo teléfono): `layout.template === 2`. Posiciones fijas (marco superior con imagen, logo, badge, título, CTA debajo del marco, features debajo). Badge puede venir de `content.footerBadge[]` (primera línea no vacía) o `content.footerBadgeText`.

### Tipografías

- `typography.fontFamily` se mapea en `resolveFontFamily` a fuentes reales (system, Roboto, Poppins, Montserrat, Bebas Neue, Anton, PP Mori, Alpha). Las fuentes de Google se cargan en `app/layout.tsx`.

### Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase (builder-config, landing-phone, phone-click).
- `REVALIDATE_SECRET`: secreto para POST `/api/revalidate`.
- Opcional: `SUPABASE_SERVICE_ROLE_KEY` si en algún momento se usa el cliente con service role.

### Métricas de performance (Vercel Speed Insights)

- Se instala `@vercel/speed-insights` y se importa `SpeedInsights` en `app/layout.tsx`.
- En el layout raíz se renderiza `<SpeedInsights />` dentro del `<body>`, después de `{children}`.
- Con esto, Vercel empieza a registrar métricas de Web Vitals (LCP, FID, CLS, etc.) para las visitas en producción. Puedes verlas en la pestaña **Speed Insights** del proyecto en Vercel.

### Analíticas de tráfico (Vercel Analytics)

- Se instala `@vercel/analytics` y se importa `Analytics` en `app/layout.tsx`.
- En el layout raíz se renderiza `<Analytics />` dentro del `<body>`, junto con `<SpeedInsights />`.
- Con esto, Vercel registra pageviews y métricas básicas de uso en producción. Puedes verlas en la pestaña **Analytics** del proyecto en Vercel.

---

## Pasos rápidos (desarrollo)

1. Copiá `.env.local` y pegá tus claves reales.
2. `npm install`
3. `npm run dev`
4. Probá una landing: `http://localhost:3000/<name>` (ej: `http://localhost:3000/kobe`).
