# DevMatch Backend

🚀 **DevMatch** is a **developer matching platform** where developers can connect, like/nope, and chat in real-time.

This repository contains the **Node.js + Express backend** for DevMatch, handling real-time communication, authentication, and API routes.

---

## ✨ Features

✅ OTP-based email verification using Resend  
✅ JWT-based authentication and protected routes  
✅ Real-time chat using Socket.IO  
✅ User profile management with Cloudinary uploads  
✅ Like / Nope functionality with optimistic updates  
✅ CRON jobs for OTP cleanup and scheduled tasks  
✅ Scalable architecture for AWS EC2 deployment

---

## 🛠️ Tech Stack

- **Node.js + Express**
- **MongoDB Atlas + Mongoose**
- **Socket.IO**
- **Resend** (OTP verification)
- **Cloudinary** (image uploads)
- **JWT** (authentication)
- **PM2 + NGINX** (process management & reverse proxy)
- **Cloudflare** (DNS & SSL)

---

## 🚀 Live Demo

🌐 [https://devmatch.co.in](https://devmatch.co.in)

---

## 🖥️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/microbhuvan/devMatch_backend.git
cd devMatch_backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a .env file

Add your environment variables:

```bash
PORT=5000
MONGO_URL=<your-mongo-db-uri>
JWT_SECRET=<your-jwt-secret>
RESEND_API_KEY=<your-resend-api-key>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### 4️⃣ Run the server locally

```bash
npm start
```
