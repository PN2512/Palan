import React from 'react';
import { useNavigate } from 'react-router-dom';
import myLogo from './assets/logo.png';
import './Dashboard.css';
import { useState } from 'react';
import { useEffect } from 'react';


const Dashboard =() =>{
    const navigate = useNavigate();
    const [pets,setPets]=useState([]);
    const [loading,setLoading] = useState(true)

    //1 fetch pets as soon as the dashboard loads
    useEffect(()=>{
        const fetchPets =async ()=>{
            const token = localStorage.getItem('authToken');

            // if they somehow get here without a token , kick them to login
            if(!token){
                navigate('/login')
            }
            try{
                const responce = await fetch('http://localhost:5000/api/pets',{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }

                });
                if(responce.ok){
                    const data = await responce.json();
                    setPets(data); // save the fetched pets to state
                }else{
                    console.error("Failed to fetch pets ");
                }

            }catch(error){
                console.error("error connecting to server:", error);
            }finally{
                setLoading(false); // stop the loading text
            }
        };
        fetchPets();
    },[navigate]);

    const handleLogout =() =>{
        
        localStorage.removeItem('authToken');
        navigate('/login');
    };
    return (
        <div className ="dashboard-container">
            {/*Sidebar navigation*/}
            <aside className="sidebar">
            {/*Sidebar  Header  */}
            <div className='sidebar-logo' style={{ display:'felx', alignItems:'center' ,paddingLeft:'10px'}}>
                <img 
                  src={myLogo}
                  alt="Palan Logo"
                  style={{
                    width:'36px',
                    height:'36px',
                    objectFit:'cover',
                    borderRadius:'50%',
                    filter:'drop-shadow( 0px 2px 4px rgbs(0,0,0,0.3))'

                  }}
                />
                <span style={{fontSize:'24px', fontWeight:'bold' ,letterSpacing:'0.5px' , color:'#ffffff' ,marginLeft:'13px', transform:'translateY(-10px)'}}>Palan</span>
                </div>
                <nav className='nav-links'>
                    <div className='nav-item active'>🐾Overview</div>
                    <div className='nav-item '>📝My Pets</div>
                    <div className='nav-item '>🍖Feeding Schedule</div>
                    <div className='nav-item '>🛁Husbandry Tasks</div>
                </nav>
                <div className='nav-item logout-btn' onClick={handleLogout}>
                    <span>🚪</span><span style={{marginlift:'10px'}}>Log Out</span>
                </div>

            
            </aside>

            {/*Main DashBoard Content*/}
            <main className='main-content'>
                <header className='dashboard-header'>
                    <h1>Welcome back! 🐣</h1>
                    <p>Here is what is happening with your pet today.</p>
                </header>
                <div className='dashboard-grid'>
                    {/*Pet Profile Card*/}
                    <div className='dash-card'>
                        <h3>My Pets</h3>
                        <div className='card-content'>
                            {/*Dynamic pet Display Logic*/}
                            {loading ?(
                                <p>Loading your pets</p>
                            ) : pets.length === 0 ?(
                                <p>You haven't added any pet profiles yet.</p>
                            ) : (
                                <ul style={{listStyle:'none',
                                    padding:0,
                                    margin:0,
                                    display:'flex',
                                    flexDirection:'column',
                                    gap:'10px'

                                }}>
                                    {pets.map(pet =>(
                                        <li key={pet._id} style={{
                                            background:'rgba(255,255,255,0.05)',
                                            padding:'12px',
                                            borderRadius:'8px',
                                            display:'flex',
                                            justifyContent:'space-between',
                                            alignItem:'center'
                                        }}>
                                            <div>
                                                <strong  style={{fontSize:'16px'}}>{pet.name}</strong>
                                                <span style={{display:'block',
                                                    fontSize:'12px',
                                                    color:'#cbd5e1'
                                                }}>
                                                    {pet.species}
                                                </span>
                                            </div>
                                            {pet.age && <span style={{fontSize:'13px', color:'#cbd5e1' }} > Age:{pet.age}</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            {/*Add Pet Button*/}
                            <button onClick={()=> navigate('/add-pet')} 
                                style={{
                                    marginTop:'15px' ,padding:'10px 15px' ,borderRadius:'8px',border:'none',
                                    background:"white" , color:"#1e1b4b" , cursor:"pointer", fontWeight:"bold",
                                    width:pets.length> 0 ? '100%' : 'auto'  // expands button is a list above it
                                }}>
                                    +Add a Pet
                                </button>
                        </div>
                    </div>

                    {/*Feeding Reminder Card*/}
                    <div className='dash-card'>
                        <h3>Upcoming Feedings</h3>
                        <div className='card-content'>
                            <ul style={{
                                listStyle:'none',
                                padding:0,
                                margin:0,
                                display:'felx',
                                flexDirection:'column',
                                gap:'10px'
                            }}>
                                <li style={{
                                    background:'rgba(255,255,255,0.05)',
                                    padding:0,
                                    borderRadius:'8px'
                                }}>
                                    <strong>Morning Meal</strong> - 8:00 AM
                                </li>
                                <li style={{
                                    background:'rgba(255,255,255,0.05)',
                                    padding:'10px',
                                    borderRadius:'8px'
                                }}>
                                    <strong>Evening Meal</strong>  - 6:00 PM
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/*husbandry /Care Schedule Card */}
                    <div className='dash-card'>
                        <h3>Husbandry Tasks</h3>
                        <div className='card-content'>
                            <ul style={{listStyleType:'none',
                                padding:0,
                                margin:0,
                                display:'flex',
                                flexDirection:'column',
                                gap:'10px'
                                        }}>
                                   <li style={{background:'rgba(255,255,255,0.05)',
                                               padding:'10px',
                                               borderRadius:'8px',
                                               borderLeft:'4px solid #4ca1af' ,
                                   }}>
                                    clean encolosure
                                    </li>         
                                    <li style={{background:'rgba(255,255,255,0.05)',
                                                padding:'10px',
                                                borderRadius:'8px',
                                                borderLeft:'4px solid #ffb3be',

                                                }}>
                                        Administer Medication
                                    </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};



export default Dashboard;