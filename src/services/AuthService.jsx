import { createContext, useContext, useState, useEffect } from "react";
// import { Alert } from 'react-alert'

const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust based on your backend
const AuthContext = createContext();

// Function to make authenticated requests
const makeAuthenticatedRequest = async (route, options = {}) => {
  const url = `${API_BASE_URL}${route}`;
  let access_token = null;

  // if the token we currently store is not actually in storage then redirect the user to login
  access_token = await getAccessTokenWithRefresh();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${access_token}`,
  };

  const response = await fetch(url, options);


  // if the access token sent in the payload happened to be expired, we need to attempt to refresh it using the refresh token
  // if the refresh token that is stored is expired, we need to send the user to login
  if (response.status === 401) {
    try {
      await refreshAccessToken();
      access_token = getAccessToken();
    } catch (error) {
      console.warn("Session expired.", error);
      throw error;
    }

    options.headers.Authorization = `Bearer ${access_token}`;
    return await fetch(url, options);
  }

  if (!response.ok) {
    throw new Error(`Request failed; Error ${response.status}: ${response.statusText}`);
  }

  return response;
};


const checkLoginStatus = async () => {
  try {
    try {
      await refreshAccessToken();
      let response = await makeAuthenticatedRequest("/verify-login/");
      if (!response.ok) throw new Error("Session expired");
    } catch (error) {
      // alert("Session expired. Please log in again.");
      console.log("User is not logged in");
      return false;
    }

    return true;
  }

  catch {
    console.log("Error in checkLoginStatus", error);
    return false;
  }
};

const getAccessTokenWithRefresh = async () => {
  try {
    return getAccessToken(); // Try getting the current access token
  } catch (error) {
    await refreshAccessToken();
    return getAccessToken(); // Await the refreshed token
  }
};


const getAccessToken = () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    console.log("No access token found");
    throw new Error("No access token found");
  }
  return access_token;
};


// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token found");

  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) throw new Error("Refresh token expired");

  const data = await response.json();
  if (!data) throw new Error("Failed to refresh access token");

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
};


// Function to handle user login and save the tokens
const handleLogin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
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

// const handleLogout = () => {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");
// };

// Auth Provider to wrap around the app
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (localStorage.getItem("access_token")) {
      return true;
    }

    return false;
  });

  const isLoggedInFunction = async () => {
    return await checkLoginStatus();
  }

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const status = await checkLoginStatus();
      setIsLoggedIn(status);
    };

    fetchLoginStatus();

    // const handleStorageChange = async () => {
    //   const isLoggedIn = await checkLoginStatus();
    //   setIsLoggedIn(isLoggedIn);
    //   console.log("Storage changed, isLoggedIn:", isLoggedIn);
    // };

    // window.addEventListener("storage", handleStorageChange);
    // return () => {
    //   window.removeEventListener("storage", handleStorageChange);
    // };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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

  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoggedInFunction }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export {
  AuthProvider,
  useAuth,
  handleLogin,
  getAccessToken,
  refreshAccessToken,
  getAccessTokenWithRefresh,
  makeAuthenticatedRequest,
  checkLoginStatus,
  // handleLogout,
};