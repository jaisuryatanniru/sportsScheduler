import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import AdminDashboard from './home';
import PlayerDashboard  from './playerDashboard';

import './App.css'; // Global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> {/* Default to Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<AdminDashboard />} />
        <Route path="/player-dashboard" element={<PlayerDashboard />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
