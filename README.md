# TaskFlow

A full-stack task management application built with React, Node.js, Express, and MongoDB.

TaskFlow provides authenticated users with a secure workspace to create, manage, complete, and organize their tasks while keeping each user's data isolated.

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
```

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/vivekreddy-03/TaskFlow.git
cd TaskFlow
```

### 2. Configure the backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Do not commit real credentials or secrets to GitHub.

### 3. Start the backend

From the `backend` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 4. Start the frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Authentication

TaskFlow uses JWT-based authentication.

User passwords are hashed using bcrypt before being stored. Protected task endpoints require a valid authentication token.

Each task is associated with its owning user, ensuring that authenticated users can only access their own tasks.

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Task routes are protected by authentication middleware.

## Testing

The application has been manually tested for:

- User registration
- User login
- JWT-protected requests
- Task creation
- Task retrieval
- Task updates
- Task deletion
- Task completion and reactivation
- Task filtering
- Task statistics
- User-specific task isolation
- Logout

## Security

- Passwords are hashed with bcrypt.
- JWT authentication protects task operations.
- Environment variables are stored outside the repository.
- `.env` files are excluded from Git through `.gitignore`.
- User-specific task ownership prevents cross-user task access.

## Future Improvements

Potential future improvements include:

- Task search and sorting
- Task priorities
- Categories and tags
- Deadline reminders
- Automated testing
- Production deployment
- CI/CD

## Author

**Vivek Reddy**

GitHub: https://github.com/vivekreddy-03