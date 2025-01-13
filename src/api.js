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
        // const response = await fetch(`${API_BASE_URL}/get_projects/`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // });
        const response = await makeAuthenticatedRequest("/projects/get_projects");
        const json = await response.json();
        const projects = json.assigned_projects;
        // return json.assigned_projects;
        // console.log("Projects fetched:", projects); // ! Debugging
        return projects;
    } catch (error) {
        if (error.status === 404) {
            return [];
        }
        console.error("Error in fetchProjects:", error);
        throw error;  // Make sure this is thrown to propagate to the `loadProjects` error handling
    }
};

export const fetchProjectDetails = async (project_id) => {
    try {
        // const response = await fetch(`${API_BASE_URL}/get_project/${project_id}/`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // });
        const response = await makeAuthenticatedRequest(`/projects/${project_id}/`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error in fetchProjectDetails:", error);
        throw error;
    }
}