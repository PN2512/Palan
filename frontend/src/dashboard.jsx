import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from './api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ name: localStorage.getItem('userName') || 'User' });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const savedSchedules = localStorage.getItem('palan_schedules');
            if (savedSchedules) setSchedules(JSON.parse(savedSchedules));

            try {
                const [petRes, taskRes] = await Promise.all([
                    API.get('/api/pets'),
                    API.get('/api/tasks')
                ]);
                setPets(petRes.data);
                setTasks(taskRes.data);
                localStorage.setItem('palan_pets', JSON.stringify(petRes.data));
            } catch (error) {
                console.error("Error connecting to server:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const toggleTaskCompletion = async (taskId) => {
        try {
            const res = await API.patch(`/api/tasks/${taskId}/toggle`);
            setTasks(tasks.map(t => t._id === taskId ? res.data : t));
        } catch (err) {
            console.error('Failed to update task status');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="dashboard-container">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div style={{ position: 'fixed', top: '20px', right: '30px', zIndex: 1100 }}>
                <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                    padding: '6px 14px 6px 6px', borderRadius: '30px', cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '16px'
                    }}>{userInitial}</div>
                    <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500', paddingRight: '5px' }}>{user?.name}</span>
                </div>

                {showProfileMenu && (
                    <div style={{
                        position: 'absolute', top: '55px', right: '0',
                        background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px', padding: '15px', width: '220px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '10px'
                    }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{user?.name}</p>
                        <button onClick={handleLogout} style={{
                            background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none',
                            padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                        }}>Log Out</button>
                    </div>
                )}
            </div>

            <main className='main-content'>
                <header className='dashboard-header'>
                    <h2>Welcome back! 🐣</h2>
                    <p>Here is what is happening with your pet today.</p>
                </header>

                <div className='dashboard-grid'>
                    <div className='dash-card'>
                        <h3>My Pets</h3>
                        <div className='card-content'>
                            {loading ? <p>Loading your pets...</p> : pets.length === 0 ? <p>No pets added yet.</p> : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {pets.map(pet => (
                                        <li key={pet._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{pet.name}</strong>
                                                <span style={{ display: 'block', fontSize: '12px', color: '#cbd5e1' }}>{pet.species}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={() => navigate('/add-pet')} style={{ marginTop: '15px', padding: '10px 15px', borderRadius: '8px', border: 'none', background: "white", color: "#1e1b4b", cursor: "pointer", fontWeight: "bold", width: pets.length > 0 ? '100%': 'auto' }}>
                                + Add a Pet
                            </button>
                        </div>
                    </div>

                    <div className='dash-card'>
                        <h3>Upcoming Feedings</h3>
                        <div className='card-content'>
                            {schedules.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No feeding schedules added yet.</p> : (
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
                            {tasks.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No husbandry tasks logged.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {tasks.map(task => (
                                        <div key={task._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #4ca1af', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task._id)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                                            <div>
                                                <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#94a3b8' : '#fff', fontWeight: 'bold', fontSize: '14px' }}>{task.title}</span>
                                                <span style={{ display: 'block', fontSize: '12px', color: '#7be0f3' }}>Time: {task.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;