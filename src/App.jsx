import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in on initial load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);  // Set the user as logged in if token exists
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear token when logging out
        setIsLoggedIn(false);  // Update login status
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login onLogin={handleLogin} />} />
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;