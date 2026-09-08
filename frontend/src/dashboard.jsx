import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import Sidebar from './Sidebar'; // 👈 Import the new reusable sidebar
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ 
        name: localStorage.getItem('userName') || 'User', 
        email: '' 
    });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeAlert, setActiveAlert] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // ... (keep your useEffect hooks and handleLogout code here)

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="dashboard-container">
            {/* 1. Reusable Fixed Sidebar */}
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* 2. Top-Right User Profile Badge */}
            <div style={{ position: 'fixed', top: '20px', right: '30px', zIndex: 1100 }}>
                <div 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                        padding: '6px 14px 6px 6px', borderRadius: '30px', cursor: 'pointer',
                        border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                >
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '16px'
                    }}>
                        {userInitial}
                    </div>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500', paddingRight: '5px' }}>
                        {user.name}
                    </span>
                </div>

                {showProfileMenu && (
                    <div style={{
                        position: 'absolute', top: '55px', right: '0',
                        background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px', padding: '15px', width: '220px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '10px'
                    }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{user.name}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>Active Account</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            style={{
                                background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none',
                                padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>

            {/* 3. Feeding & Task Popup Alerts */}
            {activeAlert && (
                <div style={{
                    position: 'fixed', top: '20px', right: '270px',
                    background: activeAlert.alertType === 'feeding' 
                        ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                        : 'linear-gradient(135deg, #0ea5e9, #2dd4bf)',
                    color: '#fff', padding: '20px 25px', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)', zIndex: 1000,
                    animation: 'slideIn 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '280px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '16px' }}>
                            {activeAlert.alertType === 'feeding' ? '🚨 Feeding Time!' : '🛁 Care Task Due!'}
                        </strong>
                        <span style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setActiveAlert(null)}>✕</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        {activeAlert.alertType === 'feeding' 
                            ? `Time to feed ${activeAlert.petName}: ${activeAlert.food}`
                            : `Task for ${activeAlert.petName}: ${activeAlert.taskName}`
                        }
                    </p>
                    <button 
                        onClick={() => {
                            if (activeAlert.alertType === 'feeding') {
                                const updated = schedules.filter(m => m.id !== activeAlert.id);
                                setSchedules(updated);
                                localStorage.setItem('palan_schedules', JSON.stringify(updated));
                            } else {
                                const updated = tasks.filter(t => t.id !== activeAlert.id);
                                setTasks(updated);
                                localStorage.setItem('palan_husbandry', JSON.stringify(updated));
                            }
                            setActiveAlert(null);
                        }}
                        style={{
                            marginTop: '5px', background: '#fff', color: '#1e1b4b',
                            border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        Mark as Done & Dismiss
                    </button>
                </div>
            )}

            {/* 4. Main Content Area */}
            <main className='main-content'>
               {/* Your grid cards go here */}
            </main>
        </div>
    );
};

export default Dashboard;