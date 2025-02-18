import BackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../services/AuthService";
import chelloLogo from '../assets/logo_crop.png';
import { CircularProgress, Button } from "@mui/material";
import { getAccount, fetchAccountDetails, AccountResponse, fetchLogo } from "../services/api";
import "../css/sidebar.css";

/**
 * 
 * @param {Object} elements this should be in the form of { section_id : { element: <Element /, icon: <Icon /, urlPath: "/dashboard/section_id", name: "element", } }. First entry will be the default selected section
 * @param {String} backLink the link to go back to, for projects page on the dashboard it would be "/dashboard/projects"
 * @param {Function} useEffectFuncs the functions to run on useEffect
 * @param {Boolean} loadingElement if true, will display a loading spinner instead of the element
 * @param {Object} managerElements this should be in the form of { section_id : { element: <Element /, icon: <Icon /, urlPath: "/dashboard/section_id", name: "element", } }, for manager specific elements
 * @param {Object} companyElements this should be in the form of { section_id : { element: <Element /, icon: <Icon /, urlPath: "/dashboard/section_id", name: "element", } }, for company specific elements
 * @returns a dashboard component with a sidebar and main content
 */
const Sidebar = ({ elements, backLink = null, useEffectFuncs = [], loadingElement = false, managerElements = {}, companyElements = {} }) => {
    const { section } = useParams();
    const [displayElements, setDisplayElements] = useState(elements);
    const [selectedSection, setSelectedSection] = useState(Object.keys(elements)[0]);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(new AccountResponse({}));
    const [manager, setManager] = useState(new AccountResponse({}));
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(null);

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

            const logo = await fetchLogo();

            if (logo) {
                setLogo(logo);
            }

            if (user.manager) {
                setDisplayElements(prevElements => ({ ...prevElements, ...managerElements }));
            }

            if (user.company_id) {
                setDisplayElements(prevElements => ({ ...prevElements, ...companyElements }));
            }

            await Promise.all(useEffectFuncs.map(func => func()));

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

    if (loading) {
        return <div />;
    }

    return (
        <div className="sidebar-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="header" style={logo ? { marginBottom: '10px' } : {}}>
                    <img src={chelloLogo} alt="Company Logo" className="logo-img" />
                    <h1 className='title'>hello</h1>
                </div>

                {logo && (
                    <img src={logo} alt="Company Logo" className="company-logo-img" />
                )}


                <nav className="nav">

                    {Object.entries(displayElements).map(([id, element]) => (
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
                <div className="bottom">
                    {backLink && (
                        <Button variant="contained" className="back-btn" startIcon={<BackIcon />} onClick={() => navigate(backLink, { replace: true })}>
                            Back
                        </Button>
                    )}
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
                    <Button variant="contained" color="info" className="settings-btn" startIcon={<SettingsIcon />} onClick={() => handleSettings()}>
                        Settings
                    </Button>
                    <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="content">
                {!loadingElement
                    ? displayElements[selectedSection].element
                    : <CircularProgress />}
            </main>
        </div>
    );
};

export default Sidebar;