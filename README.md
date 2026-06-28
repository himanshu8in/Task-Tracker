# 🚀 FocusFlow - MERN Task Tracker

A modern and responsive Task Tracker web application built using the **MERN Stack**. It allows users to securely manage their daily tasks with authentication, task prioritization, and real-time CRUD operations.

## 🌐 Live Demo

- **Frontend:** https://task-tracker-phi-teal.vercel.app
- **Backend API:** https://task-tracker-9nop.onrender.com

---

## 📌 Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📋 Create, Read, Update & Delete Tasks
- ✅ Mark Tasks as Completed or Pending
- 🎯 Task Priority (Low, Medium, High)
- 📅 Due Date Management
- 🔍 Search & Filter Tasks
- 📱 Fully Responsive UI
- 🌙 Modern Dark Theme
- ⚡ Fast React + Vite Frontend
- ☁️ Cloud Database (MongoDB Atlas)
- 🚀 Deployed on Vercel & Render

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Context API
- CSS
- Lucide React Icons

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure

```
FocusFlow
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/focusflow.git
```

```bash
cd focusflow
```

---

### Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/me` | Get Logged User |

### Tasks

| Method | Endpoint |
|---------|----------|
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| PUT | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

---

## 📸 Screenshots

### Login Page

(Add Screenshot Here)

### Dashboard

(Add Screenshot Here)

### Create Task

(Add Screenshot Here)

---

## 🔒 Environment Variables

Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

Frontend

```env
VITE_API_URL=
```

---

## 🚀 Deployment

### Frontend

Hosted on **Vercel**

### Backend

Hosted on **Render**

### Database

Hosted on **MongoDB Atlas**

---

## 🎯 Future Improvements

- Email Verification
- Password Reset
- Drag & Drop Tasks
- Task Categories
- Team Collaboration
- Notifications
- Calendar View
- Analytics Dashboard

---

## 👨‍💻 Author

**Himanshu Singh**

GitHub: https://github.com/himanshu8in

LinkedIn: https://linkedin.com/in/himanshu8in

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
