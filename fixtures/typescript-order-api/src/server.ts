import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";

type LineItem = {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

type Order = {
  id: string;
  customerName: string;
  customerTier: "regular" | "premium";
  items: LineItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export function createOrderServer() {
  const orders = new Map<string, Order>();
  let nextId = 1;

  return createServer(async (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader("content-type", "application/json");

    try {
      if (request.method === "POST" && request.url === "/orders") {
        const chunks: Buffer[] = [];
        for await (const chunk of request) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const data = JSON.parse(Buffer.concat(chunks).toString("utf8")) as any;

        if (
          !data.customerName ||
          (data.customerTier !== "regular" && data.customerTier !== "premium") ||
          !Array.isArray(data.items) ||
          data.items.length === 0
        ) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: "Invalid order" }));
          return;
        }

        for (const item of data.items) {
          if (
            !item.sku ||
            !item.name ||
            typeof item.unitPrice !== "number" ||
            item.unitPrice <= 0 ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
          ) {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "Invalid order" }));
            return;
          }
        }

        let subtotal = 0;
        for (const item of data.items) {
          subtotal += item.unitPrice * item.quantity;
        }

        let discount = 0;
        if (data.customerTier === "premium") {
          discount = subtotal * 0.1;
        } else if (subtotal >= 100) {
          discount = subtotal * 0.05;
        }

        const shipping = subtotal >= 75 ? 0 : 8;
        const order: Order = {
          id: `order-${nextId++}`,
          customerName: data.customerName,
          customerTier: data.customerTier,
          items: data.items,
          subtotal,
          discount,
          shipping,
          total: subtotal - discount + shipping,
        };

        orders.set(order.id, order);
        response.statusCode = 201;
        response.end(JSON.stringify(order));
        return;
      }

      if (request.method === "GET" && request.url === "/reports/revenue") {
        let revenue = 0;
        for (const order of orders.values()) revenue += order.total;
        response.end(JSON.stringify({ orders: orders.size, revenue }));
        return;
      }

      if (request.method === "GET" && request.url?.startsWith("/orders/")) {
        const id = request.url.split("/")[2];
        const order = orders.get(id);
        if (!order) {
          response.statusCode = 404;
          response.end(JSON.stringify({ error: "Order not found" }));
          return;
        }

        response.end(JSON.stringify(order));
        return;
      }

      response.statusCode = 404;
      response.end(JSON.stringify({ error: "Not found" }));
    } catch {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: "Invalid order" }));
    }
  });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  createOrderServer().listen(port, () => {
    console.log(`Order API listening on http://localhost:${port}`);
  });
}
