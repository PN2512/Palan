import React , {useState} from 'react';

const Signup =() =>{
    const [name ,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');

    const handleSignup = async(e) =>{
        e.preventDefault();
        setError('');
        setSuccess('');
    

    try{
        const response = await fetch('http://localhost:5000/api/auth/signup',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
                body:JSON.stringify({name,email,password}),

        });
        const data = await response.json();

        if(response.ok){
            setSuccess('User created successfully! You can now login ');
            //clear the form
            setName('');
            setEmail('');
            setPassword('');
        }
        else{
            setError(data.message);
        }
    }catch(error){
        console.error('Network Error',error);
        setError('Something went wrong. please try again.');


    }
};

return(
    <div style={{padding:'20px'}}>
        {error && <p style={{color:'red'}}>{error}</p>}
        {success && <p style={{color:'green'}}>{success}</p>}


        <form onSubmit={handleSignup} style={{display:'flex',flexDirection:'column',width:'300px',gap:'10px'}}>
            <input 
            type="text"
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{padding:'8px'}}
             />
             <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) =>setEmail(e.target.value)}
              required
              style={{padding:'8px'}}
               />

               <input
                type="password"
                placeholder='Password' 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                style={{padding:'8px'}}
                />
                <button type='submit' style={{padding:'10px' ,cursor:'pointer'}}>Sign up</button>
        </form>
    </div>
);
};

export default Signup;