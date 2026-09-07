import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard'; 
import AddPet from './AddPet';
import MyPets from './MyPets';
import Feeding from './Feeding';
import HusbandryTasks from './HusbandryTasks';

// Route protection wrapper
const SignedInRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<SignedInRoute><Dashboard /></SignedInRoute>} />
      <Route path="/add-pet" element={<SignedInRoute><AddPet /></SignedInRoute>} />
      <Route path="/my-pets" element={<SignedInRoute><MyPets /></SignedInRoute>}/>
      <Route path="/feeding-schedule" element={<SignedInRoute><Feeding /></SignedInRoute>} />
      <Route path="/husbandry-tasks" element={<SignedInRoute><HusbandryTasks /></SignedInRoute>} />
    </Routes>
  );
}

export default App;