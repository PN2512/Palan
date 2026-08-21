import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Palan.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess('User created successfully! Redirecting to login...');
                setName('');
                setEmail('');
                setPassword('');
                // Optional: redirect to login after 2 seconds
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Network Error', error);
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
                navigate('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong with Google Signup.');
        }
    };

    return (
        <div>
            <div className="palan-card">
                
                {/* Header with Paw Icon */}
                <div className="palan-header">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffffff' }}>
                        <path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 4c-2.8 0-5 2.2-5 5 0 2 1.2 3.7 3 4.5V22h4v-3.5c1.8-.8 3-2.5 3-4.5 0-2.8-2.2-5-5-5z"/>
                    </svg>
                    <span>Create Account</span>
                </div>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '-10px', marginBottom: '10px' }}>
                    Join Palan Today 🐾
                </p>

                {error && <p style={{ color: '#ffb3b3', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
                {success && <p style={{ color: '#b3ffb3', textAlign: 'center', fontSize: '14px' }}>{success}</p>}

                <form onSubmit={handleSignup} className="palan-input-group">
                    <input 
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    <button type="submit" className="palan-btn-login">Sign Up</button>
                </form>

                <div className="palan-divider">OR</div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <GoogleLogin
                        text="signup_with" 
                        shape="rectangular"
                        width="330px"
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Signup Failed')}
                    />
                </div>

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                    Already have an account? <a href="/login" style={{ color: 'white', textDecoration: 'underline', fontWeight: '500' }}>Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;