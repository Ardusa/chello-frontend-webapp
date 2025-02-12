import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";
import logo from "../assets/logo.png";
import "../css/styles.css";
import "../css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submit
        try {
            await login(email, password);
            navigate("/dashboard/projects");
            console.log("Login successful");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="centered-container">
                <div className="form-container">
                    <img src={logo} alt="Chello Logo" className="logo" />
                    <h1>Chello</h1>

                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="user@chello.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="arrow forward-btn"></button>
                        <button type="button" onClick={() => navigate("/register")} className="register-btn">Register Now!</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default Login;
