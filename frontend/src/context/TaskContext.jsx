import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const TaskContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/tasks`;

export const TaskProvider = ({ children, token }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filters & Sorting States
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    
    // UI Layout & Theme
    const [viewType, setViewType] = useState("kanban");
    const [theme, setTheme] = useState("dark");

    // Toast Notifications State
    const [toasts, setToasts] = useState([]);

    // Helper: build auth headers
    const authHeaders = useCallback(() => {
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    }, [token]);

    // Toast Actions
    const addToast = useCallback((message, type = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Fetch Tasks from API
    const fetchTasks = useCallback(async () => {
        if (!token) return; // Don't fetch if not authenticated
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);
            if (priorityFilter) params.append("priority", priorityFilter);
            if (sortBy) {
                params.append("sortBy", sortBy);
                params.append("order", sortOrder);
            }

            const response = await fetch(`${API_URL}?${params.toString()}`, {
                headers: authHeaders()
            });
            const result = await response.json();
            
            if (response.ok) {
                setTasks(result.data);
            } else {
                throw new Error(result.error || "Failed to fetch tasks");
            }
        } catch (err) {
            setError(err.message);
            addToast(`Error: ${err.message}`, "error");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, priorityFilter, sortBy, sortOrder, addToast, token, authHeaders]);

    // Fetch tasks whenever filters or token change
    useEffect(() => {
        if (!token) {
            setTasks([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            fetchTasks();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchTasks, token]);

    // Create a Task
    const createTask = async (taskData) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(taskData)
            });
            const result = await response.json();

            if (response.ok) {
                setTasks((prev) => [result.data, ...prev]);
                addToast("Task created successfully!", "success");
                return { success: true };
            } else {
                throw new Error(result.error || "Failed to create task");
            }
        } catch (err) {
            addToast(err.message, "error");
            return { success: false, error: err.message };
        }
    };

    // Update an existing Task
    const updateTask = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();

            if (response.ok) {
                setTasks((prev) =>
                    prev.map((task) => (task._id === id ? result.data : task))
                );
                addToast("Task updated successfully!", "success");
                return { success: true };
            } else {
                throw new Error(result.error || "Failed to update task");
            }
        } catch (err) {
            addToast(err.message, "error");
            return { success: false, error: err.message };
        }
    };

    // Update Task Status - Optimistic Update
    const updateTaskStatus = async (id, newStatus) => {
        const originalTasks = [...tasks];
        
        setTasks((prev) =>
            prev.map((task) => (task._id === id ? { ...task, status: newStatus } : task))
        );

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update status on server");
            }
        } catch (err) {
            setTasks(originalTasks);
            addToast(`Could not update status: ${err.message}`, "error");
        }
    };

    // Delete a Task
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            const result = await response.json();

            if (response.ok) {
                setTasks((prev) => prev.filter((task) => task._id !== id));
                addToast("Task deleted successfully!", "success");
                return { success: true };
            } else {
                throw new Error(result.error || "Failed to delete task");
            }
        } catch (err) {
            addToast(err.message, "error");
            return { success: false, error: err.message };
        }
    };

    // Theme toggler
    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            const root = window.document.documentElement;
            if (next === "light") {
                root.classList.add("light-theme");
            } else {
                root.classList.remove("light-theme");
            }
            return next;
        });
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                loading,
                error,
                search,
                setSearch,
                statusFilter,
                setStatusFilter,
                priorityFilter,
                setPriorityFilter,
                sortBy,
                setSortBy,
                sortOrder,
                setSortOrder,
                viewType,
                setViewType,
                theme,
                toggleTheme,
                toasts,
                addToast,
                removeToast,
                fetchTasks,
                createTask,
                updateTask,
                updateTaskStatus,
                deleteTask
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
};
