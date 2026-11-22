# Pet Identification and Tracking Platform (PetTrace)

A modern, high-reliability platform to safeguard and track pets using smart QR-code identification collars and accessories, with architecture ready for active GPS IoT telemetry.

---

## Tech Stack Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query v5, Axios, Lucide React
- **Backend**: Python 3.13, Django 5.1, Django REST Framework, SimpleJWT (Token Rotation + Blacklisting), drf-spectacular (OpenAPI 3 / Swagger)
- **Database**: PostgreSQL (`pet_tracking`)
- **Cache & Task Queue**: Redis + Celery
- **Authentication**: Stateless Bearer JWT with silent token refresh

---

## Quickstart Guide

### 1. Backend (`server/`)

```bash
cd server

# Activate Python virtual environment
.\venv\Scripts\activate   # (Windows PowerShell)

# Run migrations (already applied)
python manage.py migrate

# Run tests
python manage.py test apps.accounts

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

The Django REST API will run at `http://127.0.0.1:8000`.
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/api/v1/schema/swagger-ui/`
- **ReDoc Documentation**: `http://127.0.0.1:8000/api/v1/schema/redoc/`

#### Celery Worker (Optional for Background Tasks)
```bash
cd server
celery -A core worker --loglevel=info -P solo
```

---

### 2. Frontend (`client/`)

```bash
cd client

# Install dependencies (already installed)
npm install

# Build verification
npm run build

# Start Vite development server
npm run dev
```

The client will be live at `http://localhost:5173`.

---

## Phase 1 Completed Features
- Custom User Model with email-based authentication and role hierarchy (`OWNER`, `STAFF`, `ADMIN`).
- One-to-one `UserProfile` with address and emergency contact data.
- JWT Authentication endpoints:
  - `POST /api/v1/auth/register/`
  - `POST /api/v1/auth/login/`
  - `POST /api/v1/auth/refresh/`
  - `POST /api/v1/auth/logout/`
  - `GET /api/v1/auth/me/`
  - `PATCH /api/v1/auth/me/`
  - `POST /api/v1/auth/change-password/`
- Axios interceptor with silent JWT refresh and request replay on 401.
- Zustand `useAuthStore` with local persistence.
- Complete Auth UI: Login, Register, Protected Dashboard, and Profile Management screens.
