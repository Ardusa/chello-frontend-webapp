import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthService.jsx';
import { AccountResponse, getAccount } from '../services/api';
import { Button } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from "@mui/icons-material/Logout";
import '../css/settings.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';



// name, email, darkMode, workHours, setNewPassword, 2step-auth (do later), delete account, save button, back button, needs an organization settings page with:
// organization name, organization email, organization phone number, organization address, organization logo, organization delete

// account settings, integration settings, organization settings, notifications settings, security settings, billing settings

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(new AccountResponse());
    const { logout } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAccount();
            setUser(response);
        }

        fetchData();
    }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [sidebarItems] = useState({
        'Account Settings': [
            { name: 'Personal Info', id: 'personal-info' },
            { name: 'Work Hours', id: 'work-hours' },
        ],
        'Organization Settings': [
            { name: 'Organization Info', id: 'organization-info' },
            { name: 'Organization Logo', id: 'organization-logo' },
        ],
        'Integration Settings': [
            { name: 'Slack', id: 'slack' },
            { name: 'Google Calendar', id: 'google-calendar' },
        ],
        'Notifications Settings': [
            { name: 'Email Notifications', id: 'email-notifications' },
            { name: 'SMS Notifications', id: 'sms-notifications' },
        ],
        'Security Settings': [
            { name: '2-Step Authentication', id: '2-step-auth' },
            { name: 'Delete Account', id: 'delete-account' },
        ],
        'Billing Settings': [
            { name: 'Billing Info', id: 'billing-info' },
            { name: 'Payment Methods', id: 'payment-methods' },
        ],
    });

    const sidebarSections = {
        'Account Settings': { id: 'account-settings', icon: <AccountCircleIcon /> },
        'Organization Settings': { id: 'organization-settings', icon: <BusinessIcon /> },
        'Integration Settings': { id: 'integration-settings', icon: <IntegrationInstructionsIcon /> },
        'Notifications Settings': { id: 'notifications-settings', icon: <NotificationsIcon /> },
        'Security Settings': { id: 'security-settings', icon: <SecurityIcon /> },
        'Billing Settings': { id: 'billing-settings', icon: <PaymentIcon /> },
    };

    const handleWorkHoursChange = (index, field, value) => {
        const newWorkHours = [...user.workHours];
        newWorkHours[index][field] = value;
        setUser({ ...user, workHours: newWorkHours });
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSave = () => {
        // Implement save functionality here
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='settings-container'>
            <aside
                className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
                onMouseEnter={() => setIsSidebarOpen(true)}
                onMouseLeave={() => setIsSidebarOpen(false)}
            >
                <div className='nav'>
                    <ul>
                        {Object.keys(sidebarItems).map((section) => (
                            <li key={section} onClick={() => scrollToSection(sidebarSections[section].id)}>
                                {sidebarSections[section].icon}
                                {isSidebarOpen && (
                                    <div style={{ fontSize: '20px', transition: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <strong>{section}</strong>
                                        <ul style={{ padding: '0px', fontSize: '16px' }}>
                                            {sidebarItems[section].map((item) => (
                                                <li key={item.id} onClick={() => scrollToSection(item.id)} style={{ padding: '2px' }}>
                                                    {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {isSidebarOpen ? (
                    <div className='bottom'>
                        <Button variant="contained" className="back-btn" startIcon={<BackIcon />} onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div className='bottom'>
                        <Button variant='contained' className='back-btn' onClick={() => navigate(-1)}>
                            <BackIcon />
                        </Button>
                        <Button variant='outlined' color="error" className='logout-btn' onClick={() => handleLogout()}>
                            <LogoutIcon />
                        </Button>
                    </div>
                )}
            </aside>

            <div className='setting-container first' id='account-settings'>
                <h1>Account Settings</h1>

                <div className='setting-container' id='personal-info'>
                    <h1>Personal Info</h1>
                </div>

                <div className='setting-container' id='work-hours'>
                    <h1>Work Hours</h1>
                </div>
            </div>

            <div className='setting-container' id='organization-settings'>
                <h1>Organization Settings</h1>

                <div className='setting-container' id='organization-info'>
                    <h1>Organization Info</h1>
                </div>

                <div className='setting-container' id='organization-logo'>
                    <h1>Organization Logo</h1>
                </div>
            </div>

            <div className='setting-container' id='integration-settings'>
                <h1>Integration Settings</h1>

                <div className='setting-container' id='slack'>
                    <h1>Slack</h1>
                </div>

                <div className='setting-container' id='google-calendar'>
                    <h1>Google Calendar</h1>
                </div>
            </div>

            <div className='setting-container' id='notifications-settings'>
                <h1>Notifications Settings</h1>

                <div className='setting-container' id='email-notifications'>
                    <h1>Email Notifications</h1>
                </div>

                <div className='setting-container' id='sms-notifications'>
                    <h1>SMS Notifications</h1>
                </div>
            </div>

            <div className='setting-container' id='security-settings'>
                <h1>Security Settings</h1>

                <div className='setting-container' id='2-step-auth'>
                    <h1>2-Step Authentication</h1>
                </div>

                <div className='setting-container' id='delete-account'>
                    <h1>Delete Account</h1>
                </div>
            </div>

            <div className='setting-container' id='billing-settings'>
                <h1>Billing Settings</h1>

                <div className='setting-container' id='billing-info'>
                    <h1>Billing Info</h1>
                </div>

                <div className='setting-container' id='payment-methods'>
                    <h1>Payment Methods</h1>
                </div>
            </div>
        </div>
    );
};



export default Settings;