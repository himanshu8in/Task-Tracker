import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";
import { Circle, Play, CheckCircle2, Inbox, Calendar, Edit3, Trash2 } from "lucide-react";

const KanbanBoard = ({ onEdit }) => {
    const { tasks, loading, viewType, updateTaskStatus, deleteTask } = useTasks();
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Columns config
    const columns = [
        { id: "pending", title: "Pending", icon: <Circle size={18} style={{ color: "var(--text-secondary)" }} /> },
        { id: "in-progress", title: "In Progress", icon: <Play size={18} style={{ color: "var(--progress-text)" }} /> },
        { id: "completed", title: "Completed", icon: <CheckCircle2 size={18} style={{ color: "var(--completed-text)" }} /> }
    ];

    // Drag-and-drop column handlers
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (columnId) => {
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        setDragOverColumn(null);
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) {
            updateTaskStatus(taskId, columnId);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid var(--border-color)",
                    borderTopColor: "var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="glass-container empty-state animate-fade-in">
                <Inbox className="empty-state-icon" />
                <h3>No Tasks Found</h3>
                <p>Create a new task, search for a different query, or clear your filters to get started.</p>
            </div>
        );
    }

    // Render Kanban Board View
    if (viewType === "kanban") {
        return (
            <div className="kanban-grid animate-fade-in">
                {columns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.id);
                    const isOver = dragOverColumn === col.id;

                    return (
                        <div
                            key={col.id}
                            className="kanban-column"
                            onDragOver={handleDragOver}
                            onDragEnter={() => handleDragEnter(col.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className="column-header">
                                <span className="column-title">
                                    {col.icon}
                                    {col.title}
                                </span>
                                <span className="column-badge">{colTasks.length}</span>
                            </div>

                            <div className={`column-cards-container ${isOver ? "drag-over" : ""}`}>
                                {colTasks.map((task) => (
                                    <TaskCard key={task._id} task={task} onEdit={onEdit} />
                                ))}
                                {colTasks.length === 0 && (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100px",
                                        color: "var(--text-muted)",
                                        fontSize: "0.85rem",
                                        border: "1px dashed var(--border-color)",
                                        borderRadius: "var(--radius-md)"
                                    }}>
                                        Drag tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Clean Date Formatting for List View
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Calculate if task is overdue for List View
    const isOverdue = (task) => {
        if (task.status === "completed" || !task.dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    // Render List View
    return (
        <div className="list-container animate-fade-in">
            {tasks.map((task) => {
                const isTaskOverdue = isOverdue(task);
                return (
                    <div
                        key={task._id}
                        className={`glass-container task-list-item ${task.status === "completed" ? "completed" : ""}`}
                    >
                        <div className="list-item-main">
                            <button
                                className={`list-item-checkbox ${task.status === "completed" ? "checked" : ""}`}
                                onClick={() => {
                                    const nextStatus = task.status === "completed" ? "pending" : "completed";
                                    updateTaskStatus(task._id, nextStatus);
                                }}
                                title={task.status === "completed" ? "Mark Pending" : "Mark Completed"}
                            >
                                {task.status === "completed" && <CheckCircle2 size={16} />}
                            </button>
                            
                            <div className="list-item-content">
                                <h4 
                                    className="list-item-title" 
                                    style={{ 
                                        textDecoration: task.status === "completed" ? "line-through" : "none",
                                        color: task.status === "completed" ? "var(--text-muted)" : "var(--text-primary)"
                                    }}
                                >
                                    {task.title}
                                </h4>
                                {task.description && (
                                    <span className="list-item-desc">{task.description}</span>
                                )}
                            </div>
                        </div>

                        <div className="list-item-details">
                            <span className={`badge badge-${task.priority}`}>
                                {task.priority}
                            </span>
                            <span className={`badge badge-${task.status}`}>
                                {task.status === "in-progress" ? "in progress" : task.status}
                            </span>

                            {task.dueDate && (
                                <div 
                                    className={`task-date ${isTaskOverdue ? "overdue" : ""}`}
                                    style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                                >
                                    <Calendar size={13} />
                                    <span>{formatDate(task.dueDate)}</span>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "0.25rem", marginLeft: "0.5rem" }}>
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
                    </div>
                );
            })}
        </div>
    );
};

export default KanbanBoard;
