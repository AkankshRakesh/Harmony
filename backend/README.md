# Harmony — Backend

Minimal Node/Express backend for the Harmony frontend.

Getting started

1. Open a terminal in the `backend/` folder.
2. Install dependencies:

```powershell
npm install
```

3. Run in development mode (requires `nodemon`):

```powershell
npm run dev
```

4. Start in production mode:

```powershell
npm start
```

Available endpoints

- `GET /api/health` — basic health check
- `GET /api/features` — returns a small features JSON payload used by the frontend

Notes

- This is intentionally small and dependency-light. If you want authentication, a database, or additional APIs (user, sessions, webhooks), tell me and I will scaffold them.
