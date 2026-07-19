# Local Installation, Configuration & Database Architecture Guide

This guide contains step-by-step instructions to configure, run, test, and troubleshoot the Car Dealership Inventory System locally, along with database schema layouts, architecture components, and REST API payloads.

---

## 1. System Requirements & Prerequisites

Before starting, install the following tools:
- **Node.js** (v18.x or higher is recommended)
- **npm** (v9.x or higher)
- **PostgreSQL Database Server** (v14.x or higher)

### Database Installation Steps:
- **Windows**: Install using the official PostgreSQL installer. Set your database superuser `postgres` password during setup.
- **macOS**: Install via Homebrew:
  ```bash
  brew install postgresql@15
  brew services start postgresql@15
  ```
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```

Once PostgreSQL is active, create a development database:
```sql
CREATE DATABASE dealership_db;
```

---

## 2. Environment Configurations

Create a `.env` file in the `backend/` directory:

```env
# Database Connection URL (PostgreSQL)
# Format: postgresql://[user]:[password]@[host]:[port]/[database_name]?schema=public
DATABASE_URL="postgresql://postgres:AdminPassword123!@localhost:5432/dealership_db?schema=public"

# JSON Web Token Secret (used for signing access and refresh tokens)
JWT_SECRET="a_very_secure_long_random_hash_string_for_local_development_jwt"

# Backend API Port
PORT=5000
```

---

## 3. Step-by-Step Installation Guide

Follow these commands to install dependencies, run migrations, and start development servers.

### Windows (PowerShell)
```powershell
# 1. Install backend dependencies and migrate database
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed

# 2. Start the backend API server
npm run dev

# 3. In a separate PowerShell window, launch the frontend
cd frontend
npm install
npm run dev
```

### macOS / Linux (Bash)
```bash
# 1. Setup backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev &

# 2. Setup frontend in a separate directory
cd ../frontend
npm install
npm run dev
```

---

## 4. Database Schema Structure (Prisma)

The application uses **Prisma ORM** mapped to PostgreSQL. The schema definitions are structured as follows:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  name         String?
  role         Role     @default(USER) // ADMIN or USER
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Vehicle {
  id          String   @id @default(uuid())
  make        String
  model       String
  year        Int
  price       Float
  quantity    Int      @default(0)
  imageUrl    String
  class       String   // e.g., Sedan, SUV, Coupe, Truck
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

### Database Seeding:
Running `npx prisma db seed` seeds the following test accounts:
- **Admin**: `admin@dealership.com` / `AdminPassword123!`
- **User**: `john@example.com` / `UserPassword123!`
- **Vehicles**: 5 sample vehicles with initial stock values.

---

## 5. Inspecting Data via Prisma Studio

Prisma Studio is a visual database editor to browse, search, and edit database records.

To launch Prisma Studio:
1. Navigate to the `backend/` directory.
2. Run the command:
   ```bash
   npx prisma studio
   ```
3. Open your browser and navigate to `http://localhost:5555`.
4. Here, you can view the User and Vehicle tables, filter items by name/role, delete duplicate entries, or modify records directly.

---

## 6. Project Code Architecture & SOLID Design

The system implements clean layered architecture patterns:

### Architectural Components:
1. **Controllers**: Parse JSON payloads, handle status responses, and delegate execution to Service classes.
2. **Services**: Contain all application business rules (password salt/hashing, token creation validation, and concurrency checks).
3. **Repositories**: Encapsulate queries to PostgreSQL through the Prisma Client, isolating data schemas.
4. **Middlewares**: Process request streams globally (e.g., extracting token claims, authenticating sessions, validation schemas, or trapping exceptions).

### SOLID Clean Code Practices:
- **Single Responsibility (SRP)**: Each layer handles exactly one function. Hashing, authentication, database calls, and request validations reside in isolated files.
- **Open-Closed (OCP)**: Schema definitions via `Zod` can be modified or extended with validations without editing the underlying controller endpoints.
- **Dependency Inversion (DIP)**: Controllers communicate with Services via dependency abstraction, avoiding coupled references to Prisma Client.

---

## 7. TDD & Test Suite Mechanics

The project strictly follows a **Test-Driven Development (TDD)** pattern. Mock tests were authored prior to compiling endpoint logic.

