import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css' ;


const AddPet =() =>{
    const navigate = useNavigate() ;
    const [petName ,setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [age, setAge] =useState('');

    const handleAddPetSubmit =(e) =>{
        e.preventDefault();
        //Backend ligic will go here leter!
        console.log("Saving pet :",{petName,species,age});

        navigate('./dashboard');
    };

    return (
        <div className='dashboard-container'>
            {/*Sidebar Navigation */}
            <aside className="sidebar">
                <div className='sidebar-logo' style={{
                    display:"flex",
                    alignItems:"center",
                    paddingLeft:"10px"
                }}>
                    <img src={MyLogo} alt="Palan Logo"style={{
                        width:'36px',
                        height:"36px",
                        objectFit:"cover",
                        borderRadius:"50%",
                        filter:"drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                    }} />
                    <span style={{
                        fontsize:"24px",
                        fontWeight:"bold",
                        letterSpacing:"0.5px",
                        color:"#fffff",
                        marginLeft:"15px",
                        transform:"translateY(-3px)"
                    }}>
                        Palan
                    </span>
                </div>
                <nav className='nav-links'>
                    <div className='nav-item' onClick={()=> navigate('/dashboard')}>
                        <span>🔙</span><span>Back to Dashboard</span>
                    </div>
                </nav>
            </aside>
            {/*Main Content Area*/}
            <main className='main-content'>
                <header className="dashboard-header">
                    <h1>Add a New Pet 🐾</h1>
                    <p>Tell us a litter bit about your companion.</p>
                </header>
                <div className='dash-card' style={{ maxWidth:"500px"}}>
                    <form onSubmit={handleAddPetSubmit}>
                        <div className="form-group">
                            <label>Pet Name</label>
                            <input type="text"
                            placeholder='e.g. Luna'
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            required
                             />
                        </div>
                        <div className='from-group'>
                            <lable>Species</lable>
                            <select 
                            required
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}>
                                <option value ="" disabled>Select Species</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Reptial">Reptile</option>
                                <option value="Samll Animal">Samll Animal</option>
                                <option value="Other">other</option>
                                
                            </select>
                        </div>
                        <div className='form-group'>
                            <lable>Age(in Years)</lable>
                            <input type="number"
                            step="0.1"
                            placeholder='e.g. 2.5'
                            value={age}
                            onChange={(e) => setAge(e.target.value)} 
                            />

                        </div>
                        <div style={{display:"flex", gap:"15px" ,marginTop:"20px"}}>
                            <button type="button" className='submit-pet-btn' style={{
                                background:"rgba(255,100,100,0.2) ",color:'#ffb3b3'
                            }} onClick={()=>navigate('/dashboard')}>
                                cancel
                            </button>
                            <button type="submit" className='submit-pet-btn'>
                                Save Pet Profile
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddPet