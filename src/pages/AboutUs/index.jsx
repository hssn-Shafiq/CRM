// AboutPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const AboutUs = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login'); // Redirect to your login page
    };

    return (
        <>
            <Header />
            <div className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h1 className="text-center fw-bold mb-5">About AF1 CRM</h1>

                            <div className="mb-5">
                                <h2 className="fw-bold mb-3">Our Mission</h2>
                                <p className="lead">
                                    At AF1 CRM, we're dedicated to empowering businesses with comprehensive digital marketing and customer relationship management solutions. Our platform combines the power of social media management, email marketing, e-commerce integration, and advanced analytics in one unified system.
                                </p>
                            </div>

                            <div className="mb-5">
                                <h2 className="fw-bold mb-3">What We Offer</h2>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fas fa-share-alt text-primary me-2"></i>Social Media Management</h5>
                                            <p>Schedule, publish, and analyze your social media content across multiple platforms including Facebook, Instagram, LinkedIn, Twitter, Pinterest, and TikTok.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fas fa-envelope text-success me-2"></i>Email Marketing</h5>
                                            <p>Create targeted email campaigns with our advanced template editor and automation tools to nurture your customer relationships.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fab fa-shopify text-warning me-2"></i>Shopify Integration</h5>
                                            <p>Seamlessly manage your e-commerce operations with full Shopify integration for orders, inventory, and customer data.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fas fa-chart-bar text-info me-2"></i>Advanced Analytics</h5>
                                            <p>Get insights into your marketing performance with comprehensive analytics and reporting tools across all channels.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fas fa-users text-danger me-2"></i>Customer Management</h5>
                                            <p>Organize and manage your customer data with advanced segmentation, lead tracking, and relationship management tools.</p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="feature-item">
                                            <h5><i className="fas fa-calendar-alt text-purple me-2"></i>Campaign Scheduling</h5>
                                            <p>Plan and schedule your marketing campaigns across all channels with our intuitive calendar and automation features.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h2 className="fw-bold mb-3">Why Choose AF1 CRM?</h2>
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>All-in-one platform</strong> for streamlined operations
                                            </li>
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>User-friendly interface</strong> with powerful features
                                            </li>
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>Scalable solution</strong> that grows with your business
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-unstyled">
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>24/7 customer support</strong> and regular updates
                                            </li>
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>Secure, reliable,</strong> and compliant with industry standards
                                            </li>
                                            <li className="mb-3">
                                                <i className="fas fa-check text-success me-2"></i>
                                                <strong>Real-time analytics</strong> and comprehensive reporting
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h2 className="fw-bold mb-3">Our Technology</h2>
                                <p>
                                    Built with cutting-edge technology, AF1 CRM leverages modern frameworks and cloud infrastructure to deliver a fast, reliable, and secure experience. Our platform is designed to handle businesses of all sizes, from startups to enterprise-level organizations.
                                </p>

                                <div className="row mt-4">
                                    <div className="col-md-4 text-center">
                                        <div className="tech-item p-3">
                                            <i className="fas fa-cloud fa-3x text-primary mb-3"></i>
                                            <h5>Cloud-Based</h5>
                                            <p className="text-muted">Accessible anywhere, anytime with 99.9% uptime guarantee</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <div className="tech-item p-3">
                                            <i className="fas fa-shield-alt fa-3x text-success mb-3"></i>
                                            <h5>Enterprise Security</h5>
                                            <p className="text-muted">Bank-level encryption and security protocols</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <div className="tech-item p-3">
                                            <i className="fas fa-mobile-alt fa-3x text-info mb-3"></i>
                                            <h5>Mobile Ready</h5>
                                            <p className="text-muted">Responsive design works perfectly on all devices</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center bg-light p-5 rounded d-flex flex-column align-items-center justify-content-center">
                                <h3 className="fw-bold mb-3">Ready to Get Started?</h3>
                                <p className="mb-4">Experience the power of AF1 CRM and transform how you manage your business operations.</p>
                                <button className="btn btn-primary btn-lg px-5" onClick={handleLogin}>
                                    Login to Your Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
        .feature-item {
          padding: 15px 0;
        }
        
        .feature-item h5 {
          color: #333;
          margin-bottom: 10px;
        }
        
        .tech-item {
          transition: transform 0.3s ease;
        }
        
        .tech-item:hover {
          transform: translateY(-5px);
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .text-purple {
          color: #6f42c1 !important;
        }
      `}</style>
            </div>
        </>

    );
};

export default AboutUs;