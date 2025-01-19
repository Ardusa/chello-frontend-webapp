import { useEffect, useState } from "react";
import { fetchProjects, fetchEmployees, getEmployee, registerEmployee, createProject } from "../api";
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
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

import "../css/dashboard.css";

const Dashboard = () => {
    const [projects, setProjects] = useState({});
    const [employees, setEmployees] = useState([]);

    const refreshProjects = () => {
        fetchProjects().then(setProjects).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    const refreshEmployees = () => {
        fetchEmployees().then(setEmployees).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState("projects");
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        refreshProjects();
        refreshEmployees();
    }, []);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <img src={logo} alt="Chello Logo" className="logo-img" />
                <h1 style={{ fontSize: "70px", color: "black", marginTop: "10px" }}>Chello</h1>
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
                {selectedSection === "projects" && <ProjectCards projects={projects} refreshProjects={refreshProjects} />}
                {selectedSection === "insights" && <InsightsCards />}
                {selectedSection === "employees" && <EmployeeCards employees={employees} refreshEmployees={refreshEmployees} />}
            </main>
        </div>
    );
};

const ProjectCards = ({ projects, refreshProjects }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [newProject, setNewProject] = useState({
        company_id: "",
        name: "",
        description: "", // optional
        project_manager: "",
    });

    const handleOpen = () => {
        getEmployee()
            .then((response) => {
                setNewProject((prev) => ({
                    ...prev,
                    company_id: response.company_id,
                    project_manager: response.id,
                }));
            })
            .catch(console.error);
        setOpen(true);
    };

    const handleClose = () => {
        setNewProject({
            company_id: "",
            name: "",
            description: "",
            project_manager: "",
        });
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("New Project: ", newProject);
        createProject(newProject)
            .then((createdProject) => {
                refreshProjects();
                handleClose();
                navigate(`/projects/${createdProject.id}`);
            })
            .catch(console.error);
    };

    return (
        <div className="cards-container">
            <div className="cards">
                {Object.values(projects).map((project) => (
                    <div key={project.id} className="card" onClick={() => window.location.href = `/projects/${project.id}/`}>
                        <h3>{project.name}</h3>
                        {/* {project.description && (
                            <p style={{ fontSize: "15px" }}>{project.description}</p>
                        )} */}
                        <p>Tasks Remaining: {project.tasks_remaining}</p>
                    </div>
                ))}
                <div className="card create-project-card" onClick={handleOpen}>
                    <h3>Create Project</h3>
                    <AddBoxOutlinedIcon style={{ fontSize: 40 }} />
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'lightgray' } }}>
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newProject.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={newProject.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="project_manager"
                        label="Project Manager"
                        type="text"
                        fullWidth
                        value={newProject.project_manager}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const InsightsCards = () => {
    const insights = [
        // { id: 1, title: "Employee Efficiency", path: "/insights/employee-efficiency", description: "View the average efficiency of completing tasks based on time alloted for your employees" },
        { id: 2, title: "Project Completion Rate", path: "/insights/project-completion", description: "View the percentage of your projects completed on time or earlier." },
        { id: 3, title: "Task Progress", path: "/insights/task-progress", description: "View the progress of your assigned tasks." },
    ];
    return (
        <div className="cards-container">
            <div className="cards">
                {insights.map((insight) => (
                    <div key={insight.id} className="card" onClick={() => window.location.href = insight.path}>
                        <h3>{insight.title}</h3>
                        <p>{insight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EmployeeCards = ({ employees, refreshEmployees }) => {
    const [open, setOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        password: "",
        company_id: "",
        position: "Engineer",
        manager_id: "",
    });

    const handleOpen = () => {
        getEmployee()
            .then((response) => {
                setNewEmployee((prev) => ({
                    ...prev,
                    company_id: response.company_id,
                    manager_id: response.id,
                }));
            })
            .catch(console.error);
        setOpen(true);
    };

    const handleClose = () => {
        setNewEmployee({
            name: "",
            email: "",
            password: "",
            company_id: "",
            position: "Engineer",
            manager_id: "",
        });
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("New Employee: ", newEmployee);
        registerEmployee(newEmployee)
            .then(() => handleClose())
            .catch(console.error);
        refreshEmployees();
    };

    return (
        <div className="cards-container">
            <div className="cards">
                {employees.map((employee) => (
                    <div key={employee.id} className="card" onClick={() => window.location.href = `/employees/${employee.employee_id}/`}>
                        <h3>{employee.name}</h3>
                        <p>{employee.email}</p>
                        <p>{employee.position}</p>
                    </div>
                ))}
                <div className="card create-employee-card" onClick={handleOpen}>
                    <h3>Register Employee</h3>
                    <AddBoxOutlinedIcon style={{ fontSize: 40 }} />
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'lightgray' } }}>
                <DialogTitle>Register Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newEmployee.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newEmployee.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Temporary Password"
                        type="text"
                        fullWidth
                        value={newEmployee.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="manager_id"
                        label="Manager ID"
                        type="text"
                        fullWidth
                        value={newEmployee.manager_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="position"
                        label="Position"
                        type="text"
                        fullWidth
                        value={newEmployee.position}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Dashboard;
