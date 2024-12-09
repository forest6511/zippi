## 認証テスト

認証フローの実装確認　

# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

---

## Setup (Local)

This setup guide is for my personal reference.

### 1. Install dependencies

```sh
npm install remix-auth remix-auth-form prisma @prisma/client bcryptjs
```

---

### 2. Set up PostgreSQL

Access the PostgreSQL container:

```sh
docker exec -it postgres_17_db_container psql -U postgres
```

Run the following SQL commands:

```sql
DROP DATABASE IF EXISTS zippi;
DROP USER IF EXISTS zippi;

CREATE USER zippi WITH SUPERUSER CREATEDB CREATEROLE PASSWORD 'zippi';

CREATE DATABASE zippi;
GRANT ALL PRIVILEGES ON DATABASE zippi TO zippi;

\c zippi
GRANT ALL PRIVILEGES ON SCHEMA public TO zippi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zippi;
```

---

### 3. Run Prisma migrations

```sh
npx prisma migrate dev --name init
```

This will initialize your database schema for local development.
### 4. Install UI

For UI setup, refer to the official [shadcn UI installation guide for Remix](https://ui.shadcn.com/docs/installation/remix).

---
