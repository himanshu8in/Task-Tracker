import React from "react";
import { useTasks } from "../context/TaskContext";
import { Calendar, Edit3, Trash2, CheckCircle2, Circle } from "lucide-react";

const TaskCard = ({ task, onEdit }) => {
    const { updateTaskStatus, deleteTask } = useTasks();

    // Clean Date Formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Calculate if task is overdue
    const isOverdue = () => {
        if (task.status === "completed" || !task.dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    // Drag-and-drop handlers
    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", task._id);
        e.dataTransfer.effectAllowed = "move";
        // Visual cue
        e.currentTarget.style.opacity = "0.5";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
    };

    // Fast completion toggle
    const handleToggleComplete = () => {
        const nextStatus = task.status === "completed" ? "pending" : "completed";
        updateTaskStatus(task._id, nextStatus);
    };

    const isTaskOverdue = isOverdue();

    return (
        <div
            className={`glass-container task-card ${task.status === "completed" ? "completed" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="task-header">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", flex: 1 }}>
                    <button
                        onClick={handleToggleComplete}
                        className="task-menu-btn"
                        style={{ padding: 0, marginTop: "2px", opacity: 0.8 }}
                        title={task.status === "completed" ? "Mark Pending" : "Mark Completed"}
                    >
                        {task.status === "completed" ? (
                            <CheckCircle2 size={19} style={{ color: "var(--completed-text)" }} />
                        ) : (
                            <Circle size={19} style={{ color: "var(--text-muted)" }} />
                        )}
                    </button>
                    <h4 className="task-title">{task.title}</h4>
                </div>

                <div className="task-card-menu">
                    <button
                        onClick={() => onEdit(task)}
                        className="task-menu-btn"
                        title="Edit Task"
                    >
                        <Edit3 size={15} />
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this task?")) {
                                deleteTask(task._id);
                            }
                        }}
                        className="task-menu-btn delete"
                        title="Delete Task"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="task-desc">{task.description}</p>
            )}

            <div className="task-footer">
                <div className="task-tags">
                    <span className={`badge badge-${task.priority}`}>
                        {task.priority}
                    </span>
                    <span className={`badge badge-${task.status}`}>
                        {task.status === "in-progress" ? "in progress" : task.status}
                    </span>
                </div>
                
                {task.dueDate && (
                    <div className={`task-date ${isTaskOverdue ? "overdue" : ""}`} title={isTaskOverdue ? "Overdue task!" : "Due Date"}>
                        <Calendar size={13} />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
