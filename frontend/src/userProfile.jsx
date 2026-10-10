import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from './api';
import './Dashboard.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await API.get('/api/users/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await API.put('/api/users/profile', { name: user.name });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div className='dashboard-container'>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className='main-content' style={{ padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>User Profile 👤</h1>
                    <p>Manage your personal account settings and preferences.</p>
                </header>
                <div className='dashboard-grid'>
                    <div className='dash-card' style={{ maxWidth: '600px', width: '100%' }}>
                        <h3>Account Information</h3>
                        {loading ? <p style={{ marginTop: '20px' }}>Loading profile...</p> : (
                            <form onSubmit={handleUpdateProfile} style={{ marginTop: '20px' }}>
                                {message && <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '6px', background: message.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.includes('success') ? '#4ade80' : '#f87171' }}>{message}</div>}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
                                    <input type="text" className="add-pet-input" style={{ marginTop: '5px', width: '100%' }} value={user.name || ''} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Email Address (Read-only)</label>
                                    <input type="email" className="add-pet-input" style={{ marginTop: '5px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }} value={user.email || ''} disabled />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}>Save Changes</button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;