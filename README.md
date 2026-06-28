# FocusFlow — MERN Stack Task Tracker

A full-stack project tracking and task management web application built using the MERN (MongoDB, Express, React, Node.js) stack. It features a glassmorphic interface, dual layouts (Kanban board with drag-and-drop, and structured list view), interactive visual statistics, sorting, multi-layered filtering, inline form validation, and real-time toast notifications.

---

## Technical Stack & Features

- **Frontend**: React.js (Vite, Context API for state management, CSS variables, and Lucide React icons).
- **Backend**: Node.js + Express.js REST API with modular controllers, routes, and centralized error handler middleware.
- **Database**: MongoDB Atlas via Mongoose ORM.
- **Key Features**:
  - **Kanban Board layout**: Drag-and-drop support to instantly transition tasks between Pending, In Progress, and Completed.
  - **List View layout**: Tabular list layout with custom checkboxes for fast completion toggles.
  - **Interactive Analytics Panel**: Real-time cards calculating total tasks, completion percentage (linear progress bar), overdue count (turns red with alert indicator), and ongoing tasks.
  - **Rich Controls**: Instant query search, priority filtering, status filtering, and sorting (by Date Created, Due Date, Alphabetical, or Priority) with ascending/descending toggles.
  - **Dual Themes**: Smooth dark and light mode switching via CSS variable transitions.
  - **Robust Validations**: Enforced frontend input rules and Mongoose database constraints.

---

## Workspace Structure

```text
Task tracker/
├── backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Express request handler controllers (CRUD, search, sort, filter)
│   ├── middleware/         # Centralized error handler
│   ├── models/             # Mongoose Task Schema and validations
│   ├── routes/             # Express task router endpoints
│   ├── server.js           # Server runner
│   └── app.js              # Express app setup and middleware routing
└── frontend/
    ├── public/             # Static assets
    └── src/
        ├── components/     # DashboardStats, KanbanBoard, TaskCard, TaskFormModal, Toast
        ├── context/        # TaskContext (Global React state & API requests)
        ├── App.jsx         # Layout assembler and controls header
        ├── index.css       # Custom glassmorphic styling system
        └── main.jsx        # App mounting point
```

---

## Local Setup & Development

### 1. Prerequisites
- **Node.js** installed (v16+ recommended).
- **MongoDB Database**: The database connection string is already configured in the `backend/.env` file.

### 2. Launch the Backend Server
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs nodemon on port `5000`):
   ```bash
   npm run dev
   ```

You should see:
```text
Server running on 5000
MongoDB Connected
```

### 3. Launch the React Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Open your browser and navigate to the local server URL (usually `http://localhost:5173/`).

---

## REST API Reference

All requests and responses use JSON formatting. The base URL for local development is `http://localhost:5000/api/tasks`.

| Method | Endpoint | Description | Query Parameters |
|:---|:---|:---|:---|
| **GET** | `/api/tasks` | Get all tasks | `search` (text matching title/desc)<br>`status` (`pending`, `in-progress`, `completed`)<br>`priority` (`low`, `medium`, `high`)<br>`sortBy` (`createdAt`, `dueDate`, `title`, `priority`)<br>`order` (`asc`, `desc`) |
| **GET** | `/api/tasks/:id` | Get a specific task by ID | None |
| **POST** | `/api/tasks` | Create a new task | JSON body: `title` (required, min 3 chars), `description`, `status`, `priority`, `dueDate` (required) |
| **PUT** | `/api/tasks/:id` | Update an existing task | JSON body of fields to update |
| **DELETE** | `/api/tasks/:id` | Delete a task | None |

---

## Public Deployment Guide

Deploy the application live on the web by following these steps.

### Step 1: Deploy the Backend on Render
1. Sign up on [Render](https://render.com/) and click **New > Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables** in Render's dashboard:
   - `PORT`: `10000` (or leave default, Render sets it)
   - `MONGO_URI`: *[Copy your connection string from `backend/.env`]*
5. Click **Create Web Service**. Once deployed, copy your web service URL (e.g. `https://task-tracker-backend.onrender.com`).

### Step 2: Deploy the Frontend on Vercel
1. Sign up on [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Connect your Git repository.
3. Configure the project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable** in Vercel's dashboard:
   - `VITE_API_URL`: *[Paste your Render Backend URL from Step 1, e.g., `https://task-tracker-backend.onrender.com`]*
5. Click **Deploy**. Vercel will build and provide a public HTTPS link for your task tracker application.
