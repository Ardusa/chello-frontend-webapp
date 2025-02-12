import axios from "axios";
import { makeAuthenticatedRequest } from "./AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend

/**
 * Represents the response data for an account.
 * @class
 * @param {Object} data - The data to initialize the account response.
 * @param {string} [data.id=""] - The ID of the account.
 * @param {string} [data.name=""] - The name of the account.
 * @param {string} [data.email=""] - The email of the account.
 * @param {string} [data.company_id=""] - The ID of the company the account belongs to.
 * @param {string} [data.position=""] - The position of the account.
 * @param {string} [data.manager_id=""] - The ID of the manager of the account.
 */
export class AccountResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.email = data.email || "";
        this.company_id = data.company_id || "";
        this.position = data.position || "";
        this.manager_id = data.manager_id || "";
    }
}


/**
 * Represents an account to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the account creation with.
 * @param {string} [data.name=""] - The name of the account.
 * @param {string} [data.email=""] - The email of the account.
 * @param {string} [data.password=""] - The password of the account.
 * @param {string} [data.company_id=""] - The ID of the company the account belongs to.
 * @param {string} [data.position=""] - The position of the account.
 * @param {string} [data.manager_id=""] - The ID of the manager of the account.
 */
export class AccountCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.email = data.email || "";
        this.password = data.password || "";
        this.company_id = data.company_id || "";
        this.position = data.position || "";
        this.manager_id = data.manager_id || "";
    }
}

/**
 * Represents a response for a project.
 * @class
 * @param {Object} [data={}] - The data to initialize the project response with.
 * @param {string} [data.id=""] - The ID of the project.
 * @param {string} [data.name=""] - The name of the project.
 * @param {string} [data.project_manager=""] - The ID of the project manager.
 * @param {string} [data.description=""] - The description of the project.
 * @param {string} [data.company_id=""] - The ID of the company the project belongs to.
 */
export class ProjectResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.project_manager = data.project_manager || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
    }
}

/**
 * Represents a project to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the project creation with.
 * @param {string} [data.name=""] - The name of the project.
 * @param {string} [data.project_manager=""] - The ID of the project manager.
 * @param {string} [data.description=""] - The description of the project.
 * @param {string} [data.company_id=""] - The ID of the company the project belongs to.
 */
export class ProjectCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.project_manager = data.project_manager || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
    }
}

/**
 * Represents a response for a task.
 * @class
 * Creates an instance of TaskResponse.
 * @param {Object} [data={}] - The data to initialize the task response with.
 * @param {string} [data.id=""] - The ID of the task.
 * @param {string} [data.project_id=""] - The ID of the project the task belongs to.
 * @param {string} [data.name=""] - The name of the task.
 * @param {string} [data.description=""] - The description of the task.
 * @param {string} [data.assigned_to=""] - The ID of the user the task is assigned to.
 * @param {string} [data.parent_task_id=""] - The ID of the parent task, if any.
 */
export class TaskResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.project_id = data.project_id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.assigned_to = data.assigned_to || "";
        this.parent_task_id = data.parent_task_id || "";
    }
}

/**
 * Represents a task to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the task creation with.
 * @param {string} [data.project_id=""] - The ID of the project the task belongs to.
 * @param {string} [data.name=""] - The name of the task.
 * @param {string} [data.description=""] - The description of the task.
 * @param {string} [data.assigned_to=""] - The ID of the user the task is assigned to.
 * @param {string} [data.parent_task_id=""] - The ID of the parent task, if any.
 */
export class TaskCreate {
    constructor(data = {}) {
        this.project_id = data.project_id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.assigned_to = data.assigned_to || "";
        this.parent_task_id = data.parent_task_id || "";
    }
}

/**
 * Represents a response for a company.
 * @class
 * @param {Object} [data={}] - The data to initialize the company response with.
 * @param {string} [data.id=""] - The ID of the company.
 * @param {string} [data.name=""] - The name of the company.
 * @param {string} [data.founding_member=""] - The ID of the founding member of the company.
 */
export class CompanyResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.founding_member = data.founding_member || "";
    }
}

/**
 * Represents a company to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the company creation with.
 * @param {string} [data.name=""] - The name of the company.
 * @param {string} [data.founding_member=""] - The ID of the founding member of the company.
 */
