import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css';
import cricket from './assets/cricket.jpg'; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    usertype: 'player', 
    answer: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleFormType = () => {
    setIsAdmin(!isAdmin);
    setFormData({ ...formData, usertype: isAdmin ? 'player' : 'admin' });
    console.log('isAdmin:', !isAdmin); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userType = isAdmin ? 'admin' : 'player';

    try {
      const apiUrl = 'http://localhost:5000/api/v1/authentication';
      const url = `${apiUrl}/${userType}/${userType}Register`;

     
      const response = await axios.post(url, formData);
      alert(response.data.message); 
      navigate('/login'); 
    } catch (error) {
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className={`register-box ${isAdmin ? 'admin-mode' : ''}`}>
          <h2>{isAdmin ? 'Admin Register' : 'Player Register'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="answer"
              placeholder="Security Answer"
              value={formData.answer}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          <p >
            Already have an account?{' '}
            <button className="toggle-button" onClick={() => navigate('/login')}>
              Login
            </button>
          </p>
          <button className="switch" onClick={toggleFormType}>
            Switch to {isAdmin ? 'Player' : 'Admin'} Register
          </button>
        </div>

        <div className="register-info">
          <div className="message-card">
            <h3>Create Your Account</h3>
            <p>
              Join us today! Please provide accurate details and choose whether
              you are registering as a player or an admin.
            </p>
          </div>
        </div>
      </div>

      <div className="register-image">
        <img src={cricket} alt="cricket" />
      </div>
    </div>
  );
};

export default Register;