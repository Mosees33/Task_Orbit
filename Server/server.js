require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db");
const sampleRoutes = require("./routes/sampleRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI) {
    connectDB();
} else {
    console.log("MONGODB_URI not set. The API will start with sample in-memory data.");
}

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Task Orbit backend is running",
        docs: {
            health: "/api/health",
            sample: "/api/sample",
            tasks: "/api/tasks",
        },
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        server: "Task Orbit API",
        mongoConfigured: Boolean(process.env.MONGODB_URI),
        time: new Date().toISOString(),
    });
});

app.use("/api/tasks", taskRoutes)
app.use("/api/sample", sampleRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
