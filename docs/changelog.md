# Changelog

All notable changes to the **RareRupees** project will be documented in this file.

## [1.0.0] - 2025-11-23

### Added
- **Core Platform**: Initial release of the RareRupees coin tracking application.
- **Authentication**: Admin login with JWT security.
- **Dashboard**: Grid view of coin collection with filtering.
- **Coin Management**:
  - Create new coin entries with details (Year, Mint, Condition, etc.).
  - Edit existing coin details.
  - Delete coins.
  - Upload Front/Rear images via Camera or Gallery.
- **Search & Filter**:
  - Filter by Denomination (₹1, ₹2, ₹5, etc.).
  - "Special" coin category support.
- **UI/UX**:
  - Glassmorphism design system.
  - Responsive layout for Mobile and Desktop.
  - Toast notifications for user feedback.
- **Documentation**: Complete documentation suite (Architecture, API, Deployment, etc.).

### Security
- Implemented Helmet and CORS middleware.
- Secure file handling via memory storage.
