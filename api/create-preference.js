const { MercadoPagoConfig, Preference } = require('mercadopago');
const posthog = require('../lib/posthog');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customer } = req.body;

    if (!items?.length) return res.status(400).json({ error: 'Carrito vacío' });
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: 'Datos del cliente incompletos' });
    }

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    // FRONTEND_URL sin barra final, y validamos que sea https (MP lo exige para
    // back_urls + auto_return). Si falta o es inválida, omitimos esos campos para
    // que la preferencia se cree igual (no rompe el pago).
    const FU = (process.env.FRONTEND_URL || '').trim().replace(/\/+$/, '');
    const validFU = /^https:\/\//.test(FU);

    const body = {
      items: items.map(i => ({
        title: i.name,
        quantity: Number(i.qty),
        unit_price: Number(i.price),
        currency_id: 'CLP',
      })),
      payer: {
        name: customer.name,
        email: customer.email,
        phone: { number: customer.phone },
      },
      external_reference: JSON.stringify({
        customer,
        items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
      }),
      // Sin 'purpose: wallet_purchase' → permite pagar como INVITADO (con tarjeta,
      // sin cuenta de MercadoPago) además de con cuenta.
    };

    if (validFU) {
      body.back_urls = {
        success: `${FU}/success`,
        failure: `${FU}/cancel`,
        pending: `${FU}/cancel`,
      };
      body.notification_url = `${FU}/api/webhook`;
      body.auto_return = 'approved';   // requiere back_urls.success válido
    }

    const result = await preference.create({ body });

    posthog.capture({
      distinctId: customer.email,
      event: 'checkout_started',
      properties: {
        preference_id: result.id,
        item_count: items.length,
        total_amount: total,
        currency: 'CLP',
      },
    });

    res.json({ init_point: result.init_point, id: result.id });
  } catch (err) {
    console.error('create-preference error:', err);
    const detail =
      (err && err.cause && err.cause[0] && (err.cause[0].description || err.cause[0].message)) ||
      (err && err.message) || 'unknown';
    res.status(500).json({ error: 'Error al crear preferencia', detail: String(detail), hasToken: !!process.env.MERCADO_PAGO_ACCESS_TOKEN, hasFrontendUrl: !!process.env.FRONTEND_URL });
  }
};
