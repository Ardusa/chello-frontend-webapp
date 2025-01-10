import { useEffect, useState } from "react";
import { fetchProjects } from "./api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate(); // To redirect the user after logout

    useEffect(() => {
        console.log("useEffect triggered");
        const loadProjects = async () => {
            try {
                console.log("Fetching projects...");
                const data = await fetchProjects();
                console.log("Projects fetched:", data);
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
                alert("Error fetching projects. Please try again later.");
            }
        };

        loadProjects();
    }, []);  // Empty dependency array to ensure this only runs once       

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/"); // This will navigate to the login screen
    };

    return (
        <div className="centered-container">
            <h2>Your Projects</h2>
            <button className="logout" onClick={handleLogout}>Logout</button> {/* Logout button */}
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
