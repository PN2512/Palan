import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from './api';
import myLogo from './assets/logo.png';
import './Dashboard.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/api/auth/login', { email, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userName', response.data.name || 'User');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: "277186421866-i1u9eivhk8tv7pfe5j4m55j8vu5q9mve.apps.googleusercontent.com",
                callback: async (response) => {
                    try {
                        const res = await API.post('/api/auth/google', { token: response.credential });
                        localStorage.setItem('authToken', res.data.token);
                        localStorage.setItem('userName', res.data.name || 'User');
                        navigate('/dashboard');
                    } catch (err) {
                        setError('Google authentication failed on server.');
                    }
                }
            });

            google.accounts.id.renderButton(
                document.getElementById("google-signin-btn"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    }, [navigate]);

    return (
        <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="dash-card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <img src={myLogo} alt="Palan Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '10px' }} />
                    <h2>Welcome to Palan 🐾</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Sign in to manage your pets and schedules</p>
                </div>

                {error && <div style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Email Address</label>
                        <input type="email" className="add-pet-input" style={{ width: '100%', marginTop: '5px' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Password</label>
                        <input type="password" className="add-pet-input" style={{ width: '100%', marginTop: '5px' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', cursor: 'pointer', marginBottom: '15px' }}>Sign In</button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <div id="google-signin-btn"></div>
                </div>

                <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '15px' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#818cf8', fontWeight: 'bold' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;