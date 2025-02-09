import { useEffect, useState } from "react";
import { fetchProjects, fetchEmployees, getEmployee, registerEmployee, createProject, ProjectCreate, EmployeeCreate } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";

import LogoutIcon from "@mui/icons-material/Logout";
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete } from "@mui/material";

import { useAuth } from "../services/AuthService";


import "../css/dashboard.css";

let Projects = {};
let Employees = [];
let employeeToId = [];

const Dashboard = () => {
    const [projects, setProjects] = useState(Projects);
    const [employees, setEmployees] = useState(Employees);

    const refreshProjects = () => {
        fetchProjects().then((e) => {
            Projects = e;
            setProjects(e);
        }
        ).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    const refreshEmployees = () => {
        fetchEmployees().then((e) => {
            Employees = e;
            getEmployee().then((currentUser) => {
                employeeToId = [
                    { name: currentUser.name, id: currentUser.id },
                    ...e.map(employee => ({
                        name: employee.name,
                        id: employee.id
                    }))
                ];
            });
            console.log("Employee to ID:", employeeToId);
            setEmployees(e);
        }
        ).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    useEffect(() => {
        refreshProjects();
        refreshEmployees();
    }, []);

    const { section } = useParams();
    const [selectedSection, setSelectedSection] = useState(section || "projects");
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSettings = () => {
        navigate("/settings");
    }

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
                <Button variant="contained" color="info" className="settings-btn" startIcon={<SettingsIcon />} onClick={() => handleSettings()}>
                    Settings
                </Button>
                <Button variant="outlined" color="error" className="logout-btn" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                    Logout
                </Button>
            </aside>

            {/* Main Content */}
            <main className="content">
                {selectedSection === "projects" && <ProjectCards projects={projects} refreshProjects={refreshProjects} refreshEmployees={refreshEmployees} />}
                {selectedSection === "insights" && <InsightsCards />}
                {selectedSection === "employees" && <EmployeeCards employees={employees} refreshEmployees={refreshEmployees} />}
            </main>
        </div>
    );
};

const ProjectCards = ({ projects, refreshProjects, refreshEmployees }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [projectData, setNewProject] = useState(new ProjectCreate());

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
        setNewProject(new ProjectCreate());
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleManagerChange = (e, value) => {
        setNewProject((prev) => ({ ...prev, project_manager: value.id }));
    }

    const handleSubmit = () => {
        console.log("New Project: ", projectData);

        createProject(projectData)
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
                        value={projectData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={projectData.description}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        autoSelect
                        autoHighlight
                        margin='normal'
                        onChange={handleManagerChange}
                        name="project_manager"
                        value={employeeToId[0]}
                        label="Project Manager"
                        disablePortal
                        fullWidth
                        options={employeeToId}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="Manager" />}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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

const EmployeeCards = ({ employees, refreshProjects, refreshEmployees }) => {
    const [open, setOpen] = useState(false);
    const [employeeData, setNewEmployee] = useState(new EmployeeCreate());

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
        setNewEmployee(new EmployeeCreate());
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("New Employee: ", employeeData);
        registerEmployee(employeeData)
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
                        value={employeeData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={employeeData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Temporary Password"
                        type="text"
                        fullWidth
                        value={employeeData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="manager_id"
                        label="Manager ID"
                        type="text"
                        fullWidth
                        value={employeeData.manager_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="position"
                        label="Position"
                        type="text"
                        fullWidth
                        value={employeeData.position}
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
