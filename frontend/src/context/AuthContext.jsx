import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const AuthContext = createContext();
const API_BASE = "https://task-tracker-9nop.onrender.com/api";
const AUTH_URL = `${API_BASE}/auth`;

export const AuthProvider = ({ children, addToast }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(true);

    // Verify token on application startup
    const checkUser = useCallback(async (authToken) => {
        if (!authToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${AUTH_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            const result = await response.json();

            if (response.ok) {
                setUser(result.data);
            } else {
                // Token invalid
                localStorage.removeItem("token");
                setToken("");
                setUser(null);
            }
        } catch (err) {
            console.error("Token verification failed:", err);
            // Leave local state as is, but stop loading (e.g. offline fallback)
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUser(token);
    }, [token, checkUser]);

    // Local Email/Password Registration
    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("token", result.token);
                setToken(result.token);
                setUser(result.data);
                if (addToast) addToast(`Welcome to FocusFlow, ${result.data.name}!`, "success");
                return { success: true };
            } else {
                throw new Error(result.error || "Registration failed");
            }
        } catch (err) {
            if (addToast) addToast(err.message, "error");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Local Email/Password Login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("token", result.token);
                setToken(result.token);
                setUser(result.data);
                if (addToast) addToast(`Logged in as ${result.data.name}`, "success");
                return { success: true };
            } else {
                throw new Error(result.error || "Login failed");
            }
        } catch (err) {
            if (addToast) addToast(err.message, "error");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Social OAuth Sync Login (Google & GitHub)
    const oauthLogin = async (provider, providerId, email, name, avatar) => {
        setLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}/oauth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ provider, providerId, email, name, avatar })
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("token", result.token);
                setToken(result.token);
                setUser(result.data);
                if (addToast) addToast(`Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, "success");
                return { success: true };
            } else {
                throw new Error(result.error || "OAuth linking failed");
            }
        } catch (err) {
            if (addToast) addToast(err.message, "error");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        if (addToast) addToast("Logged out successfully", "info");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                register,
                login,
                oauthLogin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
