import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MESA · Inventario",
  description: "Inventario y pedido (MESA + ADMIN) con PIN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
