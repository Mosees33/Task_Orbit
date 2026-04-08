# Task Orbit

A full-stack MERN task management dashboard featuring complete CRUD operations, advanced filtering, sorting, activity tracking, and secure MongoDB persistence. 

Built from the ground up to demonstrate clean architecture, RESTful API design, and seamless frontend-backend integration.

##  Features
* **Full Task Control:** Create, read, edit, and delete tasks instantly.
* **Smart Search & Filters:** Search by title, and filter tasks by status or priority.
* **Organization:** Sort tasks dynamically by their due dates.
* **User Feedback:** Real-time toast notifications for all user actions.
* **Resilient UI:** Thoughtfully designed loading screens, empty states, and error handling.
* **Data Persistence:** Securely stores and retrieves data using MongoDB Atlas.

##  Tech Stack
* **Frontend:** React + Vite, CSS, React Toastify
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose

##  Project Structure
This repository uses a monorepo-style structure separating the client and server code, managed by a root `package.json` for easy execution.
* `/Client` - Contains the Vite + React frontend application.
* `/Server` - Contains the Express backend and Mongoose models.

## Local Setup

## Local Setup

1. Install root dependencies:
npm install


2. Install frontend and backend dependencies:
npm install --prefix Client
npm install --prefix Server


3. Start both the client and server:
npm run dev

## Environment Variables

Create two `.env` files to run this project locally.

### Client/.env
VITE_API_URL=http://localhost:5000

Server/.env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string

## API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Check if the API is running |
| **GET** | `/api/tasks` | Fetch all tasks |
| **POST** | `/api/tasks` | Create a new task |
| **PATCH** | `/api/tasks/:id` | Update an existing task's details |
| **DELETE** | `/api/tasks/:id` | Remove a task from the database |



## Future Improvements

* **Authentication:** Implement JWT-based user login and registration.

* **Analytics:** Add visual charts to track task completion rates over time.

* **Activity Tracking:** Enhance logging for granular task history.
