# Task Orbit MERN Starter

This workspace now contains a simple MERN starter with:

- `Client`: React + Vite frontend
- `Server`: Express + Mongo-ready backend
- root `package.json`: scripts to run both apps together

## Project structure

```text
Task_Orbit/
|-- Client/
|   |-- src/
|   |   |-- components/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- index.css
|   |-- .env
|   |-- package.json
|   `-- vite.config.js
|-- Server/
|   |-- config/
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- .env
|   |-- package.json
|   `-- server.js
`-- package.json
```

## Run the app

```bash
npm install
npm run dev
```

## Environment files

- `Server/.env` already contains safe local defaults.
- Add a real `MONGODB_URI` in `Server/.env` when you want MongoDB storage.
- `Client/.env` points the frontend to `http://localhost:5000`.

## API routes

- `GET /api/health`
- `GET /api/sample`
