import axios from "axios";

// TODO: Update the API_BASE_URL to your backend URL
// const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend
const API_BASE_URL = "http://192.168.0.80:8000"; // Adjust based on your backend

export const login = async (id, password) => {
    const response = await axios.post(`${API_BASE_URL}/token/`, 
        new URLSearchParams({ username: id, password: password })
    );
    localStorage.setItem("token", response.data.access_token);
    return response.data;
};

export const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/get_projects/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Projects fetched:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in fetchProjects:", error);
        throw error;  // Make sure this is thrown to propagate to the `loadProjects` error handling
    }
};
