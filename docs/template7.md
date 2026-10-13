# Template 7 en el motor clásico

El motor clásico soporta `rey_de_ases`, `multi_skin`, `ases_del_norte` y `ganamos_net` usando la misma configuración persistida del constructor. Ganamos NET es independiente de Ganamos+ Multi Skin. El navegador no elige el proveedor: `/api/template7/start` vuelve a comprobar landing, plan, asesor asignado, workspace y límites durables en una única operación local antes de resolver el jugador en Atrio.

**Paridad obligatoria:** cualquier proveedor, contrato, campo de atribución o comportamiento nuevo de Template 7 debe implementarse y probarse también en el constructor de `landing-builder`. La matriz de cuatro proveedores debe avanzar junta en ambos motores.

Nombre, teléfono válido, `promo_code`, landing y proveedor viajan a Atrio. El teléfono argentino inválido muestra advertencia en la interfaz pero no bloquea la creación ni la redirección. El handoff al gateway incluye el promo por servidor para que llegue firmado al widget. Las demos se habilitan solo mediante allowlists y secretos de servidor; nunca se activan como fallback ante una falla de API2.

La carga inicial consulta `builder-config` directamente desde el servidor de Next y conserva ISR, `force-cache`, tags de revalidación, Pixel y el mismo `event_id` de browser/CAPI. Esta reducción de un salto interno no modifica el contrato de eventos Meta.
