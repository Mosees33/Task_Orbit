const mongoose = require("mongoose");

const Task = require("../models/Task");

const starterTasks = [
    {
        title: "Set up backend routes",
        status: "Done",
        owner: "API",
        priority: "High",
    },
    {
        title: "Connect React client to the API",
        status: "In Progress",
        owner: "Frontend",
        priority: "High",
    },
    {
        title: "Add MongoDB connection string",
        status: "Backlog",
        owner: "You",
        priority: "Medium",
    },
];

const toTaskPayload = (task) => ({
    id: task._id ? task._id.toString() : task.id,
    title: task.title,
    status: task.status,
    owner: task.owner,
    priority: task.priority,
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

const getTasks = async (req, res) => {
    try{
        const tasks = await Task.find().sort({ createdAt: -1});

        return res.json({
            source: "database",
            message: tasks.length 
            ? "Tasks loaded from MongoDB."
            : "No tasks found",
        tasks: tasks.map(toTaskPayload),
        });
    } catch (error){
        return res.status(500).json({
            message: "Unable to load tasks.",
            error: error.message,
        });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, status, owner, priority } = req.body;

        const createdTask = await Task.create({
            title,
            status,
            owner,
            priority,
        });

        return res.status(201).json({
            source: "database",
            message: "Task created successfully.",
            task: toTaskPayload(createdTask),
        });
    }catch (error){
        return res.status(500).json({
            message: "Unable to create task.",
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try{
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new : true,
                runValidators: true,
            }
        );

        if(!updateTask){
            return res.status(404).json({
                message: "Task not found.",
            });
        }
        return res.json({
            source: "database",
            message: "Task updated successfully.",
            task: toTaskPayload(updatedTask),
        });
    }catch (error){
        return res.status(500).json({
            message: "Unable to update task.",
            error: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if(!deleteTask) {
            return res.status(404).json({
                message: "Task not Found.",
            });
        }

        return res.json({
            source: "database",
            message: "Task deleted successfully.",
        });
    }catch (error) { 
        return res.status(500).json({
            message: "Unable to delete task.",
            error: error.message,
        });
    }
};

module.exports = {
    getSampleBoard,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
