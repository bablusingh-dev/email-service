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