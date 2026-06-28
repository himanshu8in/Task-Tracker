const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: ""
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "in-progress", "completed"],
                message: "Status must be pending, in-progress, or completed"
            },
            default: "pending"
        },
        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"],
                message: "Priority must be low, medium, or high"
            },
            default: "medium"
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", TaskSchema);
