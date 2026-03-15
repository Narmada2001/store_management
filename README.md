# 🏛️ Store Management System

A desktop-based Store Management System for a Government Office, built with:

| Layer | Technology |
|---|---|
| Desktop Shell | **Electron** |
| Frontend | **React 18 + Vite + Tailwind CSS** |
| Backend | **Node.js + Express.js** |
| Database | **MySQL** |

---

## 📋 Prerequisites

| Software | Version | Notes |
|---|---|---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| MySQL | v8+ | Must be running locally |
| npm | v9+ | Comes with Node.js |

---

## ⚙️ Database Setup

1. Open MySQL and run the schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   This creates the `store_management` database, all tables, and seed data.

2. Update `.env` with your MySQL credentials:
   ```
   DB_USER=root
   DB_PASSWORD=your_password
   ```

3. Fix seed passwords (run once):
   ```bash
   cd Community_Project
   node backend/scripts/seed-passwords.js
   ```

---

## 🚀 Installation

```bash
# 1. Install root Electron dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## ▶️ Running the App

```bash
# Start everything (backend + frontend + Electron)
npm run dev
```

This uses `concurrently` to:
1. Start Express backend on `http://localhost:5000`
2. Start Vite dev server on `http://localhost:5173`
3. Wait for both, then launch the Electron window

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@store.gov` | `Admin@123` |
| Staff | `staff@store.gov` | `Staff@123` |

> ⚠️ Change these credentials immediately after first login.

---

## 📦 Modules

| Module | Description |
|---|---|
| **Dashboard** | Summary stats, quick actions |
| **Inventory** | Add/edit/delete items, categories, low-stock alerts |
| **Requests** | Staff submits requests; Admin approves/rejects |
| **Transactions** | Record items received/issued; auto updates stock |
| **Suppliers** | Supplier directory CRUD |
| **Users** | Register users, manage roles (Admin only) |
| **Reports** | Inventory/request/transaction reports + PDF/Excel export |

---

## 🗂️ Project Structure

```
Community_Project/
├── electron/           # Electron main process
│   └── main.js
├── backend/            # Node.js Express API (port 5000)
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── frontend/           # React + Vite app (port 5173)
│   └── src/
│       ├── api/        # Axios service layer
│       ├── components/ # Layout, Sidebar, Topbar, Modal
│       ├── context/    # AuthContext (JWT)
│       └── pages/      # One file per module page
├── database/
│   └── schema.sql
├── .env
└── package.json
```

---

## 📄 API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/register` | Register user | Admin |
| GET | `/api/inventory/items` | List items | Any |
| POST | `/api/inventory/items` | Add item | Admin |
| GET | `/api/requests` | List requests | Any |
| POST | `/api/requests` | Submit request | Any |
| PUT | `/api/requests/:id/review` | Approve/Reject | Admin |
| GET | `/api/transactions` | List transactions | Any |
| POST | `/api/transactions` | Record transaction | Any |
| GET | `/api/reports/summary` | Dashboard summary | Any |
| GET | `/api/reports/inventory` | Inventory report | Any |
