import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RegisterEmployee from "./components/RegisterEmployee";
import CreateProject from "./components/CreateProject";
import { checkLoginStatus } from "./services/AuthService";
import ProjectDisplay from "./components/ProjectDisplay";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in on initial load
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log("Checking if user is logged in. Token:", token);  // Log token for debugging
  //   setIsLoggedIn(!!token);  // If token exists, user is logged in
  // }, []);  // Empty dependency array so this runs only once on initial render

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token when logging out
    setIsLoggedIn(false);  // Update login status
    console.log("User logged out. Token removed.");  // Log for debugging
  };

  useEffect(() => {
    // Check login status on initial render
    setIsLoggedIn(checkLoginStatus());

    // Add event listener for storage changes
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);  // Empty dependency array so this runs only once on initial render


  return (
    <BrowserRouter>
      <Routes>
        {/* Login route: Always accessible */}
        <Route path="/" element={<Login />} />

        {/* Dashboard route: Only accessible if logged in */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* Register route: Always accessible */}
        <Route
          path="/register"
          element={<RegisterEmployee />}
        />

        {/* Create Project route: Only accessible if logged in */}
        <Route
          path="/projects/create"
          element={isLoggedIn ? <CreateProject onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        {/* Dynamic Project route: Only accessible if logged in */}
        <Route
          path="/projects/:project_id"
          element={isLoggedIn ? <ProjectDisplay onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
