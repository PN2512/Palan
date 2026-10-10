import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from './api';
import './Dashboard.css';

const Feeding = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [time, setTime] = useState('');
    const [food, setFood] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const savedSchedules = localStorage.getItem('palan_schedules');
        if (savedSchedules) setSchedules(JSON.parse(savedSchedules));

        const fetchPets = async () => {
            try {
                const response = await API.get('/api/pets');
                setPets(response.data);
                if (response.data.length > 0) setSelectedPet(response.data[0].name);
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        };
        fetchPets();
    }, []);

    const handleDeleteSchedule = (id) => {
        const updatedSchedules = schedules.filter(meal => meal.id !== id);
        setSchedules(updatedSchedules);
        localStorage.setItem('palan_schedules', JSON.stringify(updatedSchedules));
    };

    const handleAddSchedule = (e) => {
        e.preventDefault();
        if (!time || !food) return;
        const newMeal = {
            id: Date.now().toString(),
            petName: selectedPet || (pets[0] ? pets[0].name : 'Pet'),
            time,
            food,
            portion: 'Standard portion'
        };
        const updatedSchedules = [newMeal, ...schedules];
        setSchedules(updatedSchedules);
        localStorage.setItem('palan_schedules', JSON.stringify(updatedSchedules));
        setTime('');
        setFood('');
    };

    return (
        <div className='dashboard-container'>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className='main-content' style={{ padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>Feeding Schedule 🍲</h1>
                    <p>Keep track of meal times and portions for your companions.</p>
                </header>
                <div className="dashboard-grid">
                    <div className="dash-card">
                        <h3>Schedule a Meal</h3>
                        <form onSubmit={handleAddSchedule} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Select Pet</label>
                                <select className="add-pet-input" style={{ marginTop: '5px', width: '100%' }} value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)}>
                                    {pets.map(pet => <option key={pet._id} value={pet.name}>{pet.name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Time</label>
                                <input type="time" className="add-pet-input" style={{ marginTop: '5px', width: '100%' }} value={time} onChange={(e) => setTime(e.target.value)} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Food Type & Portion</label>
                                <input type="text" placeholder="e.g., 1/2 cup Wet Food" className="add-pet-input" style={{ marginTop: '5px', width: '100%' }} value={food} onChange={(e) => setFood(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor:'pointer' }}>+ Add Schedule</button>
                        </form>
                    </div>
                    <div className="dash-card">
                        <h3>Upcoming Feedings</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {schedules.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No schedules added yet.</p> : schedules.map((meal) => (
                                <div key={meal.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0' }}>{meal.petName} <span style={{ fontWeight: 'bold', color: '#818cf8', marginLeft: '10px' }}>{meal.time}</span></h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{meal.food}</p>
                                    </div>
                                    <button onClick={() => handleDeleteSchedule(meal.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✔️ Complete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feeding;