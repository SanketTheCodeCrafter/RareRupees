# Maintenance & Future Roadmap

## Next 12 Months Roadmap

### Q2 2025: Enhanced Discovery
- [ ] **Advanced Search**: Filter by multiple mints, condition ranges, and keyword tags.
- [ ] **Public Gallery**: Allow non-admins to view the collection in "Read-Only" mode.
- [ ] **Social Sharing**: "Share this Coin" button generating a dynamic OG image.

### Q3 2025: User Features
- [ ] **User Accounts**: Allow other collectors to sign up and manage their own private collections.
- [ ] **Wishlist**: Users can mark coins they want to acquire.
- [ ] **Valuation Tool**: Integrate with external APIs to estimate coin value based on year/mint/condition.

### Q4 2025: Mobile Experience
- [ ] **PWA Support**: Make the web app installable with offline support.
- [ ] **Native App**: React Native port for iOS/Android.

### Q1 2026: AI Integration
- [ ] **AI Grading**: Upload an image and let AI suggest a condition rating (1-10).
- [ ] **Auto-Identification**: OCR to detect Year and Denomination from photos.

## Technical Debt & Refactoring
- **TypeScript Migration**: Convert the entire codebase to TypeScript for better type safety.
- **Testing Coverage**: Increase unit test coverage to >80%.
- **Component Library**: Extract UI components (Buttons, Modals) into a separate package or Storybook.

## Scalability Upgrades
- **Redis Caching**: Cache API responses for `GET /coins` to reduce DB load.
- **CDN for API**: Use Cloudflare to cache static API responses at the edge.
- **Horizontal Scaling**: Containerize the backend with Docker and deploy via Kubernetes if traffic spikes.
