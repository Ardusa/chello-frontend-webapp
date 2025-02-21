import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthService";
import logo from "../assets/chello_logo.png";
import LoginIcon from '@mui/icons-material/Login';
import "../css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error("Login Failed:", error);
            alert("Email or password is incorrect. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="centered-container">
                <div className="form-container">
                    <div className="header">
                        <img src={logo} alt="Chello Logo" className="logo" />
                        <h1>Sign-in</h1>
                    </div>
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
                        <div className="button-bar">
                            <button type="button" onClick={() => navigate("/register")} className="register-btn">Register Now!</button>
                            <button type="submit" className="login-btn">
                                <LoginIcon style={{ fontSize: 30 }} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default Login;
