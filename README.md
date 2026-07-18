# InterviewPrep-AI

AI-powered interview preparation platform. Paste a job description and upload your resume to instantly generate a match score, tailored technical & behavioural questions, identified skill gaps, and a day-by-day prep roadmap. Built with React (Vite) and a Node/Express + MongoDB backend with JWT auth. It can also export an optimized resume as a PDF.

---

## ✨ Features

- **Resume-aware analysis** — upload a PDF resume or paste a quick self-description
- **Match score** against the target job description
- **Tailored questions** — technical and behavioural, with intent + model answers
- **Skill-gap detection** with severity levels
- **Day-by-day preparation roadmap**
- **Resume export** to PDF
- **Auth** — register / login / logout with JWT (httpOnly cookies)
- Polished dark-themed UI with a shared loading experience and password visibility toggle

---

## 🛠 Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Axios
- Sass (SCSS)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs` for auth
- Google GenAI (`@google/genai`) for question/plan generation
- `multer` + `pdf-parse` for resume upload/parsing
- `puppeteer` for PDF generation

---

## 📁 Project Structure

```
.
├── Backend/                # Express API server
│   ├── server.js           # Entry point (listens on port 3000)
│   └── src/
│       ├── app.js          # Express app, CORS, routes
│       ├── config/         # Database connection
│       ├── controllers/    # Auth & interview logic
│       ├── middlewares/    # Auth & file-upload middleware
│       ├── models/         # Mongoose models
│       ├── routes/         # /api/auth, /api/interview
│       └── services/       # AI service
└── Frontend/               # React (Vite) client
    └── src/
        ├── components/     # Shared components (LoadingScreen)
        ├── features/
        │   ├── auth/       # Login, Register, auth context/hooks
        │   └── interview/  # Home, Interview pages, context/hooks
        └── app.routes.jsx  # Route definitions
```

---

## ✅ Prerequisites

- **Node.js** 18+ and npm
- A **MongoDB** database (local or MongoDB Atlas connection string)
- A **Google GenAI API key** ([Google AI Studio](https://aistudio.google.com/))

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone <your-repo-url>
cd InterviewPrep-AI
```

### 1. Backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

Start the API server (runs on **http://localhost:3000**):

```bash
npm run dev
```

### 2. Frontend

In a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173** (Vite's default) and expects the backend at `http://localhost:3000`.

Open **http://localhost:5173** in your browser, register an account, and start generating interview plans.

---

## 🔐 Environment Variables (Backend)

| Variable               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `MONGO_URI`            | MongoDB connection string                    |
| `JWT_SECRET`           | Secret used to sign JWT auth tokens          |
| `GOOGLE_GENAI_API_KEY` | Google GenAI API key for content generation  |

---

## 📜 Available Scripts

**Backend** (`/Backend`)
| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the server with nodemon        |

**Frontend** (`/Frontend`)
| Script            | Description                        |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Build for production              |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

---

## 📝 Notes

- The backend port (`3000`) is set in `Backend/server.js`, and CORS is configured for the frontend origin `http://localhost:5173` in `Backend/src/app.js`.
- The frontend's API base URL (`http://localhost:3000`) is defined in the Axios instances under `Frontend/src/features/*/services/`. Update these if you change the backend host or port.
- Auth tokens are stored in httpOnly cookies, so the frontend and backend must run on the configured origins for cookies to flow correctly.
