# Luméra Beauty Academy

**Live. Learn. Elevate.**

A premium global beauty education platform connecting beauty educators with students worldwide through live video
classes, on-demand courses, and professional certifications.

## Architecture

This is a monorepo containing:

```
lumera-beauty-academy/
├── services/
│   ├── frontend/          # Next.js 16 React application
│   └── backend/           # Spring Boot 3.2 Java API
├── docker-compose.yml     # Local development orchestration
└── package.json          # Root workspace configuration
```

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context (future: Zustand)

### Backend

- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Migrations**: Flyway

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Cache**: Redis (optional)

## Getting Started

### Prerequisites

- Node.js 20+
- Java 21+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Quick Start with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

Services will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- Adminer (DB UI): http://localhost:8081

### Local Development

#### 1. Start the database

```bash
docker-compose up -d postgres
```

#### 2. Start the backend

```bash
cd services/backend
./mvnw spring-boot:run
```

#### 3. Start the frontend

```bash
cd services/frontend
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:

- `DB_*` - Database connection settings
- `JWT_SECRET` - JWT signing key (min 256 bits)
- `CORS_ORIGINS` - Allowed frontend origins
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get tokens

### Categories

- `GET /api/v1/categories` - List visible categories
- `GET /api/v1/categories/{slug}` - Get category by slug

### Live Classes

- `GET /api/v1/classes` - List upcoming classes
- `GET /api/v1/classes/live` - List currently live classes
- `GET /api/v1/classes/{id}` - Get class details
- `POST /api/v1/classes` - Create class (Educator)
- `PUT /api/v1/classes/{id}` - Update class (Educator)

### Protected Routes

- `/api/v1/student/*` - Student-only endpoints
- `/api/v1/educator/*` - Educator-only endpoints
- `/api/v1/admin/*` - Admin-only endpoints

## Database Schema

Key entities:

- **users** - Students, Educators, Admins
- **categories** - Class categories (visible/hidden)
- **live_classes** - Live video class sessions
- **enrollments** - Student class enrollments
- **certificates** - Completion certificates
- **payout_records** - Educator payouts

## Project Structure

### Frontend (`services/frontend/`)

```
src/
├── app/                 # Next.js App Router pages
│   ├── (dashboard)/    # Dashboard layouts
│   │   ├── student/
│   │   ├── educator/
│   │   └── admin/
│   ├── classroom/      # Live classroom
│   └── ...
├── components/         # React components
│   ├── dashboard/
│   ├── layout/
│   └── ui/
├── data/              # Mock data & categories
├── lib/               # Utilities
└── types/             # TypeScript types
```

### Backend (`services/backend/`)

```
src/main/java/com/lumera/academy/
├── config/            # Spring configuration
├── controller/        # REST controllers
├── dto/              # Data transfer objects
├── entity/           # JPA entities
├── exception/        # Exception handling
├── repository/       # Data repositories
├── security/         # JWT & Spring Security
└── service/          # Business logic
```

## Scripts

Root package.json commands:

```bash
npm run frontend:dev    # Start frontend dev server
npm run frontend:build  # Build frontend for production
npm run backend:run     # Start backend with Maven
npm run backend:build   # Build backend JAR
npm run docker:up       # Start all Docker services
npm run docker:down     # Stop all Docker services
npm run dev            # Start both frontend and backend
```

## License

Proprietary - All rights reserved.
