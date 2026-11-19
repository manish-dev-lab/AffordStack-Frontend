# Software Services Platform - Frontend UI

A modern, responsive client portal and administrative dashboard built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

---

## 🎨 Highlights & Features

- **Public Client Portal**:
  - Home, Services, Student Project Guidance, Developer Support, Enterprise Software.
  - Portfolio showcases with case studies, live demo links, and GitHub repositories.
  - Technical articles and blog module.
  - Multi-section **Request a Quote** module with file uploads, instant reference numbers, and Zod validation.
  - **Secure Quotation Decision Portal** (`/quote/{secureToken}`): Digital review and Accept/Reject without login.
- **Admin Management Console (13 Modules)**:
  - Analytics Dashboard with Recharts visual charts.
  - Enquiries inbox with status filters and internal notes.
  - Quotation line-item builder & QuestPDF dispatcher.
  - Delivery project tracker with milestone checklist and progress sliders.
  - Customer directory, services catalog, portfolio manager, and website settings.

---

## ⚡ Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Start Development Server
```powershell
npm run dev
```
- **Public Portal**: `http://localhost:5173/`
- **Admin Console**: `http://localhost:5173/admin/login`

> **Note**: Vite is configured with a development proxy (`/api` -> `http://localhost:5000`). Make sure the backend API is running on port 5000.
