"use client";

export function TopBar({ title }: { title: string }) {
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="header">
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <div className="small">Inventario y pedido · MESA</div>
      </div>
      <div className="nav">
        <a className="btn" href="/mesa">Mesa</a>
        <a className="btn" href="/admin">Admin</a>
        <button className="btn" onClick={logout}>Salir</button>
      </div>
    </div>
  );
}
