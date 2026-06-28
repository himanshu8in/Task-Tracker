import React from "react";
import { useTasks } from "../context/TaskContext";
import { ListTodo, Play, AlertCircle, CheckCircle2 } from "lucide-react";

const DashboardStats = () => {
    const { tasks } = useTasks();

    // Calculations
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    
    // Calculate overdue (due date < today, and not completed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => {
        if (t.status === "completed") return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="stats-grid animate-fade-in">
            {/* Total Tasks Card */}
            <div className="glass-container stat-card">
                <div 
                    className="stat-icon-wrapper" 
                    style={{ 
                        background: "rgba(99, 102, 241, 0.12)", 
                        color: "var(--primary)" 
                    }}
                >
                    <ListTodo size={24} />
                </div>
                <div className="stat-info" style={{ flex: 1 }}>
                    <span className="stat-value">{total}</span>
                    <span className="stat-label">Total Tasks</span>
                    <div className="progress-container">
                        <div 
                            className="progress-bar" 
                            style={{ width: `${completionRate}%` }} 
                        />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", fontWeight: "600" }}>
                        {completionRate}% Completed
                    </span>
                </div>
            </div>

            {/* In Progress Card */}
            <div className="glass-container stat-card">
                <div 
                    className="stat-icon-wrapper" 
                    style={{ 
                        background: "rgba(168, 85, 247, 0.12)", 
                        color: "var(--secondary)" 
                    }}
                >
                    <Play size={20} style={{ transform: "rotate(0deg)" }} />
                </div>
                <div className="stat-info">
                    <span className="stat-value">{inProgress}</span>
                    <span className="stat-label">In Progress</span>
                </div>
            </div>

            {/* Overdue Card */}
            <div className="glass-container stat-card">
                <div 
                    className="stat-icon-wrapper" 
                    style={{ 
                        background: overdue > 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(255, 255, 255, 0.05)", 
                        color: overdue > 0 ? "#ef4444" : "var(--text-muted)" 
                    }}
                >
                    <AlertCircle size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-value" style={{ color: overdue > 0 ? "#f87171" : "inherit" }}>
                        {overdue}
                    </span>
                    <span className="stat-label">Overdue Tasks</span>
                </div>
            </div>

            {/* Completed Card */}
            <div className="glass-container stat-card">
                <div 
                    className="stat-icon-wrapper" 
                    style={{ 
                        background: "rgba(34, 197, 94, 0.12)", 
                        color: "var(--completed-text)" 
                    }}
                >
                    <CheckCircle2 size={24} />
                </div>
                <div className="stat-info">
                    <span className="stat-value">{completed}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
