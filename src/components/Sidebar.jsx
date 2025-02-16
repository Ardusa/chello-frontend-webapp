import BackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../services/AuthService";
import logo from '../assets/logo.png';
import { CircularProgress, Button } from "@mui/material";
import "../css/sidebar.css";
import { getAccount, fetchAccountDetails, AccountResponse } from "../services/api";


/**
 * 
 * @param {Object} elements this should be in the form of { section_id : { element: <Element /, icon: <Icon /, urlPath: "/dashboard/section_id", name: "element", } }. First entry will be the default selected section
 * @param {String} backLink the link to go back to, for projects page on the dashboard it would be "/dashboard/projects"
 * @param {Function} useEffectFuncs the functions to run on useEffect
 * @returns a dashboard component with a sidebar and main content
 */
const Sidebar = ({ elements, backLink = null, useEffectFuncs = [], loadingElement = false }) => {
    const { section } = useParams();
    const [selectedSection, setSelectedSection] = useState(Object.keys(elements)[0]);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(new AccountResponse({}));
    const [manager, setManager] = useState(new AccountResponse({}));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            useEffectFuncs.forEach(func => func());
            if (section) {
                setSelectedSection(section);
            }

            const user = await getAccount();
            setUser(user);

            if (user.manager_id) {
                const manager = await fetchAccountDetails(user.manager_id);
                console.log("manager: ", manager);
                console.log("user: ", user)
                setManager(manager);
            }
            setLoading(false);
        };

        fetchData();
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
                {/* <img src={user?.profile_picture} alt="Profile Picture" className="profile-img" /> */}
                <h1 style={{ fontSize: "70px", color: "black", margin: "10px 0px" }}>Chello</h1>
                <img src={logo} alt="Chello Logo" className="logo-img" />
                <div className="user-details-container">
                    <div className="user-info">
                        <h3 >{user.position}</h3>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                    {manager.id &&
                        <div className='manager-info'>
                            <h3 >{manager.position}</h3>
                            <h2 style={{ fontWeight: 'bold' }}>{manager.name}</h2>
                            <p>{manager.email}</p>
                        </div>
                    }
                </div>
                <nav className="nav">
                    {Object.entries(elements).map(([id, element]) => (
                        <Button
                            key={id}
                            className={`nav-item ${selectedSection === id ? "active" : ""}`}
                            onClick={() => {
                                if (selectedSection === id) return;
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
                {!loading && !loadingElement
                    ? elements[selectedSection].element
                    : null}
                {loading && <CircularProgress />}
            </main>
        </div>
    );
};

export default Sidebar;