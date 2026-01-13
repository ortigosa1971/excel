"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const sp = useSearchParams();
  const nextPath = useMemo(() => sp.get("next") || "/mesa", [sp]);

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "PIN incorrecto");
      }
      window.location.href = nextPath;
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1 style={{ marginTop: 0 }}>Entrar</h1>
      <p className="small" style={{ marginTop: -6 }}>
        Acceso por PIN. Cambia el PIN en <span className="kbd">APP_PIN</span>.
      </p>

      <form onSubmit={onSubmit}>
        <label className="small">PIN</label>
        <input
          className="input"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="123456"
        />
        <div style={{ height: 10 }} />
        <button className="btn primary" disabled={loading || !pin}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {err ? <p style={{ color: "#b00020" }}>{err}</p> : null}
      </form>
    </div>
  );
}
