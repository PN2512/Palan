import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import Sidebar from './Sidebar';
import './Dashboard.css';

const AddPet = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAddPet = async (e) => {
        e.preventDefault();
        try {
            await API.post('/api/pets', { name, species, age });
            navigate('/my-pets');
        } catch (err) {
            setError('Failed to add pet. Please try again.');
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="main-content" style={{ padding: '40px' }}>
                <header style={{ marginBottom: '30px' }}>
                    <h1>Add a New Pet 🐾</h1>
                    <p>Register a new companion to your dashboard.</p>
                </header>
                <div className="dash-card" style={{ maxWidth: '600px', width: '100%' }}>
                    {error && <div style={{ color: '#f87171', marginBottom: '15px' }}>{error}</div>}
                    <form onSubmit={handleAddPet}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Pet Name</label>
                            <input type="text" className="add-pet-input" style={{ width: '100%', marginTop: '5px' }} value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Species / Type</label>
                            <input type="text" className="add-pet-input" style={{ width: '100%', marginTop: '5px' }} placeholder="e.g., Cat, Dog, Bird" value={species} onChange={(e) => setSpecies(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Age (Optional)</label>
                            <input type="number" className="add-pet-input" style={{ width: '100%', marginTop: '5px' }} value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}>Save Pet</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddPet;