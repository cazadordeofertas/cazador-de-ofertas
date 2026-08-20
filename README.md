# 🎯 Cazador de Ofertas

**Tu asistente inteligente para pagar menos.**

Cazador de Ofertas es una plataforma chilena para **buscar → comparar → decidir → vigilar → ahorrar**.

La propuesta no es mostrar listas de descuentos: Cazador intenta identificar el producto exacto, separar variantes, comparar precios disponibles, construir historial, calcular un Cazador Score y ayudar al consumidor a decidir si conviene comprar o seguir esperando.

## Principio rector

> Primero ayudamos al usuario a encontrar la mejor compra. Después monetizamos esa decisión. Nunca al revés.

Una comisión, afiliación, campaña o patrocinio **no puede modificar el ranking orgánico ni el Cazador Score**. El contenido patrocinado debe identificarse explícitamente.

## Cazador 1.0

La base técnica incluye:

- Producto Maestro y matching conservador de variantes.
- Catálogo automático por categorías.
- Comparación multifuente preparada.
- Historial de precios.
- Cazador Score y recomendación basada en evidencia.
- Alertas por producto/listing.
- Cola de email y WhatsApp preparada para proveedores externos.
- Cupones y beneficios bancarios verificados.
- Tracking de clics, programas comerciales, campañas y conversiones.
- Analítica propia de búsquedas, categorías, alertas y funnel.
- Club Cazador para beneficios de comercios físicos/locales.
- Pase Cazador de un solo uso para beneficios QR.
- Postulación online de comercios.
- CAZA, motor de contenido del asistente virtual, que sólo genera piezas cuando existe una oportunidad o beneficio verificado.

## Automatizaciones

- Robot de catálogo: cada 5 minutos.
- Monitor de precios: cada hora.
- Email transaccional: cola revisada cada hora (se activa al conectar proveedor).
- WhatsApp: cola revisada cada hora (se activa al conectar Meta y respetando guardas de costo).
- Control financiero: cada hora.
- CAZA Content Builder: cada hora.

## Seguridad

- Tablas internas protegidas con RLS.
- Robots internos autenticados con una credencial almacenada en Supabase Vault.
- Los navegadores no reciben service-role keys, tokens OAuth ni credenciales de proveedores.
- Los endpoints antiguos de prototipo fueron retirados o protegidos.
- Los enlaces de compra pasan por tracking controlado y sólo redirigen a HTTPS.
- Los Pases Cazador QR son temporales y de un solo uso.

## Sitios

- Web principal: `https://cazadordeofertas.github.io/cazador-de-ofertas/`
- Club Cazador: `https://cazadordeofertas.github.io/cazador-de-ofertas/club.html`
- Postulación de comercios: `https://cazadordeofertas.github.io/cazador-de-ofertas/partners.html`
- Validador de comercios: `https://cazadordeofertas.github.io/cazador-de-ofertas/partner-scan.html`

## Integraciones externas pendientes de credenciales/acuerdos

La arquitectura está preparada, pero estas capacidades sólo deben marcarse como activas cuando exista la conexión real:

- Programa de afiliados/tracking aprobado de cada comercio.
- Proveedor de correo transaccional (Resend preparado).
- WhatsApp Cloud API de Meta + plantilla aprobada.
- Integraciones oficiales o autorizadas más amplias para retailers adicionales.
- Proveedor de avatar/video para CAZA.
- Automatización de publicación en redes sociales.

Cazador no inventa precios, comisiones, cupones, ventas ni beneficios para aparentar cobertura.