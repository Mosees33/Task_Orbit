const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Backlog", "In Progress", "Done"],
            default: "Backlog",
        },
        owner: {
            type: String,
            default: "Team",
            trim: true,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        dueDate: { 
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);
