# Deployment Guide

This guide outlines the steps to deploy RareRupees to a production environment.

## Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** Account
- **Cloudinary** Account
- **Vercel** Account (Frontend)
- **Render/Heroku/Railway** Account (Backend)
- **Git** repository

## 1. Backend Deployment (Render Example)

1. **Create a Web Service**: Connect your GitHub repository to Render.
2. **Build Command**: `npm install` (Ensure you are in the `/server` directory or root).
3. **Start Command**: `node server.js` (or `npm start`).
4. **Environment Variables**:
   Add the following secrets in the Render dashboard:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/rarerupees
   JWT_SECRET=your_super_secure_secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure_password
   ```
5. **Deploy**: Trigger a manual deploy or enable auto-deploy on push.

## 2. Frontend Deployment (Vercel)

1. **Import Project**: Connect your GitHub repo to Vercel.
2. **Framework Preset**: Select "Vite".
3. **Root Directory**: Set to `client`.
4. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-service.onrender.com/api
   ```
5. **Deploy**: Vercel will build and deploy the site.

## 3. Post-Deployment Checks

- **CORS**: Ensure the backend `cors` configuration allows the Vercel domain.
  - Update `server.js`:
    ```javascript
    app.use(cors({ origin: 'https://your-frontend.vercel.app' }));
    ```
- **Health Check**: Visit `https://your-backend.com/api/health` to verify uptime.
- **Admin Login**: Test the login flow on the production URL.

## 4. Optimization & Security

- **CDN**: Cloudinary automatically serves images via CDN. Ensure transformations (w_500, q_auto) are used in the frontend to save bandwidth.
- **HTTPs**: Vercel and Render provide automatic SSL certificates.
- **Database Access**: Whitelist the backend IP address in MongoDB Atlas Network Access (or allow 0.0.0.0/0 if IP is dynamic).

## 5. CI/CD Pipeline
- **Frontend**: Vercel automatically builds previews for Pull Requests.
- **Backend**: Configure Render to deploy only when the `main` branch is updated.
