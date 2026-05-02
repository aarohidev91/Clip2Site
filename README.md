# Clip2Site AI

> Turn any product video into a high-converting landing page in seconds.

Clip2Site AI is a free-first, AI-powered SaaS that converts short product/service videos into beautiful, conversion-optimized landing pages. Upload a video or describe your product, and the app generates professional copy, chooses a template, and produces a live preview with exportable HTML/React code.

## Features

- **AI Landing Page Generation** — Gemini AI (free tier) analyzes your product and generates conversion-optimized copy
- **Smart Fallback** — Built-in Mock AI engine produces realistic results when Gemini quota is exhausted or API key is missing
- **3 Professional Templates** — Creator Launch (dark/bold), SaaS/Product (clean/light), Local Business (warm/inviting)
- **Live Preview** — See your generated landing page in real-time with template switching
- **Content Editor** — Edit every generated section: headlines, benefits, FAQs, pricing, CTAs
- **Export** — Download as self-contained HTML or React + Tailwind component
- **Video Upload** — Upload product videos (MP4, MOV, AVI, MKV, WebM up to 100MB)
- **Project Management** — Dashboard with project cards, status tracking, AI provider badges
- **JWT Authentication** — Secure user accounts with hashed passwords
- **Premium UI** — Dark-first glassmorphism design with Framer Motion animations
- **Mobile Responsive** — Beautiful on every screen size

## Free-First Architecture

This project is designed to run **100% free**:

| Component | Solution | Cost |
|-----------|----------|------|
| AI Generation | Google Gemini free tier | Free |
| AI Fallback | Built-in Mock AI Engine | Free |
| Transcription | Mock transcription from metadata | Free |
| Database | MongoDB (local or Atlas free tier) | Free |
| File Storage | Local filesystem | Free |
| Auth | JWT (self-hosted) | Free |
| Frontend | React + Vite (static) | Free |
| Backend | FastAPI (self-hosted) | Free |

## Tech Stack

### Backend
- **FastAPI** — Python async web framework
- **MongoDB** via Motor — async database driver
- **Google Gemini SDK** — AI content generation
- **JWT** via PyJWT — authentication
- **bcrypt** — password hashing
- **Pydantic** — data validation

### Frontend
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Lucide React** — beautiful icons
- **Axios** — HTTP client
- **React Router v6** — SPA routing

## Project Structure

