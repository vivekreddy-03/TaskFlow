# TaskFlow

TaskFlow is a full-stack task management application built with React, Node.js, Express, and MongoDB.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected task APIs
- Create, view, update, and delete tasks
- Mark tasks as completed or active
- Filter tasks by All, Active, and Completed
- Task statistics
- User-specific task isolation
- Responsive task management dashboard

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

## Project Structure

```text
TaskFlow/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md