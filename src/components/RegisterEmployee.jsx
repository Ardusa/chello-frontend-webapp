import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../api.js";
import "../css/register-employee.css";
import { getEmployeeId, registerEmployee } from "../api.js";
import { makeAuthenticatedRequest } from "../services/AuthService.jsx";

const RegisterEmployee = (new_account = false) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFormData();
      setFormData(data);
    };

    fetchData();
  }, []);

  const getFormData = async () => {
    if (new_account) {
      return {
        name: "",
        email: "",
        password: "",
        company_id: "",
        position: "Founder",
      };
    }

    const companyResponse = await makeAuthenticatedRequest("/get-id");
    const companyJson = await companyResponse.json();
    const managerResponse = await makeAuthenticatedRequest("/get-id");
    const managerJson = await managerResponse.json();

    return {
      name: "",
      email: "",
      password: "",
      company_id: companyJson.company_id,
      position: "",
      manager_id: managerJson.id,
    };
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerEmployee(formData);
      alert("Registration successful. Redirecting to login...");
      navigate("/login");
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
            <label>Full Name *</label>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required autoComplete="name" />
          </div>

          <div className="form-input">
            <label>Email *</label>
            <input type="email" name="email" placeholder="user@chello.team" onChange={handleChange} required autoComplete="off" />
          </div>

          <div className="form-input">
            <label>Password *</label>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required autoComplete="new-password" />
          </div>

          {new_account ? (
            <div className="form-input">
              <label>Company Name *</label>
              <input type="text" name="company_name" placeholder="Company Name" onChange={handleChange} required autoComplete="organization" />
            </div>
          ) : (
            <div className="form-input">
              <label>Manager ID *</label>
              <input type="text" name="manager_id" value={formData.manager_id} required />
            </div>
          )}

          <div className="form-input">
            <label>Position Title *</label>
            <input type="text" name="title" placeholder="Software Engineer" onChange={handleChange} required autoComplete="organization-title" />
          </div>
          {new_account ? (
            <button type="submit" className="register-btn">Register Account</button>
          ) : (
            <button type="submit" className="register-btn">Register Employee</button>
          )}
        </form>

        <button type="button" onClick={() => navigate("/login")} className="arrow backward-btn"></button>
      </div>
    </div>
  );

};

export default RegisterEmployee;