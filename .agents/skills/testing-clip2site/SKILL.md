---
name: testing-clip2site
description: End-to-end testing of the Clip2Site AI full-stack SaaS app. Use when verifying registration, project creation, AI generation, template switching, content editing, exports, dashboard, or settings.
---

# Testing Clip2Site AI

## Environment Setup

### MongoDB
```bash
mkdir -p /home/ubuntu/mongodb-data
mongod --dbpath /home/ubuntu/mongodb-data --fork --logpath /home/ubuntu/mongodb.log
```
If mongod fails to start with fork, check the log file. Common issue: stale lock file — delete `/home/ubuntu/mongodb-data/mongod.lock` and retry.

### Backend (FastAPI)
```bash
cd /home/ubuntu/Clip2Site/backend
source venv/bin/activate
JWT_SECRET=test-secret-key \
  MONGODB_URI=mongodb://localhost:27017 \
  MONGODB_DB_NAME=clip2site \
  UPLOAD_DIR=uploads \
  FRONTEND_URL=http://localhost:5173 \
  uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Run as background process with `nohup ... > /home/ubuntu/backend.log 2>&1 &` if needed.

No `GEMINI_API_KEY` is set by default — the app falls back to MockAIProvider automatically.

### Frontend (Vite + React)
```bash
cd /home/ubuntu/Clip2Site/frontend
npm run dev
```
Runs on http://localhost:5173 by default.

### Verify Services
```bash
curl -s http://localhost:8000/health  # Should return {"status":"ok",...}
curl -s http://localhost:5173 | head -3  # Should return HTML
```

**Known cosmetic issue**: `/health` may report `database: "disconnected"` due to a module-level import capturing the initial `None` DB value. This is cosmetic — actual DB operations work correctly via the `get_db()` function. Verify by successfully registering a user.

## Email Validation Gotcha

Pydantic's `EmailStr` validator rejects reserved TLDs like `.test`, `.example`, `.invalid`, `.localhost`. When testing registration, always use valid TLDs:
- Use: `demo@clip2site.com`, `test@example.org`
- Do NOT use: `demo@clip2site.test` (will get 422 error)

## Error Handling Pattern

Pydantic 422 validation errors return as an array: `{"detail": [{"type": "...", "loc": [...], "msg": "..."}]}`. The frontend pages (Register, Login, CreateProject) stringify these arrays before displaying. If you see a blank page after a form submission error, check that the error handling in the corresponding `.tsx` file properly handles array `detail` values.

## Primary Test Flow

1. **Register** — Navigate to /register, fill Name/Email/Password, submit. Expect redirect to /dashboard with empty state.
2. **Create Project** — Click "Create Your First Project", fill title + description + audience + tone, click Continue, skip video upload, click "Create Project". Expect redirect to /projects/{id} with "Ready to Generate".
3. **Generate** — Click "Generate Landing Page". Expect animation, then full preview with "Generated with Free Mock Engine" badge and 3 template buttons.
4. **Template Switching** — Click each of the 3 template buttons. Each should show a distinct color scheme (Creator Launch = purple/dark, SaaS = blue/light, Local Business = green/warm).
5. **Edit Content** — Click "Edit" tab, modify headline, click "Save Changes", switch to "Preview" tab. Edited content should persist.
6. **Export HTML** — Click "Export" button, select "HTML Export". Code should start with `<!DOCTYPE html>` and contain the edited headline.
7. **Export React** — Click "Change format", select "React Component". Code should start with `import React` and contain `className=` attributes.
8. **Dashboard** — Navigate to /dashboard. Project card should show title, "generated" status badge, and "Mock" provider indicator.
9. **Settings** — Navigate to /settings. Should show user profile, Configured Provider="gemini", Gemini API="Not configured", Active Provider="Free Mock Engine".

## Clean Database for Fresh Testing

To reset the database before testing:
```bash
mongosh --eval 'db.getSiblingDB("clip2site").dropDatabase()'
```
Or delete the data directory and restart mongod.

## Devin Secrets Needed

No secrets required for basic testing (mock provider is used by default).

Optional: `GEMINI_API_KEY` — Set this to test real Gemini AI generation instead of mock fallback.
