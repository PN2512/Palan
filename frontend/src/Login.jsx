import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Palan.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                setError('');
                navigate('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                setError('');
                navigate('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div> 
            <div className="palan-card">
                
                {/* Header with Clean Icon */}
                <div className="palan-header">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffffff' }}>
                        <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 4c-2.8 0-5 2.2-5 5 0 2 1.2 3.7 3 4.5V22h4v-3.5c1.8-.8 3-2.5 3-4.5 0-2.8-2.2-5-5-5z"/>
                    </svg>
                    <span>Palan</span>
                </div>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '-10px', marginBottom: '10px' }}>
                    Your Pet Care Companion
                </p>

                {error && <p style={{ color: '#ffb3b3', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

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
                    <button type="submit" className="palan-btn-login">Sign In</button>
                </form>

                <div className="palan-divider">OR</div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <GoogleLogin
                        text="signin_with" 
                        shape="rectangular"
                        width="330px"
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                    />
                </div>

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                    Don't have an account? <a href="/signup" style={{ color: 'white', textDecoration: 'underline', fontWeight: '500' }}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;