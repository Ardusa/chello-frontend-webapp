import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register-employee.css";
import { createAccount, getEmployee, setPassword, EmployeeCreate } from "../services/api.js";

const RegisterEmployee = () => {
    const [formData, setFormData] = useState(new EmployeeCreate());
    const navigate = useNavigate();
    const [isCompany, setIsCompany] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAccount(formData);
            alert("Registration successful. Redirecting to login...");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed");
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="register-container">
            <div className="centered-container">
                <div className="form-container">
                    <h2>Register Account</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-input">
                            <label>Full Name *</label>
                            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required autoComplete="name" />
                        </div>

                        <div className="form-input">
                            <label>Email *</label>
                            <input type="email" name="email" placeholder="user@chello.team" onChange={handleChange} required autoComplete="email" />
                        </div>

                        <div className="form-input">
                            <label>Password *</label>
                            <input type="password" name="password" placeholder={"Password"} onChange={handleChange} required autoComplete="new-password" />
                        </div>

                        <div className="form-input">
                            <label>Company Name *</label>
                            <input type="text" name="company_name" placeholder="Company Name" onChange={handleChange} required autoComplete="organization" />
                        </div>

                        <div className="form-input">
                            <label>Position Title *</label>
                            <input type="text" name="position" placeholder="Founder" onChange={handleChange} required autoComplete="organization-title" readOnly={false} />
                        </div>
                        <button type="submit" className="register-btn">Register Account</button>
                    </form>

                    <button type="button" onClick={() => navigate("/login")} className="arrow backward-btn"></button>
                </div>
            </div>
        </div>
    );

};

export default RegisterEmployee;