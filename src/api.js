// import axios from "axios";
import { makeAuthenticatedRequest } from "./services/AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend

export const fetchProjects = async () => {
    try {
        const response = await makeAuthenticatedRequest("/projects/get-projects");
        const json = await response.json();
        const projects = json.assigned_projects;

        return projects;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }

        throw error;
    }
};

export const fetchEmployees = async () => {
    return [];
}

export const fetchProjectDetails = async (project_id) => {
    const response = await makeAuthenticatedRequest(`/projects/${project_id}/`);
    const json = await response.json();
    return json;
}

export const createProject = async (projectData) => {
    const response = await makeAuthenticatedRequest("/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
    });

    return response;
}

export const getEmployeeId = async () => {
    const response = await makeAuthenticatedRequest("/get-id");
    const json = await response.json();
    return json.id;
}

export const registerEmployee = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, employeeData);
    return response;
}