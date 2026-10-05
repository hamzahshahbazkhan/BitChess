# BitChess

Realtime 1v1 online chess. React + Vite frontend, Express + Socket.IO backend, Prisma + Postgres.

Revived 2026: fixed JWT secret unify + expiry, socket handshake auth, password-hash leak, updateInfo guard, masked inputs.

## Run locally
Backend:
```
cd backend1
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```
Frontend:
```
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deploy notes
Backend needs long-lived process for Socket.IO (Render/Fly/Railway), not Vercel serverless. Frontend on Vercel.
