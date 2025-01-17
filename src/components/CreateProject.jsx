import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { makeAuthenticatedRequest } from "../services/AuthService";
import ProjectTreeView from "./ProjectTreeView.jsx"; // Assuming this is your tree component
import "../css/create-project.css";
import { createProject } from "../api.js";

const CreateProject = () => {
    const [projectData, setProjectData] = useState({
        project_id: "",
        project_name: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0], // Default to current date
        end_date: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const response = await makeAuthenticatedRequest("/projects/create", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(projectData),
        // });

        const response = createProject(projectData);
        const data = await response.json();

        if (response.ok) {
            alert("Project created successfully: " + data.project_id);
            navigate("/dashboard");
        }
        else if (response.status === 401) {
            alert("Session expired. Please log in again.");
            navigate("/login");
        }
        else {
            alert("Failed to create project");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div className="create-project-container">
            <div className="tree-view-container">
                <h2>Project Structure</h2>
                <ProjectTreeView projectName={projectData.project_name} />
            </div>

            <div className="form-container">
                <h2>Create a New Project</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <label>Project ID *</label>
                        <input type="text" name="project_id" value={projectData.project_id} onChange={handleChange} required />
                    </div>

                    <div className="form-input">
                        <label>Project Name *</label>
                        <input type="text" name="project_name" value={projectData.project_name} onChange={handleChange} required />
                    </div>

                    <div className="form-input">
                        <label>Description *</label>
                        <textarea name="description" value={projectData.description} onChange={handleChange} required style={{ height: "35px", width: "269px" }} />
                    </div>

                    <div className="form-input">
                        <label>Start Date *</label>
                        <input type="date" name="start_date" value={projectData.start_date} onChange={handleChange} required />
                    </div>

                    <div className="form-input">
                        <label>End Date</label>
                        <input type="date" name="end_date" value={projectData.end_date} onChange={handleChange} />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="create-project-btn">Create Project</button>
                        <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default CreateProject;