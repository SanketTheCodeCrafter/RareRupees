# DevOps & Production Readiness

## CI/CD Pipeline Recommendations

### GitHub Actions Workflow
Automate testing and deployment to ensure code quality.

**Proposed Workflow (`.github/workflows/main.yml`):**
1. **Trigger**: Push to `main` or Pull Request.
2. **Job 1: Test**:
   - Checkout code.
   - Install dependencies (`npm ci`).
   - Run Linter (`npm run lint`).
   - Run Unit Tests (`npm test`).
3. **Job 2: Build**:
   - Build Frontend (`npm run build`).
   - Verify no build errors.
4. **Job 3: Deploy** (Only on `main`):
   - Trigger Vercel Deploy Hook.
   - Trigger Render Deploy Hook.

## Versioning Strategy
RareRupees follows **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes (e.g., API response structure change).
- **MINOR**: New features (backward compatible).
- **PATCH**: Bug fixes.

## Branching Strategy
**Git Flow (Simplified)**:
- `main`: Production-ready code.
- `develop`: Integration branch for features.
- `feature/feature-name`: Individual feature work.
- `hotfix/bug-name`: Critical fixes for production.

## Backup Strategy
- **Database**:
  - **MongoDB Atlas**: Enable "Cloud Backups" (Snapshots).
  - **Retention**: Keep daily snapshots for 7 days, weekly for 4 weeks.
- **Images**:
  - **Cloudinary**: Enable "Backup" in settings to keep original files even after transformation/deletion.

## Performance Optimization

### Frontend
- **Code Splitting**: Use `React.lazy()` for route components to reduce initial bundle size.
- **Image Optimization**: Use Cloudinary's `f_auto,q_auto` transformations.
- **Caching**: Configure Vercel headers for static assets (`Cache-Control: max-age=31536000, immutable`).

### Backend
- **Compression**: Enable Gzip compression in Express (`app.use(compression())`).
- **Database Indexing**: Ensure all frequently queried fields (e.g., `year`, `denomination`) are indexed.
- **Connection Pooling**: Mongoose handles this automatically, but ensure `maxPoolSize` is tuned for production load.

## Monitoring & Logging
- **Application Performance Monitoring (APM)**: New Relic or Sentry.
- **Error Tracking**: Integrate **Sentry** for real-time error reporting from both Client and Server.
- **Uptime Monitoring**: Use **UptimeRobot** to ping `/api/health` every 5 minutes.
