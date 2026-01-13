"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/app/_components/TopBar";
import { isAlarm } from "@/lib/alarm";

type Product = {
  id: number;
  barcode: string | null;
  productCode: string | null;
  description: string;
  stockActual: number;
  stockMin: number;
  orderQty: number;
};

export default function MesaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [onlyAlarm, setOnlyAlarm] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/products");
    const j = await res.json();
    setProducts(j.products || []);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return products.filter((p) => {
      if (onlyAlarm && !isAlarm(p.stockActual, p.stockMin)) return false;
      if (!qq) return true;
      return (
        (p.description || "").toLowerCase().includes(qq) ||
        (p.barcode || "").toLowerCase().includes(qq) ||
        (p.productCode || "").toLowerCase().includes(qq)
      );
    });
  }, [products, q, onlyAlarm]);

  async function patch(id: number, data: Partial<Product>) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      const j = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? j.product : p)));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <TopBar title="Mesa" />

      <div className="card">
        <div className="row" style={{ alignItems: "end" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label className="small">Buscar</label>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Descripción / barcode / código" />
          </div>
          <div>
            <label className="small">Filtro</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input id="onlyAlarm" type="checkbox" checked={onlyAlarm} onChange={(e) => setOnlyAlarm(e.target.checked)} />
              <label htmlFor="onlyAlarm">Solo PEDIR</label>
            </div>
          </div>
          <div>
            <a className="btn primary" href="/api/order/export" target="_blank" rel="noreferrer">
              Exportar pedido (CSV)
            </a>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <table className="table">
          <thead>
            <tr>
              <th>Alarma</th>
              <th>Descripción</th>
              <th>Barcode</th>
              <th>Código</th>
              <th>Stock actual</th>
              <th>Stock mín.</th>
              <th>Cantidad a pedir</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const alarm = isAlarm(p.stockActual, p.stockMin);
              return (
                <tr key={p.id}>
                  <td>
                    <span className={`badge ${alarm ? "alert" : "ok"}`}>{alarm ? "PEDIR" : "NO PEDIR"}</span>
                  </td>
                  <td>{p.description}</td>
                  <td className="small">{p.barcode ?? ""}</td>
                  <td className="small">{p.productCode ?? ""}</td>
                  <td>
                    <input
                      className="input"
                      style={{ maxWidth: 110 }}
                      type="number"
                      value={p.stockActual}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stockActual: v } : x)));
                      }}
                      onBlur={() => patch(p.id, { stockActual: p.stockActual })}
                    />
                  </td>
                  <td className="small">{p.stockMin}</td>
                  <td>
                    <input
                      className="input"
                      style={{ maxWidth: 130 }}
                      type="number"
                      value={p.orderQty}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, orderQty: v } : x)));
                      }}
                      onBlur={() => patch(p.id, { orderQty: p.orderQty })}
                    />
                  </td>
                  <td className="small">{savingId === p.id ? "guardando..." : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 ? <p className="small">No hay resultados.</p> : null}
      </div>
    </div>
  );
}
