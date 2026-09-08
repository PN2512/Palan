import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Feeding = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedPet, setSelectedPet] = useState('');
    const [time, setTime] = useState('');
    const [food, setFood] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user] = useState({ 
        name: localStorage.getItem('userName') || 'User' 
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const savedSchedules = localStorage.getItem('palan_schedules');
        if (savedSchedules) {
            setSchedules(JSON.parse(savedSchedules));
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
                    if (data.length > 0) setSelectedPet(data[0].name);
                }
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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('palan_pets');
        localStorage.removeItem('palan_schedules');
        localStorage.removeItem('palan_husbandry');
        navigate('/login');
    };

    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className='dashboard-container'>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {/* Fixed Top-Right User Avatar & Dropdown Menu */}
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
                                <select 
                                    className="add-pet-input" 
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={selectedPet}
                                    onChange={(e) => setSelectedPet(e.target.value)}
                                >
                                    {pets.map(pet => (
                                        <option key={pet._id} value={pet.name}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Time</label>
                                <input 
                                    type="time" 
                                    className="add-pet-input" 
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Food Type & Portion</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., 1/2 cup Wet Food" 
                                    className="add-pet-input" 
                                    style={{ marginTop: '5px', width: '100%' }}
                                    value={food}
                                    onChange={(e) => setFood(e.target.value)}
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor:'pointer' }}>
                                + Add Schedule
                            </button>
                        </form>
                    </div>

                    <div className="dash-card">
                        <h3>Upcoming Feedings</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {schedules.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>No schedules added yet.</p>
                            ) : (
                                schedules.map((meal) => (
                                    <div key={meal.id} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        borderLeft: '4px solid #6366f1',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <h4 style={{ margin: '0' }}>{meal.petName}</h4>
                                                <span style={{ fontWeight: 'bold', color: '#818cf8' }}>{meal.time}</span>
                                            </div>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                                                {meal.food}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteSchedule(meal.id)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                border: '1px solid #ef4444',
                                                color: '#f87171',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✔️ Complete
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

export default Feeding;