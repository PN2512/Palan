import React ,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import myLogo from './assets/logo.png';
import './DashBoard.css';

const Feeding =()=>{
    const navigate = useNavigate();
    //Fetch from the Backend
    const [pets,setPets] = useState([{_id:'1',name:'Luna'}]);
    const[schedules,setSchedules] = useState([
        {id:'1' , petName:'Luna' , time :'08:00 AM' , food:'kibble',portion:'1 cup'}
    ]);

    return(
        <div className='dashboard-container'>
            {/* Sidebar Navigation */}
            <aside className='sidebar'>
                <div className="sidebar-log" style={{display:"flex",
                    alignItems:'center',
                    paddingLeft:'10px' }}>
                        <img src={myLogo} alt="Palan Logo" style={{
                            width:'36px', height:'36px',objectFit:"cover",
                            borderRadius:'50%', filter:'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
                        }}/>
                        <span style={{
                            fontSize:'24px',
                            fontWeight:'bold',
                            color:'#ffffff',
                            marginleft:'15px'
                            }}>
                            Palan
                            </span>
                </div>
                <nav  className='nav-links'>
                    <div className='nav-item' onClick={()=> navigate('/dashboard')}>
                        <span>🔙</span><span style={{marginLeft:'10px'}}>DashBoard</span>
                    </div>
                    <div className='nav-item' onClick={()=> navigate ('/my-pets')}>
                        <span>🐾</span><span style={{marginLeft:'10px'}}>My Pets</span>
                    </div>
                </nav>
            </aside>
            {/* main content  */}
            <main className='main-content' style={{padding:'40px'}}>
                <header style={{ marginBottom:'30px'}}>
                    <h1>Feeding Schedule 🍲</h1>
                    <p>Keep track of meal time and portions for your companions.</p>
                </header>
                <div className='Dashboard-grid'>
                    {/* from to add a meal  */}
                    <div className='dash-card'>
                        <h3>Schedule a Meal</h3>
                        <form style={{marginTop:'20px'}}>
                            <div style={{marginBottom:'15px'}}>
                                <label style={{fontSize:'14px' ,color:'rgba(255,255,255,0.8)'}}>Select Pet</label>
                                <select className='add-pet-input' style={{marginTop:'5px' , width:'100%'}}>
                                    {pets.map(pet => (
                                        <option key={pet._id} value={pet._id}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{marginBottom:'15px'}}>
                                <lable style={{fontSize:'14px' ,color:'rgba(255,255,255,0.8)'}}>Time</lable>
                                <input type="time" className='add-pet-input' style={{marginTop:'5px' ,width:'100%'}}/>
                            </div>
                            <div style={{marginBottom:'15px'}}>
                                <lable style={{fontSize:'14px' , color:'rgba(255,255,255,0.8)'}}>Food Type & Portion</lable>
                                <input  type='text' placeholder="e.g . 1/2 cup Wet Food" className='add-pet-input' style={{
                                    marginTop:'5px',
                                    width:'100%'
                                }}/>
                            </div>
                                <button type="submit" className='btn-primary' style={{width:'100%',marginTop:'10px'}}>
                                    +Add Schedule
                                </button>
                        </form>
                    </div>
                    {/* Display Upcoming meals */}
                    <div className='dash-card'>
                        <h3>Upcoming Feedings</h3>
                        <div style={{marginTop:'20px',display:'flex',flexDirection:'column',gap:'15px'}}>
                            {schedules.map((meal) =(
                                <div key={meal.id} style={{
                                    background:'rgba(255,255,255,0.05)',
                                    padding:'15px',
                                    borderRadius:'12px',
                                    borderLeft:'4px solid #6366f1'

                                }}>
                                    <div style={{display:"flex",justifyContent:'space-between',alignItems:'center'}}>
                                        <h4 style={{margin:0}}>{meal.petname}</h4>
                                        <span style={{fontWeight:'bold', color:"#818cf8" }}>
                                            {meal.time}
                                        </span>
                                    </div>
                                    <p style={{margin:'8px 0 0 0' , fontSize:"14px" , color:'rgba(255,255,255,0.7)'}}>
                                        {meal.food} . {meal.portion}
                                    </p>
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