# Email Queue System with TypeScript & Repository Pattern

A production-ready, scalable email queue system built with TypeScript, Repository Pattern, and Drizzle ORM. Designed for service-based companies with multiple projects that need to queue emails via API with background workers handling delivery.

## 🎯 Features

- **Multi-Project Management** - Manage multiple projects with separate configurations
- **API Key Authentication** - Secure API key system with SHA-256 hashing and Redis caching
- **Priority Queue** - Priority-based email processing (1-10 scale)
- **Scheduled Emails** - Schedule emails for future delivery
- **Bulk Email Support** - Send up to 100 emails per request
- **Automatic Retry** - Exponential backoff retry logic for failed emails
- **Rate Limiting** - Global and per-project rate limiting with Redis
- **Webhook Notifications** - Real-time status updates via webhooks
- **Email History** - Complete email tracking and history
- **Repository Pattern** - Easy to swap ORMs (Drizzle ↔ Mongoose)
- **Docker Ready** - Complete Docker Compose setup

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Project   │─────▶│  API Server  │─────▶│  RabbitMQ   │
│   (Client)  │      │  (Express)   │      │   Queue     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌─────────────┐
                     │  PostgreSQL  │◀─────│   Workers   │
                     │   Database   │      │  (2 replicas)│
                     └──────────────┘      └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌─────────────┐
                     │    Redis     │      │   Resend    │
                     │   (Cache)    │      │  (Provider) │
                     └──────────────┘      └─────────────┘
```

## 💻 Tech Stack

- **TypeScript** (Strict mode, ES2022)
- **Node.js 20+** (Latest LTS)
- **Express 4.19** (API server)
- **Drizzle ORM** (Database layer)
- **PostgreSQL 16** (Database)
- **RabbitMQ 3.13** (Message queue)
- **Redis 7** (Caching & rate limiting)
- **Resend 4.0** (Email provider)
- **Docker & Docker Compose** (Containerization)




# Authentication Setup Guide

This guide explains how to set up and use the authentication system.

## Features Implemented

- User signup (CLI only)
- User login (API endpoint)
- Password reset (CLI only)
- Single admin user constraint
- Role-based access (Admin role only)


## Usage

### 1. Create Admin User (Signup)

Only one admin user can exist in the system. Use the CLI to create the admin user:

```bash
npm run cli:signup <email> <password> <name>
```

Example:
```bash
npm run cli:signup admin@example.com SecurePass123 "Admin User"
```

### 2. Login (API Endpoint)

Login via the REST API:

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "ADMIN"
    },
      "accessToken": "access token",
       "refreshToken": "refresh token"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "errorCode": "INVALID_CREDENTIALS"
}
```

### 3. Password Reset

Password reset is a two-step process via CLI:

**Step 1: Initiate Password Reset**

Generate a reset token:

```bash
npm run cli:reset-init <email>
```

Example:
```bash
npm run cli:reset-init admin@example.com
```

This will output a reset token that expires in 1 hour:
```
✓ Password reset token generated. Use this token to reset your password.
  Reset Token: a1b2c3d4e5f6...
  This token will expire in 1 hour.
```

**Step 2: Complete Password Reset**

Use the reset token to set a new password:

```bash
npm run cli:reset-complete <email> <resetToken> <newPassword>
```

Example:
```bash
npm run cli:reset-complete admin@example.com a1b2c3d4e5f6... NewSecurePass456
```
