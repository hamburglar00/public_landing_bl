# Meta Pixel/CAPI — implementación local del 14/11/2026

Fuente canónica Builder `cbdb937870351d01ccc1c7ee820994d2c96dca92`. Base clásica `5d5420f`, con la publicación de ingreso vigente. Checkpoint previo de ocho proyectos y tres worktrees: `../.checkpoints/meta-capi-hardening-20261114-212335` (76 artefactos verificados, cero omisiones).

PageView y CTA usan trackSingle para el píxel propio de la landing, conservando nombre e ID compartido con CAPI. Incluye el renderer/bundle común y las rutas React heredadas PixelInit/WhatsAppButton. Se copian los cinco activos con nombre por contenido y se conservan los anteriores. No cambia ingreso, SDK oficial 1.3.1, identidad ni captura de campañas.

Verificación: siete pruebas específicas de clásico, 43 de Builder para ambos motores, 18 escenarios Chromium de asignación/deduplicación T1–T6 y 208 escenarios FBC T7/T8 clásico/constructor × Chromium/WebKit con transporte interceptado. TypeScript correcto en ambos. El generador de Builder y la copia clásica coinciden.

Los ajustes servidor de recibo, cookies, URL y action_source se entregan en las funciones compartidas de Builder. [Registro completo](../../landing-builder-meta-hardening/docs/validation/meta-capi-hardening-20261114.md). El núcleo CTA → mensaje → compra/recompra permanece independiente del evento publicitario. Sin cambios de API2, Atrio, gateways/Worker o finanzas.

Estado: commit local, sin push ni publicación de este lote. El despliegue clásico y su comprobación se realizan separadamente de Builder. Revertir al bundle/revisión anterior conservando activos y recibos; no reenviar conversiones aceptadas.
