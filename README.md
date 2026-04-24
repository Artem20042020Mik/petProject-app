# my pet-project

A Full-Stack Task Management Application built with Spring Boot 3, React, and Docker.

It is my pet project designed to demonstrate a deep understanding of modern web development, clean architecture, and advanced security patterns. It provides a secure and responsive environment for managing tasks and projects.

---

##  Key Features

###  Modern JWT Authentication
Implements secure, stateless authentication using:
- Short-lived Access Tokens (stored in memory/local storage)
- Long-lived Refresh Tokens (stored as secure HTTP-Only cookies)

###  Role-Based Access Control (RBAC)
- `ROLE_USER` — standard users
- `ROLE_BOSS` — administrators with extended permissions  
  Provides restricted access to specific endpoints and UI components.

###  Smart Token Management
- Automatic token refreshing via Axios interceptors on the frontend

###  Secure Logout
- Instant token invalidation using Redis (token blacklisting)

###  Database Migrations
- Automated schema management and data seeding using Flyway

###  Containerized Infrastructure
- Multi-stage Docker builds
- Nginx for production-ready deployment

---

## ️ Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS (Styling)
- React Router DOM (Navigation)
- Axios (HTTP Client with Interceptors)
- Lucide React (Icons)

### Backend
- Java & Spring Boot 3
- Spring Security
- PostgreSQL (Primary Database)
- Redis (Token Blacklisting)
- Flyway (Migrations)

### DevOps
- Docker & Docker Compose
- Nginx (Static file serving)

---

##  Quick Start (Docker)

The easiest way to run the application is using Docker Compose. You don't need to install Java, Node.js, or any databases locally.

**1. Download the project**

**2. Run with Docker Compose:**
```bash
docker-compose up -d --build
```

**3. Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
---

##  Default Admin Account

Upon the first startup, Flyway will automatically create a default boss account for testing purposes:

| Field    | Value              |
|----------|--------------------|
| Email    | `boss@project.com` |
| Password | `supersecret`      |
 
---

## 💻 Local Development (Without Docker)

If you prefer to run the application locally for development:

**1. Start the Databases** (using the provided docker-compose):
```bash
docker-compose up -d postgres redis
```

**2. Start the Backend:**

Open the root directory in IntelliJ IDEA / Eclipse and run `AuthCleanApplication.java`, or use Maven:
```bash
./mvnw spring-boot:run
```

**3. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
 
---