```
clip2site/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI application
│   │   ├── core/
│   │   │   ├── config.py              # Environment configuration
│   │   │   ├── database.py            # MongoDB connection
│   │   │   └── security.py            # JWT + password hashing
│   │   ├── models/
│   │   │   ├── user.py                # User document model
│   │   │   └── project.py             # Project document model
│   │   ├── schemas/
│   │   │   ├── auth.py                # Auth request/response schemas
│   │   │   ├── project.py             # Project schemas
│   │   │   └── generation.py          # Generation + export schemas
│   │   ├── routes/
│   │   │   ├── auth.py                # POST /api/auth/register, login, me
│   │   │   ├── projects.py            # CRUD /api/projects
│   │   │   ├── upload.py              # POST /api/projects/:id/upload-video
│   │   │   ├── generation.py          # POST /api/projects/:id/generate
│   │   │   ├── export.py              # POST /api/projects/:id/export/html|react
│   │   │   └── health.py              # GET /health
│   │   ├── services/
│   │   │   ├── auth_service.py        # User registration + login logic
│   │   │   ├── project_service.py     # Project CRUD operations
│   │   │   ├── storage_service.py     # Local file upload handler
│   │   │   ├── transcription_service.py # Mock + Whisper placeholder
│   │   │   ├── ai_provider.py         # Base AI provider interface
│   │   │   ├── gemini_provider.py     # Google Gemini implementation
│   │   │   ├── mock_ai_provider.py    # Realistic mock AI fallback
│   │   │   ├── landing_page_generator.py # Orchestrator
│   │   │   └── export_service.py      # HTML + React code generation
│   │   └── tests/
│   │       ├── test_health.py
│   │       ├── test_auth.py
│   │       └── test_project_flow.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx               # Marketing landing page
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx          # Project list
│   │   │   ├── CreateProject.tsx      # New project wizard
│   │   │   ├── ProjectDetail.tsx      # Preview + editor
│   │   │   └── Settings.tsx           # Provider status
│   │   ├── components/
│   │   │   ├── layout/                # Navbar, Layout
│   │   │   ├── ui/                    # LoadingSpinner, GenerationSteps
│   │   │   ├── landing-preview/       # LandingPreview component
│   │   │   ├── project/               # ContentEditor
│   │   │   └── export/                # ExportModal
│   │   ├── services/                  # API, auth, projects
│   │   └── types/                     # TypeScript interfaces
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Setup

### Prerequisites
- **Python 3.12+**
- **Node.js 20+**
- **MongoDB** (local install or [MongoDB Atlas free tier](https://www.mongodb.com/cloud/atlas))

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings (see Environment Variables below)

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start dev server
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# MongoDB: localhost:27017
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `clip2site` |
| `JWT_SECRET` | Secret for JWT signing | `change-me` |
| `AI_PROVIDER` | AI provider to use | `gemini` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | _(empty)_ |
| `GEMINI_MODEL` | Gemini model name | `gemini-1.5-flash` |
| `UPLOAD_DIR` | Upload directory path | `uploads` |
| `MAX_UPLOAD_MB` | Max upload file size | `100` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Gemini Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. Set `GEMINI_API_KEY` in your backend `.env`
4. Optionally change `GEMINI_MODEL` (default: `gemini-1.5-flash`)

If Gemini is not configured or quota is exhausted, the app **automatically falls back** to the Mock AI Engine — no crashes, no errors.

## Mock Fallback Behavior

The Mock AI Engine activates when:
- `GEMINI_API_KEY` is not set
- Gemini quota or rate limits are exceeded
- Gemini model is not found
- Any Gemini API error occurs

The mock engine generates **realistic, impressive** landing page content based on:
- Project title
- Description/context
- Target audience
- Desired tone

Backend logs clearly show which provider was used:
```
INFO: MockAIProvider generating content for: FitPro App
INFO: Project abc123 generated with mock provider
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/api/provider/status` | No | AI provider status |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/projects` | Yes | List projects |
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects/:id` | Yes | Get project |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| POST | `/api/projects/:id/upload-video` | Yes | Upload video |
| POST | `/api/projects/:id/generate` | Yes | Generate landing page |
| PUT | `/api/projects/:id/content` | Yes | Update generated content |
| POST | `/api/projects/:id/export/html` | Yes | Export as HTML |
| POST | `/api/projects/:id/export/react` | Yes | Export as React |

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest app/tests/ -v
```

### Frontend Build Verification

```bash
cd frontend
npm run build
```

## Free Deployment Suggestions

| Service | Use For | Free Tier |
|---------|---------|-----------|
| [Render](https://render.com) | Backend + Frontend | Free web services |
| [Railway](https://railway.app) | Backend | $5 free credit/month |
| [Vercel](https://vercel.com) | Frontend | Free for hobby |
| [MongoDB Atlas](https://mongodb.com/atlas) | Database | 512MB free cluster |
| [Fly.io](https://fly.io) | Backend | 3 free VMs |

## Roadmap

- [ ] Real video transcription via Whisper/faster-whisper
- [ ] More landing page templates
- [ ] Custom domain support
- [ ] Team collaboration
- [ ] A/B testing for generated pages
- [ ] Analytics dashboard
- [ ] Direct publish to custom domain
- [ ] Stripe integration for premium features
- [ ] Multi-language landing page generation
- [ ] Template marketplace

## License

MIT
