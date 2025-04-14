import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-text">Survey System</span>
        </Link>
      </div>
      
      <div className="navbar-menu">
        {currentUser ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <div className="nav-user">
              <span>{currentUser.name}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/join" className="nav-link">Join</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary nav-button">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;