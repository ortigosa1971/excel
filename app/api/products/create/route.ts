import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({
  barcode: z.string().optional().nullable(),
  productCode: z.string().optional().nullable(),
  description: z.string().min(1),
  stockActual: z.number().int().optional().default(0),
  stockMin: z.number().int().optional().default(0),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: "No se pudo crear (¿barcode duplicado?)" }, { status: 400 });
  }
}
