import { useState } from "react";
import { fetchProjects, fetchAccounts, getAccount, registerAccount, createProject, ProjectCreate, AccountCreate } from "../services/api.js";
import { useNavigate, useParams } from "react-router-dom";

import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import InsightsIcon from '@mui/icons-material/Insights';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete } from "@mui/material";
import "../css/dashboard.css";
import "../css/project-display.css";
import Sidebar from "./Sidebar";

const Dashboard = () => {
    const [projects, setProjects] = useState({});
    const [accounts, setAccounts] = useState({});
    const navigate = useNavigate();

    const refreshProjects = () => {
        fetchProjects().then((e) => {
            setProjects(e);
        }).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    const refreshAccounts = () => {
        fetchAccounts().then((e) => {
            setAccounts(e);
        }).catch((e) => {
            console.error(e);
            if (e.status === 401) {
                console.log("Session expired. Redirecting to login page.");
                navigate("/login");
            }
        });
    };

    let funcs = [
        refreshProjects,
        refreshAccounts
    ];

    let elements = {
        projects: {
            element: <ProjectCards projects={projects} refreshProjects={refreshProjects} refreshAccounts={refreshAccounts} />,
            icon: <FolderIcon />,
            urlPath: "/dashboard/projects",
            name: "Projects",
        },
        insights: {
            element: <InsightsCards />,
            icon: <InsightsIcon />,
            urlPath: "/dashboard/insights",
            name: "Insights",
        },
        employees: {
            element: <AccountCards accounts={accounts} refreshAccounts={refreshAccounts} />,
            icon: <AssignmentIndIcon />,
            urlPath: "/dashboard/employees",
            name: "Employees",
        },
    };

    return <Sidebar elements={elements} useEffectFuncs={funcs} />;
};

export default Dashboard;

const ProjectCards = ({ projects, refreshProjects, refreshAccounts }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [projectData, setNewProject] = useState(new ProjectCreate());

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

    const handleManagerChange = (e, value) => {
        setNewProject((prev) => ({ ...prev, project_manager: value.id }));
    }

    const handleSubmit = () => {
        console.log("New Project: ", projectData);

        createProject(projectData)
            .then((createdProject) => {
                refreshProjects();
                handleClose();
                navigate(`/projects/${createdProject.id}/files/`);
            })
            .catch(console.error);
    };

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
                        label="Project Name"
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
        // { id: 1, title: "Account Efficiency", path: "/insights/account-efficiency", description: "View the average efficiency of completing tasks based on time alloted for your accounts" },
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

const AccountCards = ({ accounts, refreshAccounts }) => {
    const [open, setOpen] = useState(false);
    const [accountData, setNewAccount] = useState(new AccountCreate());

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
        refreshAccounts();
    };

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
                <div className="card create-account-card" onClick={handleOpen}>
                    <h3>Register Account</h3>
                    <AddBoxOutlinedIcon style={{ fontSize: 40 }} />
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'lightgray' } }}>
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
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={accountData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Temporary Password"
                        type="text"
                        fullWidth
                        value={accountData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="manager_id"
                        label="Manager ID"
                        type="text"
                        fullWidth
                        value={accountData.manager_id}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="position"
                        label="Position"
                        type="text"
                        fullWidth
                        value={accountData.position}
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
