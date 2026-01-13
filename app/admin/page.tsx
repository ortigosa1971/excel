"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/app/_components/TopBar";

type Product = {
  id: number;
  barcode: string | null;
  productCode: string | null;
  description: string;
  stockActual: number;
  stockMin: number;
  orderQty: number;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    barcode: "",
    productCode: "",
    description: "",
    stockMin: 0,
    stockActual: 0,
  });

  async function load() {
    const res = await fetch("/api/products");
    const j = await res.json();
    setProducts(j.products || []);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return products;
    return products.filter((p) =>
      (p.description || "").toLowerCase().includes(qq) ||
      (p.barcode || "").toLowerCase().includes(qq) ||
      (p.productCode || "").toLowerCase().includes(qq)
    );
  }, [products, q]);

  async function patch(id: number, data: Partial<Product>) {
    setBusy(true);
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
      setBusy(false);
    }
  }

  async function del(id: number) {
    if (!confirm("¿Borrar producto?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo borrar");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    setBusy(true);
    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: form.barcode ? form.barcode : null,
          productCode: form.productCode ? form.productCode : null,
          description: form.description,
          stockMin: Number(form.stockMin),
          stockActual: Number(form.stockActual),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "No se pudo crear");
      setProducts((prev) => [j.product, ...prev]);
      setForm({ barcode: "", productCode: "", description: "", stockMin: 0, stockActual: 0 });
    } catch (e: any) {
      alert(e.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <TopBar title="Admin" />

      <div className="card" style={{ marginBottom: 14 }}>
        <h2 style={{ marginTop: 0 }}>Crear producto</h2>
        <div className="row">
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="small">Descripción</label>
            <input className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ minWidth: 170 }}>
            <label className="small">Barcode</label>
            <input className="input" value={form.barcode} onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))} />
          </div>
          <div style={{ minWidth: 140 }}>
            <label className="small">Código</label>
            <input className="input" value={form.productCode} onChange={(e) => setForm((f) => ({ ...f, productCode: e.target.value }))} />
          </div>
          <div style={{ minWidth: 130 }}>
            <label className="small">Stock mín.</label>
            <input className="input" type="number" value={form.stockMin} onChange={(e) => setForm((f) => ({ ...f, stockMin: Number(e.target.value) }))} />
          </div>
          <div style={{ minWidth: 140 }}>
            <label className="small">Stock actual</label>
            <input className="input" type="number" value={form.stockActual} onChange={(e) => setForm((f) => ({ ...f, stockActual: Number(e.target.value) }))} />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn primary" onClick={create} disabled={busy || !form.description}>Crear</button>
          </div>
        </div>
        <p className="small">Tip: si no usas barcode, déjalo vacío.</p>
      </div>

      <div className="card">
        <div className="row" style={{ alignItems: "end" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label className="small">Buscar</label>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Descripción / barcode / código" />
          </div>
          <div className="small">{busy ? "Trabajando..." : ""}</div>
        </div>

        <div style={{ height: 12 }} />

        <table className="table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Barcode</th>
              <th>Código</th>
              <th>Stock actual</th>
              <th>Stock mín.</th>
              <th>Pedido</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    className="input"
                    value={p.description}
                    onChange={(e) => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, description: e.target.value } : x)))}
                    onBlur={() => patch(p.id, { description: p.description })}
                  />
                </td>
                <td className="small">{p.barcode ?? ""}</td>
                <td className="small">{p.productCode ?? ""}</td>
                <td>
                  <input
                    className="input"
                    style={{ maxWidth: 120 }}
                    type="number"
                    value={p.stockActual}
                    onChange={(e) => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stockActual: Number(e.target.value) } : x)))}
                    onBlur={() => patch(p.id, { stockActual: p.stockActual })}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    style={{ maxWidth: 120 }}
                    type="number"
                    value={p.stockMin}
                    onChange={(e) => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, stockMin: Number(e.target.value) } : x)))}
                    onBlur={() => patch(p.id, { stockMin: p.stockMin })}
                  />
                </td>
                <td className="small">{p.orderQty}</td>
                <td>
                  <button className="btn danger" onClick={() => del(p.id)} disabled={busy}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 ? <p className="small">No hay resultados.</p> : null}
      </div>
    </div>
  );
}
