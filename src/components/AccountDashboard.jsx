import { useState, useEffect } from "react";
import { fetchProjects, fetchAccounts, getAccount, registerAccount, createProject, ProjectCreate, AccountCreate, AccountResponse } from "../services/api.js";
import { useNavigate, useParams } from "react-router-dom";

import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import "../css/dashboard.css";
import "../css/project-display.css";
import Sidebar from "./Sidebar.jsx";

const Dashboard = () => {
    let elements = {
        projects: {
            element: <ProjectCards/>,
            icon: <FolderIcon />,
            urlPath: "/dashboard/projects",
            name: "Projects",
        },
        insights: {
            element: <InsightsCards />,
            icon: <InsightsIcon />,
            urlPath: "/dashboard/insights",
            name: "Insights",
        }
    };

    let company_elements = {
        employees: {
            element: <AccountCards/>,
            icon: <AssignmentIndIcon />,
            urlPath: "/dashboard/employees",
            name: "Employees",
        },
    };

    return <Sidebar elements={elements} companyElements={company_elements} loadingElement={false} />;
};

export default Dashboard;

const ProjectCards = () => {
    const [projects, setProjects] = useState({});
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [projectData, setNewProject] = useState(new ProjectCreate());

    useEffect(() => {
        const fetchData = async () => {
            const projects = await fetchProjects();
            setProjects(projects);
        }

        fetchData();
    }, []);

    const handleOpen = () => {
        getAccount()
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

    const handleSubmit = () => {
        console.log("New Project: ", projectData);

        createProject(projectData)
            .then((createdProject) => {
                handleClose();
                navigate(`/projects/${createdProject.id}/files/`);
            })
            .catch(console.error);
    };

    const isFormValid = projectData.name && projectData.description;

    return (
        <div className="cards-container">
            <div className="cards">
                {Object.keys(projects).map((projectId) => {
                    const project = projects[projectId];
                    return (
                        <div key={project.id} className="card" onClick={() => window.location.href = `/projects/${project.id}/files`}>
                            <h3>{project.name}</h3>
                            <p>Tasks Remaining: {project.tasks_remaining}</p>
                        </div>
                    );
                })}
                <div className="card add-card" onClick={handleOpen}>
                    <h3>Create Project</h3>
                    <AddBoxOutlinedIcon className="add-sign" />
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Project Name"
                        type="text"
                        fullWidth
                        value={projectData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={projectData.description}
                        onChange={handleChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={!isFormValid} aria-required="true">
                        Create Project
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const InsightsCards = () => {
    const insights = [
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

const AccountCards = () => {
    const [accounts, setAccounts] = useState({});
    const [open, setOpen] = useState(false);
    const [accountData, setNewAccount] = useState(new AccountCreate());

    useEffect(() => {
        const fetchData = async () => {
            const accounts = await fetchAccounts();
            setAccounts(accounts);
        }

        fetchData();
    }, []);

    const handleOpen = () => {
        getAccount()
            .then((response) => {
                setNewAccount((prev) => ({
                    ...prev,
                    company_id: response.company_id,
                    manager_id: response.id,
                }));
            })
            .catch(console.error);
        setOpen(true);
    };

    const handleClose = () => {
        setNewAccount(new AccountCreate());
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAccount((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("New Account: ", accountData);
        registerAccount(accountData)
            .then(() => handleClose())
            .catch(console.error);
        fetchAccounts().then((e) => {
            setAccounts(e);
        }).catch((e) => {
            console.error(e);
        });
    };

    const isFormValid = accountData.name && accountData.email && accountData.password && accountData.position;

    return (
        <div className="cards-container">
            <div className="cards">
                {accounts.length > 0 && accounts.map((account) => (
                    <div key={account.id} className="card" onClick={() => window.location.href = `/accounts/${account.account_id}/`}>
                        <h3>{account.name}</h3>
                        <p>{account.email}</p>
                        <p>{account.position}</p>
                    </div>
                ))}
                <div className="card add-card" onClick={handleOpen}>
                    <h3>Add Employee</h3>
                    <AddBoxOutlinedIcon className="add-sign" />
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Register Account</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={accountData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={accountData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Temporary Password"
                        type="text"
                        fullWidth
                        value={accountData.password}
                        onChange={handleChange}
                        required
                    />
                    {/* <TextField
                        margin="dense"
                        name="manager_id"
                        label="Manager ID"
                        type="text"
                        fullWidth
                        value={accountData.manager_id}
                        onChange={handleChange}
                        required
                    /> */}
                    <TextField
                        margin="dense"
                        name="position"
                        label="Position"
                        type="text"
                        fullWidth
                        value={accountData.position}
                        onChange={handleChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" style={{ fontSize: "20px", marginRight: "10px" }} >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" style={{ fontSize: "20px" }} disabled={!isFormValid}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};