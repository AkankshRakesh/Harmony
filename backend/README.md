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
 - `GET /api/organizations` — returns a small list of organizations (mock)
 - `POST /api/signup` — create a new user (body: { email, password, role, profile }) — returns { user, token }
 - `POST /api/login` — login with email/password (body: { email, password }) — returns { user, token }
 - `GET /api/me` — get current user (requires Authorization: Bearer <token>)

Notes

- This is intentionally small and dependency-light. If you want authentication, a database, or additional APIs (user, sessions, webhooks), tell me and I will scaffold them.

Authentication notes

- The backend supports JWT-based authentication. A token is returned on signup/login and should be sent in the `Authorization: Bearer <token>` header for protected endpoints like `/api/me`.
- Configure the following environment variables in a `.env` file or your deployment environment:
	- `JWT_SECRET` — secret used to sign JWTs (required in production)
	- `MONGODB_URL` or `MONGODB_URI` — optional MongoDB connection string; when provided users are persisted in MongoDB, otherwise an in-memory store is used (development only)
	- `FRONTEND_URL` — optional CORS origin for your frontend (defaults to `*` in development)

If you plan to deploy parts of this on Vercel, consider using Vercel Serverless Functions or Edge Functions for API routes; this Express server can be deployed to a small Node host or converted to serverless handlers.
