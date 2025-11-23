# Frontend Documentation

## Overview
The RareRupees frontend is a modern, responsive Single Page Application (SPA) built with **React 18** and **Vite**. It features a premium "glassmorphism" design aesthetic, utilizing Tailwind CSS for styling and Framer Motion (implied/planned) for smooth transitions.

## Component Architecture

### Directory Structure
```
src/
├── api/            # Axios instances and API service functions
├── components/     # Reusable UI building blocks
│   ├── dashboard/  # Dashboard-specific components (CoinGrid, Filters)
│   ├── modal/      # Modal dialogs (CoinModal, DetailModal)
│   └── navbar/     # Navigation components
├── context/        # Global state providers
├── layouts/        # Route layouts (MainLayout)
├── pages/          # Page views (Dashboard, Login)
└── utils/          # Helper functions
```

### Key Components

#### `CoinModal.jsx`
A complex form component used for both creating and editing coins.
- **Features**:
  - Dynamic image previews (blob URLs).
  - Camera and Gallery file input integration.
  - Real-time validation for required fields.
  - "Special" coin toggle with custom UI.
- **Props**: `initial` (coin data for edit mode), `mode` ('create' | 'edit'), `onClose`.

#### `Filters.jsx`
A horizontal, scrollable filter bar.
- **Features**:
  - Visual active state with gradient backgrounds.
  - Real-time count badges for each category.
  - Responsive design (scrolls on mobile).

#### `Navbar.jsx`
Top navigation bar containing the logo, search bar, and admin controls (Login/Logout).

## State Management

### Context API
RareRupees uses React Context for global state, avoiding the complexity of Redux.

1. **AuthContext**:
   - Manages `token` and `isAdmin` state.
   - Persists token to `localStorage`.
   - Provides `login` and `logout` methods.
   - Intercepts 401 responses to force logout.

2. **CoinsContext** (Implied):
   - Manages the list of coins (`coins` array).
   - Handles CRUD operations (`fetchCoins`, `createCoin`, `updateCoin`, `deleteCoin`).
   - Centralizes API error handling.

## UI/UX & Design System

### Styling Strategy
- **Tailwind CSS**: Utility-first styling for rapid development.
- **Glassmorphism**: Heavy use of `backdrop-blur`, semi-transparent backgrounds (`bg-white/5`, `bg-gray-900/95`), and subtle borders (`border-white/10`).
- **Color Palette**:
  - **Background**: Deep slate/gray (`bg-slate-900`).
  - **Accents**: Teal (`text-teal-400`) and Emerald gradients.
  - **Text**: High contrast white/gray (`text-gray-100`, `text-gray-400`).

### Interactions
- **Hover Effects**: Cards lift up (`-translate-y-1`) and glow on hover.
- **Modals**: Fade-in backdrops and slide-in drawers.
- **Feedback**: `react-hot-toast` provides immediate visual feedback for success/error states.

## Routing
Powered by `react-router-dom` v6.
- `/`: Dashboard (Protected/Public hybrid view).
- `/login`: Admin login page.
- `*`: 404 Not Found page.

## Assets & Media
- Images are served via Cloudinary CDNs.
- Local assets (logos) are stored in `src/assets`.
- Icons provided by `react-icons` (FontAwesome, Material Design).
