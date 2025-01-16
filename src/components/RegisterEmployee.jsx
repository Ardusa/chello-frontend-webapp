import React, { useState } from "react";
import axios from "axios";
// import { redirectLogin } from "../services/AuthService";
import "../css/register-employee.css";
import { useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    password: "",
    email: "",
    authority_level: 1,
    title: "Employee",
  });

  const navigate = useNavigate();

//   useEffect(() => {
//     const handlePopState = () => {
//         alert("You are navigating away from the registration page.");
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//         window.removeEventListener('popstate', handlePopState);
//     };
// }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", formData);
      alert("Registration successful. Redirecting to login...");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="centered-container">
      <div className="register-container">
        <h2>Register Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <label>Employee ID *</label>
            <input type="text" name="employee_id" placeholder="Employee ID" onChange={handleChange} required  autoComplete="username"/>
          </div>

          <div className="form-input">
            <label>Full Name *</label>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required autoComplete="name" />
          </div>

          <div className="form-input">
            <label>Password *</label>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required autoComplete="new-password" />
          </div>

          <div className="form-input">
            <label>Email *</label>
            <input type="email" name="email" placeholder="user@chello.team" onChange={handleChange} required autoComplete="off" />
          </div>

          <div className="form-input">
            <label>Authority Level *</label>
            <input type="number" name="authority_level" placeholder="Authority Level" onChange={handleChange} min="1" max="3" autoComplete="off" />
          </div>

          <div className="form-input">
            <label>Job Title</label>
            <input type="text" name="title" placeholder="Job Title" onChange={handleChange} autoComplete="organization-title" />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>

        <button type="button" onClick={() => navigate("/")} className="arrow backward-btn"></button>
      </div>
    </div>
  );

};

export default RegisterEmployee;