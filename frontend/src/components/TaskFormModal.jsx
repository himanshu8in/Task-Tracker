import React, { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { X } from "lucide-react";

const TaskFormModal = ({ taskToEdit, onClose }) => {
    const { createTask, updateTask } = useTasks();

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");

    // Validation errors
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format ISO string to YYYY-MM-DD
    const formatDateForInput = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Load initial values if editing
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || "");
            setDescription(taskToEdit.description || "");
            setStatus(taskToEdit.status || "pending");
            setPriority(taskToEdit.priority || "medium");
            setDueDate(formatDateForInput(taskToEdit.dueDate));
        } else {
            // Set default date to today
            const todayStr = formatDateForInput(new Date());
            setDueDate(todayStr);
        }
    }, [taskToEdit]);

    // Validation
    const validate = () => {
        const newErrors = {};
        if (!title.trim()) {
            newErrors.title = "Task title is required";
        } else if (title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters long";
        } else if (title.trim().length > 100) {
            newErrors.title = "Title cannot exceed 100 characters";
        }

        if (!dueDate) {
            newErrors.dueDate = "Due date is required";
        }

        if (description && description.length > 500) {
            newErrors.description = "Description cannot exceed 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        const taskData = {
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            dueDate
        };

        let result;
        if (taskToEdit) {
            result = await updateTask(taskToEdit._id, taskData);
        } else {
            result = await createTask(taskData);
        }

        setIsSubmitting(false);
        if (result.success) {
            onClose();
        } else {
            // Handle server validation messages mapped back to form
            if (result.error) {
                setErrors({ server: result.error });
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        {taskToEdit ? "Edit Task" : "Create New Task"}
                    </h3>
                    <button onClick={onClose} className="modal-close-btn" title="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {errors.server && (
                        <div className="validation-error" style={{ padding: "0.5rem", background: "rgba(239,68,68,0.1)", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem" }}>
                            {errors.server}
                        </div>
                    )}

                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="task-title">Title *</label>
                        <input
                            type="text"
                            id="task-title"
                            className="form-input"
                            placeholder="e.g. Design Landing Page"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                            }}
                            maxLength={100}
                            required
                        />
                        {errors.title && <span className="validation-error">{errors.title}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="task-desc">Description</label>
                        <textarea
                            id="task-desc"
                            className="form-textarea"
                            placeholder="Provide details about the task..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                            }}
                            maxLength={500}
                        />
                        {errors.description && <span className="validation-error">{errors.description}</span>}
                    </div>

                    {/* Form Grid */}
                    <div className="form-grid-2">
                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="task-status">Status</label>
                            <select
                                id="task-status"
                                className="select-custom"
                                style={{ width: "100%" }}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                className="select-custom"
                                style={{ width: "100%" }}
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="task-date">Due Date *</label>
                        <input
                            type="date"
                            id="task-date"
                            className="form-input"
                            value={dueDate}
                            onChange={(e) => {
                                setDueDate(e.target.value);
                                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: "" }));
                            }}
                            required
                        />
                        {errors.dueDate && <span className="validation-error">{errors.dueDate}</span>}
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-footer-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : taskToEdit ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormModal;
