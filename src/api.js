import axios from "axios";
import { makeAuthenticatedRequest } from "./services/AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend


/**
{
    project_id: Project,
    ...
}
*/
export const fetchProjects = async () => {
    const response = await makeAuthenticatedRequest("/projects/get-projects");
    const json = await response.json();


    // ! Debugging
    console.log("Projects:", json);

    return json;
};

export const fetchEmployees = async () => {
    const response = await makeAuthenticatedRequest("/employees/get-employees");
    const json = await response.json();

    // ! Debugging
    console.log("Employees:", json);

    return json;
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

    const json = await response.json();

    // ! Debugging
    console.log("Project created:", json);

    return json;
}

export const getEmployee = async () => {
    const response = await makeAuthenticatedRequest("/get-id/");
    const json = await response.json();
    return json;
}

export const registerEmployee = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/create-new-employee`, employeeData);
    return response;
}

export const createAccount = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/register-account`, employeeData);
    return response;
}

export const setPassword = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/set-password`, employeeData);
    return response;
}