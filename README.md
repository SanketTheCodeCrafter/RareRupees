# 🪙 RareRupees
*A personal digital system for managing my Indian coin collection*

> **Live Repo:** [github.com/SanketTheCodeCrafter/RareRupees](https://github.com/SanketTheCodeCrafter/RareRupees)

---

## 🚀 Overview

**RareRupees** is a full-stack MERN application built to solve a real problem — managing and tracking a rare Indian coin collection in a structured, visual, and scalable way.

Instead of relying on scattered notes or memory, this is a cloud-based system that catalogs, filters, and inspects coins efficiently — with a clean UI that feels like a product, not a project.

### 💡 The Problem
- No structured way to track coin details
- Difficult to visually inspect a growing collection
- No filtering or categorization system
- Poor accessibility and organization

### ⚡ The Solution
- Centralized digital catalog with rich metadata
- Dual image inspection — front & rear of every coin
- Denomination-based filtering with live coin count
- Clean, responsive UI with fast interactions

---

## ⚠️ Personal Project Notice

This repository is a personal project built for the author's own use and workflow. It was created to solve a specific, private need and may be opinionated or incomplete for general use. If you plan to reuse or deploy this project for others, review the `docs/` folder and the security and deployment sections before doing so.


## 🖼️ Preview

### 🏠 Dashboard — Collection View (Desktop)

![Dashboard — Collection View (Desktop)](./client/public/assets/Screenshot%202026-04-07%20173231.png)

> Filter by denomination (₹1, ₹2, ₹5, ₹10, ₹20, Special), sort by oldest/newest, and browse all 66 coins in a visual grid with front & rear images.

---

### 🪙 Coin Detail Modal (Desktop)

![Coin Detail Modal (Desktop)](./client/public/assets/Screenshot%202026-04-07%20173252.png)

> Click any coin to see full metadata — denomination, year, mint location, mint mark, condition score (out of 10), and edition type — with dual image thumbnails.

---

### 📱 Mobile View — Collection

![Mobile View — Collection](./client/public/assets/Screenshot%202026-04-07%20173330.png)

---

### 📱 Mobile View — Coin Detail

![Mobile View — Coin Detail](./client/public/assets/Screenshot%202026-04-07%20173351.png)

---

## ✨ Features

### 🔐 Authentication
- JWT-based admin authentication
- Protected mutation routes (POST, PUT, DELETE)
- Public viewing with admin-only controls

### 📦 Coin Management
- Full CRUD — create, update, delete coins
- Track denomination, mint location, year, condition
- Special coins tagging with `isSpecial` flag

### 🖼️ Image Handling
- Upload front & rear images via camera or gallery
- Instant preview with Blob URLs
- Cloudinary CDN for persistent, optimized storage

### 🎨 UI/UX
- Glassmorphism dark design system
- Responsive grid layout (desktop + mobile)
- Interactive coin detail modals
- Denomination filter tabs with live coin counts
- Real-time toast notifications

---

## 🧠 Why This Project Matters

This is not a tutorial project.

- Built for real personal use — not a demo
- Designed with scalability from day one
- Implements production-level architecture decisions
- Prioritizes UX, performance, and clean code

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- Context API (Auth + Coins state)
- Tailwind CSS
- React Hot Toast, React Icons

### Backend
- Node.js + Express.js
- Middleware: Helmet, CORS, Morgan

### Database
- MongoDB Atlas + Mongoose

### Services & Tools
- Cloudinary — image CDN storage
- Multer — memory storage for uploads
- JWT — stateless authentication
- Sentry — error monitoring

---

## 🏗️ Architecture

### Design Pattern
- MERN-based client-server architecture
- Clean separation of frontend and backend concerns

### 🔄 Data Flow

```
Client → API Request
       → Multer processes image in memory
       → Image streamed to Cloudinary
       → CDN URL stored in MongoDB
       → Response updates UI state
```

### 📂 Project Structure

```
client/
├── src/api/
├── src/components/
└── src/context/

server/
├── controllers/
├── middleware/
└── models/
```

---

## 🗄️ Database Design

### Collection: `coins`

| Field | Type | Description |
|---|---|---|
| `denomination` | String | Rupee value |
| `year` | Number | Mint year |
| `mint` | String | Mint location |
| `condition` | Number | Rating (1–10) |
| `mark` | String | Mint mark |
| `isSpecial` | Boolean | Special tag |
| `frontImage` | String | Cloudinary URL |
| `rearImage` | String | Cloudinary URL |
| `timestamps` | Auto | createdAt, updatedAt |

---

## 🔌 API Endpoints

```
POST   /api/auth/login       → Admin login
GET    /api/coins            → Fetch all coins
GET    /api/coins/:id        → Fetch coin by ID
POST   /api/coins            → Add new coin   (protected)
PUT    /api/coins/:id        → Update coin    (protected)
DELETE /api/coins/:id        → Delete coin    (protected)
```

### Auth Header
```
Authorization: Bearer <token>
```

---

## ⚙️ Setup & Installation

### 📌 Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 🔐 Environment Variables

#### Backend — `/server/.env`
```env
NODE_ENV=
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

#### Frontend — `/client/.env`
```env
VITE_API_URL=
```

### ▶️ Run Locally

```bash
# Clone the repo
git clone https://github.com/SanketTheCodeCrafter/RareRupees.git

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---

## 📜 Scripts

### Backend
| Command | Action |
|---|---|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |

### Frontend
| Command | Action |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## ⚡ Performance & Optimization

### Frontend
- Code splitting with `React.lazy`
- Optimized image delivery via Cloudinary transformations
- Efficient global state via Context API

### Backend
- Gzip compression enabled
- MongoDB indexing on frequently queried fields
- Stateless uploads — no disk I/O on the server

---

## 🔐 Security

- JWT-based stateless authentication
- Secure HTTP headers via Helmet
- CORS restrictions configured
- Input validation & sanitization
- No filesystem access — uploads live only in memory

---

## 📈 Scalability

- Stateless backend — horizontal scaling ready
- CDN-based image delivery (no bandwidth pressure on server)

### Future Improvements
- Redis caching for frequent reads
- Edge caching for global performance

---

## 🧠 Engineering Decisions

| Decision | Rationale |
|---|---|
| Stateless upload architecture | Avoids server storage complexity |
| Context API over Redux | Simplicity and sufficient performance for this scope |
| Vite over CRA | Significantly faster dev experience and build times |

---

## 🚧 Challenges Solved

- Handling image uploads without server filesystem
- Maintaining smooth UI with real-time state updates
- Designing a scalable architecture for a personal-use tool

---

## 🔮 Future Roadmap

- [ ] Advanced filtering & full-text search
- [ ] AI-based coin recognition & auto-tagging
- [ ] Multi-user support with roles
- [ ] Mobile PWA version

---

## 🚀 Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render / Railway |
| CI/CD | GitHub Actions |

---

## 💬 Final Note

This started as a personal necessity.

But it was built with the mindset of a production system — with real attention to scalability, performance, security, and clean architecture from day one.

---

## 🔥 What This Demonstrates

- Real-world problem solving — not a toy project
- System design thinking at the architecture level
- Practical engineering trade-offs with clear reasoning
- The ability to ship usable, well-structured products

---

*Built by [Sanket](https://github.com/SanketTheCodeCrafter)*
