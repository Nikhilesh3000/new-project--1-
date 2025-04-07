import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "../src/styles.css";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/logo.png";
import loginImg from "../src/assets/loginimg.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!name.trim() || !email.trim() || !mobileNumber.trim() || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (mobileNumber.length < 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Remove country code and any non-numeric characters
    // const cleanedMobileNumber = mobileNumber.replace(/^\+?[0-9]{1,3}/, "").replace(/\D/g, "");
    const cleanedMobileNumber = mobileNumber.replace(/^(\d{2})/, "");

    console.log("Mobile Number Sent to Backend:", cleanedMobileNumber); // Debugging
  
    const signUpInfo = { name, email, mobile_number: cleanedMobileNumber, password };
  
    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpInfo),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }
  
      const result = await response.json();
      alert(result.message);
  
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="register-container">
      <div className="login-box">
        <img src={logo} alt="Talent Corner Logo" className="login-box-logo" />
        <div className="wrapper">
          <div className="left-section">
            <h2>Sarthi 360</h2>
            <h3>Team Member Registration</h3>
            <p>Create your account to join the team</p>
            <form onSubmit={handleRegister}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

<PhoneInput
  country={"in"}
  value={mobileNumber}
  onChange={(phone) => {
    console.log("Full Phone Number:", phone); // Debugging

    // Remove only hyphens from the phone number
    const cleanedNumber = phone.replace(/-/g, ""); 
    setMobileNumber(cleanedNumber);
  }}
  inputProps={{
    name: "mobileNumber",
    required: true,
  }}
/>


              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="submit" className="login-btn">
                Register
              </button>

              <p className="register-link">
                Already have an account? <a href="/">Login here</a>
              </p>
              <p className="admin-login">
                Are you an admin? <a href="/admin">Admin Login</a>
              </p>
            </form>
          </div>
          <div className="right-section">
            <img
              src={loginImg}
              alt="Talent Corner Logo"
              className="company-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;