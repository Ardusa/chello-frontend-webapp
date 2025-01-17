import { useEffect, useState } from "react";
import { fetchProjects, fetchEmployees } from "../api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
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
        // localStorage.removeItem("access_token");
        // localStorage.removeItem("refresh_token");
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
                <div className="logo">
                    <img src={logo} alt="Chello Logo" className="logo-img" />
                    <h1>Chello</h1>
                </div>
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
                        >
                            {section.name}
                        </Button>
                    ))}
                </nav>
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
        <h2>Projects</h2>
        <div className="cards">
            {projects.map((project) => (
                <div key={project.project_id} className="card" onClick={() => window.location.href = `/projects/${project.project_id}/`}>
                    <h3>{project.project_name}</h3>
                    <p>{project.description}</p>
                </div>
            ))}
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
            <h2>Insights</h2>
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
        <h2>Employees</h2>
        <div className="cards">
            {employees.map((employee) => (
                <div key={employee.employee_id} className="card" onClick={() => window.location.href = `/employees/${employee.employee_id}/`}>
                    <h3>{employee.name}</h3>
                    <p>{employee.email}</p>
                    <p>{employee.title}</p>
                </div>
            ))}
        </div>
    </div>
);

export default Dashboard;
