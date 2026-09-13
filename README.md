# TaskFlow

A full-stack task management application built with React, Node.js, Express, and MongoDB.

TaskFlow provides authenticated users with a secure workspace to create, manage, complete, and organize their tasks while keeping each user's data isolated.

## 🚀 Deployment

**Live Application:**
https://taskflow-frontend-y05w.onrender.com

**Live Backend:**
https://taskflow-gg6t.onrender.com

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected task APIs
- User-specific task isolation
- Create, view, update, and delete tasks
- Mark tasks as completed or active
- Filter tasks by All, Active, and Completed
- Task statistics
- Task descriptions and due dates
- Responsive task management dashboard
- Logout functionality

## Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Application Architecture

```text
User
 │
 ▼
React + Vite Frontend
 │
 │ HTTP requests + JWT
 ▼
Express.js REST API
 │
 ├── Authentication Middleware
 │
 ├── Authentication Routes
 │
 └── Task Routes
 │
 ▼
MongoDB + Mongoose
