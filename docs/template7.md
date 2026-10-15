# Template 7 en el motor clásico

## Formulario inmediato y renderer compartido

Template 7 usa `components/Template7FastView.tsx`, un fragmento HTML generado en el servidor con formulario, CSS crítico y runtime propios. Permite escribir antes de la hidratación de React. Mantiene el endpoint clásico `/api/template7/start`, la identidad del dispositivo, Pixel, Contact, atribución y deduplicación. Los templates 1–6 siguen por el componente anterior.

El renderer compartido en `lib/template7/shared.cjs` se genera desde `landing-builder`; no editarlo manualmente. Desde ese repositorio ejecutar `node scripts/build-classic-template7.mjs --write` y, para verificar paridad, el mismo comando sin `--write`. Es un módulo de servidor, no un bundle que descargue el visitante.

Los logos y fondos públicos de Template 7 usan tamaños optimizados de Supabase Storage con fallback al original, sin cambiar las URLs guardadas en el editor. También se aplica a landings existentes después de regenerarse el HTML. `npm ci` copia el SDK de parámetros Meta versionado al directorio público mediante `postinstall`; se puede repetir con `npm run sync:meta-sdk`.

Verificar `npm test` y `npm run build` antes de desplegar ambos motores. Esta primera etapa no modifica la creación de cuentas, los gateways, el flag de API2 ni requiere migraciones. Las pruebas de navegador compartidas están en `landing-builder/frontend/scripts/template7-browser-check.ts` y `landing-builder/scripts/phase0/template7-classic-smoke.mjs`.

## Creación e ingreso

El motor clásico soporta `rey_de_ases`, `multi_skin`, `ases_del_norte` y `ganamos_net` usando la misma configuración persistida del constructor. Ganamos NET es independiente de Ganamos+ Multi Skin. El navegador no elige el proveedor: `/api/template7/start` vuelve a comprobar landing, plan, asesor asignado, workspace y límites durables en una única operación local antes de resolver el jugador en Atrio.

**Paridad obligatoria:** cualquier proveedor, contrato, campo de atribución o comportamiento nuevo de Template 7 debe implementarse y probarse también en el constructor de `landing-builder`. La matriz de cuatro proveedores debe avanzar junta en ambos motores.

Nombre, teléfono válido, `promo_code`, landing y proveedor viajan a Atrio. El teléfono argentino inválido muestra advertencia en la interfaz pero no bloquea la creación ni la redirección. El handoff al gateway incluye el promo por servidor para que llegue firmado al widget. Las demos se habilitan solo mediante allowlists y secretos de servidor; nunca se activan como fallback ante una falla de API2.

La carga inicial consulta `builder-config` directamente desde el servidor de Next y conserva ISR, `force-cache`, tags de revalidación, Pixel y el mismo `event_id` de browser/CAPI. Esta reducción de un salto interno no modifica el contrato de eventos Meta.
