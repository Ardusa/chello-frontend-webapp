import { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);  // Ensure it's always an array
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadProjects = async () => {
        try {
            console.log("Fetching projects...");
            const fetchedProjects = await fetchProjects();
            
            // if () {
            //     throw new Error("No data received from server");
            // }

            // if (!Array.isArray(data.assigned_projects)) {
            //     throw new Error("Invalid data format received");
            // }

            setProjects(fetchedProjects); // Set projects if data is valid
            // console.log("Projects fetched (dashboard.jsx):", fetchedProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setError("Error fetching projects. Please try again later.");
            alert("Error fetching projects: " + error.message);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/");
    };

    const handleCreateProject = () => {
        navigate("/projects/create");
    };

    return (
        <div className="centered-container">
            <h2>Dashboard</h2>
            <button className="logout" onClick={handleLogout}>Logout</button>
            <button onClick={handleCreateProject}>Create New Project</button>

            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : projects.length > 0 ? (
                <ul>
                    {projects.map((project) => (
                        <li key={project.project_id}>
                            <a href={`/projects/${project.project_id}`}>{project.project_name}</a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No projects available.</p>
            )}
        </div>
    );
};

export default Dashboard;