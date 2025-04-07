import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/styles.css';
import logo from '../src/assets/logo.png'; // Ensure the image is correctly placed
import loginImg from '../src/assets/loginimg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email and password are required');
      return;
    }

    const loginInfo = { email, password };

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      alert(result.message);

      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    
      <div className="container">
        <div className="login-box">
        {/* Logo inside login box at the top left */}
        <img src={logo} alt="Talent Corner Logo" className="login-box-logo" />
        <div className='wrapper'>

        <div className="left-section">
          <h2>Sarthi 360</h2>
          <p>Enter your credentials to access your account</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email/Username</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>

            <button type="submit" className="login-btn">Login</button>

            <p className="register-link">Don't have an account? <a href="/register">Register here</a></p>
            <p className="admin-login">Are you an admin? <a href="/admin">Admin Login</a></p>
          </form>
        </div>
        <div className="right-section">
          <img src={loginImg} alt="Illustration" className="company-logo" />
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default Login;