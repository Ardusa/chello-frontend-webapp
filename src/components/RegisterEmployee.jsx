import React, { useState } from "react";
import axios from "axios";
import { redirectLogin } from "../services/AuthService";

const RegisterEmployee = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    password: "",
    email: "",
    authority_level: 1,
    title: "Employee",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register", formData);
      setMessage(response.data.message);
      redirectLogin(); // Call redirectLogin after successful registration
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="centered-container">
      <div className="login-container">
        <h2>Register Employee</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="user@chello.team"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="authority_level"
            placeholder="Authority Level"
            onChange={handleChange}
            min="1"
            max="3"
          />
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
          />
          <button type="submit" className="register-btn">Register</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default RegisterEmployee;