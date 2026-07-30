import assert from "node:assert/strict";
import { test } from "node:test";
import { createOrderServer } from "./server.js";

const regularOrder = {
  customerName: "Ada",
  customerTier: "regular",
  items: [{ sku: "notebook", name: "Notebook", unitPrice: 20, quantity: 2 }],
};

const premiumOrder = {
  customerName: "Grace",
  customerTier: "premium",
  items: [{ sku: "keyboard", name: "Keyboard", unitPrice: 100, quantity: 1 }],
};

test("order workflow", async () => {
  const server = createOrderServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No TCP address");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const create = (order: unknown) =>
      fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(order),
      });

    const regularResponse = await create(regularOrder);
    const regular = (await regularResponse.json()) as Record<string, unknown>;
    assert.equal(regularResponse.status, 201);
    assert.deepEqual(
      [regular.id, regular.subtotal, regular.discount, regular.shipping, regular.total],
      ["order-1", 40, 0, 8, 48],
    );

    const lookup = await fetch(`${baseUrl}/orders/order-1`);
    assert.equal(((await lookup.json()) as Record<string, unknown>).customerName, "Ada");

    await create(premiumOrder);
    const premium = (await (await fetch(`${baseUrl}/orders/order-2`)).json()) as Record<
      string,
      unknown
    >;
    assert.deepEqual(
      [premium.subtotal, premium.discount, premium.shipping, premium.total],
      [100, 10, 0, 90],
    );

    const report = await fetch(`${baseUrl}/reports/revenue`);
    assert.deepEqual(await report.json(), { orders: 2, revenue: 138 });

    const invalid = await create({
      ...regularOrder,
      items: [{ ...regularOrder.items[0], quantity: 0 }],
    });
    assert.equal(invalid.status, 400);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
