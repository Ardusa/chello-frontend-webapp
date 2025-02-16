import axios from "axios";
import { makeAuthenticatedRequest } from "./AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend

/**
 * Represents the response data for an account.
 * @class
 * @param {Object} data - The data to initialize the account response.
 * @param {string} [data.id=""] - Unique identifier for the account, primary key.
 * @param {string} [data.name=""] - Name of the account.
 * @param {string} [data.email=""] - Unique email address of the account.
 * @param {string} [data.password=""] - Password of the account.
 * @param {string} [data.manager_id=""] - Foreign key referencing the manager of the account, nullable.
 * @param {number} [data.position=0] - Position of the account within the company.
 * @param {boolean} [data.free_plan=false] - Boolean indicating if the account is on a free plan.
 * @param {number} [data.task_limit=null] - Maximum number of tasks the account can create.
 * @param {string} [data.company_id=""] - Foreign key referencing the company the account belongs to.
 * @param {Date} [data.account_created=new Date()] - Date and time the account was created.
 * @param {Date} [data.last_login=new Date()] - Date and time the account was last logged into.
 * @param {number} [data.efficiency_score=0.0] - Score indicating the efficiency of the account.
 */
export class AccountResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.email = data.email || "";
        this.password = data.password || "";
        this.company_id = data.company_id || "";
        this.manager_id = data.manager_id || "";
        this.position = data.position || "";
        this.account_created = data.account_created ? new Date(data.account_created) : new Date();
        this.last_login = data.last_login ? new Date(data.last_login) : new Date();
        this.free_plan = data.free_plan || false;
        this.task_limit = data.task_limit || null;
        this.efficiency_score = data.efficiency_score || 0.0;
    }
}


/**
 * Represents an account to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the account creation with.
 * @param {string} [data.name=""] - The name of the account.
 * @param {string} [data.email=""] - The email of the account.
 * @param {string} [data.password=""] - The password of the account.
 * @param {string} [data.manager_id=null] - The ID of the manager of the account.
 * @param {string} [data.position=""] - The position of the account.
 * @param {boolean} [data.free_plan=false] - Boolean indicating if the account is on a free plan.
 * @param {number} [data.task_limit=null] - Maximum number of tasks the account can create.
 * @param {string} [data.company_id=null] - The ID of the company the account belongs to.
 * @param {boolean} [data.create_company=false] - Boolean indicating if a new company should be created.
 */
export class AccountCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.email = data.email || "";
        this.password = data.password || "";
        this.manager_id = data.manager_id || null;
        this.position = data.position || "";
        this.free_plan = data.free_plan || false;
        this.task_limit = data.task_limit || null;
        this.company_id = data.company_id || null;
        this.create_company = data.create_company || false;
    }
}

/**
 * Represents a response for a project.
 * @class
 * @param {Object} [data={}] - The data to initialize the project response with.
 * @param {string} [data.id=""] - The ID of the project.
 * @param {string} [data.name=""] - The name of the project.
 * @param {string} [data.description=""] - The description of the project.
 * @param {string} [data.company_id=""] - The ID of the company the project belongs to.
 * @param {string} [data.project_manager=""] - The ID of the project manager.
 * @param {Date} [data.project_created=new Date()] - The date and time the project was created.
 * @param {Date} [data.project_started=null] - The date and time the project was started.
 * @param {Date} [data.project_completed=null] - The date and time the project was completed.
 * @param {boolean} [data.is_finished=false] - Boolean indicating if the project is finished.
 */
export class ProjectResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
        this.project_manager = data.project_manager || "";
        this.project_created = data.project_created ? new Date(data.project_created) : new Date();
        this.project_started = data.project_started ? new Date(data.project_started) : null;
        this.project_completed = data.project_completed ? new Date(data.project_completed) : null;
        this.is_finished = data.is_finished || false;
    }
}

/**
 * Represents a project to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the project creation with.
 * @param {string} [data.name=""] - The name of the project.
 * @param {string} [data.description=""] - The description of the project.
 * @param {string} [data.company_id=""] - The ID of the company the project belongs to.
 * @param {string} [data.project_manager=""] - The ID of the project manager.
 */
export class ProjectCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.description = data.description || "";
        this.company_id = data.company_id || "";
        this.project_manager = data.project_manager || "";
    }
}

/**
 * Represents a response for a task.
 * @class
 * Creates an instance of TaskResponse.
 * @param {Object} [data={}] - The data to initialize the task response with.
 * @param {string} [data.id=""] - The ID of the task.
 * @param {string} [data.name=""] - The name of the task.
 * @param {string} [data.description=""] - The description of the task.
 * @param {string} [data.project_id=""] - The ID of the project the task belongs to.
 * @param {string} [data.assigned_to=""] - The ID of the user the task is assigned to.
 * @param {string} [data.parent_task_id=""] - The ID of the parent task, if any.
 * @param {number} [data.order=0] - The order of the task within the project.
 * @param {Date} [data.task_created=new Date()] - The date and time the task was created.
 * @param {Date} [data.task_started=null] - The date and time the task was started.
 * @param {Date} [data.task_completed=null] - The date and time the task was completed.
 * @param {boolean} [data.is_finished=false] - Boolean indicating if the task is finished.
 * @param {number} [data.task_human_estimated_man_hours=null] - Estimated time of completion, given by the task creator.
 * @param {number} [data.task_AI_estimated_man_hours=null] - Estimated time of completion, given by the neural network.
 * @param {number} [data.task_actual_man_hours=null] - Actual time of completion.
 */
