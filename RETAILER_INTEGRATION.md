# Integración de tiendas con Cazador de Ofertas

Cazador admite un **feed autorizado** para incorporar tiendas sin scraping y sin reuniones presenciales.

## Flujo

1. Cazador crea/activa la tienda en `stores`.
2. Cazador genera una clave de integración para esa tienda mediante el proceso interno seguro.
3. La tienda envía un `POST` a:

`/functions/v1/cazador-retailer-feed`

con headers:

- `x-cazador-store`: slug asignado a la tienda.
- `x-cazador-store-key`: clave privada entregada a esa tienda.
- `Content-Type: application/json`

La clave sólo se conserva hasheada en la base de datos.

## Payload

```json
{
  "items": [
    {
      "external_id": "SKU-123",
      "title": "Producto exacto",
      "url": "https://tienda.cl/producto",
      "image_url": "https://tienda.cl/imagen.jpg",
      "price": 99990,
      "original_price": 119990,
      "currency": "CLP",
      "available": true
    }
  ]
}
```

Máximo actual: 100 items por llamada.

## Qué hace Cazador

- Valida URL HTTPS y precios.
- Upsert por tienda + identificador externo.
- Conserva historial cuando cambia el precio.
- Ejecuta el matching de Producto Maestro existente.
- Mantiene separadas las variantes cuando no existe suficiente confianza.
- Permite después aplicar tracking/afiliación mediante `commercial_links`, sin alterar el ranking orgánico.

## Principio comercial

El feed de una tienda permite que sus productos entren al universo de comparación. **No compra posición orgánica**. Una campaña patrocinada debe mostrarse en un espacio separado y rotulado como patrocinado.