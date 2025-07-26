// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css"
import Header from '../../components/Header';
const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); // Redirect to your login page
    };

    const handleAbout = () => {
        navigate('/about-us'); // Navigate to about page
    };

    return (
        <>
            <Header />
            <div>
                {/* Hero Section */}
                <section className="hero-section bg-dark text-white py-5" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

                }}>
                    <div className="container h-100">
                        <div className="row align-items-center  py-5">
                            <div className="col-lg-6">
                                <div className="hero-content">
                                    <h1 className="display-4 fw-bold mb-4">
                                        Streamline Your Business with AF1 CRM
                                    </h1>
                                    <p className="lead mb-4">
                                        Manage social media campaigns, email marketing, Shopify integration, and customer relationships all in one powerful platform.
                                    </p>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-light btn-lg px-4" onClick={handleLogin}>
                                            Get Started
                                        </button>
                                        <button className="btn btn-outline-light btn-lg px-4" onClick={handleAbout}>
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="hero-image text-center">
                                    <div style={{
                                        width: '400px',
                                        height: '300px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <div className="text-center">
                                            <div style={{ fontSize: '80px', marginBottom: '20px' }}>📊</div>
                                            <h4>AF1 CRM Dashboard</h4>
                                            <p className="mb-0">Your Business Control Center</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold">Powerful Features for Your Business</h2>
                            <p className="text-muted">Everything you need to manage and grow your business efficiently</p>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card text-center p-4 h-100 border rounded shadow-sm">
                                    <div className="feature-icon mb-3">
                                        <i className="fab fa-facebook fa-3x text-primary"></i>
                                    </div>
                                    <h5>Social Media Management</h5>
                                    <p className="text-muted">Schedule and manage posts across Facebook, Instagram, LinkedIn, Twitter, and more.</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card text-center p-4 h-100 border rounded shadow-sm">
                                    <div className="feature-icon mb-3">
                                        <i className="fas fa-envelope fa-3x text-success"></i>
                                    </div>
                                    <h5>Email Marketing</h5>
                                    <p className="text-muted">Create and send targeted email campaigns with advanced analytics and automation.</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card text-center p-4 h-100 border rounded shadow-sm">
                                    <div className="feature-icon mb-3">
                                        <i className="fab fa-shopify fa-3x text-warning"></i>
                                    </div>
                                    <h5>Shopify Integration</h5>
                                    <p className="text-muted">Seamlessly manage your Shopify store, orders, and customer data in one place.</p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="feature-card text-center p-4 h-100 border rounded shadow-sm">
                                    <div className="feature-icon mb-3">
                                        <i className="fas fa-chart-line fa-3x text-info"></i>
                                    </div>
                                    <h5>Analytics & Reports</h5>
                                    <p className="text-muted">Track performance with detailed analytics and comprehensive reporting tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-light py-5">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-md-3 mb-4">
                                <div className="stat-item">
                                    <h2 className="fw-bold text-primary mb-2">10,000+</h2>
                                    <p className="mb-0">Active Users</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="stat-item">
                                    <h2 className="fw-bold text-success mb-2">1M+</h2>
                                    <p className="mb-0">Posts Scheduled</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="stat-item">
                                    <h2 className="fw-bold text-warning mb-2">500K+</h2>
                                    <p className="mb-0">Emails Sent</p>
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="stat-item">
                                    <h2 className="fw-bold text-info mb-2">99.9%</h2>
                                    <p className="mb-0">Uptime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-5">
                    <div className="container text-center d-flex flex-column align-items-center justify-content-center">
                        <h2 className="fw-bold mb-4">Ready to Transform Your Business?</h2>
                        <p className="lead mb-4">Join thousands of businesses already using AF1 CRM to streamline their operations.</p>
                        <button className="btn btn-primary btn-lg px-5 " onClick={handleLogin}>
                            Start Your Journey Today
                        </button>
                    </div>
                </section>


            </div>
        </>

    );
};

export default HomePage;