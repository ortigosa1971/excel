# MESA Inventario (PIN)

App mínima tipo tu Excel, pero solo para **MESA** + **ADMIN**, con un único **PIN**.

## Requisitos
- Node 18+ (recomendado 20)
- npm

## Arrancar en local (SQLite)
1. Copia variables:
   ```bash
   cp .env.example .env
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea DB + migración:
   ```bash
   npm run prisma:migrate
   ```
4. (Opcional) Mete datos demo:
   ```bash
   npm run seed
   ```
5. Arranca:
   ```bash
   npm run dev
   ```

Abre: http://localhost:3000

PIN por defecto: el de `.env` (APP_PIN). Si no existe, usa `123456`.

## Railway (más adelante)
- Cambia `DATABASE_URL` a Postgres y en `prisma/schema.prisma` cambia provider a `postgresql`.
- Ejecuta migraciones en build/deploy con `prisma migrate deploy`.

> Para el siguiente paso podemos añadir: importación desde tu `pedidos.xlsm` (hoja MESA), histórico de pedidos, y escaneo con móvil.
