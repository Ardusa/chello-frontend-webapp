import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../api.js";
import "../css/register-employee.css";
import { getEmployeeId } from "../api.js";

const RegisterEmployee = (new_account = false) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    password: "",
    email: "",
    authority_level: 1,
    title: "Employee",
    manager_id: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", formData);
      alert("Registration successful. Redirecting to login...");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed");
    }
  };

  useEffect(() => {
    if (!new_account) {
      getEmployeeId().catch(console.error);
      // setFormData(manager_id: )
    }
  })

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

        <button type="button" onClick={() => navigate("/login")} className="arrow backward-btn"></button>
      </div>
    </div>
  );

};

export default RegisterEmployee;