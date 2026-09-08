import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else if (response.status === 401) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: user.name })
            });
            if (response.ok) {
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error connecting to server.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className='dashboard-container'>
            {isSidebarOpen && (
                <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <button className='mobile-toggle-btn' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", paddingLeft: '10px', marginTop: "60px" }}>
                    <img src={myLogo} alt="Palan Logo" style={{
                        width: '36px', height: '36px', objectFit: 'cover',
                        borderRadius: '50%', filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                    }} />
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginLeft: "15px" }}>
                        Palan
                    </span>
                </div>
                <nav className='nav-links'>
                    <div className='nav-item' onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <span>🐾</span><span style={{ marginLeft: "10px" }}>Overview</span>
                    </div>
                    <div className='nav-item' onClick={() => navigate('/my-pets')} style={{ cursor: 'pointer' }}>
                        <span>📝</span><span style={{ marginLeft: "10px" }}>My Pets</span>
                    </div>
                    <div className='nav-item' onClick={() => navigate('/feeding-schedule')} style={{ cursor: 'pointer' }}>
                        <span>🍖</span><span style={{ marginLeft: "10px" }}>Feeding Schedule</span>
                    </div>
                    <div className='nav-item' onClick={() => navigate('/husbandry-tasks')} style={{ cursor: 'pointer' }}>
                        <span>🛁</span><span style={{ marginLeft: "10px" }}>Husbandry Tasks</span>
                    </div>
                    <div className='nav-item active' onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        <span>👤</span><span style={{ marginLeft: "10px" }}>Profile</span>
                    </div>
                </nav>
                <div className='nav-item logout-btn' onClick={handleLogout}>
                    <span>🚪</span><span style={{ marginLeft: '10px' }}>Log Out</span>
                </div>
            </aside>

            <main className='main-content' style={{ padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>User Profile 👤</h1>
                    <p>Manage your personal account settings and preferences.</p>
                </header>

                <div className='dashboard-grid'>
                    <div className='dash-card' style={{ maxWidth: '600px', width: '100%' }}>
                        <h3>Account Information</h3>
                        {loading ? (
                            <p style={{ marginTop: '20px' }}>Loading profile...</p>
                        ) : (
                            <form onSubmit={handleUpdateProfile} style={{ marginTop: '20px' }}>
                                {message && (
                                    <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '6px', background: message.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.includes('success') ? '#4ade80' : '#f87171' }}>
                                        {message}
                                    </div>
                                )}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        className="add-pet-input" 
                                        style={{ marginTop: '5px', width: '100%' }}
                                        value={user.name || ''}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Email Address (Read-only)</label>
                                    <input 
                                        type="email" 
                                        className="add-pet-input" 
                                        style={{ marginTop: '5px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                                        value={user.email || ''}
                                        disabled 
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}>
                                    Save Changes
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// export Profile = null;
export default UserProfile;