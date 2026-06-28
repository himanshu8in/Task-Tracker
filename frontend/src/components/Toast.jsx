import React from "react";
import { useTasks } from "../context/TaskContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const Toast = () => {
    const { toasts, removeToast } = useTasks();

    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={18} style={{ color: "#22c55e" }} />;
            case "error":
                return <AlertCircle size={18} style={{ color: "#ef4444" }} />;
            case "info":
            default:
                return <Info size={18} style={{ color: "#3b82f6" }} />;
        }
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type}`}
                    role="alert"
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                        {getIcon(toast.type)}
                        <span className="toast-message">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="toast-close"
                            title="Dismiss"
                        >
                            <X size={15} />
                        </button>
                    </div>
                    {/* Linear timer visual indicator */}
                    <div className="toast-progress" />
                </div>
            ))}
        </div>
    );
};

export default Toast;
