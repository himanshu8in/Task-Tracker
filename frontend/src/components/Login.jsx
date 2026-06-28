import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Login = () => {
    const { login, register, oauthLogin } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Form validation and state
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sandbox OAuth loading simulator state
    const [simulatingOAuth, setSimulatingOAuth] = useState(null); // 'google' or 'github' or null

    // Client validation
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (isSignUp && !name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (isSignUp) {
            if (!confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        let result;
        if (isSignUp) {
            result = await register(name.trim(), email.trim(), password);
        } else {
            result = await login(email.trim(), password);
        }
        setIsSubmitting(false);

        if (!result.success && result.error) {
            setErrors({ server: result.error });
        }
    };

    // Simulated Social logins for Sandbox testing
    const handleOAuthClick = (provider) => {
        setSimulatingOAuth(provider);

        // Simulate a popup auth delay of 2 seconds
        setTimeout(async () => {
            let mockProfile = {};
            if (provider === "google") {
                mockProfile = {
                    provider: "google",
                    providerId: `g_${Math.floor(Math.random() * 1000000)}`,
                    name: "Alex Mercer",
                    email: "alex.mercer@gmail.com",
                    avatar: "https://lh3.googleusercontent.com/a/default-user"
                };
            } else {
                mockProfile = {
                    provider: "github",
                    providerId: `git_${Math.floor(Math.random() * 1000000)}`,
                    name: "CodeCraft Dev",
                    email: "dev.coder@github.com",
                    avatar: "https://avatars.githubusercontent.com/u/9919?v=4"
                };
            }

            const result = await oauthLogin(
                mockProfile.provider,
                mockProfile.providerId,
                mockProfile.email,
                mockProfile.name,
                mockProfile.avatar
            );

            setSimulatingOAuth(null);
            if (!result.success && result.error) {
                setErrors({ server: result.error });
            }
        }, 1800);
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1.5rem"
        }}>
            <div className="glass-container animate-fade-in" style={{
                width: "100%",
                maxWidth: "420px",
                padding: "2.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem"
            }}>
                {/* Auth Heading */}
                <div style={{ textAlign: "center" }}>
                    <h2 style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2rem",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 70%, var(--secondary) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.03em"
                    }}>
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        {isSignUp ? "Sign up to start organizing tasks" : "Sign in to access your dashboard"}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="view-toggle" style={{ width: "100%", padding: "0.25rem" }}>
                    <button
                        className={`view-toggle-btn ${!isSignUp ? "active" : ""}`}
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => {
                            setIsSignUp(false);
                            setErrors({});
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`view-toggle-btn ${isSignUp ? "active" : ""}`}
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={() => {
                            setIsSignUp(true);
                            setErrors({});
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {errors.server && (
                    <div className="validation-error" style={{
                        padding: "0.625rem",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center"
                    }}>
                        {errors.server}
                    </div>
                )}

                {/* Credentials Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {isSignUp && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="auth-name">Full Name</label>
                            <div style={{ position: "relative" }}>
                                <User size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <input
                                    type="text"
                                    id="auth-name"
                                    className="form-input"
                                    style={{ paddingLeft: "2.5rem" }}
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            {errors.name && <span className="validation-error">{errors.name}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="auth-email">Email Address</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="email"
                                id="auth-email"
                                className="form-input"
                                style={{ paddingLeft: "2.5rem" }}
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && <span className="validation-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="auth-pass">Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input
                                type="password"
                                id="auth-pass"
                                className="form-input"
                                style={{ paddingLeft: "2.5rem" }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <span className="validation-error">{errors.password}</span>}
                    </div>

                    {isSignUp && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="auth-confirm">Confirm Password</label>
                            <div style={{ position: "relative" }}>
                                <Lock size={18} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                                <input
                                    type="password"
                                    id="auth-confirm"
                                    className="form-input"
                                    style={{ paddingLeft: "2.5rem" }}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {errors.confirmPassword && <span className="validation-error">{errors.confirmPassword}</span>}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                        disabled={isSubmitting}
                    >
                        <span>{isSubmitting ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                {/* Divider */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    margin: "0.5rem 0"
                }}>
                    <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
                    <span>or continue with</span>
                    <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
                </div>

                {/* OAuth Provider Triggers */}
                <div style={{ display: "flex", gap: "1rem" }}>
                    {/* Google Button */}
                    <button
                        onClick={() => handleOAuthClick("google")}
                        className="btn btn-secondary"
                        style={{ flex: 1, gap: "0.625rem" }}
                        disabled={isSubmitting}
                    >
                        {/* Google custom SVG */}
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Google</span>
                    </button>

                    {/* GitHub Button */}
                    <button
                        onClick={() => handleOAuthClick("github")}
                        className="btn btn-secondary"
                        style={{ flex: 1, gap: "0.625rem" }}
                        disabled={isSubmitting}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>GitHub</span>
                    </button>
                </div>
            </div>

            {/* Sandbox OAuth Simulation Dialog */}
            {simulatingOAuth && (
                <div className="modal-overlay" style={{ backdropFilter: "blur(4px)", zIndex: 1200 }}>
                    <div className="glass-container animate-fade-in" style={{
                        background: "var(--bg-modal)",
                        padding: "2rem",
                        width: "90%",
                        maxWidth: "360px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1.25rem"
                    }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            border: "3px solid var(--border-color)",
                            borderTopColor: simulatingOAuth === "google" ? "#4285F4" : "var(--text-primary)",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite"
                        }} />
                        <div>
                            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600 }}>
                                Signing in with {simulatingOAuth === "google" ? "Google" : "GitHub"}
                            </h4>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                                [Sandbox Mock OAuth Flow] Connecting to secure profile servers...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