export class CompanyCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.founding_member = data.founding_member || "";
    }
}


/**
 * Fetches the list of projects from the server for the current account.
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
 * Fetches the list of accounts from the server.
 *
 * @async
 * @function fetchAccounts
 * @returns {Promise<Object>} A promise that resolves to a dictionary of accounts where the key is the account_id and the value is an AccountResponse object.
 */
export const fetchAccounts = async () => {
    const response = await makeAuthenticatedRequest("/accounts/get-accounts");
    const json = await response.json();
    return json;
}


/**
 * Fetches the details of a specific account from the server.
 * @async
 * @function fetchAccountDetails
 * @param {string} account_id - The ID of the account to fetch.
 * @returns {Promise<AccountResponse>} A promise that resolves to the details of the account.
 */
export const fetchAccountDetails = async (account_id) => {
    const response = await makeAuthenticatedRequest(`/accounts/${account_id}`);
    const json = await response.json();
    return json;
}

/**
 * Fetches the details of a specific project from the server.
 * @async
 * @function fetchProjectDetails
 * @param {string} project_id - The ID of the project to fetch.
 * @returns {Promise<Object>} A promise that resolves to the details of the project.
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
    });

    const json = await response.json();
    return json;
}

/**
 * Fetches the details of the currently logged-in account.
 * @async
 * @function getAccount
 * @returns {Promise<AccountResponse>} A promise that resolves to the details of the account.
 */
export const getAccount = async () => {
    const response = await makeAuthenticatedRequest("/accounts/self");
    const json = await response.json();
    return json;
}

/**
 * Put a new account into the company database.
 * @async
 * @function registerAccount
 * @param {Object} accountData - The account data to create.
 * @returns {Promise<AccountResponse>} A promise that resolves to the created account data.
 */
export const registerAccount = async (accountData) => {
    const response = await axios.put(`${API_BASE_URL}/accounts/register-account`, accountData);
    return response;
}

/**
 * Create a new account for a completely new company.
 * @async
 * @function createAccount
 * @param {AccountCreate} accountData - The account data to create.
 * @returns {Promise<AccountResponse>} A promise that resolves to the created account data.
 */
export const createAccount = async (accountData) => {
    const response = await axios.put(`${API_BASE_URL}/accounts/register-account`, accountData);
    return response;
}

/**
 * Set a password for an existing account.
 * @async
 * @function setPassword
 * @param {Object} accountData - The account data to create.
 * @returns {Promise<Object>} A promise that resolves to the created account data.
 */
export const setPassword = async (accountData) => {
    const response = await axios.post(`${API_BASE_URL}/set-password`, accountData);
    return response;
}

/**
 * Creates a new task on the server.
 * @async
 * @function createTask
 * @param {TaskCreate} taskData - The task data to create.
 * @returns {Promise<TaskResponse>} A promise that resolves to the created task data.
 */
export const createTask = async (taskData) => {
    const response = await makeAuthenticatedRequest(`/tasks/create-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });

    const json = await response.json();
    return json;
};

/**
 * Deletes a task from the server.
 * @async
 * @function deleteTask
 * @param {string} task_id - The ID of the task to delete.
 * @returns {Promise<Object>} A promise that resolves to the response from the server.
 */
export const deleteTask = async (task_id) => {
    const response = await makeAuthenticatedRequest(`/tasks/${task_id}/delete`, {
        method: "DELETE",
    });

    return response;
}

/**
 * Fetches the details of a specific task from the server.
 * @async
 * @function fetchTaskDetails
 * @param {string} task_id - The ID of the task to fetch.
 * @returns {Promise<TaskResponse>} A promise that resolves to the details of the task.
 */
export const fetchTaskDetails = async (task_id) => {
    const response = await makeAuthenticatedRequest(`/tasks/${task_id}`);
    const json = await response.json();
    return json;
}

/**
 * Deletes a project from the server.
 * @async
 * @function deleteProject
 * @param {string} project_id - The ID of the project to delete.
 * @returns {Promise<Object>} A promise that resolves to the response from the server.
 */
export const deleteProject = async (project_id) => {
    const response = await makeAuthenticatedRequest(`/projects/${project_id}/delete`, {
        method: "DELETE",
    });

    return response;
}