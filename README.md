# i-c-u-gaming-portal

Proyecto con Next.js y Supabase.

## Requisitos

- Node.js 20+ (o compatible con Next.js 16)
- npm o pnpm
- Supabase configurado con las variables de entorno en `.env`

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase y Postgres.

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
POSTGRES_URL=...
POSTGRES_PASSWORD=...
POSTGRES_USER=...
POSTGRES_DATABASE=...
```

> El proyecto ya ignora archivos `.env*` en `.gitignore`.

## Instalación

Usa npm o pnpm según prefieras:

```bash
npm install
```

o

```bash
pnpm install
```

## Desarrollo

Inicia el servidor de desarrollo de Next.js:

```bash
npm run dev
```

o

```bash
pnpm dev
```

Abre `http://localhost:3000` en tu navegador.

## Construir y ejecutar

Construye el proyecto:

```bash
npm run build
```

o

```bash
pnpm build
```

Inicia el servidor en modo producción:

```bash
npm start
```

o

```bash
pnpm start
```

## Lint

Ejecuta ESLint:

```bash
npm run lint
```

o

```bash
pnpm lint
```

## Prisma (opcional)

Este proyecto no tiene Prisma configurado en `package.json` actualmente, pero si agregas Prisma puedes usar comandos como:

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Comandos útiles:

```bash
npx prisma migrate dev --name init
npx prisma db push
npx prisma studio
```

En pnpm:

```bash
pnpm prisma migrate dev --name init
pnpm prisma db push
pnpm prisma studio
```

## Supabase

- Asegúrate de tener `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` definidos.
- Usa el `SUPABASE_SERVICE_ROLE_KEY` solo en entorno server-side.
- El cliente de Supabase en este proyecto se inicializa desde `lib/supabase/client.ts` y `lib/supabase/server.ts`.

## Notas

- Si quieres usar Prisma con Supabase, la URL de conexión debe apuntar a la base de datos Postgres de Supabase.
- Si necesitas soporte para entornos locales y de producción, usa `NEXT_PUBLIC_...` para el cliente público y variables `SUPABASE_...` para server-side.
