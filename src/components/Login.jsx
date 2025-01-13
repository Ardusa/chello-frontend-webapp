import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/AuthService"; // Import the handleLogin from AuthService
import logo from "../assets/logo.png"; // Assuming the logo is stored in src/assets

const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submit
        try {
            // Call the imported handleLogin from AuthService
            await handleLogin(id, password);
            navigate("/dashboard"); // Redirect to the dashboard after login
            console.log("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="centered-container">
            <div className="login-container">
                {/* Logo */}
                <img src={logo} alt="Chello Logo" className="logo" />

                {/* Cool-looking "Chello" Text */}
                <h1>Chello</h1>

                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Employee ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-btn">
                        <span className="arrow">→</span>
                    </button>
                </form>
            </div>
            <button type="button" onClick={() => navigate("/register")}>Register Now!</button>
        </div>
    );
};

export default Login;
