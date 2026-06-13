const { MercadoPagoConfig, Payment } = require('mercadopago');
const { Resend } = require('resend');
const posthog = require('../lib/posthog');

function formatCLP(n) {
  return '$' + Number(n).toLocaleString('es-CL');
}

function buildEmailHtml({ customer, items, total, paymentId, status }) {
  const itemsRows = items
    .map(i => `<tr><td style="padding:6px 0">${i.qty}x ${i.name}</td><td style="padding:6px 0;text-align:right">${formatCLP(i.price)}</td><td style="padding:6px 0;text-align:right">${formatCLP(i.price * i.qty)}</td></tr>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f5f7">
  <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <h1 style="font-size:22px;margin:0 0 8px">🛒 Nuevo Pedido</h1>
    <p style="color:#6e6e73;margin:0 0 24px">Pagado vía Mercado Pago ${new Date().toLocaleString('es-CL')}</p>

    <div style="background:#f5f5f7;border-radius:12px;padding:16px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-weight:600">${customer.name}</p>
      <p style="margin:0;color:#6e6e73;font-size:13px">${customer.rut ? 'RUT: ' + customer.rut + '<br>' : ''}Email: ${customer.email}<br>Tel: ${customer.phone}</p>
      ${customer.city ? `<p style="margin:4px 0 0;color:#6e6e73;font-size:13px">${customer.city}${customer.address ? ' - ' + customer.address : ''}</p>` : ''}
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead><tr style="border-bottom:1px solid #e5e5e5;font-size:12px;color:#6e6e73;text-transform:uppercase">
        <th style="text-align:left;padding:6px 0">Producto</th>
        <th style="text-align:right;padding:6px 0">Precio</th>
        <th style="text-align:right;padding:6px 0">Subtotal</th>
      </tr></thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div style="border-top:2px solid #000;padding-top:12px;text-align:right;font-size:18px;font-weight:700">
      Total: ${formatCLP(total)}
    </div>

    <div style="margin-top:24px;padding:12px;background:#e8f5e9;border-radius:8px;font-size:13px">
      <strong>Pago ID:</strong> ${paymentId}<br>
      <strong>Estado:</strong> ${status}
    </div>
  </div>
</body>
</html>`;
}

module.exports = async (req, res) => {
  const debug = req.query && req.query.debug === '1';
  const rep = {
    hasMpToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
    hasResendKey: !!process.env.RESEND_API_KEY,
    notificationEmail: process.env.NOTIFICATION_EMAIL || null,
  };
  const done = (extra) => {
    Object.assign(rep, extra || {});
    if (debug) return res.status(200).json(rep);
    return res.status(200).end();
  };
  // Test directo de Resend (sin MercadoPago): /api/webhook?testmail=1
  if (req.query && req.query.testmail === '1') {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const r = await resend.emails.send({
        from: 'Pedidos <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: '🛒 Test Dune Dragon',
        html: '<p>Email de prueba del webhook. Si te llegó, Resend funciona.</p>',
      });
      return res.status(200).json({
        testmail: true, to: process.env.NOTIFICATION_EMAIL,
        emailId: r && r.data ? r.data.id : null,
        emailError: r && r.error ? (r.error.message || JSON.stringify(r.error)) : null,
      });
    } catch (e) {
      return res.status(200).json({ testmail: true, error: e && (e.message || String(e)) });
    }
  }

  try {
    // MercadoPago avisa con { type:'payment', data:{ id } } (o por query). NO manda
    // los datos del pedido: hay que consultar el pago por ID para obtenerlos.
    const body = req.body || {};
    const query = req.query || {};
    const type = body.type || body.topic || query.type || query.topic;
    const paymentId = (body.data && body.data.id) || body.id || query.id || query['data.id'];
    rep.type = type; rep.paymentId = paymentId || null;

    if (type && type !== 'payment') return done({ skip: 'not a payment notification' });
    if (!paymentId) return done({ skip: 'no payment id' });

    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
    const payment = await new Payment(client).get({ id: paymentId });

    const status = payment.status;   // approved | pending | rejected | ...
    rep.status = status;
    const orderData = payment.external_reference ? JSON.parse(payment.external_reference) : null;
    rep.hasExternalRef = !!orderData;
    if (!orderData) return done({ skip: 'payment has no external_reference' });

    posthog.capture({
      distinctId: orderData.customer.email,
      event: status === 'approved' ? 'order_completed' : 'order_' + status,
      properties: {
        payment_id: payment.id, payment_status: status,
        item_count: orderData.items.length, total_amount: orderData.total, currency: 'CLP',
      },
    });

    // Email del pedido solo cuando el pago quedó APROBADO.
    if (status === 'approved') {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const r = await resend.emails.send({
        from: 'Pedidos <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `🛒 Nuevo Pedido - ${formatCLP(orderData.total)}`,
        html: buildEmailHtml({
          customer: orderData.customer, items: orderData.items, total: orderData.total,
          paymentId: payment.id, status,
        }),
      });
      rep.emailId = r && r.data && r.data.id ? r.data.id : null;
      rep.emailError = r && r.error ? (r.error.message || JSON.stringify(r.error)) : null;
    } else {
      rep.emailSkipped = 'status no es approved';
    }

    try { await posthog.flush(); } catch (e) {}
    return done({ ok: true });
  } catch (err) {
    console.error('webhook error:', err);
    return done({ ok: false, error: err && (err.message || String(err)) });
  }
};
