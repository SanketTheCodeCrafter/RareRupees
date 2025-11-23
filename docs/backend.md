# Backend Documentation

## Overview
The RareRupees backend is a RESTful API built with **Node.js** and **Express**. It handles data persistence, authentication, and file management, serving as the logic layer for the application.

## Service Layer Design

### Controllers (`/controllers`)
Business logic is encapsulated in controller functions to keep routes clean.
- **`coin.controller.js`**: Handles CRUD operations for coins.
  - `getCoins`: Fetches and sorts coins.
  - `createCoin`: Handles text data + file uploads -> Cloudinary -> DB.
  - `updateCoin`: Merges existing data with updates; handles partial image updates.
- **`auth.controller.js`**: Manages admin login and token generation.

### Models (`/models`)
Defined using **Mongoose** schemas.
- **Strict Typing**: Enforces data integrity (e.g., `year` must be a Number).
- **Timestamps**: Automatically tracks `createdAt` and `updatedAt`.

## Middleware (`/middleware`)

### `adminAuth.js`
Protects sensitive routes.
1. Checks for `Authorization` header (`Bearer <token>`).
2. Verifies JWT using `process.env.JWT_SECRET`.
3. Decodes payload and checks `role === 'admin'`.
4. Attaches user data to `req.admin` or returns 401/403.

### `upload.js`
Handles `multipart/form-data` using **Multer**.
- **Storage**: `multer.memoryStorage()` (Files are held in RAM as buffers).
- **Filter**: Rejects non-image files.
- **Limits**: (Recommended) File size limits should be configured here.

### `errorHandler.js`
Global error handling middleware.
- Catches async errors.
- Returns standardized JSON error responses (`{ success: false, message: ... }`).

## File Upload Architecture
RareRupees uses a **Stateless Upload** strategy.
1. Client sends file via `POST /api/coins` (multipart).
2. Multer intercepts and stores file in `req.files` (RAM).
3. Controller calls `uploadBufferToCloudinary` utility.
4. Utility streams buffer to Cloudinary and awaits URL.
5. Controller saves the returned URL to MongoDB.
6. **Benefit**: Server disk is never used; easy to scale horizontally.

## Configuration (`/config`)
- **`db.js`**: Manages MongoDB connection.
- **Environment Variables**:
  - `PORT`: Server port.
  - `MONGO_URI`: Database connection string.
  - `JWT_SECRET`: Secret key for signing tokens.
  - `CLOUDINARY_CLOUD_NAME`, `_API_KEY`, `_API_SECRET`: Storage credentials.
  - `ADMIN_USERNAME`, `ADMIN_PASSWORD`: Hardcoded admin credentials (simple auth).

## Security Measures
- **Helmet**: Sets secure HTTP headers.
- **CORS**: Restricts access to allowed frontend domains.
- **Input Validation**: Mongoose validation + Controller-level checks.
- **Sanitization**: Basic sanitization in update logic (trimming strings).
