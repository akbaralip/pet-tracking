# Phase 1: Foundations, Infrastructure & Core Authentication — [COMPLETED]

> **Milestone Status**: Successfully Scaffolding, Implemented & Verified  
> **Backend**: Django 5.1 + DRF + SimpleJWT + PostgreSQL (`pet_tracking`) + Redis + Celery  
> **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand + TanStack Query + Axios Interceptors

---

## 1. Scope & Objectives

In Phase 1, we build the robust bedrock upon which all subsequent modules (Pets, QR tags, E-commerce, Scans) will sit.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASE 1 DELIVERABLES                            │
├────────────────────────────────────────┬───────────────────────────────┤
│ BACKEND                                │ FRONTEND                      │
├────────────────────────────────────────┼───────────────────────────────┤
│ • PostgreSQL + PostGIS Connection      │ • Vite + React + TypeScript   │
│ • Celery + Redis Asynchronous Worker   │ • Tailwind CSS Design System  │
│ • Custom User Model (Email as primary) │ • Zustand Global Auth Store   │
│ • JWT Auth (SimpleJWT with rotation)   │ • TanStack Query + Axios Client│
│ • Role-Based Access Control (RBAC)     │ • Protected Route Guards      │
│ • DRF Spectacular (OpenAPI/Swagger)    │ • Auth Views (Login/Register) │
└────────────────────────────────────────┴───────────────────────────────┘
```

---

## 2. Directory & Architecture Layout

```
pet-tracking/
├── client/                              # Frontend React Application
│   ├── src/
│   │   ├── api/                         # Axios client & TanStack Query hooks
│   │   │   ├── axios.ts                 # Axios instance with interceptors
│   │   │   └── authApi.ts               # Auth endpoints (login, register, me)
│   │   ├── components/
│   │   │   ├── common/                  # Buttons, Inputs, Loaders, Alerts, Modals
│   │   │   └── layout/                  # Navbar, Sidebar, AuthLayout, AppLayout
│   │   ├── context/ or stores/          # Zustand stores (useAuthStore)
│   │   ├── pages/                       # Login, Register, Profile, Dashboard
│   │   ├── routes/                      # ProtectedRoute, AppRoutes
│   │   ├── types/                       # TypeScript interfaces (User, AuthResponse)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                              # Backend Django Application
│   ├── core/                            # Project configuration root
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── celery.py                    # Celery app initialization
│   │   ├── settings/                    # Modular settings (base, dev, prod)
│   │   ├── urls.py                      # Global URL routing
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/                    # Users, Roles, Profiles, Auth views
│   │   │   ├── models.py                # Custom User & Profile models
│   │   │   ├── serializers.py          # User & Auth serializers
│   │   │   ├── views.py                 # DRF API ViewSets
│   │   │   ├── urls.py
│   │   │   └── permissions.py           # Custom RBAC permissions
│   │   ├── common/                      # Shared base models (UUID, timestamps)
│   │   └── notifications/               # Celery email & notification tasks
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                                # Project documentation & blueprints
│   ├── PROJECT_BLUEPRINT_AND_ROADMAP.md
│   └── PHASE_1_SPECIFICATION.md
└── docker-compose.yml                   # Local dev PostgreSQL, PostGIS, Redis
```

---

## 3. Backend Specification

### 3.1 Dependencies (`requirements.txt`)
- `Django>=5.0,<5.2`
- `djangorestframework>=3.15`
- `djangorestframework-simplejwt>=5.3` (JWT Auth)
- `django-cors-headers>=4.3`
- `psycopg2-binary>=2.9` (PostgreSQL driver)
- `celery>=5.3` & `redis>=5.0` (Task queue & caching)
- `django-environ>=0.11` (12-factor environment variables)
- `drf-spectacular>=0.27` (OpenAPI 3 / Swagger interactive documentation)
- `pillow>=10.2` (Image processing)

### 3.2 Database Models (`apps/accounts/models.py`)

#### `User` Model
Extends `AbstractBaseUser` and `PermissionsMixin`:
- `id`: `models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`
- `email`: `models.EmailField(unique=True, db_index=True)` (replaces default username)
- `first_name`: `CharField(max_length=100)`
- `last_name`: `CharField(max_length=100)`
- `phone_number`: `CharField(max_length=20, blank=True, null=True)`
- `role`: `CharField(choices=[('OWNER', 'Pet Owner'), ('STAFF', 'Staff'), ('ADMIN', 'Administrator')], default='OWNER')`
- `is_active`: `BooleanField(default=True)`
- `is_staff`: `BooleanField(default=False)`
- `created_at`: `DateTimeField(auto_now_add=True)`
- `updated_at`: `DateTimeField(auto_now=True)`

#### `UserProfile` Model (One-to-One with User)
- `user`: `OneToOneField(User, on_delete=CASCADE, related_name='profile')`
- `avatar`: `ImageField(upload_to='avatars/', null=True, blank=True)`
- `preferred_notification_method`: `CharField(choices=[('EMAIL', 'Email'), ('SMS', 'SMS'), ('BOTH', 'Both')], default='EMAIL')`
- `address_line1`: `CharField(max_length=255, blank=True)`
- `city`: `CharField(max_length=100, blank=True)`
- `state`: `CharField(max_length=100, blank=True)`
- `postal_code`: `CharField(max_length=20, blank=True)`
- `country`: `CharField(max_length=100, default='USA')`

### 3.3 Authentication & User API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/` | Register new pet owner account | Public |
| `POST` | `/api/v1/auth/login/` | Authenticate & receive Access + Refresh JWT tokens | Public |
| `POST` | `/api/v1/auth/refresh/` | Rotate & refresh expired access token | Public (Refresh token) |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh token & clear session | Bearer JWT |
| `GET` | `/api/v1/auth/me/` | Fetch authenticated user data & profile | Bearer JWT |
| `PATCH`| `/api/v1/auth/me/` | Update profile information, phone, address | Bearer JWT |
| `POST` | `/api/v1/auth/password-reset/` | Request password reset email | Public |
| `POST` | `/api/v1/auth/password-reset/confirm/` | Submit new password with secure token | Public |
| `GET` | `/api/v1/schema/swagger-ui/` | Interactive Swagger UI API documentation | Public |

