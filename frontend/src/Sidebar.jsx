import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('palan_pets');
        localStorage.removeItem('palan_schedules');
        localStorage.removeItem('palan_husbandry');
        navigate('/login');
    };

    return (
        <>
            {isSidebarOpen && (
                <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <button className='mobile-toggle-btn' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className='sidebar-logo' style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', marginTop: '60px' }}>
                    <img
                        src={myLogo}
                        alt="Palan Logo"
                        style={{
                            width: '36px', height: '36px', objectFit: 'cover',
                            borderRadius: '50%', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
                        }}
                    />
                    <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#ffffff', marginLeft: '13px', transform: 'translateY(-2px)' }}>
                        Palan
                    </span>
                </div>
                <nav className='nav-links'>
                    <div className={`nav-item ${currentPath === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        🐾 Overview
                    </div>
                    <div className={`nav-item ${currentPath === '/my-pets' ? 'active' : ''}`} onClick={() => navigate('/my-pets')} style={{ cursor: 'pointer' }}>
                        📝 My Pets
                    </div>
                    <div className={`nav-item ${currentPath === '/feeding-schedule' ? 'active' : ''}`} onClick={() => navigate('/feeding-schedule')} style={{ cursor: 'pointer' }}>
                        🍖 Feeding Schedule
                    </div>
                    <div className={`nav-item ${currentPath === '/husbandry-tasks' ? 'active' : ''}`} onClick={() => navigate('/husbandry-tasks')} style={{ cursor: 'pointer' }}>
                        🛁 Husbandry Tasks
                    </div>
                </nav>
                <div className='nav-item logout-btn' onClick={handleLogout}>
                    <span>🚪</span><span style={{ marginLeft: '10px' }}>Log Out</span>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;