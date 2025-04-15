import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo-link">Quizlet</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/join" className="navbar-item">Join Survey</Link>
        {currentUser ? (
          <>
            <Link to="/dashboard" className="navbar-item">Dashboard</Link>
            <div className="user-profile" onClick={() => navigate('/logout')}>
              <img 
                src="/loggedin.png" 
                alt="User Profile" 
                className="user-avatar" 
              />
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
            <div className="user-profile" onClick={() => navigate('/login')}>
              <img 
                src="/login.png" 
                alt="Login" 
                className="user-avatar" 
              />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;