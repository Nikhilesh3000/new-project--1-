import React, { useState, useRef } from 'react';
import '../src/styles.css';
import logo from '../src/assets/logo.png';
import loginImg from '../src/assets/loginimg.png';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        alert('OTP sent successfully to your email');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleChangeOtp = (index, value) => {
    if (!/\d?/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
    if (newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const verifyOtp = async (enteredOtp) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const result = await response.json();
      if (result.success) {
        setOtpVerified(true);
        alert('OTP Verified Successfully');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('OTP verification failed. Please try again.');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify OTP before entering the password');
      return;
    }
    if (!password) {
      alert('Password is required');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <div className="login-box">
        <img src={logo} alt="Talent Corner Logo" className="login-box-logo" />
        <div className='wrapper'>
          <div className="right-section">
            <img src={loginImg} alt="Talent Corner Logo" className="company-logo" />
          </div>
          <div className="left-section">
            <h2>Sarthi 360</h2>
            <h3>Admin/Co-Admin Login</h3>
            <p>Enter your credentials to access the admin panel</p>
            <form onSubmit={handleAdminLogin}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
              />

              <button type="button" className="otp-btn" onClick={handleSendOtp} disabled={otpSent}>
                {otpSent ? 'OTP Sent ✅' : 'Send OTP'}
              </button>

              <label>Enter OTP</label>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                    ref={(el) => (otpRefs.current[index] = el)}
                  />
                ))}
              </div>
              {otpVerified && <p className="otp-verified">✅ OTP Verified</p>}

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!otpVerified}
              />
              <button type="submit" className="login-btn" disabled={!otpVerified}>
                Admin Login
              </button>
              <p className="register-link">Need an account? <a href="/register">Register here</a></p>
              <p className="admin-login">Go back to <a href="/">User Login</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;