### 3.4 Celery & Redis Setup
- Configure `core/celery.py` with Redis broker: `redis://localhost:6379/0`.
- Implement a health-check task `ping()` to ensure worker readiness.
- Set up automated welcome email task dispatched upon registration via Celery.

---

## 4. Frontend Specification

### 4.1 Tech Stack & Packages
- **Vite** with **React 18/19** and **TypeScript**
- **Tailwind CSS** + **Tailwind Merge** + **Lucide React** (icons)
- **Zustand**: Clean, reactive state store with `persist` middleware for token persistence.
- **TanStack Query (React Query v5)**: For API data caching, invalidation, and queries.
- **Axios**: HTTP client configured with automatic token refresh interceptor.
- **React Router DOM v6/v7**: Declarative routing with layout wrappers.

### 4.2 Zustand Auth Store (`useAuthStore.ts`)
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}
```

### 4.3 Axios Interceptor Strategy
- **Request Interceptor**: Automatically injects `Authorization: Bearer <accessToken>` from Zustand into all outgoing requests.
- **Response Interceptor**:
  - Intercepts `401 Unauthorized`.
  - Queues pending requests while sending a background refresh request to `/api/v1/auth/refresh/`.
  - If refresh succeeds: Updates Zustand with the new access token and replays the original requests.
  - If refresh fails: Clears the auth state and redirects cleanly to `/login`.

### 4.4 User Interface Deliverables
1. **Design System & Shell**:
   - Modern, pet-themed styling (clean typography, rounded corners, soft shadows).
   - Responsive Navigation Bar (showing user avatar, pet switcher placeholder, cart count, login/logout).
2. **Authentication Pages**:
   - `/login`: Clean email/password form with validation, "Remember Me", and password reveal toggle.
   - `/register`: Name, email, phone number, and password with real-time strength indicator.
   - `/forgot-password`: Email recovery submission.
3. **Protected User Portal Layout**:
   - `/dashboard`: Starter dashboard with welcome banner, pet cards placeholder, and quick action shortcuts.
   - `/profile`: User settings, contact info, shipping address, and password change tab.

---

## 5. Verification & Acceptance Criteria (Definition of Done)

Before Phase 1 is marked complete, we will verify:
1. **Automated Backend Tests**:
   - Registration validation tests (reject duplicate emails, invalid passwords).
   - JWT login and token refresh lifecycle tests.
   - Profile update and permission access tests.
2. **Celery Worker Execution**:
   - Async task fires and finishes with Redis broker confirmation.
3. **Frontend Integration Tests**:
   - User signs up -> token stored in Zustand -> redirected to `/dashboard`.
   - Page refresh retains authenticated session.
   - Expired access token silently refreshes without logging out the user.
   - Manual logout blacklists token on server and clears client storage.
4. **Documentation**:
   - Swagger / OpenAPI live documentation accessible at `/api/v1/schema/swagger-ui/`.

---

## 6. Execution Steps (Ready to Begin Upon Approval)

1. **Step 1**: Initialize `server/` with virtual environment, install requirements, and configure `settings` + PostgreSQL connection.
2. **Step 2**: Create `apps/accounts` with Custom User model, run migrations, and write serializers & SimpleJWT views.
3. **Step 3**: Configure Celery + Redis and add async notification handler.
4. **Step 4**: Initialize `client/` with Vite, React, TypeScript, and Tailwind CSS.
5. **Step 5**: Build Zustand auth store, Axios interceptor, and TanStack Query provider.
6. **Step 6**: Build Auth UI screens (`Login`, `Register`, `DashboardLayout`, `Profile`) and wire up API calls.
7. **Step 7**: End-to-end integration test of auth and token rotation.
