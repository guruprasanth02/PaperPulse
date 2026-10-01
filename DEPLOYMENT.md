# PaperPulse: Production Deployment Guide

This guide walks you through deploying **PaperPulse** to production.

---

## Deployment Options at a Glance

| Platform | Best For | Architecture | Setup Time |
| :--- | :--- | :--- | :--- |
| **Vercel** *(Recommended)* | Fast, serverless, zero maintenance | React SPA + Python Serverless Functions | ~3 minutes |
| **Render** | Dedicated 24/7 container | Full-Stack Docker Container | ~5 minutes |
| **Docker / Self-Hosted** | Any VPS (AWS, GCP, DigitalOcean, local) | Multi-stage Docker container | ~5 minutes |

---

## Option 1: Deploy on Vercel (Recommended)

PaperPulse is pre-configured with [`vercel.json`](./vercel.json) and [`api/index.py`](./api/index.py) to run both the React frontend and FastAPI serverless backend together on a single domain.

### Step 1: Push your latest code to GitHub
Make sure all your latest commits are pushed to your repository:
```bash
git add .
git commit -m "Prepare production deployment"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your repository: `guruprasanth02/PaperPulse`.
4. Vercel will automatically detect **Vite** as the Framework Preset.

### Step 3: Configure Environment Variables
In the **Environment Variables** section on Vercel, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `Your_Gemini_Key` | Used by FastAPI backend for RAG & questions |
| `VITE_GEMINI_API_KEY` | `Your_Gemini_Key` | Used by client-side fallback |
| `VITE_FIREBASE_API_KEY` | *(From your .env)* | Firebase Authentication |
| `VITE_FIREBASE_AUTH_DOMAIN` | *(From your .env)* | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | *(From your .env)* | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET`| *(From your .env)* | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| *(From your .env)* | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | *(From your .env)* | Firebase App ID |

> **Note:** You do **not** need to set `VITE_API_URL` on Vercel. In production, PaperPulse automatically defaults to `/api` on the same domain.

### Step 4: Click "Deploy"
Vercel will build the frontend into `dist/`, prepare the serverless function under `/api`, and give you a live production URL (e.g. `https://paperpulse-xyz.vercel.app`).

---

## Option 2: Deploy on Render (Docker Container)

Render can run the entire application (Frontend + Backend) inside our pre-configured production Docker container.

1. Sign up / Log in to [render.com](https://render.com).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository `guruprasanth02/PaperPulse`.
4. Choose **"Docker"** as the Environment / Runtime.
5. Set the following:
   - **Name:** `paperpulse`
   - **Region:** Choose the closest region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Plan:** Free
6. Add Environment Variables:
   - `GEMINI_API_KEY` = your Gemini API key
7. Click **"Create Web Service"**.
   Render will build the multi-stage Docker container and launch the app at `https://paperpulse-xxxx.onrender.com`.

---

## Option 3: Deploy with Docker Compose (VPS / Local)

If you have a Linux VPS (Ubuntu, Debian) or want to run a local production container:

### Prerequisites
- Docker & Docker Compose installed.

### Steps
1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/guruprasanth02/PaperPulse.git
   cd PaperPulse
   ```
2. Create `.env` file with your keys:
   ```bash
   cp .env.example .env
   # Edit .env and paste your GEMINI_API_KEY
   ```
3. Build and launch:
   ```bash
   docker compose up -d --build
   ```
4. Access the application in your browser at `http://localhost:8000`.

---

## Verifying Your Deployment

Once deployed, verify that the core services are operating properly:
1. **Health Check:** Open `https://your-deployed-url/api/health` (or `/health` on Render/Docker) — it should return `{"status": "healthy"}`.
2. **Search arXiv:** In the **Research Recommendation** tab or **My Papers Library**, search for *"Deepfake recognition"* — results should populate from arXiv in real-time.
3. **Upload & Chat:** Upload a research paper PDF and ask a question in the **Research Assistant** to verify Gemini 3.5 synthesis.
4. **Save Paper:** Click the bookmark icon on any paper to confirm it persists in **Saved Papers**.
