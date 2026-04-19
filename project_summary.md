# 🚗 RentCar Application — Project Summary

## What You Built

A full-stack **car rental management dashboard** built with:
- **Frontend**: Angular 21 (standalone components, signals, Angular Material)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: Custom JWT-based auth (local backend, no Auth0)

---

## ✅ What Works

### 🔐 Authentication
- Login with email & password via backend (`/auth/login`)
- JWT token stored in `localStorage` via `PersistenceService`
- `authGuard` protects all dashboard routes — redirects to login if not authenticated
- Token expiry check built into the guard
- Logout clears state and redirects to `/login`
- Sign-up page exists (`/auth/register` endpoint wired)

### 🏠 Home Dashboard
- Live stats cards: **Total Vehicles, Active Rentals, Total Revenue, Pending Bookings** — all pulled from real backend data
- **Revenue chart** (SVG bar chart, static visual but real data context)
- **Vehicle Overview panel** — shows latest 4 vehicles with status badges
- **Recent Bookings panel** — shows the last 4 bookings
- **Quick Actions** — navigate to Add Booking, Add Vehicle, Add Client, Analytics, Calendar, Settings
- Clicking a vehicle card navigates to `/vehicles?vehicleId=<id>` and **opens that vehicle's popup automatically** ✅ *(just added)*

### 🚗 Vehicles Page
- Full **CRUD**: Add, View, Edit, Delete vehicles — all connected to the backend
- **Grid / List view toggle**
- **Search** by name/plate
- **Filter** by status (all, available, rented, service)
- **Stats bar**: Total, Available, Rented, Service counts (live)
- **Utilization ranking** sidebar
- **Add Vehicle modal** with camera capture support
- **Vehicle Details popup** (view + edit mode)
- URL-based deep linking: `/vehicles?vehicleId=<id>` opens the popup, closing resets the URL ✅ *(just added)*
- Global **MatSnackBar** notifications on add/update/delete

### 📅 Bookings Page
- Full **CRUD**: Create, Edit, Delete bookings — all connected to the backend
- Filter bookings by status (All, Pending, Confirmed, Completed, Cancelled)
- **Booking Details dialog** with form
- Auto-populates client & vehicle dropdowns from API
- Quick-action shortcut from Home → `/bookings?action=new` opens the new booking form
- Global snackbar notifications

### 👥 Clients Page
- Full **CRUD**: Add, View, Edit, Delete clients
- **Search** by name or email
- **Filter** by status: all, VIP, active, inactive
- **Live stats cards**: Total, VIP, Active, Inactive counts
- **Client segments donut** (visual, data-driven percentages)
- **Top Clients** sidebar (sorted by total spent)
- Global snackbar notifications

### 📊 Analytics Page
- Pulls real vehicle + client data from API
- Shows: **Fleet Utilization %**, **Active Users count**, avg duration (partial mock), satisfaction (mock)
- **Top Vehicles** sorted by utilization (live data)

### 💰 Revenue Page
- Pulls real booking data from API
- Calculates: **Total Revenue**, **Pending Revenue**, **Net Profit** (65% margin simulation), **Avg Booking Value**
- Live computed stats

### ⚙️ Settings Page
- Page exists and renders but has **no functionality yet** (empty shell)

### 🔔 Notification System
- Global `NotificationComponent` exists
- Centralized `TopbarComponent` used across all pages

### 🧱 Architecture
- All components are **standalone** (Angular 21 style)
- **Signal-based state** everywhere (`signal()`, `computed()`)
- Centralized `BaseApiService` for all HTTP calls
- `PersistenceService` for localStorage abstraction
- `authGuard` (functional guard pattern)
- `HTTP interceptor` directory exists (for token injection)

---

## ❌ What Doesn't Work / Known Issues

| Issue | Location | Notes |
|---|---|---|
| **Settings page is empty** | `/settings` | No form, no save — just a shell component |
| **Revenue chart is static** | Home & Revenue | SVG bars are hardcoded; not driven by real monthly data |
| **Analytics: Avg Duration & Satisfaction are mocked** | Analytics | Need historical booking duration calculation |
| **Calendar page missing** | Quick Actions links to `/calendar` | Route does not exist, will 404 |
| **Pagination not functional** | Clients page | `currentPage` and `pages` are hardcoded `[1,2,3]`, no actual pagination logic |
| **`onNewRental` and `onMessage` are empty stubs** | `clients.component.ts` | "New Rental" and "Message" buttons do nothing |
| **HTTP interceptor may not be attached** | `/interceptors` folder exists | Need to verify token is sent on every request |
| **`/auth/register` has no frontend UI** | Sign-up | `register()` method exists in `AuthService` but no sign-up route/page in the router |
| **`zz` text in home template** | `home.component.html` line 205 | Leftover debug text artifact, should be removed |
| **Booking status constraint bug (fixed in past session)** | Booking creation | Was sending `'D'` instead of valid status — should be verified end-to-end |

---

## 🔜 What You Should Add Next

### High Priority
1. **Calendar / Schedule page** — The quick action button already links to `/calendar`. Build a simple booking calendar view.
2. **Settings page** — Profile settings (name, email, password change), app preferences (theme toggle, language)
3. **Fix pagination** on Clients page — implement real server-side or client-side pagination
4. **HTTP Auth Interceptor** — make sure the JWT token is attached to every API request header automatically
5. **Sign-up page** — a `/register` route with a form, tied to `authService.register()`

### Medium Priority
6. **Real revenue chart** — group bookings by month, render dynamic bars from real data
7. **Analytics: Avg Rental Duration** — calculate from `startDate`/`endDate` fields on bookings
8. **"New Rental" button** in client details — navigate to `/bookings?action=new&clientId=<id>` pre-filling the client
9. **Wildcard route** — add `{ path: '**', redirectTo: 'login' }` to handle unknown URLs gracefully
10. **Error pages** — a 404 / not-found component for better UX

### Nice to Have
11. **Dark/light theme toggle** in settings
12. **Export to PDF/CSV** for bookings or revenue reports
13. **Dashboard revenue chart** driven by real monthly aggregation from backend
14. **Notifications bell** — connect the existing `NotificationComponent` to real events
15. **Mobile responsive sidebar** — verify the sidebar collapses correctly on small screens

---

## 🗂️ Registered Routes

| Path | Component | Guard |
|---|---|---|
| `/` | → redirect to `/login` | — |
| `/login` | `LoginComponent` | — |
| `/home` | `HomeComponent` | ✅ authGuard |
| `/vehicles` | `VehicleComponent` | ✅ authGuard |
| `/bookings` | `BookingsComponent` | ✅ authGuard |
| `/clients` | `ClientsComponent` | ✅ authGuard |
| `/revenue` | `RevenueComponent` | ✅ authGuard |
| `/analytics` | `AnalyticsComponent` | ✅ authGuard |
| `/settings` | `SettingsComponent` | ✅ authGuard |
| `/calendar` | ❌ **Missing** | — |
| `/**` | ❌ **No wildcard catch-all** | — |
