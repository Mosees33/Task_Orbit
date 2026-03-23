const mongoose = require("mongoose");

const Task = require("../models/Task");

const starterTasks = [
    {
        title: "Set up backend routes",
        description: "Create the first backend route structure for the task API.",
        status: "Done",
        owner: "API",
        priority: "High",
        dueDate: "2026-03-20T00:00:00.000Z",
    },
    {
        title: "Connect React client to the API",
        description: "Connect React client to the API for understanding.",
        status: "In Progress",
        owner: "Frontend",
        priority: "High",
        dueDate: "2026-04-15T00:00:00.000Z",
    },
    {
        title: "Add MongoDB connection string",
        description: "Add MongoDB connection string to work with database.",
        status: "Backlog",
        owner: "You",
        priority: "Medium",
        dueDate: "2026-03-10T00:00:00.000Z",

    },
];

const toTaskPayload = (task) => ({
    id: task._id ? task._id.toString() : task.id,
    title: task.title,
    description: task.description || "",
    status: task.status,
    owner: task.owner,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,

});

const getSampleBoard = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                source: "memory",
                message: "MongoDB is optional right now. Add MONGODB_URI to store tasks in the database.",
                tasks: starterTasks,
            });
        }

        let tasks = await Task.find().sort({ createdAt: -1 }).limit(6);

        if (!tasks.length) {
            tasks = await Task.insertMany(starterTasks);
        }

        return res.json({
            source: "database",
            message: "Sample tasks loaded from MongoDB.",
            tasks: tasks.map(toTaskPayload),
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to load sample tasks.",
            error: error.message,
        });
    }
};

module.exports = {
    getSampleBoard,
};
