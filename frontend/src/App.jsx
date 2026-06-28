import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider, useTasks } from "./context/TaskContext";
import DashboardStats from "./components/DashboardStats";
import KanbanBoard from "./components/KanbanBoard";
import TaskFormModal from "./components/TaskFormModal";
import Toast from "./components/Toast";
import Login from "./components/Login";
import { Plus, Search, Moon, Sun, Kanban, List, ArrowUpDown, SlidersHorizontal, LogOut, User } from "lucide-react";

// Dashboard content — renders when authenticated
const DashboardContent = () => {
    const {
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
        toggleTheme
    } = useTasks();

    const { user, logout } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const handleCreateClick = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    // Get user initials for avatar placeholder
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Header Area */}
            <header className="dashboard-header animate-fade-in">
                <div className="logo-section">
                    <h1>FocusFlow</h1>
                    <p>Streamline your workflow with visual project tracking</p>
                </div>
                <div className="header-actions">
                    {/* User Profile Badge */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.375rem 0.875rem 0.375rem 0.375rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)"
                    }}>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "0.7rem",
                                fontWeight: 700
                            }}>
                                {getInitials(user?.name)}
                            </div>
                        )}
                        <span style={{ color: "var(--text-primary)" }}>{user?.name}</span>
                    </div>

                    {/* Theme Toggler */}
                    <button
                        onClick={toggleTheme}
                        className="btn-icon-only"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="btn-icon-only"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>

                    {/* Add Task Button */}
                    <button onClick={handleCreateClick} className="btn btn-primary">
                        <Plus size={18} />
                        <span>Add Task</span>
                    </button>
                </div>
            </header>

            {/* Dashboard Visual Overview Widgets */}
            <DashboardStats />

            {/* Controls, Filters & Sorters */}
            <section className="glass-container controls-bar animate-fade-in">
                {/* Search Bar */}
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter and View Toggles */}
                <div className="filter-groups">
                    {/* Filter by Priority */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <SlidersHorizontal size={14} style={{ color: "var(--text-secondary)" }} />
                        <select
                            className="select-custom"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            title="Filter by Priority"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>

                    {/* Filter by Status */}
                    <select
                        className="select-custom"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        title="Filter by Status"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Sorter */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <select
                            className="select-custom"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            title="Sort by Column"
                        >
                            <option value="createdAt">Date Created</option>
                            <option value="dueDate">Due Date</option>
                            <option value="title">Alphabetical</option>
                            <option value="priority">Priority level</option>
                        </select>
                        <button
                            onClick={toggleSortOrder}
                            className="btn-icon-only"
                            style={{ height: "38px", width: "38px" }}
                            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                        >
                            <ArrowUpDown size={15} style={{
                                transform: sortOrder === "desc" ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform var(--transition-fast)"
                            }} />
                        </button>
                    </div>

                    {/* Layout View Toggle */}
                    <div className="view-toggle">
                        <button
                            className={`view-toggle-btn ${viewType === "kanban" ? "active" : ""}`}
                            onClick={() => setViewType("kanban")}
                            title="Kanban Board View"
                        >
                            <Kanban size={15} />
                            <span>Board</span>
                        </button>
                        <button
                            className={`view-toggle-btn ${viewType === "list" ? "active" : ""}`}
                            onClick={() => setViewType("list")}
                            title="List View"
                        >
                            <List size={15} />
                            <span>List</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Board / Tasks Grid Area */}
            <main>
                <KanbanBoard onEdit={handleEditClick} />
            </main>

            {/* Task Create / Edit Slide-over Modal */}
            {isModalOpen && (
                <TaskFormModal
                    taskToEdit={taskToEdit}
                    onClose={handleCloseModal}
                />
            )}

            {/* Notifications Display Stack */}
            <Toast />
        </div>
    );
};

// Inner shell: handles auth-gated rendering and wires TaskProvider with the JWT token
const AppShell = () => {
    const { user, token, loading } = useAuth();

    // Loading spinner during initial token check
    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                flexDirection: "column",
                gap: "1.25rem"
            }}>
                <div style={{
                    width: "44px",
                    height: "44px",
                    border: "4px solid var(--border-color)",
                    borderTopColor: "var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>Loading FocusFlow...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Unauthenticated → Login/Register view
    if (!user) {
        return <Login />;
    }

    // Authenticated → Dashboard
    return (
        <TaskProvider token={token}>
            <DashboardContent />
        </TaskProvider>
    );
};

// Root App component: wraps everything in AuthProvider
const App = () => {
    return (
        <AuthProvider>
            <AppShell />
        </AuthProvider>
    );
};

export default App;
