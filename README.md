# Merca — E-Commerce Usability Simulator

**Merca** (`merca.com`) is an academic and UX research e-commerce simulator designed to evaluate how users discover, evaluate, and purchase products online. It combines an authentic e-commerce navigation structure with a minimalist, **Woodwrights-inspired warm off-white** visual design.

---

## 🚀 Quick Start (Running the Project)

### Option 1: Current Project Structure (Standard)

The project is ready to run directly from the root folder:

```bash
# 1. Navigate to the project root directory
cd "E-Commerce Usability Simulator"

# 2. Install dependencies (Node.js 18+ required)
npm install
# or if using pnpm:
pnpm install

# 3. Start the local development server
npm run dev
# or:
pnpm dev

# 4. Open the preview URL shown in your terminal (usually http://localhost:5173)
```

---

### Option 2: Two-Folder Setup (`frontend/` & `backend/`)

If you want to split the repository into separate `frontend/` and `backend/` folders:

#### 1. Folder Structure
```text
E-Commerce Usability Simulator/
├── frontend/              # The React + Vite client app (move current files here)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── backend/               # Your API / database service (e.g., Express, FastAPI)
│   ├── package.json
│   └── ...
└── README.md
```

#### 2. Running Frontend
```bash
# Navigate to the frontend folder
cd frontend

# Install packages
npm install

# Launch frontend development server
npm run dev
```

#### 3. Running Backend (when configured)
```bash
# Open a separate terminal and navigate to backend
cd backend

# Install backend dependencies
npm install

# Start API server
npm start
```

---

## 🛠️ Built With

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom design tokens
- **Icons:** Lucide React
- **Routing:** React Router v7 (`createBrowserRouter`)
- **Data Visualization:** Recharts

---

## 🎨 Design System & Visual Tokens

- **Main page background:** `#F3F0EB` (Warm natural off-white)
- **Product cards & surfaces:** `#FAF8F4` (Soft ivory)
- **Secondary sections & chips:** `#EAE5DD` (Muted warm beige)
- **Primary typography:** `#302E2A` (Soft charcoal) + **Cormorant Garamond** (Editorial serif)
- **Secondary text:** `#77736C`
- **Borders & dividers:** `#D8D2C8` (Warm gray hairline rules)
- **Primary buttons:** `#383630` with `#FAF8F4` text
- **Themes:** Supports both **Warm Off-White** and **Obsidian Black** themes (toggle via the header sun/moon button).

---

## 📋 Available Routes & Features

| Route | Description |
|---|---|
| `/` | **Merca Storefront**: Hero banner carousel, featured departments, and curated deals |
| `/catalogue` | **The Collection**: Architectural Woodwrights product cards, department filters, and grid/list view |
| `/product/:id` | **Product Details**: Editorial hero gallery, material swatches (Oak / Walnut / Charcoal), specs accordion, and sample request |
| `/cart` | **Cart**: Multi-item management, quantity adjusters, and discount promo code (`SAVE10`) |
| `/checkout` | **Checkout**: Guest/Auth checkout flow with telemetry tracking |
| `/task` | **Usability Study Mode**: Guided scenario prompts (e.g. TASK-01) for UX participants |
| `/login` & `/register` | **Authentication**: Session management and cart persistence |
| `/admin` | **Researcher Console**: Live event stream, session drop-off rates, and interaction logs |

---

## 📦 Build for Production

To create a production-optimized build:

```bash
npm run build
# Preview the production build locally:
npm run preview
```
