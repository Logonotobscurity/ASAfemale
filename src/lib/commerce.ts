import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";

const checkoutInput = z.object({
  tenantId: z.string().min(1).max(80).default("asa-default"),
  items: z
    .array(
      z.object({
        sku: z.string().min(1).max(40),
        size: z.string().min(1).max(20),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});

type CatalogRow = {
  sku: string;
  name: string;
  price_cents: number;
  size_label: string;
  stock: number;
  reserved: number;
};

function orderReference() {
  return `ASA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

/** Creates a server-priced order and returns a WhatsApp handoff URL. */
export const createWhatsAppCheckout = createServerFn({ method: "POST" })
  .inputValidator(checkoutInput)
  .handler(async ({ data }) => {
    const input = checkoutInput.parse(data);
    const sql = await getSql();
    const skuList = input.items.map((item) => item.sku);
    const rows = await sql.query<CatalogRow>(
      `select p.sku, p.name, p.price_cents, v.size_label, v.stock, v.reserved
       from products p
       join product_variants v on v.product_id = p.id
       where p.tenant_id = $1 and p.active = true and p.sku = any($2::text[])
       for update`,
      [input.tenantId, skuList],
    );

    const lineItems = input.items.map((item) => {
      const row = rows.find(
        (candidate) => candidate.sku === item.sku && candidate.size_label === item.size,
      );
      if (!row) throw new Error(`Item ${item.sku} in size ${item.size} is unavailable.`);
      const available = row.stock - row.reserved;
      if (item.quantity > available) throw new Error(`${row.name} has limited stock.`);
      return {
        sku: row.sku,
        name: row.name,
        size: row.size_label,
        quantity: item.quantity,
        unitPriceCents: row.price_cents,
        lineTotalCents: row.price_cents * item.quantity,
      };
    });

    const totalCents = lineItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const reference = orderReference();
    const orderId = crypto.randomUUID();
    await sql.query(
      `insert into orders (id, tenant_id, reference, status, total_cents, pricing_snapshot, whatsapp_status)
       values ($1, $2, $3, 'initiated', $4, $5::jsonb, 'not_sent')`,
      [orderId, input.tenantId, reference, totalCents, JSON.stringify({ items: lineItems })],
    );
    await sql.query(
      `insert into order_events (order_id, event_type, payload, actor)
       values ($1, 'initiated', $2::jsonb, 'customer')`,
      [orderId, JSON.stringify({ reference, totalCents })],
    );

    const phone = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER ?? "2348000000000";
    const message = `Hello ÀṢÀ, I want to place order ${reference}. Total: ₦${(totalCents / 100).toLocaleString("en-NG")}. ${lineItems.map((item) => `${item.quantity}× ${item.name} (${item.size})`).join("; ")}`;
    return {
      orderId,
      reference,
      totalCents,
      whatsappUrl: `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
    };
  });

export const recordConsent = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tenantId: z.string().min(1).max(80).default("asa-default"),
      channel: z.enum(["analytics", "location", "whatsapp", "sms", "cobrowse"]),
      granted: z.boolean(),
      scope: z.string().min(1).max(120),
      source: z.string().min(1).max(80),
    }),
  )
  .handler(async ({ data }) => {
    const input = z.object({
      tenantId: z.string().min(1).max(80),
      channel: z.enum(["analytics", "location", "whatsapp", "sms", "cobrowse"]),
      granted: z.boolean(),
      scope: z.string().min(1).max(120),
      source: z.string().min(1).max(80),
    }).parse(data);
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql.query(
      `insert into consent_records (id, tenant_id, channel, granted, scope, source)
       values ($1, $2, $3, $4, $5, $6)`,
      [id, input.tenantId, input.channel, input.granted, input.scope, input.source],
    );
    return { id, granted: input.granted };
  });
