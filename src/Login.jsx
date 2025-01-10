import { useState } from "react";
import { login } from "./api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(id, password);
            console.log("Login success:", response); // Debugging line
            navigate("/dashboard"); // Redirect after login
        } catch (error) {
            console.error(error);  // Log detailed error for debugging
            alert("Invalid credentials");
        }
    };

    return (
        <div className="centered-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
