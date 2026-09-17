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
    const [taskTime, setTaskTime] = useState('08:00'); // 👈 Added time state for backend popup triggers
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const cachedPets = localStorage.getItem('palan_pets');
        if (cachedPets) {
            const parsed = JSON.parse(cachedPets);
            setPets(parsed);
            if (parsed.length > 0) setSelectedPet(parsed[0].name);
        }
        
        const fetchTasksAndPets = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                // Fetch backend tasks
                const taskRes = await fetch('http://localhost:5000/api/tasks', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (taskRes.ok) {
                    const taskData = await taskRes.json();
                    setTasks(taskData);
                }

                // Fetch pets
                const petRes = await fetch('http://localhost:5000/api/pets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (petRes.ok) {
                    const petData = await petRes.json();
                    setPets(petData);
                    localStorage.setItem('palan_pets', JSON.stringify(petData));
                    if (petData.length > 0 && !selectedPet) setSelectedPet(petData[0].name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTasksAndPets();
    }, []);

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/toggle`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // Remove or filter out completed task from state
                const updatedTasks = tasks.filter(task => task._id !== taskId);
                setTasks(updatedTasks);
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!taskName) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 👈 Fixed template literal quotes here
                },
                body: JSON.stringify({
                    petId: selectedPet || 'General Care', 
                    title: taskName,
                    time: taskTime // 👈 Sends selected time for dashboard popups
                })
            });

            if (response.ok) {
                const savedTask = await response.json();
                setTasks([savedTask, ...tasks]);

                // Reset form fields
                setTaskName('');
                setFrequency('');
                setTaskTime('08:00');
            } else {
                console.error('Failed to save task to backend');
            }
        } catch (error) {
            console.error('Error connecting to server:', error); // 👈 Fixed typo: console.erro -> console.error
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
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Reminder Time</label>
                                <input
                                    type="time"
                                    className='add-pet-input'
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={taskTime}
                                    onChange={(e) => setTaskTime(e.target.value)}
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
                                    <div key={task._id || task.id} style={{
                                        background: "rgba(255,255,255,0.05)",
                                        padding: '15px',
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #4ca1af',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
    <h4 style={{ margin: '0' }}>{task.petName || 'General Care'}</h4>
    <span style={{ 
        fontSize: '12px', 
        color: '#7be0f3', 
        background: 'rgba(255,255,255,0.1)', 
        padding: '2px 8px', 
        borderRadius: '4px',
        whiteSpace: 'nowrap' // 👈 This prevents "Time:" and the numbers from breaking into two lines
    }}>
        Time: {task.time}
    </span>
</div>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                                {task.title || task.taskName}
                                            </p>
                                        </div>

                                        <button onClick={() => handleDeleteTask(task._id)}
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