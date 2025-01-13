import React, { useState } from "react";
import { makeAuthenticatedRequest } from "../services/AuthService";
import ProjectTreeView from "./ProjectTreeView.jsx"; // Assuming this is your tree component
import "../css/styles.css";

const CreateProject = () => {
    const [projectData, setProjectData] = useState({
        project_id: "",
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await makeAuthenticatedRequest("/projects/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "/dashboard";
            alert("Project created successfully: " + data.project_id);
        } else {
            alert("Failed to create project");
        }
    };

    const handleCancel = () => {
        window.location.href = "/dashboard";  // Redirects back to the dashboard
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
                    <label>Project ID:</label>
                    <input type="text" name="project_id" value={projectData.project_id} onChange={handleChange} required />

                    <label>Project Name:</label>
                    <input type="text" name="project_name" value={projectData.project_name} onChange={handleChange} required />

                    <label>Description:</label>
                    <textarea name="description" value={projectData.description} onChange={handleChange} required />

                    <label>Start Date:</label>
                    <input type="date" name="start_date" value={projectData.start_date} onChange={handleChange} required />

                    <label>End Date:</label>
                    <input type="date" name="end_date" value={projectData.end_date} onChange={handleChange} required />

                    <button type="submit">Create Project</button>
                    <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;