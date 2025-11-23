# Testing Strategy

## Overview
RareRupees employs a multi-layered testing strategy to ensure reliability, data integrity, and a smooth user experience.

## 1. Unit Testing
Focus on individual functions and utilities.

- **Tools**: Jest, Vitest (for Client)
- **Scope**:
  - **Backend**:
    - Utility functions (e.g., data formatters).
    - Middleware logic (e.g., ensuring auth middleware blocks invalid tokens).
  - **Frontend**:
    - Helper functions (e.g., currency formatters).
    - Hook logic (custom hooks).

## 2. Integration Testing
Verify that different modules work together.

- **Tools**: Supertest (Backend), React Testing Library (Frontend)
- **Scope**:
  - **API Routes**:
    - `POST /api/auth/login`: Verify valid/invalid credentials.
    - `GET /api/coins`: Verify data structure and sorting.
    - `POST /api/coins`: Verify database insertion and mock file upload.
  - **Frontend Flows**:
    - Login flow: Input -> Submit -> Context Update -> Redirect.
    - Modal interaction: Open -> Fill Form -> Submit -> Close.

## 3. API Testing (Manual/Automated)
Use **Postman** or **Insomnia** for end-to-end API verification.

### Test Checklist
- [ ] **Health Check**: `GET /api/health` returns 200.
- [ ] **Public Access**: `GET /api/coins` works without token.
- [ ] **Unauthorized Access**: `POST /api/coins` fails without token (401).
- [ ] **Admin Access**: `POST /api/coins` succeeds with valid token.
- [ ] **Validation**: Sending empty body to `POST /api/coins` returns 400.

## 4. UI/UX Regression Testing
Manual or automated checks for visual correctness.

- **Tools**: Cypress or Playwright (Recommended for future)
- **Key Scenarios**:
  - **Responsive Layout**: Check Dashboard on Mobile (375px) vs Desktop (1440px).
  - **Image Loading**: Ensure placeholders appear before images load.
  - **Error Toasts**: Disconnect network and try to save a coin; verify toast appears.

## Suggested Folder Structure for Tests
```
/tests
  /unit
    auth.test.js
    utils.test.js
  /integration
    coins.api.test.js
  /e2e
    login.spec.js
```