### Executing Tests:
To run the full backend Vitest test run:
```bash
cd backend
npm test
```
To run specific test scopes (e.g., auth, vehicle, or middleware files):
```bash
npx vitest run src/tests/vehicle.test.ts
npx vitest run src/tests/auth.routes.test.ts
```

### Mocking Token-Based Authorization:
API endpoints verify tokens using `Bearer` claims. Inside integration files, authorization headers are mocked using `generateAccessToken` helper payloads containing the user's role:
```typescript
const token = generateAccessToken({ userId: 'mock-user-uuid', role: 'ADMIN' });
const response = await request(app)
  .post('/api/vehicles')
  .set('Authorization', `Bearer ${token}`)
  .send(vehiclePayload);
```

---

## 8. REST API Payload Reference

Use this reference to inspect payloads when testing via client tools like **Postman** or **cURL**:

### 1. User Registration (`POST /api/auth/register`)
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response Shape (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "e6f8a42b-9801-44bb-90ca-c87289ef3c21",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "USER"
    }
  }
  ```

### 2. User Login (`POST /api/auth/login`)
- **Request Body**:
  ```json
  {
    "email": "admin@dealership.com",
    "password": "AdminPassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "c1f7a42b-9801-44bb-90ca-a87289ef1b32",
      "name": "Admin",
      "email": "admin@dealership.com",
      "role": "ADMIN"
    }
  }
  ```

### 3. Add New Vehicle (`POST /api/vehicles`) - *Admin Authorization Required*
- **Request Body**:
  ```json
  {
    "make": "Tesla",
    "model": "Model S",
    "year": 2024,
    "price": 79990,
    "quantity": 3,
    "imageUrl": "https://images.unsplash.com/photo-1617788138017-80ad40651399",
    "class": "Sedan"
  }
  ```

### 4. Search Vehicles (`GET /api/vehicles/search?keyword=tesla`)
- **Parameters**: `keyword` (Make or Model search), `category` (Class type filter), `minPrice` (Number), `maxPrice` (Number).
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "vehicles": [
      {
        "id": "7b8d4f40-cc59-4505-bd88-d552ad34e21a",
        "make": "Tesla",
        "model": "Model S",
        "year": 2024,
        "price": 79990,
        "quantity": 3,
        "imageUrl": "https://images.unsplash.com/photo-1617788138017-80ad40651399",
        "class": "Sedan"
      }
    ]
  }
  ```

### 5. Purchase Vehicle (`POST /api/vehicles/:id/purchase`)
- **Request Body**:
  ```json
  {
    "quantity": 1
  }
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Purchase successful",
    "vehicle": {
      "id": "7b8d4f40-cc59-4505-bd88-d552ad34e21a",
      "quantity": 2
    }
  }
  ```

### 6. Restock Vehicle (`POST /api/vehicles/:id/restock`) - *Admin Authorization Required*
- **Request Body**:
  ```json
  {
    "quantity": 5
  }
  ```

### 7. Delete Vehicle (`DELETE /api/vehicles/:id`) - *Admin Authorization Required*
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Vehicle deleted successfully"
  }
  ```

---

## 9. Troubleshooting Guide

### Issue 1: `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
- **Description**: Occurs during database connections when Postgres credentials contain special characters that are parsed incorrectly or if environment variables are not loaded.
- **Fix**: Check that your `backend/.env` file is named correctly. Wrap your database password in URL encoding if it contains special characters (e.g. replacing `@` with `%40`).

### Issue 2: `Port 5000 is already in use` (EADDRINUSE)
- **Description**: The Express server cannot bind to port 5000 because another background process is already using it.
- **Fix**: 
  - **Windows (PowerShell)**:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
    ```
  - **Linux / macOS**:
    ```bash
    kill -9 $(lsof -t -i:5000)
    ```

### Issue 3: Vitest Hook Timeouts (`Hook timed out in 10000ms`)
- **Description**: Running seed scripts sequentially inside multiple test file teardowns causes connection pools to lock, causing Vitest's `afterAll` or `beforeEach` hooks to timeout on slower machines.
- **Fix**: Open `backend/package.json` and ensure that `npm test` runs vitest files sequentially without internal database seed commands, running the seed script exactly once after all tests complete using:
  ```json
  "test": "vitest run src && npx prisma db seed"
  ```
