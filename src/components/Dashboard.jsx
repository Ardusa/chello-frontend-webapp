import { useEffect, useState } from "react";
import { fetchProjects } from "../api";
// import { useAuth } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, List, ListItem, ListItemButton, ListItemText, Paper, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import "../css/dashboard.css";

const Dashboard = () => {
    // const { handleLogout2 } = useAuth();
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
    };

    const handleCreateProject = async () => {
        navigate("/projects/create");
    };

    useEffect(() => {
        const loadProjects = async () => {
            try {
                console.log("Fetching projects...");
                const fetchedProjects = await fetchProjects();
                setProjects(fetchedProjects); // Set projects if data is valid
                // console.log("Projects fetched (dashboard.jsx):", fetchedProjects);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError("Error fetching projects. Please try again later.");
                // if (error.response.status !== 401) {
                // console.error("Error fetching projects:", error);
                // setError("Error fetching projects. Please try again later.");
                // alert("Error fetching projects: " + error.message);
                // }
                if (error.response && error.response.status === 401) {
                    alert("Session expired. Redirecting to login...");
                    handleLogout();
                }
            }
        };

        loadProjects();
    }, []);

    return (
        <Container maxWidth="md" className="dashboard-container">
            <Paper elevation={6} className="dashboard-card">
                <Typography variant="h4" className="dashboard-title">Dashboard</Typography>
                <Box className="dashboard-buttons">
                    <Button variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />} onClick={() => handleCreateProject()}>
                        New Project
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </Box>

                {error && <Typography color="error">{error}</Typography>}

                {projects && projects.length > 0 ? (
                    <List className="project-list">
                        {projects.map((project) => (
                            <ListItem key={project.project_id} disablePadding>
                                <ListItemButton component="a" href={`/projects/${project.project_id}/`} className="project-item">
                                    <ListItemText primary={project.project_name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" className="no-projects">No projects available.</Typography>
                )}
            </Paper>
        </Container>
    );

};


export default Dashboard;