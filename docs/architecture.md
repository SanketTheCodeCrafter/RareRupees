# System Architecture

## High-Level Architecture

RareRupees follows a classic **Client-Server** architecture using the MERN stack (MongoDB, Express.js, React, Node.js). The application is designed for separation of concerns, scalability, and maintainability.

```mermaid
graph TD
    Client[Client (React + Vite)]
    LB[Load Balancer / CDN]
    Server[API Server (Node.js + Express)]
    DB[(MongoDB Atlas)]
    Storage[Cloudinary / Object Storage]
    Auth[JWT Auth Service]

    Client -->|HTTP/HTTPS| LB
    LB --> Server
    Server -->|Mongoose| DB
    Server -->|Uploads| Storage
    Server -->|Verify Token| Auth
    Client -->|Direct Asset Load| Storage
```

## Technology Stack

### Frontend (Client)
- **Framework**: React 18 (via Vite)
- **Styling**: Vanilla CSS (Custom Design System), Glassmorphism effects
- **Routing**: React Router DOM v6
- **State Management**: React Context API + Hooks
- **HTTP Client**: Native `fetch` / `axios` (implied)
- **Notifications**: React Hot Toast
- **Icons**: React Icons (Phosphor/Lucide)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **File Handling**: Multer (Memory Storage)

### Infrastructure & Services
- **Database Hosting**: MongoDB Atlas
- **Image Storage**: Cloudinary (or similar object storage)
- **Deployment**: Vercel (Client), Render/Heroku (Server)

## Folder Structure

### Client Structure (`/client`)
```
/client
  /src
    /api          # API integration logic
    /components   # Reusable UI components (Modal, Navbar, etc.)
    /context      # Global state (AuthContext, CoinContext)
    /layouts      # Page layouts (MainLayout)
    /pages        # Route components (Dashboard, Login)
    /utils        # Helper functions
    App.jsx       # Root component
    main.jsx      # Entry point
```

### Server Structure (`/server`)
```
/server
  /config       # DB and environment config
  /controllers  # Request handlers (Business logic)
  /middleware   # Auth, Upload, Error handling
  /models       # Mongoose schemas
  /routes       # API route definitions
  /utils        # Helper functions (Cloudinary, etc.)
  server.js     # Entry point
```

## Request-Response Lifecycle
1. **Request**: Client sends an HTTP request (e.g., `GET /api/coins`).
2. **Middleware**: Request passes through global middleware (CORS, Helmet, JSON parser).
3. **Routing**: Router matches the URL to a specific controller function.
4. **Validation**: (Optional) Middleware validates input data or authentication token.
5. **Controller**:
   - Calls the Service/Model layer to query the database.
   - Processes data (e.g., formatting, calculation).
6. **Database**: MongoDB executes the query and returns BSON data.
7. **Response**: Controller sends a JSON response with appropriate HTTP status code.
8. **Client**: Frontend receives data and updates the UI state.

## Key Design Decisions
- **Vite over CRA**: Chosen for faster build times and modern ESM support.
- **Context API**: Used instead of Redux for simplicity, as global state requirements are moderate (Auth + Coin List).
- **Separation of Concerns**: Controllers handle logic, Routes handle endpoints, Models handle data structure.
- **Cloudinary**: Offloaded image storage to keep the server stateless and lightweight.
