import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './login.css';
import cricket from './assets/cricket.jpg'; 
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const toggleFormType = () => {
    setIsAdmin(!isAdmin);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userType = isAdmin ? 'admin' : 'player'; 
    try {
      const apiUrl = 'http://localhost:5000/api/v1/authentication';
      const url = `${apiUrl}/${userType}/${userType}Login`;

      const response = await axios.post(url, formData);

      const { message, user } = response.data;
      alert(message);

      if (userType === 'admin') {
        navigate('/home');
      } else {
        navigate('/player-dashboard');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
    <div className="login-container">
      <div className={`login-box ${isAdmin ? 'admin-mode' : ''}`}>
        <h2>{isAdmin ? 'Admin Login' : 'Player Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account?{' '}
          <button onClick={() => navigate('/register')}>Sign Up</button>
        </p>
        <button className="toggle-button" onClick={toggleFormType}>
          Switch to {isAdmin ? 'Player' : 'Admin'} Login
        </button>
      </div>
      <div className="login-info">
        <h3>Welcome Back!</h3>
        <p>
          Please log in to access your dashboard. If you do not have an account,
          sign up to get started.
        </p>
      </div>
       <div className="register-image">
            <img src={cricket} alt="cricket" />
          </div>
        </div>
    
    
    </>
  );
};

export default Login;
