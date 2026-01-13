import { prisma } from "@/lib/prisma";

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const items = await prisma.product.findMany({
    where: { orderQty: { gt: 0 } },
    orderBy: { description: "asc" },
  });

  const header = ["barcode", "product_code", "description", "order_qty", "stock_actual", "stock_min"];
  const rows = items.map((p) => [
    p.barcode ?? "",
    p.productCode ?? "",
    p.description,
    p.orderQty,
    p.stockActual,
    p.stockMin,
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedido_mesa.csv"`,
    },
  });
}
