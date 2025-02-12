import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/front-page.css';

const FrontPage = () => {
    const navigate = useNavigate();

    return (
        <div className="front-page-container">
            <header className="header">
                <div className="logo-placeholder">[Logo Image]</div>
                <nav className="nav">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </nav>
            </header>

            <section className="hero-section">
                <div className="hero-text">
                    <h1>Welcome to Chello</h1>
                    <p>Your ultimate solution for efficient project management and task prioritization.</p>
                    <button onClick={() => navigate('/register-new-account')}>Get Started</button>
                </div>
                <div className="hero-image-placeholder">[Hero Image]</div>
            </section>

            <section className="features-section">
                <h2>Features</h2>
                <div className="features">
                    <div className="feature">
                        <div className="feature-image-placeholder">[Feature Image 1]</div>
                        <h3>Neural Network Prioritization</h3>
                        <p>Our advanced neural network prioritization engine helps you manage tasks efficiently, supporting sprints and other engineering methods of production.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-image-placeholder">[Feature Image 2]</div>
                        <h3>User Authentication</h3>
                        <p>Secure login and access with integration to the backend authentication system.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-image-placeholder">[Feature Image 3]</div>
                        <h3>Manager-Account Relations</h3>
                        <p>Manage team structures with manager-account relationship capabilities.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-image-placeholder">[Feature Image 4]</div>
                        <h3>Project Management</h3>
                        <p>Create, view, and modify projects seamlessly using backend API calls.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-image-placeholder">[Feature Image 5]</div>
                        <h3>Task Interaction</h3>
                        <p>Assign tasks, update statuses, and handle dependencies via the intuitive interface.</p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2023 Chello. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default FrontPage;