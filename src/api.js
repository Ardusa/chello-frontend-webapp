import axios from "axios";
import { getAccessTokenWithRefresh, makeAuthenticatedRequest } from "./services/AuthService";

// TODO: Update the API_BASE_URL to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend
// const API_BASE_URL = "http://192.168.0.80:8000"; // Adjust based on your backend

// export const login = async (id, password) => {
//     // const response = await axios.post(`${API_BASE_URL}/token/`, 
//     //     new URLSearchParams({ username: id, password: password })
//     // );
//     const response = makeAuthenticatedRequest("/token", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({ username: id, password: password }),
//     });
//     localStorage.setItem("token", response.data.access_token);
//     return response.data;
// };

export const fetchProjects = async () => {
    try {
        const response = await makeAuthenticatedRequest("/projects/get-projects");
        const json = await response.json();
        const projects = json.assigned_projects;
        // return json.assigned_projects;
        // console.log("Projects fetched:", projects); // ! Debugging
        return projects;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        // console.error("Error in fetchProjects:", error);
        throw error;
    }
};

export const fetchEmployees = async () => {
    return [];
}

export const fetchProjectDetails = async (project_id) => {

    // try {
    const response = await makeAuthenticatedRequest(`/projects/${project_id}/`);
    const json = await response.json();
    return json;
    // } catch (error) {
    // console.error("Error in fetchProjectDetails:", error);
    // throw error;
    // }
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