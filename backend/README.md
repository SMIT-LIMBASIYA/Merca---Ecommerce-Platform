# Merca Backend Service

This is the empty backend directory for the **Merca** platform.

## 🔌 Connecting Frontend & Backend

Once you implement your backend service (Node.js / Express, Python FastAPI, Go, etc.), you can connect it to the frontend:

1. **API Endpoints to Implement**:
   - `GET /api/products` — Retrieve product catalogue
   - `POST /api/auth/login` — User authentication
   - `POST /api/auth/register` — User registration
   - `POST /api/telemetry` — Log usability events from participant sessions
   - `POST /api/orders` — Simulated order processing

2. **Frontend Service Bridge**:
   - Update `frontend/src/services/auth-service.js` (or add an `api.js` client) to point `fetch()` calls to `http://localhost:5000` (or your backend port).
   - In `frontend/vite.config.js`, you can configure a proxy:
     ```javascript
     server: {
       proxy: {
         '/api': 'http://localhost:5000'
       }
     }
     ```
