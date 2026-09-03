import React, { useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png'; // Imported circular logo
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
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Network Error', error);
            setError('Something went wrong. Please try again.');
        }
    };

    // const handleGoogleSuccess = async (credentialResponse) => {
    //     try {
    //         const response = await fetch('http://localhost:5000/api/auth/google', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ credential: credentialResponse.credential }),
    //         });
    //         const data = await response.json();

    //         if (response.ok) {
    //             localStorage.setItem('authToken', data.token);
    //             navigate('/dashboard');
    //         } else {
    //             setError(data.message);
    //         }
    //     } catch (error) {
    //         setError('Something went wrong with Google Signup.');
    //     }
    // };

    return (
        <div>
            <div className="palan-card">
                
                {/* --- Header with Circular Logo on the Left --- */}
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
                        <h2 style={{ color: '#ffffff', fontSize: '26px', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
                            Create Account
                        </h2>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
                        Join Palan Today 🐾
                    </p>
                </div>

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

                {/* <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <GoogleLogin
                        text="signup_with" 
                        shape="rectangular"
                        width="330px"
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Signup Failed')}
                    />
                </div> */}

                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                    Already have an account? <a href="/login" style={{ color: 'white', textDecoration: 'underline', fontWeight: '500' }}>Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;