export class TaskResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.project_id = data.project_id || "";
        this.assigned_to = data.assigned_to || "";
        this.parent_task_id = data.parent_task_id || "";
        this.order = data.order || 0;
        this.task_created = data.task_created ? new Date(data.task_created) : new Date();
        this.task_started = data.task_started ? new Date(data.task_started) : null;
        this.task_completed = data.task_completed ? new Date(data.task_completed) : null;
        this.is_finished = data.is_finished || false;
        this.task_human_estimated_man_hours = data.task_human_estimated_man_hours || null;
        this.task_AI_estimated_man_hours = data.task_AI_estimated_man_hours || null;
        this.task_actual_man_hours = data.task_actual_man_hours || null;
    }
}

/**
 * Represents a task to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the task creation with.
 * @param {string} [data.name=""] - The name of the task.
 * @param {string} [data.description=""] - The description of the task.
 * @param {string} [data.project_id=""] - The ID of the project the task belongs to.
 * @param {string} [data.assigned_to=""] - The ID of the user the task is assigned to.
 * @param {string} [data.parent_task_id=null] - The ID of the parent task, if any.
 * @param {number} [data.order=0] - The order of the task within the project.
 */
export class TaskCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.description = data.description || "";
        this.project_id = data.project_id || "";
        this.assigned_to = data.assigned_to || "";
        this.parent_task_id = data.parent_task_id || null;
        this.order = data.order || 0;
    }
}

/**
 * Represents a response for a company.
 * @class
 * @param {Object} [data={}] - The data to initialize the company response with.
 * @param {string} [data.id=""] - The ID of the company.
 * @param {string} [data.name=""] - The name of the company.
 * @param {Date} [data.founding_date=new Date()] - The date the company was founded.
 * @param {string} [data.founding_member=""] - The ID of the founding member of the company.
 */
export class CompanyResponse {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.founding_date = data.founding_date ? new Date(data.founding_date) : new Date();
        this.founding_member = data.founding_member || "";
    }
}

/**
 * Represents a company to create.
 * @class
 * @param {Object} [data={}] - The data to initialize the company creation with.
 * @param {string} [data.name=""] - The name of the company.
 * @param {string} [data.founding_member=""] - The ID of the founding member of the company.
 * @param {number} [data.task_limit=20000] - The maximum number of tasks the company can create.
 * @param {string} [data.logo=""] - The logo image string of the company.
 */
export class CompanyCreate {
    constructor(data = {}) {
        this.name = data.name || "";
        this.founding_member = data.founding_member || "";
        this.task_limit = data.task_limit || 20000;
        this.logo = data.logo || "";
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
 * @param {boolean} createCompany - Boolean indicating if a new company should be created.
 * @returns {Promise<AccountResponse>} A promise that resolves to the created account data.
 */
export const createAccount = async (account_data) => {
    const response = await axios.put(`${API_BASE_URL}/accounts/register-account`, account_data);
    const json = await response.data;
    return json;
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
    const response = await makeAuthenticatedRequest(`/tasks/${task_id}`, {
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
    const response = await makeAuthenticatedRequest(`/projects/${project_id}`, {
        method: "DELETE",
    });

    return response;
}


/**
 * Fetches the logo of the user's company.
 * @async
 * @function fetchLogo
 * @returns {Promise<string>} A promise that resolves to the logo image base64 string.
 */
export const fetchLogo = async () => {
    const response = await makeAuthenticatedRequest("/companies/logo");
    const json = await response.json();
    if (json === "") {
        return null;
    }
    return json;
}

// ? Company API

/**
 * Fetches the details of the currently logged-in company.
 * @async
 * @function getCompany
 * @param {CompanyCreate} companyData - The data for the company to create.
 * @returns {Promise<CompanyResponse>} A promise that resolves to the details of the company.
 */
export const createCompany = async (companyData) => {
    console.log("Company Data:", companyData);
    const response = await makeAuthenticatedRequest("/companies/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
    });

    const json = await response.json();
    return json;
}

/**
 * Update the details of the currently logged-in account.
 * @async
 * @function updateAccount
 * @param {AccountResponse} accountData - The account data to update.
 * @returns {Promise<AccountResponse>} A promise that resolves to the updated account data.
 */
export const updateAccount = async (accountData) => {
    const response = await makeAuthenticatedRequest("/accounts/update-account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData),
    });

    const json = await response.json();
    return json;
}