const Task = require("../models/Task");

const toTaskPayload = (task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    owner: task.owner,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
});

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        return res.json({
            message: tasks.length ? "Tasks loaded Successfully" : "No tasks found.",
            tasks: tasks.map(toTaskPayload),
        });
    }catch (error){
        return res.status(500).json({
            message: "Unable to load tasks.",
            error: error.message,
        });
    }
};

const createTask = async (req, res) => {
    try{
        const { title, description, status, owner, priority, dueDate } = req.body;

        if(!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required."
            });
        }

        const createdTask = await Task.create({
            title,
            description,
            status,
            owner,
            priority,
            dueDate,
        });

        return res.status(201).json({
            message: "Task created Successfully.",
            task: toTaskPayload(createdTask),
        });
    } catch (error){
        return res.status(500).json({
            message: "Unable to create Task.",
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        if("title" in req.body && !req.body.title.trim()){
            return res.status(400).json({
                message: "Title cannot be empty.",
            });
        }
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!updatedTask){
            return res.status(404).json({
                message: "Task not found.",
            });
        }

        return res.json({
            message: "Task updated Successfully.",
            task: toTaskPayload(updatedTask),
        });
    }catch (error) {
        return res.status(500).json({
            message: "Unable to update task.",
            error: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if(!deletedTask){
            return res.status(404).json({
                message: "Task not found.",
            });
        }

        return res.json({
            message: "Task deleted Successfully.",
        });
    }catch (error) {
        return res.status(500).json({
            message: "Unable to delete task.",
            error: error.message,
        });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};