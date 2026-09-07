import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeAlert, setActiveAlert] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const savedPets = localStorage.getItem('palan_pets');
            if (savedPets) setPets(JSON.parse(savedPets));

            const savedSchedules = localStorage.getItem('palan_schedules');
            if (savedSchedules) setSchedules(JSON.parse(savedSchedules));

            const savedTasks = localStorage.getItem('palan_husbandry');
            if (savedTasks) setTasks(JSON.parse(savedTasks));

            try {
                const response = await fetch('http://localhost:5000/api/pets', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPets(data);
                    localStorage.setItem('palan_pets', JSON.stringify(data));
                } else if (response.status === 401 || response.status === 400) {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Timer check for both Feedings and Husbandry Tasks
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;

            // Check feeding schedules
            const dueMeal = schedules.find(meal => meal.time === currentTime);
            // Check husbandry tasks
            const dueTask = tasks.find(task => task.time === currentTime);

            if (dueMeal && (!activeAlert || activeAlert.id !== dueMeal.id)) {
                setActiveAlert({ ...dueMeal, alertType: 'feeding' });
            } else if (dueTask && (!activeAlert || activeAlert.id !== dueTask.id)) {
                setActiveAlert({ ...dueTask, alertType: 'husbandry' });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [schedules, tasks, activeAlert]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {activeAlert && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: activeAlert.alertType === 'feeding' 
                        ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                        : 'linear-gradient(135deg, #0ea5e9, #2dd4bf)',
                    color: '#fff',
                    padding: '20px 25px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    zIndex: 1000,
                    animation: 'slideIn 0.4s ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: '280px'
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
                            marginTop: '5px',
                            background: '#fff',
                            color: '#1e1b4b',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Mark as Done & Dismiss
                    </button>
                </div>
            )}

            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <button
               className="mobile-toggle-btn"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className='sidebar-logo' style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' , marginTop:'60px' }}>
                    <img
                        src={myLogo}
                        alt="Palan Logo"
                        style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            filter: 'drop-shadow( 0px 2px 4px rgba(0,0,0,0.3))'
                        }}
                    />
                    <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#ffffff', marginLeft: '13px', transform: 'translateY(-2px)' }}>
                        Palan
                    </span>
                </div>
                <nav className='nav-links'>
                    <div className='nav-item active' onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>🐾 Overview</div>
                    <div className='nav-item' onClick={() => navigate('/my-pets')} style={{cursor:'pointer'}}>📝 My Pets</div>
                    <div className='nav-item' onClick={()=> navigate('/feeding-schedule')} style={{cursor:'pointer'}}>🍖 Feeding Schedule</div>
                    <div className='nav-item' onClick={() => navigate('/husbandry-tasks')} style={{cursor:'pointer'}}>🛁 Husbandry Tasks</div>
                </nav>
                <div className='nav-item logout-btn' onClick={handleLogout}>
                    <span>🚪</span><span style={{ marginLeft: '10px' }}>Log Out</span>
                </div>
            </aside>

            <main className='main-content'>
                <header className='dashboard-header' style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div>
                        <h2>Welcome back! 🐣</h2>
                        <p>Here is what is happening with your pet today.</p>
                    </div>
                </header>

                <div className='dashboard-grid'>
                    <div className='dash-card'>
                        <h3>My Pets</h3>
                        <div className='card-content'>
                            {loading ? (
                                <p>Loading your pets...</p>
                            ) : pets.length === 0 ? (
                                <p>You haven't added any pet profiles yet.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {pets.map(pet => (
                                        <li key={pet._id} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <strong style={{ fontSize: '16px' }}>{pet.name}</strong>
                                                <span style={{ display: 'block', fontSize: '12px', color: '#cbd5e1' }}>
                                                    {pet.species}
                                                </span>
                                            </div>
                                            {pet.age && <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Age: {pet.age}</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button onClick={() => navigate('/add-pet')}
                                style={{
                                    marginTop: '15px', padding: '10px 15px', borderRadius: '8px', border: 'none',
                                    background: "white", color: "#1e1b4b", cursor: "pointer", fontWeight: "bold",
                                    width: pets.length > 0 ? '100%' : 'auto'
                                }}>
                                + Add a Pet
                            </button>
                        </div>
                    </div>

                    <div className='dash-card'>
                        <h3>Upcoming Feedings</h3>
                        <div className='card-content'>
                            {schedules.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No feeding schedules added yet.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {schedules.slice(0, 3).map((meal) => (
                                        <li key={meal.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <strong>{meal.petName}</strong>
                                                <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{meal.time}</span>
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{meal.food}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className='dash-card'>
                        <h3>Husbandry Tasks</h3>
                        <div className='card-content'>
                            {tasks.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No husbandry tasks logged.</p>
                            ) : (
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {tasks.slice(0, 3).map((task) => (
                                        <li key={task.id} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #4ca1af'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <strong>{task.petName}</strong>
                                                <span style={{ color: '#7be0f3', fontWeight: 'bold' }}>{task.time}</span>
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{task.taskName}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;