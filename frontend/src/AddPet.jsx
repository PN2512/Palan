import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';
import './AddPet.css'


const AddPet = () => {
    const navigate = useNavigate();
    const [petName, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] = useState('');

    const handleAddPetSubmit = async (e) => {
        e.preventDefault();

        // Grab the user's secure login token
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('You must be logged in to add a pet.');
            navigate('/login');
            return;
        }

        try {
            // send the data to the backend
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
                // success: go back to the dashboard to see the pet 
                navigate('/dashboard');
            } else {
                const data = await response.json();
                alert(`Failed to save pet: ${data.message}`);
            }

        } catch (error) {
            console.error('Error saving pet:', error);
            alert('Could not connect to the server');
        }
        
        // Notice: The old console.log and navigate('./dashboard') that were here have been removed!
    };

    return (
        <div className='dashboard-container'>
            {/*Sidebar Navigation */}
            <aside className="sidebar">
                <div className='sidebar-logo' style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}>
                    <img src={myLogo} alt="Palan Logo" style={{
                        width: '36px', height: "36px", objectFit: "cover",
                        borderRadius: "50%", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                    }} />
                    <span style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "0.5px", color: "#ffffff", marginLeft: "15px", translateY: "-3px" }}>
                        Palan
                    </span>
                </div>
                <nav className='nav-links'>
                    <div className='nav-item' onClick={() => navigate('/dashboard')}>
                        <span>🔙</span><span style={{ marginLeft: "10px" }}>Back to Dashboard</span>
                    </div>
                </nav>
            </aside>
            
            {/*Main Content Area*/}
            <main className='main-content'>
                <header className="dashboard-header">
                    <h1>Add a New Pet 🐾</h1>
                    <p>Tell us a little bit about your companion.</p>
                </header>
                
                {/* 👇 The new animated card wrapper */}
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
                                <option value="Dog"> 🐕‍🦺Dog</option>
                                <option value="Cat">🐈Cat</option>
                                <option value="Bird">🦜Bird</option>
                                <option value="Reptile">🐊Reptile</option>
                                <option value="Small Animal">🦋Small Animal</option>
                                <option value="Other">🐚Other</option>
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