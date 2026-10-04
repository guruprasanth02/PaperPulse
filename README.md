<div align="center">

<h1>
  <img src="https://img.shields.io/badge/PaperPulse-AI%20Research%20Platform-0ea5e9?style=for-the-badge&logo=bookstack&logoColor=white" alt="PaperPulse" />
</h1>

<p><strong>An intelligent research assistant platform powered by Google Gemini, Sentence Transformers, and live arXiv data.</strong></p>

<p>
  <a href="https://github.com/guruprasanth02/PaperPulse/actions"><img src="https://img.shields.io/github/actions/workflow/status/guruprasanth02/PaperPulse/deploy.yml?style=flat-square&label=CI%2FCD" alt="Build Status" /></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Gemini-3.5%20Flash-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

</div>

---

## Overview

**PaperPulse** is a full-stack AI research platform that accelerates academic and professional literature workflows. Upload research papers, extract structured intelligence, conduct semantic question answering across multiple documents, discover related studies via real-time vector recommendations and live arXiv queries, and generate publication-ready literature surveys and citations — all within a unified, authenticated interface.

> **Live Demo:** [paperpulse.vercel.app](https://paperpulse.vercel.app) &nbsp;|&nbsp; **Backend API:** Hosted on Render

---

## Features

| Module | Description |
| :--- | :--- |
| 🤖 **Research Assistant** | Context-aware RAG Q&A synthesized across all uploaded documents with citation attribution |
| 💡 **Recommendation Engine** | 4 search modes (Topic, Abstract, PDF Upload, Domain Browse) using Sentence Transformer cosine similarity + live arXiv API |
| 📚 **Literature Survey Generator** | Automated multi-paper surveys categorized by objectives, methodologies, findings and themes |
| ⚖️ **Paper Comparison** | Side-by-side AI breakdown of models, architectures, datasets, and performance tradeoffs |
| 🔍 **Research Gap Analysis** | Automated discovery of unexplored problem spaces and future research directions |
| 📈 **Trend Analysis** | Keyword frequency shifts, emerging topics, and research trajectory projections |
| 📝 **Citation Generator** | APA 7, MLA 9, Chicago, Harvard, IEEE, and BibTeX — formatted instantly |
| 📂 **My Papers Library** | Unified manager for uploaded PDFs and saved arXiv recommendations with live search |
| 📤 **Export** | Export full sessions, notes, and surveys to Markdown, PDF, and DOCX |
| 🔐 **Authentication** | Firebase Google Sign-in with guest-mode fallback |
| 🌙 **Themes** | Animated dark / light theme toggle, persisted across sessions |

---

## Tech Stack

```
Frontend                   Backend                   AI & Data
────────────────────        ────────────────────       ──────────────────────────
React 18 + Vite 5          FastAPI (Python 3.11)      Google Gemini 3.5 Flash
Context API (Auth,          Uvicorn ASGI server        Sentence Transformers
  Theme, Toast)             Pydantic v2                  (all-MiniLM-L6-v2)
Firebase Auth               python-dotenv              TF-IDF hashing fallback
jsPDF / DOCX export        In-memory VectorStore       Live arXiv Atom/XML API
FontAwesome Icons           Cosine similarity          Browser DOMParser (client)
LocalStorage persistence    CORS-enabled
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **Python** 3.10+
- A **Google Gemini API key** — [Get one here](https://aistudio.google.com/app/apikey)
- A **Firebase project** — [Create one here](https://console.firebase.google.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/guruprasanth02/PaperPulse.git
cd PaperPulse
```

---

### 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key

# Firebase (Web App config)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Override backend URL in production
# VITE_API_URL=https://your-backend.onrender.com
```

> In development, `VITE_API_URL` defaults to `http://localhost:8000`.
> In production builds, it automatically falls back to `/api` on the same domain.

---

### 3. Run the Frontend

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

### 4. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs  (interactive API docs)
```

---

## Project Structure

```
PaperPulse/
├── src/
│   ├── components/
│   │   ├── ChatContainer.jsx         # Research assistant with RAG & citation tracing
│   │   ├── RecommendationPage.jsx    # Vector-based recommendation with 4 search modes
│   │   ├── DocBrowser.jsx            # Paper library — upload, save, and search
│   │   ├── LiteratureSurveyPage.jsx  # Automated literature survey generation
│   │   ├── ComparePapersPage.jsx     # Side-by-side paper comparison
│   │   ├── ResearchGapPage.jsx       # Research gap discovery
│   │   ├── TrendAnalysisPage.jsx     # Trend and keyword trajectory analysis
│   │   ├── CitationGeneratorPage.jsx # Multi-style citation formatter
│   │   ├── ExportPanel.jsx           # PDF / Word / Markdown export
│   │   ├── UploadZone.jsx            # Parallel multi-file PDF ingestion
│   │   ├── SummaryPanel.jsx          # AI-driven document summarization
│   │   └── SettingsPage.jsx          # User preferences
│   ├── context/                      # AuthContext, ThemeContext, ToastContext
│   ├── hooks/
│   │   └── useSessionPersistence.js  # localStorage session sync with debounce
│   ├── services/
│   │   ├── gemini.js                 # Gemini API client — model cascade + fallbacks
│   │   └── recommendation.js        # Recommendation API + arXiv client-side fallback
│   └── firebase.js                   # Firebase initialization
│
├── backend/
│   ├── main.py                       # FastAPI app — /research, /suggest_questions, /feedback
│   ├── recommendation/
│   │   ├── recommender.py            # RecommendationEngine with vector indexing
│   │   ├── vector_store.py           # In-memory cosine similarity store
│   │   ├── embeddings.py             # SentenceTransformer + TF-IDF fallback
│   │   ├── arxiv_fetcher.py          # Live arXiv Atom/XML query and parser
│   │   ├── routes.py                 # FastAPI router — /recommend, /save-paper
│   │   └── models.py                 # Pydantic request/response schemas
│   └── requirements.txt
│
├── api/
│   └── index.py                      # Vercel serverless function entry point
│
├── Dockerfile                        # Multi-stage production container
├── docker-compose.yml                # One-command local container setup
├── vercel.json                       # Vercel frontend + serverless routing config
├── vite.config.js                    # Vite build config with manual chunk splitting
└── .env.example                      # Environment variable template
```

---

## Deployment

PaperPulse supports three deployment strategies. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full step-by-step guide.

### Strategy 1 (Recommended): Vercel + Render

Deploy the React frontend on Vercel's global CDN and the FastAPI backend on Render's dedicated container — eliminating serverless cold-start limitations for long AI inference tasks.

```
User Browser
  ├── Static assets  ──►  Vercel (Edge CDN, global)
  └── /api requests  ──►  Render (FastAPI, 24/7 container)
```

1. Deploy the backend on **Render** → copy the service URL.
2. On **Vercel**, set `VITE_API_URL` to your Render URL and add all Firebase + Gemini keys.
3. Add your Vercel domain to **Firebase Console → Authentication → Authorized Domains**.

### Strategy 2: All-in-One on Vercel

Serves both the SPA and the Python FastAPI serverless function from a single Vercel project — pre-configured with [`vercel.json`](./vercel.json) and [`api/requirements.txt`](./api/requirements.txt).

### Strategy 3: Docker Container (Any VPS or Render)

```bash
docker compose up -d --build
# App available at http://localhost:8000
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check |
| `POST` | `/research` | RAG research Q&A |
| `POST` | `/suggest_questions` | AI-generated follow-up questions |
| `POST` | `/recommend` | Vector-based paper recommendations |
| `POST` | `/search-topic` | Live arXiv + vector topic search |
| `POST` | `/save-paper` | Toggle save/unsave a paper |
| `GET` | `/saved-papers` | Retrieve saved papers |
| `POST` | `/feedback` | Log user feedback on AI answers |

Interactive API docs available at `http://localhost:8000/docs` when running locally.

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Built with React, FastAPI, Google Gemini, and arXiv open data.</sub>
</div>
