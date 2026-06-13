# Pagos con MercadoPago — Guía completa

MercadoPago es el sistema de pagos **de MercadoLibre**. Para Chile (CLP). El sitio
ya tiene todo el código: dos funciones serverless en Vercel (`api/create-preference.js`
y `api/webhook.js`) + el checkout del carrito.

## Cómo funciona el flujo
1. Cliente arma el carrito → datos (nombre, email, tel) → "Pagar con Mercado Pago".
2. El front llama a `/api/create-preference` → crea la orden y devuelve un link.
3. Se abre el checkout de MercadoPago → el cliente paga (tarjeta, débito, o cuenta MP).
   - Ahora se puede pagar **como invitado** (con tarjeta, sin cuenta MP).
4. Vuelve a `/success` (o `/cancel`).
5. MercadoPago avisa a `/api/webhook` → el webhook **consulta el pago por ID**, y si
   quedó **aprobado** manda el **email del pedido** (Resend) + registra el evento.

---

## 1) Qué sacar (credenciales)
1. **Cuenta MercadoPago Chile** (mercadopago.cl) — idealmente la del **dueño del negocio** (ahí cae la plata).
2. Panel de desarrolladores → **Tus integraciones → Crear aplicación** (tipo: Pagos online / Checkout Pro).
3. La app te da **dos juegos de credenciales**:
   - **TEST** (para probar sin plata real) → `Access Token` de prueba.
   - **PRODUCCIÓN** → `Access Token` real (`APP_USR-...`).
4. **Resend** (resend.com) → una **API Key** (`re_...`) para los emails de pedido.

> 🔒 El Access Token es **SECRETO**. Va solo en las variables de Vercel, nunca en el código ni compartido.

## 2) Conectar en Vercel
Vercel → proyecto → **Settings → Environment Variables** → agregar:

| Variable | Valor |
|---|---|
| `MERCADO_PAGO_ACCESS_TOKEN` | Access Token (TEST para probar / PRODUCCIÓN para vender) |
| `RESEND_API_KEY` | API key de Resend (`re_...`) |
| `NOTIFICATION_EMAIL` | email donde llegan los pedidos |
| `FRONTEND_URL` | URL del sitio (ej. `https://tudominio.vercel.app`, sin `/` al final) |
| `POSTHOG_API_KEY` | (opcional) para eventos de PostHog |
| `POSTHOG_HOST` | (opcional) ej. `https://us.i.posthog.com` |

Después: **Redeploy** para que tome las variables.

## 3) Configurar el webhook en MercadoPago
El sitio ya manda la `notification_url` en cada orden, pero conviene también dejarlo fijo:
- Panel MP → tu aplicación → **Webhooks / Notificaciones** → URL:
  `https://TUDOMINIO/api/webhook` → evento **Pagos** (payment).

---

## 4) MODO PRUEBA (sandbox) — probar sin plata real
1. Poné el **Access Token de TEST** en `MERCADO_PAGO_ACCESS_TOKEN` en Vercel → Redeploy.
2. Entrá al sitio, agregá productos, andá a pagar.
3. Pagá con una **tarjeta de prueba** de MercadoPago:

| Tarjeta | Número | CVV | Vencimiento |
|---|---|---|---|
| Mastercard | `5031 7557 3453 0604` | 123 | 11/30 |
| Visa | `4075 5957 1648 3764` | 123 | 11/30 |

   - **Nombre del titular** = define el resultado:
     - `APRO` → **aprobado** ✅
     - `OTHE` → rechazado por error general
     - `CONT` → queda pendiente
   - Documento (RUT/DNI de prueba): `12345678`
4. Con `APRO` el pago se aprueba → te tiene que **llegar el email del pedido**.
   (Confirmá que llegó a `NOTIFICATION_EMAIL`.)

## 5) Pasar a PRODUCCIÓN (vender de verdad)
1. Cambiá `MERCADO_PAGO_ACCESS_TOKEN` por el de **PRODUCCIÓN** (`APP_USR-...`) → Redeploy.
2. Hacé **una compra real chica** (ej. el producto más barato) para confirmar punta a punta.
3. Listo.

---

## Notas / pendientes
- **Email "from":** hoy usa `onboarding@resend.dev` (remitente de prueba de Resend) →
  solo entrega a tu propio email verificado. Para mandar desde un dominio propio
  (ej. `pedidos@tudominio.cl`) hay que **verificar el dominio en Resend** y cambiar el
  `from` en `api/webhook.js`. (Decime y lo dejo listo cuando tengas el dominio.)
- El webhook responde siempre `200` para que MercadoPago no reintente en loop, y solo
  manda email cuando el pago está **aprobado** (los pendientes/rechazados se registran
  pero no mandan email).
