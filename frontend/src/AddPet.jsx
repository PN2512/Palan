import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';
import './AddPet.css';

const AddPet = () => {
    const navigate = useNavigate();
    const [petName, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user] = useState({ 
        name: localStorage.getItem('userName') || 'User' 
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleAddPetSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You must be logged in to add a pet.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: petName,
                    species: species,
                    age: age
                }),
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                const data = await response.json();
                alert(`Failed to save pet: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving pet:', error);
            alert('Could not connect to the server');
        }
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
            {/* Reusable Fixed Sidebar */}
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
            
            {/* Main Content Area */}
            <main className='main-content'>
                <header className="dashboard-header">
                    <h1>Add a New Pet 🐾</h1>
                    <p>Tell us a little bit about your companion.</p>
                </header>
                
                <div className='add-pet-card'>
                    <form onSubmit={handleAddPetSubmit}>
                        <div className="add-pet-form-group">
                            <label>Pet Name</label>
                            <input 
                                type="text"
                                placeholder='e.g. Luna'
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                required
                                className="add-pet-input"
                            />
                        </div>
                        <div className='add-pet-form-group'>
                            <label>Species</label>
                            <select 
                                required
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                className="add-pet-input"
                            >
                                <option value="" disabled>Select Species</option>
                                <option value="Dog">🐕‍🦺 Dog</option>
                                <option value="Cat">🐈 Cat</option>
                                <option value="Bird">🦜 Bird</option>
                                <option value="Reptile">🐊 Reptile</option>
                                <option value="Small Animal">🦋 Small Animal</option>
                                <option value="Other">🐚 Other</option>
                            </select>
                        </div>
                        <div className='add-pet-form-group'>
                            <label>Age (in Years)</label>
                            <input 
                                type="number"
                                step="0.1"
                                placeholder='e.g. 2.5'
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="add-pet-input"
                            />
                        </div>
                        
                        <div className="add-pet-actions">
                            <button type="button" className='btn-cancel' onClick={() => navigate('/dashboard')}>
                                Cancel
                            </button>
                            <button type="submit" className='btn-save'>
                                Save Pet Profile
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddPet;