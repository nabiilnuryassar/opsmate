# TASK-03 — Authentication (Register / Login / Logout)

> Fase: Phase 1 — Core MVP
> Dependensi: TASK-01
> Estimasi: 1–2 hari

---

## Tujuan

Implementasi sistem autentikasi lengkap: register, login, logout, reset password, dan proteksi route. User tidak bisa akses dashboard tanpa login.

---

## Scope

### 3.1 Backend — Laravel Sanctum

#### Database Migration: `users`
```
users
├── id (bigint, PK)
├── name (string)
├── email (string, unique)
├── password (hashed)
├── email_verified_at (nullable)
├── remember_token
├── created_at
└── updated_at
```

#### API Endpoints (PRD §15)
```http
POST   /api/register          ← name, email, password, business_name
POST   /api/login             ← email, password
POST   /api/logout            ← authenticated
GET    /api/me                ← current user info
POST   /api/forgot-password   ← email
POST   /api/reset-password    ← token, email, password
```

#### Validation Rules
- name: required, string, max:255
- email: required, email, unique:users
- password: required, min:8, confirmed
- business_name: required (untuk auto-create business saat register)

#### Behaviour
- Register → create user + create business → auto login → return token
- Login → validate → return Sanctum token
- Logout → revoke current token
- Semua API route (kecuali auth) wajib `auth:sanctum` middleware

---

### 3.2 Frontend — Auth Pages

#### Login Page
- Fields: email, password
- Link: "Belum punya akun? Daftar" → register
- Link: "Lupa password?" → forgot password
- CTA: "Masuk" (primary button)
- Error messages: bahasa Indonesia (DESIGN §22)

#### Register Page
- Fields: nama lengkap, email, password, konfirmasi password, nama bisnis
- Link: "Sudah punya akun? Masuk" → login
- CTA: "Daftar & Mulai" (primary button)
- Success → redirect ke onboarding (TASK-04)

#### Forgot Password Page
- Field: email
- CTA: "Kirim Link Reset"
- Success toast: "Link reset password sudah dikirim ke email kamu."

#### Design Rules
- Layout: centered card, clean, tidak intimidating
- Gunakan logo OpsMate AI di atas form
- Mobile-first, max-width ~400px untuk form
- Error message: clear, bahasa Indonesia
  - ✅ "Email sudah terdaftar."
  - ✅ "Password minimal 8 karakter."
  - ❌ "Invalid credentials."

---

### 3.3 Frontend — Auth State Management

- Zustand store: `useAuthStore`
  ```ts
  interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email, password) => Promise<void>;
    register: (data) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
  }
  ```
- Token stored in localStorage
- Axios interceptor: attach Bearer token to all requests
- Protected route wrapper: redirect to `/login` if not authenticated

---

### 3.4 Frontend — Route Protection

```tsx
// ProtectedRoute wrapper
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Dashboard />} />
  {/* ... all app routes */}
</Route>

// Public routes
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
```

---

## Output Files

### Backend
| File | Keterangan |
| ---- | ---------- |
| `app/Http/Controllers/Api/AuthController.php` | register, login, logout, me |
| `app/Http/Requests/RegisterRequest.php` | validation |
| `app/Http/Requests/LoginRequest.php` | validation |
| `routes/api.php` | auth routes |

### Frontend
| File | Keterangan |
| ---- | ---------- |
| `src/features/auth/pages/LoginPage.tsx` | login form |
| `src/features/auth/pages/RegisterPage.tsx` | register form |
| `src/features/auth/pages/ForgotPasswordPage.tsx` | forgot password |
| `src/features/auth/components/AuthLayout.tsx` | centered card layout |
| `src/stores/authStore.ts` | Zustand auth state |
| `src/lib/api.ts` | axios instance + interceptor |
| `src/components/shared/ProtectedRoute.tsx` | route guard |

---

## Acceptance Criteria (PRD §19)

- [ ] User dapat register dengan nama, email, password, nama bisnis
- [ ] User dapat login dengan email dan password
- [ ] User dapat logout
- [ ] User tidak bisa akses dashboard tanpa login
- [ ] Token tersimpan dan di-attach ke semua request
- [ ] Error messages tampil dalam bahasa Indonesia
- [ ] Password di-hash (bcrypt)
- [ ] Data antar user terisolasi (business-scoped)
