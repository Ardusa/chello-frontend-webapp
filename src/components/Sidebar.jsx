import BackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuth } from "../services/AuthService";
import logo from '../assets/logo.png';
import "../css/sidebar.css";



/**
 * 
 * @param {Object} elements this should be in the form of { section_id : { element: <Element /, icon: <Icon /, urlPath: "/dashboard/section_id", name: "element", } }. First entry will be the default selected section
 * @param {String} backLink the link to go back to, for projects page on the dashboard it would be "/dashboard/projects"
 * @param {Function} useEffectFuncs the functions to run on useEffect
 * @returns a dashboard component with a sidebar and main content
 */
const Sidebar = ({ elements, backLink = null, useEffectFuncs = [] }) => {
    const { section } = useParams();
    const [selectedSection, setSelectedSection] = useState(Object.keys(elements)[0]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        useEffectFuncs.forEach(func => func());
        if (section) {
            setSelectedSection(section);
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSettings = () => {
        navigate("/settings");
    }

    return (
        <div className="sidebar-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <img src={logo} alt="Chello Logo" className="logo-img" />
                <h1 style={{ fontSize: "70px", color: "black", marginTop: "10px" }}>Chello</h1>
                <nav className="nav">
                    {Object.entries(elements).map(([id, element]) => (
                        <Button
                            key={id}
                            className={`nav-item ${selectedSection === id ? "active" : ""}`}
                            onClick={() => {
                                navigate(element.urlPath);
                                setSelectedSection(id);
                            }}
                            startIcon={element.icon}
                            disableRipple
                        >
                            {element.name}
                        </Button>
                    ))}
                </nav>
                {backLink && (
                    <Button variant="contained" className="back-btn" startIcon={<BackIcon />} onClick={() => navigate(backLink, { replace: true })}>
                        Back
                    </Button>
                )}
                <Button variant="contained" color="info" className={`settings-btn ${backLink ? "not-top" : ""}`} startIcon={<SettingsIcon />} onClick={() => handleSettings()}>
                    Settings
                </Button>
                <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                    Logout
                </Button>
            </aside>

            {/* Main Content */}
            <main className="content">
                {elements[selectedSection].element}
            </main>
        </div>
    );
};

export default Sidebar;