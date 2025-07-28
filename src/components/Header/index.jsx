import React from 'react';
import './Header.css';
import logo from '../../assets/images/af1-logo.jpg'; // Replace with your actual logo path
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about-us">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/terms-and-conditions">Terms &amp; Conditions</Link>
              </li>
            </ul>
            <Link to="/login" className="btn btn-primary header-login-btn">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;