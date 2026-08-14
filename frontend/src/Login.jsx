import React ,{useState} from 'react';

const Login =() => 
    {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError]= useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:5000/api/auth/login',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({email,password}),
            });
            const data = await response.json();

            if(response.ok){
                localStorage.setItem('authToken',data.token);
                console.log('Login Successful! Token saved');
                setError('');
                alert('success! You are logged in ')
            }
            else{
                setError(data.message)
            }
        }catch(error){
            console.error('Network Error',error);
            setError('Something went wrong.Place try again');
        }
    };




return(
    <div style={{padding:'20px'}}>
        <h2>Log in to Your Account</h2>
        {error && <p style={{color:'red'}}>{error}</p>}

        <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column',width:'300px',gap:'10px'}}>
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
             onChange={(e) =>setPassword(e.target.value)}
             required
             style={{padding:'8px'}}
             />
             <button type="submit" style={{padding:'10px', cursor:'pointer'}}>Log In</button>
        </form>
    </div>
);

};
export default Login;