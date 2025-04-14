import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo-link">
            <span className="logo-text">Quizlet</span>
          </Link>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link to="/join" className="nav-link">Join</Link>
          </div>
          
          <div className="navbar-end">
            {currentUser ? (
              <div className="user-section">
                <span className="welcome-text">Welcome, {currentUser.name}</span>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;