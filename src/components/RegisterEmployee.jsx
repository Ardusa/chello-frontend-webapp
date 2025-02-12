import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/register-employee.css";
import { createAccount, getEmployee, setPassword } from "../services/api.js";

const RegisterEmployee = ({ new_account = false, set_password = false }) => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getFormData = async () => {
      if (set_password) {
        return {
          id: id || "",
          temporary_password: "",
          new_password: "",
        }
      }

      if (new_account) {
        return {
          name: "",
          email: "",
          password: "",
          company_name: "",
          position: "Founder",
        };
      }

      const responseJson = await getEmployee();

      return {
        name: "",
        email: "",
        password: "",
        company_id: responseJson.company_id,
        position: "",
        manager_id: responseJson.id,
      };
    };

    const fetchData = async () => {
      const data = await getFormData();
      setFormData(data);
    };

    fetchData();
  }, []);

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

  const handleSetPassword = async (e) => {
    e.preventDefault();
    try {
      await setPassword(formData);
      alert("Password set successfully. Redirecting to login...");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to set password");
    }
  };

  if (set_password) {
    return (
      <div className="register-container">
        <div className="centered-container">
          <div className="form-container">
            <h2>Create Password</h2>
            <p>Please create a password for your new account Employee {formData.id}</p>

            <form onSubmit={handleSetPassword}>
              <div className="form-input">
                <label>Temporary Password *</label>
                <input type="password" name="temporary_password" placeholder="New Password" onChange={handleChange} required autoComplete="new-password" />
              </div>

              <div className="form-input">
                <label>New Password *</label>
                <input type="password" name="new_password" placeholder="Confirm Password" onChange={handleChange} required autoComplete="new-password" />
              </div>

              <button type="submit" className="register-btn">Set Password</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="centered-container">
        <div className="form-container">
          <h2>Register Employee</h2>

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
              <input type="password" name="password" placeholder={new_account ? "Password" : "Temporary Password"} onChange={handleChange} required autoComplete="new-password" />
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
              <input type="text" name="position" placeholder="Founder" onChange={handleChange} required autoComplete="organization-title" readOnly={false} />
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
    </div>
  );

};

export default RegisterEmployee;