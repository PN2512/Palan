import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from './api';
import './Dashboard.css';

const HusbandryTasks = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskTime, setTaskTime] = useState('08:00');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchTasksAndPets = async () => {
            try {
                const [taskRes, petRes] = await Promise.all([
                    API.get('/api/tasks'),
                    API.get('/api/pets')
                ]);
                setTasks(taskRes.data);
                setPets(petRes.data);
                if (petRes.data.length > 0) setSelectedPet(petRes.data[0].name);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTasksAndPets();
    }, []);

    const handleDeleteTask = async (taskId) => {
        try {
            await API.patch(`/api/tasks/${taskId}/toggle`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!taskName) return;
        try {
            const response = await API.post('/api/tasks', {
                petId: selectedPet || 'General Care',
                title: taskName,
                time: taskTime
            });
            setTasks([response.data, ...tasks]);
            setTaskName('');
            setTaskTime('08:00');
        } catch (error) {
            console.error('Error connecting to server:', error);
        }
    };

    return (
        <div className='dashboard-container'>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
                                <select className='add-pet-input' style={{ marginTop: '5px', width: "100%" }} value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
                                    <option value="General Care">General / All Pets</option>
                                    {pets.map(pet => <option key={pet._id} value={pet.name}>{pet.name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Task Description</label>
                                <input type="text" placeholder='e.g., Deep clean terrarium tank' className='add-pet-input' style={{ marginTop: '5px', width: '100%' }} value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Reminder Time</label>
                                <input type="time" className='add-pet-input' style={{ marginTop: '5px', width: '100%' }} value={taskTime} onChange={(e) => setTaskTime(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}>+ Add Task</button>
                        </form>
                    </div>
                    <div className='dash-card'>
                        <h3>Active Maintenance Routines</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {tasks.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No husbandry tasks logged.</p> : tasks.map((task) => (
                                <div key={task._id} style={{ background: "rgba(255,255,255,0.05)", padding: '15px', borderRadius: '12px', borderLeft: '4px solid #4ca1af', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0' }}>{task.petName || 'General Care'} <span style={{ fontSize: '12px', color: '#7be0f3', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', marginLeft: '10px' }}>Time: {task.time}</span></h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{task.title}</p>
                                    </div>
                                    <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'rgba(76,161,175,0.2)', border: '1px solid #4ca1af', color: "#7be0f3", padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Done</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HusbandryTasks;