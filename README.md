# Course Discussion and Resource Hub

Course Discussion and Resource Hub is a MERN-stack university project for course discussions, academic resources, and study meetup coordination.

This repository is organized as a small monorepo:

```text
client/   React frontend
server/   Express + MongoDB backend
```

## Current Status

The repository is currently implemented through **step 4** of the planned build:

- step 1: project scaffolding and folder structure
- step 2: backend server, database config, health route, and MongoDB foundation
- step 3: backend authentication foundation with JWT cookie auth routes and middleware
- step 4: React app shell, routing, shared layout, navbar, breadcrumbs, and placeholder pages

## Implemented So Far

### Backend

- Express server with centralized app setup
- MongoDB connection and environment configuration
- health check route
- JSON 404 and error handling
- `User` model with role and status fields
- auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- signed JWT cookie authentication middleware
- sample user seed script

### Frontend

- Vite + React app entry
- Tailwind CSS setup
- React Router route shell
- main layout with navbar, breadcrumbs, and footer
- reusable components such as:
  - `Navbar`
  - `Breadcrumbs`
  - `SearchBar`
  - `PageHeader`
  - `StatCard`
  - `EmptyState`
- public pages:
  - home
  - search
  - thread detail
  - login
  - register
  - not found
- placeholder user pages:
  - dashboard
  - profile
  - activity
  - meetups
- placeholder admin dashboard page
- protected and admin route wrappers

## Current Gaps

The frontend auth flow is not fully wired yet. The next step is to replace the mock shell auth behavior with real login, register, logout, session restore, and profile data from the backend.

## Planned Build Order

1. Login, register, and profile flow
2. Thread CRUD
3. Comments
4. Courses and resources
5. Meetup flow
6. Admin dashboard
7. Analytics
8. Docker and environment setup
9. Seed data and cleanup
