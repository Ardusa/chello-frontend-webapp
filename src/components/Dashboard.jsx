import { useEffect, useState } from "react";
import { fetchProjects, fetchEmployees } from "../api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import LogoutIcon from "@mui/icons-material/Logout";
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

import { useAuth } from "../services/AuthService";

import { Container, Typography, Button, List, ListItem, ListItemButton, ListItemText, Paper, Box } from "@mui/material";
import "../css/dashboard.css";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("projects");
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        if (selectedSection === "projects") {
            fetchProjects().then(setProjects).catch((e) => {
                console.error(e);
                if (e.status === 401) {
                    console.log("Session expired. Redirecting to login page.");
                    navigate("/login");
                }
            });
        } else if (selectedSection === "employees") {
            fetchEmployees().then(setEmployees).catch(console.error);
        }
    }, [selectedSection]);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <img src={logo} alt="Chello Logo" className="logo-img" />
                <h1 style={{ fontSize: "70px", color: "black", marginTop: "10px"}}>Chello</h1>
                <nav className="nav">
                    {[
                        { id: "projects", name: "Projects", icon: <FolderIcon /> },
                        { id: "insights", name: "Insights", icon: <InsightsIcon /> },
                        { id: "employees", name: "Employees", icon: <AssignmentIndIcon /> },
                    ].map((section) => (
                        <Button
                            key={section.id}
                            className={`nav-item ${selectedSection === section.id ? "active" : ""}`}
                            onClick={() => setSelectedSection(section.id)}
                            startIcon={section.icon}
                            disableRipple
                        >
                            {section.name}
                        </Button>
                    ))}
                </nav>
                <Button variant="contained" color="info" className="settings-btn" startIcon={<SettingsIcon />} onClick={() => handleLogout()}>
                    Settings
                </Button>
                <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                    Logout
                </Button>
            </aside>

            {/* Main Content */}
            <main className="content">
                {selectedSection === "projects" && <ProjectCards projects={projects} />}
                {selectedSection === "insights" && <InsightsCards />}
                {selectedSection === "employees" && <EmployeeCards employees={employees} />}
            </main>
        </div>
    );
};

const ProjectCards = ({ projects }) => (
    <div className="cards-container">
        {/* <h2>Projects</h2> */}
        <div className="cards">
            {Object.keys(projects).map((projectId) => (
                <div key={projectId} className="card" onClick={() => window.location.href = `/projects/${projectId}/`}>
                    <h3>{projects[projectId].name}</h3>
                    <p>{projects[projectId].description}</p>
                </div>
            ))}
            <div className="card create-project-card" onClick={() => window.location.href = "/projects/create"}>
                <h3>Create Project</h3>
                <AddBoxOutlinedIcon style={{ fontSize: 40 }} />
            </div>
        </div>
    </div>
);

const InsightsCards = () => {
    const insights = [
        { id: 1, title: "Employee Efficiency", path: "/insights/employee-efficiency" },
        { id: 2, title: "Project Completion Rate", path: "/insights/project-completion" },
        { id: 3, title: "Task Progress", path: "/insights/task-progress" },
        { id: 4, title: "Resource Utilization", path: "/insights/resource-utilization" },
    ];
    return (
        <div className="cards-container">
            {/* <h2>Insights</h2> */}
            <div className="cards">
                {insights.map((insight) => (
                    <div key={insight.id} className="card" onClick={() => window.location.href = insight.path}>
                        <h3>{insight.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmployeeCards = ({ employees }) => (
    <div className="cards-container">
        {/* <h2>Employees</h2> */}
        <div className="cards">
            {(employees).map((employee) => (
                <div key={employee.employee_id} className="card" onClick={() => window.location.href = `/employees/${employee.employee_id}/`}>
                    <h3>{employee.name}</h3>
                    <p>{employee.email}</p>
                    <p>{employee.position}</p>
                </div>
            ))}
            <div className="card create-employee-card" onClick={() => window.location.href = "/register-employee"}>
                <h3>Register Employee</h3>
                <AddBoxOutlinedIcon style={{ fontSize: 40 }} />
            </div>
        </div>
    </div>
);

export default Dashboard;
