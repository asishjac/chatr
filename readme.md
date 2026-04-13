# Chatr: Premium AWS-Native Messaging Experience

Chatr is a professional-grade, borderless messaging application built with a scalable AWS-native architecture and a premium Light Theme aesthetic. It focuses on high performance, rigorous security, and a seamless user experience.

![Chatr Hero](screenshots/hero.png)

---

## ✨ Key Features

- **Premium UI/UX**: Minimalist, borderless light-theme design with high-contrast shadows, sticky selection states, and fluid micro-animations.
- **AWS-Native Architecture**: Fully migrated from legacy DBs to **DynamoDB** (Data), **S3** (Storage), and **SES** (Identity/Email).
- **Hardened Security**:
    - **Helmet & Rate Limiting**: Global protection against XSS and DoS attacks.
    - **Strict Validation**: All API inputs are rigorously checked with **Zod Schemas**.
    - **Identity Protection**: JWT-based authentication with secure `httpOnly` cookies.
- **AI Image Moderation**: Fully integrated **AWS Rekognition** to perform real-time safety scans on all uploaded images, ensuring a safe community environment.
- **Messaging**: Send and receive high-performance messages with a unified vertical stream layout.
- **Pro-Active Monitoring**: Native `/health` orchestration endpoint and startup environment validation.

---

## 🏗️ Architecture Detail

Chatr follows a clean **Repository Pattern** to ensure service logic is decoupled from cloud infrastructure:
- **Compute**: Node.js / Express
- **Persistence**: Amazon DynamoDB
- **Blob Storage**: Amazon S3
- **Dev-Ops**: LocalStack (for local development) & Terraform (for production infrastructure).

---

## 🚀 How to Run (Local Development)

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- Node.js v18+ (optional, for local linting)

### 1. Snapshot the Environment
Create your `.env` file in the `backend` directory:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
AWS_REGION=us-east-1
CLIENT_URL=https://chatr.local
```

### 2. Launch with Docker Compose
The fastest way to get started is using the pre-configured Docker stack:
```bash
docker-compose up --build
```
This command spins up:
- **LocalStack**: Emulating S3, DynamoDB, and API Gateway.
- **Backend**: Hardened Node.js server.
- **Frontend**: Vite-powered React application.
- **Nginx Proxy**: Mapping services to `chatr.local` and `api.chatr.local`.

### 3. Verification
- **App**: Access [https://chatr.local](https://chatr.local)
- **API Health**: [https://api.chatr.local/health](https://api.chatr.local/health)

---

## 📸 Screenshots

| Login Experience | Messaging Input |
| :---: | :---: |
| ![Login](screenshots/login.png) | ![Input](screenshots/input.png) |

---

## 🛠️ Tech Stack

**Frontend**: React, Vite, Lucide Icons, Zustand (State), Axios.
**Backend**: Node.js, Express, Zod (Validation), Helmet, Bcrypt, Socket.io.
**Infra**: Docker, LocalStack, Terraform, Nginx.

---

## 📜 Development Status & Roadmap

✅ **Hardening & AWS Migration (Complete)**: The core architecture, security hardening, and AWS migration are finished.

🚀 **Next Phases (Planned)**:
- **Phase 5**: **Real-time Group Chat** — Transition from 1-on-1 to multi-user rooms with typing indicators.
- **Phase 6**: **End-to-End Encryption (E2EE)** — Implementing Signal-protocol style privacy for all messages.
- **Phase 7**: **Voice & Video Support** — Native WebRTC integration for direct audio/video calling.