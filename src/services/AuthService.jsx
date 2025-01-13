import { createContext, useContext, useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend
const AuthContext = createContext();

// Function to make authenticated requests
const makeAuthenticatedRequest = async (route, options = {}) => {
  const url = `${API_BASE_URL}${route}`;
  let access_token = null;

  try {
    access_token = await getAccessTokenWithRefresh();
  } catch {
    redirectLogin();
    console.warn("Session expired. Redirecting to login.");
    return null;
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${access_token}`,
  };

  const response = await fetch(url, options);

  // If unauthorized, try refreshing
  if (response.status === 401) {
    access_token = await refreshAccessToken();
    if (!access_token) {
      redirectLogin();
      console.warn("Session expired. Redirecting to login.");
      return null;
    }

    options.headers.Authorization = `Bearer ${access_token}`;
    return await fetch(url, options);
  }

  return response;
};

const redirectLogin = () => {
  setTimeout(() => {
    window.location.href = "/";
  }, 2000);
}

const getAccessTokenWithRefresh = async () => {
  try {
    return getAccessToken(); // Try getting the current access token
  } catch (error) {
    return await refreshAccessToken(); // Await the refreshed token
  }
};


const getAccessToken = () => {
  const access_token = localStorage.getItem("access_token");
  // console.log("Access token:", access_token);  // ! Debugging
  if (!access_token) throw new Error("No access token found");
  return access_token;
};


// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) throw new Error("No refresh token found");

    const response = await fetch(`${API_BASE_URL}/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refresh_token }),
    });

    if (!response.ok) throw new Error("Refresh token expired");

    const data = await response.json();
    if (!data.access_token) throw new Error("Failed to refresh access token");

    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return null; // Return null to indicate failure
  }
};


// Function to handle user login and save the tokens
const handleLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
    });

    console.log("Server response:", response);  // Log the response object

    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }

    const data = await response.json();

    if (data.access_token && data.refresh_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

    } else {
      throw new Error("Invalid response format: Missing tokens");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
    throw new Error("Login failed");
  }
};

// Auth Provider to wrap around the app
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkLoginStatus());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(checkLoginStatus());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      if (data.access_token && data.refresh_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setIsLoggedIn(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for authentication


const checkLoginStatus = () => {
  let token = null;

  try {
    token = getAccessTokenWithRefresh();
  } catch (error) {
    // TODO: add this back
    window.location.href = "/"; // Redirect to login if both tokens are expired
    console.warn("Session expired. Redirecting to login.");
    alert("Session expired. Please log in again.");
    return false;
  }
  // alert("Session is still active.");
  // console.log("Checking if user is logged in. Token:", token);  // ! debugging
  // console.log(!!token);
  return !!token;
};


// Export functions
const useAuth = () => useContext(AuthContext);

// export { handleLogin, getAccessToken, refreshAccessToken, getAccessTokenWithRefresh, makeAuthenticatedRequest, checkLoginStatus, redirectLogin };


export {
  AuthProvider,
  useAuth,
  handleLogin,
  getAccessToken,
  refreshAccessToken,
  getAccessTokenWithRefresh,
  makeAuthenticatedRequest,
  checkLoginStatus,
  redirectLogin,
};