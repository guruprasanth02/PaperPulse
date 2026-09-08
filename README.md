# 🎓 AI-Based Intelligent Research Paper Recommendation and Literature Survey Assistant

A final-year project built with **React + Vite + FastAPI + Google Gemini**. Upload research papers, get AI-powered recommendations, generate literature surveys, compare papers, analyze research gaps, and export your findings — all authenticated with Google sign-in.

---

## ✨ Features

| Module | Status | Description |
|--------|--------|-------------|
| 🔐 Google OAuth | ✅ Active | Firebase Authentication — one-click sign-in |
| 📄 Paper Upload | ✅ Active | PDF, TXT, MD, DOCX — AI extracts text via Gemini Vision |
| 🤖 Research Assistant | ✅ Active | RAG-based Q&A with BM25 retrieval + Gemini synthesis |
| 📌 Citation Tracing | ✅ Active | Every answer shows source document + page number |
| 📊 Summarization | ✅ Active | Concise / Detailed / Bullet-point styles, cross-doc synthesis |
| 📤 Multi-Format Export | ✅ Active | PDF, Word, Markdown, JSON export with full Q&A and citations |
| 💡 Research Recommendation | 🔜 Phase 2 | AI-powered paper recommendations based on uploaded research |
| 📚 Literature Survey | 🔜 Phase 2 | Automated literature survey generation |
| ⚖️ Compare Papers | 🔜 Phase 2 | Side-by-side paper comparison with AI analysis |
| 🔍 Research Gap Analysis | 🔜 Phase 2 | Identify unexplored research areas |
| 📈 Trend Analysis | 🔜 Phase 2 | Discover emerging research trends and patterns |
| 📝 Citation Generator | 🔜 Phase 2 | Generate APA, MLA, IEEE citations |
| 💾 Session Persistence | ✅ Active | Survives browser refresh via localStorage |
| 🌙 Dark / Light Theme | ✅ Active | Animated toggle, persisted to localStorage |
| 🔔 Toast Notifications | ✅ Active | Success, error, info, warning toasts |
| 👍 Feedback Loop | ✅ Active | Thumbs up/down on every AI answer |

---

## 🚀 Setup

### 1. Clone & install

```bash
git clone <repo>
cd AI-Based-Intelligent-Research-Paper-Recommendation-and-Literature-Survey-Assistant
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Add a **Web App** → copy the config values
4. Go to **Authentication → Sign-in method → Google → Enable**
5. Add `http://localhost:3000` to **Authorized domains**

### 3. Configure environment variables

Edit `.env` and fill in your values:

```env
VITE_GEMINI_API_KEY="your_gemini_api_key"

VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

For the backend, edit `backend/.env`:

```env
GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Run the app

**Frontend:**
```bash
npm run dev
# → http://localhost:3000
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── ChatContainer.jsx        # RAG research assistant, citations, feedback
│   ├── DocBrowser.jsx           # Paper library + search
│   ├── ExportPanel.jsx          # PDF / Word / Markdown / JSON export
│   ├── LoginPage.jsx            # Google OAuth login
│   ├── Sidebar.jsx              # Navigation + user info (10 items)
│   ├── SummaryPanel.jsx         # AI summarization
│   ├── UploadZone.jsx           # File upload + validation
│   ├── HomePage.jsx             # Dashboard landing page
│   ├── RecommendationPage.jsx   # [Phase 2] Paper recommendations
│   ├── LiteratureSurveyPage.jsx # [Phase 2] Literature survey generator
│   ├── ComparePapersPage.jsx    # [Phase 2] Paper comparison
│   ├── ResearchGapPage.jsx      # [Phase 2] Research gap analysis
│   ├── TrendAnalysisPage.jsx    # [Phase 2] Trend analysis
│   ├── CitationGeneratorPage.jsx# [Phase 2] Citation formatter
│   └── SettingsPage.jsx         # User preferences
├── context/
│   ├── AuthContext.jsx          # Firebase auth state
│   ├── ThemeContext.jsx         # Dark/light theme
│   └── ToastContext.jsx         # Toast notification system
├── hooks/
│   └── useSessionPersistence.js # localStorage session sync
├── services/
│   └── gemini.js                # Gemini API calls (RAG, OCR, summaries)
└── firebase.js                  # Firebase initialization

backend/
├── main.py                      # FastAPI: /research /suggest_questions /feedback
├── pipeline.py                  # BM25 retrieval + semantic chunking
└── requirements.txt
```

---

## 🔐 Authentication Flow

```
Browser → Firebase Google Popup → ID token issued
         → onAuthStateChanged fires → user object available
         → App renders (or LoginPage if not signed in)
```

Sessions are stored **per-browser** in localStorage. No server-side user data is stored.

---

## 📋 Project Roadmap

- **Phase 1** ✅ — Core platform with RAG, upload, summarization, export, authentication
- **Phase 2** 🔜 — Research recommendation, literature survey, paper comparison, gap analysis, trend analysis, citation generator
