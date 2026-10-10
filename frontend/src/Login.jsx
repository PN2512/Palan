import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Palan.css';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || "https://palan-mp3q.onrender.com";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const googleInitialized = useRef(false);

    // 1. Initialize Google Auth on mount
    useEffect(() => {
        if (window.google && !googleInitialized.current) {
            googleInitialized.current = true;

            window.google.accounts.id.initialize({
                client_id: "277186421866-i1u9eivhk8tv7pfe5j4m55j8vu5q9mve.apps.googleusercontent.com",
                callback: handleGoogleResponse,
            });

            const btnContainer = document.getElementById("google-login-btn");
            if (btnContainer) {
                btnContainer.innerHTML = "";
                window.google.accounts.id.renderButton(btnContainer, {
                    theme: "outline",
                    size: "large",
                    width: 260,
                    text: "signin_with",
                });
            }
        }
    }, []);

    // 2. Handle Google Response
    const handleGoogleResponse = async (response) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userName", data.name || data.user?.name || "User");
                setError("");
                navigate("/dashboard");
            } else {
                setError(data.message || "Google login failed");
            }
        } catch (err) {
            setError("Something went wrong with Google authentication.");
        }
    };

    // 3. Handle standard email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userName', data.user?.name || 'User');
                setError('');
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="palan-card">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "4px" }}>
                        <img src={myLogo} alt="Palan Logo" style={{ width: "46px", height: "46px", objectFit: "cover", borderRadius: "50%", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.3))" }} />
                        <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: 0, letterSpacing: "0.5px" }}>
                            Palan
                        </h2>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>
                        Your Pet Care Companion
                    </p>
                </div>

                {error && <p style={{ color: "#ffb3b3", textAlign: "center", fontSize: "14px" }}>{error}</p>}

                <form onSubmit={handleLogin} className="palan-input-group">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="palan-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="palan-input"
                    />
                    <button type="submit" className="palan-btn-login">
                        Sign In
                    </button>
                </form>

                <div className="palan-divider">OR</div>

                <div id="google-login-btn" style={{ display: "flex", justifyContent: "center", marginTop: "15px", width: "100%" }}></div>

                <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "24px" }}>
                    Don't have an account? <a href="/signup" style={{ color: "white", textDecoration: "underline", fontWeight: "500" }}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;