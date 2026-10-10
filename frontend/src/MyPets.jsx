import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from './api';
import './MyPets.css';
import './Dashboard.css';

const MyPets = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await API.get('/api/pets');
                setPets(response.data);
            } catch (error) {
                console.error('Failed to fetch pets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this pet profile?")) return;
        try {
            await API.delete(`/api/pets/${id}`);
            setPets(pets.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="main-content" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1>My Pets 🐾</h1>
                        <p>Manage all your registered pet profiles in one place.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Dashboard</button>
                        <button onClick={() => navigate('/add-pet')} className="btn-primary">+ Add New Pet</button>
                    </div>
                </div>
                {loading ? <p>Loading your pets...</p> : pets.length === 0 ? (
                    <div className="dash-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No pets found. Start by adding your first companion!</p>
                        <button onClick={() => navigate('/add-pet')} className="btn-primary" style={{ marginTop: '15px' }}>Add a Pet</button>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {pets.map(pet => (
                            <div key={pet._id} className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {pet.name}
                                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '6px' }}>{pet.species}</span>
                                    </h3>
                                    <div className="card-content" style={{ marginTop: '10px' }}>
                                        <p><strong>Age: </strong>{pet.age ? `${pet.age} years old` : 'Not specified'}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(pet._id)} className="btn-danger" style={{ marginTop: '15px' }}>Remove Pet</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyPets;