import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';

const HusbandryTasks = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [taskName, setTaskName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const cachedPets = localStorage.getItem('palan_pets');
        if (cachedPets) {
            const parsed = JSON.parse(cachedPets);
            setPets(parsed);
            if (parsed.length > 0) setSelectedPet(parsed[0].name);
        }
        
        const savedTasks = localStorage.getItem('palan_husbandry');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        } else {
            setTasks([
                { id: '1', petName: 'All Pets', taskName: 'Clean enclosure / Living space', frequency: 'Daily' },
                { id: '2', petName: 'All Pets', taskName: 'Check water and supplements', frequency: 'Daily' }
            ]);
        }

        const fetchPets = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/pets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPets(data);
                    localStorage.setItem('palan_pets', JSON.stringify(data));
                    if (data.length > 0 && !selectedPet) setSelectedPet(data[0].name);
                }
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };
        fetchPets();
    }, []);

    const handleDeleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('palan_husbandry', JSON.stringify(updatedTasks));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!taskName) return;

        const newTask = {
            id: Date.now().toString(),
            petName: selectedPet || 'General Care',
            taskName,
            frequency: frequency || 'As needed'
        };

        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        localStorage.setItem('palan_husbandry', JSON.stringify(updatedTasks));

        setTaskName('');
        setFrequency('');
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
                    <div className='nav-item active' onClick={() => navigate('/husbandry-tasks')} style={{ cursor: 'pointer' }}>
                        <span>🛁</span><span style={{ marginLeft: "10px" }}>Husbandry Tasks</span>
                    </div>
                </nav>
                <div className='nav-item logout-btn' onClick={handleLogout}>
                    <span>🚪</span><span style={{ marginLeft: '10px' }}>Log Out</span>
                </div>
            </aside>

            <main className='main-content' style={{ padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>Husbandry Tasks 🛁</h1>
                    <p>Organize enclosure upkeep, habitat maintenance, and health logs.</p>
                </header>

                <div className='dashboard-grid'>
                    <div className='dash-card'>
                        <h3>Add Care Task</h3>
                        <form onSubmit={handleAddTask} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Target Pet / Scope</label>
                                <select
                                    className='add-pet-input'
                                    style={{ marginTop: '5px', width: "100%" }}
                                    value={selectedPet}
                                    onChange={(e) => setSelectedPet(e.target.value)}
                                >
                                    <option value="General Care">General / All Pets</option>
                                    {pets.map(pet => (
                                        <option key={pet._id || pet.name} value={pet.name}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                    Task Description
                                </label>
                                <input
                                    type="text"
                                    placeholder='e.g., Deep clean terrarium tank'
                                    className='add-pet-input'
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Frequency</label>
                                <input
                                    type='text'
                                    placeholder='e.g., Bi-weekly, Daily'
                                    className='add-pet-input'
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}>
                                + Add Task
                            </button>
                        </form>
                    </div>

                    <div className='dash-card'>
                        <h3>Active Maintenance Routines</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {tasks.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No husbandry tasks logged.</p>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} style={{
                                        background: "rgba(255,255,255,0.05)",
                                        padding: '15px',
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #4ca1af',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <h4 style={{ margin: '0' }}>{task.petName}</h4>
                                                <span style={{ fontSize: '12px', color: '#7be0f3', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {task.frequency}
                                                </span>
                                            </div>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                                {task.taskName}
                                            </p>
                                        </div>

                                        <button onClick={() => handleDeleteTask(task.id)}
                                            style={{
                                                background: 'rgba(76,161,175,0.2)',
                                                border: '1px solid #4ca1af',
                                                color: "#7be0f3",
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HusbandryTasks;