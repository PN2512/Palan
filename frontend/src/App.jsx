import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

// 1. Define Dashboard FIRST, right here at the top
const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to your Palan Dashboard! 🐾</h1>
      <p>You have successfully logged in.</p>
    </div>
  );
};

// 2. Then define App below it
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;