import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MyPets.css';
import './Dashboard.css';

const MyPets = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user] = useState({ 
        name: localStorage.getItem('userName') || 'User' 
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const fetchPets = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('http://localhost:5000/api/pets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPets(data);
            } else {
                console.error("Failed to fetch. Backend blocked it!");
            }
        } catch (error) {
            console.error('Error fetching pets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this pet profile?")) return;
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:5000/api/pets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setPets(pets.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error('Error deleting pet:', error);
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
        <div className="dashboard-container">
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

            <main className="main-content" style={{ padding: '40px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <div>
                        <h1>My Pets 🐾</h1>
                        <p>Manage all your registered pet profiles in one place.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                            Back to Dashboard
                        </button>
                        <button onClick={() => navigate('/add-pet')} className="btn-primary">
                            + Add New Pet
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p>Loading your pets...</p>
                ) : pets.length === 0 ? (
                    <div className="dash-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No pets found. Start by adding your first companion!</p>
                        <button onClick={() => navigate('/add-pet')} className="btn-primary" style={{ marginTop: '15px' }}>
                            Add a Pet
                        </button>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {pets.map(pet => (
                            <div key={pet._id} className="dash-card" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <h3 style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        {pet.name}
                                        <span style={{
                                            fontSize: '12px',
                                            background: 'rgba(255,255,255,0.15)',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            {pet.species}
                                        </span>
                                    </h3>
                                    <div className="card-content" style={{ marginTop: '10px' }}>
                                        <p><strong>Age: </strong>{pet.age ? `${pet.age} years old` : 'Not specified'}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(pet._id)} className="btn-danger" style={{ marginTop: '15px' }}>
                                    Remove Pet
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyPets;