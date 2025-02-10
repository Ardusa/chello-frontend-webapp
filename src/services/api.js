import axios from "axios";
import { makeAuthenticatedRequest } from "./services/AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend

export class EmployeeResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.email = data.email || "";
        this.company_id = data.company_id || "";
        this.position = data.position || "";
        this.manager_id = data.manager_id || "";
    }
}

export class EmployeeCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.email = data.email || "";
        this.password = data.password || "";
        this.company_id = data.company_id || "";
        this.position = data.position || "";
        this.manager_id = data.manager_id || "";
    }
}

export class ProjectResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.project_manager = data.project_manager || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
    }
}

export class ProjectCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.project_manager = data.project_manager || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
    }
}

/**
{
    project_id: Project,
    ...
}
*/

/**
 * Fetches the list of projects from the server for the current employee.
 * @async
 * @function fetchProjects
 * @returns {Promise<Object>} A promise that resolves to a dictionary of projects where the key is the project_id and the value is a {@link ProjectResponse} object.
 */
export const fetchProjects = async () => {
    const response = await makeAuthenticatedRequest("/projects/get-projects");
    const json = await response.json();


    // ! Debugging
    // console.log("Projects:", json);

    return json;
};

/**
 * Fetches the list of employees from the server.
 *
 * @async
 * @function fetchEmployees
 * @returns {Promise<Object>} A promise that resolves to a dictionary of employees where the key is the employee_id and the value is an EmployeeResponse object.
 */
export const fetchEmployees = async () => {
    const response = await makeAuthenticatedRequest("/employees/get-employees");
    const json = await response.json();

    // ! Debugging
    console.log("Employees:", json);

    return json;
}


/**
 * Fetches the details of a specific employee from the server.
 * @async
 * @function fetchEmployeeDetails
 * @param {string} employee_id - The ID of the employee to fetch.
 * @returns {Promise<EmployeeResponse>} A promise that resolves to the details of the employee.
 */
export const fetchEmployeeDetails = async (employee_id) => {
    const response = await makeAuthenticatedRequest(`/employees/${employee_id}`);
    const json = await response.json();
    return json;
}

/**
 * Fetches the details of a specific project from the server.
 * @async
 * @function fetchProjectDetails
 * @param {string} project_id - The ID of the project to fetch.
 * @returns {Promise<ProjectResponse>} A promise that resolves to the details of the project.
 */
export const fetchProjectDetails = async (project_id) => {
    const response = await makeAuthenticatedRequest(`/projects/${project_id}/`);
    const json = await response.json();
    return json;
}

/**
 * Creates a new project on the server.
 * @async
 * @function createProject
 * @param {ProjectCreate} projectData - The project data to create.
 * @returns {Promise<ProjectResponse>} A promise that resolves to the created project data.
 */
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

/**
 * Fetches the details of the currently logged-in employee.
 * @async
 * @function getEmployee
 * @returns {Promise<EmployeeResponse>} A promise that resolves to the details of the employee.
 */
export const getEmployee = async () => {
    const response = await makeAuthenticatedRequest("/employees/self");
    const json = await response.json();
    return json;
}

/**
 * Put a new employee into the company database.
 * @async
 * @function registerEmployee
 * @param {Object} employeeData - The employee data to create.
 * @returns {Promise<EmployeeResponse>} A promise that resolves to the created employee data.
 */
export const registerEmployee = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/create-new-employee`, employeeData);
    return response;
}

/**
 * Create a new account for a completely new company.
 * @async
 * @function createAccount
 * @param {EmployeeCreate} employeeData - The employee data to create.
 * @returns {Promise<EmployeeResponse>} A promise that resolves to the created employee data.
 */
export const createAccount = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/register-account`, employeeData);
    return response;
}

/**
 * Set a password for an existing employee.
 * @async
 * @function setPassword
 * @param {Object} employeeData - The employee data to create.
 * @returns {Promise<Object>} A promise that resolves to the created employee data.
 */
export const setPassword = async (employeeData) => {
    const response = await axios.post(`${API_BASE_URL}/set-password`, employeeData);
    return response;
}