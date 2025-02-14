import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount, AccountCreate, CompanyCreate, createCompany, updateAccount } from "../services/api.js";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../services/AuthService";
import "../css/register-account.css";


const RegisterAccount = () => {
    const [accountData, setAccountData] = useState(new AccountCreate());
    const [companyData, setCompanyData] = useState(new CompanyCreate());
    const [isCompany, setIsCompany] = useState(false);
    const [isFree, setIsFree] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleAccountChange = (e) => {
        setAccountData({ ...accountData, [e.target.name]: e.target.value });
    };

    const handleCompanyChange = (e) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check required fields for account
        if (!accountData.name || !accountData.email || !accountData.password || !confirmPassword) {
            alert("Please fill in all required account fields");
            return;
        }

        // Check required fields for company if account type is company
        if (isCompany && (!companyData.name || !accountData.position)) {
            alert("Please fill in all required company fields");
            return;
        }

        if (accountData.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            if (isFree) {
                accountData.task_limit = 0;
            }

            if (isCompany) {
                accountData.task_limit = null;
                accountData.free_plan = true;
            }

            // console.log("Account Data:", accountData);
            // console.log("Company Data:", companyData);

            const user = await createAccount(accountData);
            await login(accountData.email, accountData.password);
            if (isCompany) {
                console.log("User:", user);
                console.log("Local Storage:", localStorage);
                const company = await createCompany({ ...companyData, founding_member: user.id });
                await updateAccount({ ...user, company_id: company.id });
            }
            
            alert("Registration successful. Redirecting to login...");
            console.log("Registration successful");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed");
            console.error("Registration failed:", error);
        }
    };

    const handleAccountTypeChange = (e) => {
        setIsCompany(e.target.value === "company");
    };

    const handleSubscriptionPlanChange = (e) => {
        setIsFree(e.target.value === "free");
        setAccountData({ ...accountData, free_plan: e.target.value === "free" });
    };

    const handleAccountTaskLimitChange = (e) => {
        setAccountData({ ...accountData, task_limit: e.target.value });
    }

    const handleCompanyTaskLimitChange = (e) => {
        setCompanyData({ ...companyData, task_limit: e.target.value });
    }

    const handleCompanyLogoChange = (e) => {
        setCompanyData({ ...companyData, logo: "" });
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyData({ ...companyData, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    return (
        <div className="register-container">
            <div className="centered-container">

                <div className="information-container">
                    <h2>Account Details</h2>

                    <div className="forms-container">
                        <div className="account-container">
                            <form>

                                <div className="form-input">
                                    <label>Account Type *</label>
                                    <select className="dropdown" name="accountType" onChange={handleAccountTypeChange} required>
                                        <option value="personal">Personal</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>

                                <div className="form-input">
                                    <label>Full Name *</label>
                                    <input type="text" name="name" placeholder="Full Name" onChange={handleAccountChange} required autoComplete="name" />
                                </div>

                                <div className="form-input">
                                    <label>Email *</label>
                                    <input type="email" name="email" placeholder="user@chello.team" onChange={handleAccountChange} required autoComplete="email" />
                                </div>

                                <div className="form-input">
                                    <label>Password *</label>
                                    <input type="password" name="password" placeholder={"Password"} onChange={handleAccountChange} required autoComplete="new-password" />
                                </div>

                                <div className="form-input">
                                    <label>Confirm Password *</label>
                                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} required autoComplete="new-password" />
                                </div>

                                {!isCompany && (
                                    <div className="form-input">
                                        <label>Subscription Plan *</label>
                                        <select className="dropdown" name="subscriptionType" onChange={handleSubscriptionPlanChange} required>
                                            <option value="free">Free</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                )}

                                {!isFree && !isCompany && (
                                    <div className="form-input">
                                        <label>Task Limit *</label>
                                        <select itemType="number" className="dropdown" name="taskLimit" onChange={handleAccountTaskLimitChange} required>
                                            <option value="1000">1,000</option>
                                            <option value="10000">10,000</option>
                                            <option value="100000">100,000</option>
                                            <option value="1000000">1,000,000</option>
                                        </select>
                                    </div>
                                )}

                            </form>
                        </div>

                        {isCompany && (
                            <div className="company-container">
                                <form>
                                    <div className="form-input">
                                        <label>Company Name *</label>
                                        <input type="text" name="name" placeholder="Company Name" onChange={handleCompanyChange} required autoComplete="organization" />
                                    </div>

                                    <div className="form-input">
                                        <label>Position Title *</label>
                                        <input type="text" name="position" placeholder="Founder" onChange={handleAccountChange} required autoComplete="organization-title" />
                                    </div>

                                    {!isFree && !isCompany && (
                                        <div className="form-input">
                                            <label>Task Limit *</label>
                                            <select itemType="number" className="dropdown" name="taskLimit" onChange={handleCompanyTaskLimitChange} required>
                                                <option value="20000">20,000</option>
                                                <option value="200000">200,000</option>
                                                <option value="2000000">2,000,000</option>
                                                <option value="20000000">20,000,000</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-input">
                                        <label>Company Logo</label>
                                        <input type="file" name="logo" accept="image/*" onChange={handleCompanyLogoChange} />
                                    </div>

                                    {companyData.logo ? (
                                        <div className="img-preview">
                                            <h3>Preview:</h3>
                                            <div className="logo">
                                                {companyData.logo !== "" ? (
                                                    <img src={companyData.logo} alt="Company Logo Preview" />
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </div>
                                        </div>
                                    ) : null}
                                </form>
                            </div>
                        )}

                    </div>
                    <button type="button" onClick={handleSubmit} className="register-btn">Register Account</button>
                    <button type="button" onClick={() => navigate("/login")} className="arrow backward-btn"></button>
                </div>
            </div>
        </div>
    );
};

export default RegisterAccount;