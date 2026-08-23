import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
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
                
                {/* --- Header: Logo on the left of the name --- */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '4px' }}>
                        <img 
                            src={myLogo} 
                            alt="Palan Logo" 
                            style={{ 
                                width: '46px', 
                                height: '46px', 
                                objectFit: 'cover',
                                borderRadius: '50%',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.3))' 
                            }} 
                        />
                        <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
                            Palan
                        </h2>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
                        Your Pet Care Companion
                    </p>
                </div>

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

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                    Don't have an account? <a href="/signup" style={{ color: 'white', textDecoration: 'underline', fontWeight: '500' }}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;