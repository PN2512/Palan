import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import myLogo from "./assets/logo.png";
import "./Palan.css";
import "./Login.css"; // Uses the same shared CSS styles

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const googleInitialized = useRef(false);

  useEffect(() => {
    if (window.google && !googleInitialized.current) {
      googleInitialized.current = true;

      window.google.accounts.id.initialize({
        client_id:
          "277186421866-cklh2219et2mkub2e5cqoj5dapr9jc7d.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      const btnContainer = document.getElementById("google-signup-btn");
      if (btnContainer) {
        btnContainer.innerHTML = ""; // Clear existing instance
        window.google.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          width: 260,
          text: "continue_with",
        });
      }
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "userName",
          data.name || data.user?.name || "User",
        );
        setError("");
        navigate("/dashboard");
      } else {
        setError(data.message || "Google signup failed");
      }
    } catch (err) {
      setError("Something went wrong with Google authentication.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem(
          "userName",
          data.name || data.user?.name || fullName || "User",
        );
        setError("");
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="palan-card">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "4px",
            }}
          >
            <img
              src={myLogo}
              alt="Palan Logo"
              style={{
                width: "46px",
                height: "46px",
                objectFit: "cover",
                borderRadius: "50%",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.3))",
              }}
            />
            <h2
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "700",
                margin: 0,
                letterSpacing: "0.5px",
              }}
            >
              Create Account
            </h2>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              margin: 0,
            }}
          >
            Join Palan Today 🐾
          </p>
        </div>

        {error && (
          <p
            style={{ color: "#ffb3b3", textAlign: "center", fontSize: "14px" }}
          >
            {error}
          </p>
        )}

        {/* 1. Signup Form First */}
        <form onSubmit={handleSignup} className="palan-input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="palan-input"
          />
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
            Sign Up
          </button>
        </form>

        {/* 2. The OR Divider */}
        <div className="palan-divider">OR</div>

        {/* 3. Google Sign Up Button at the Bottom */}
        <div
          id="google-signup-btn"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
            width: "100%",
          }}
        ></div>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "white",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;